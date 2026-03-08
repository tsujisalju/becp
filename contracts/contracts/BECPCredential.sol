// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : BECPCredential.sol
// Description      : ERC-1155 soulbound credential contract for the Blockchain-based Extracurricular Credentials Platform (BECP)
// First Written on : Sunday, 8-Mar-2026
// Last Modified on :

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155Pausable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import {IBECPCredential} from "../interfaces/IBECPCredential.sol";
import {CredentialLib} from "../libraries/CredentialLib.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BECPCredential is
    ERC1155,
    ERC1155Supply,
    ERC1155Burnable,
    AccessControl,
    ERC1155Pausable,
    IBECPCredential
{
    using CredentialLib for string;
    using Strings for uint256;

    // Role identifiers
    bytes32 public constant UNIVERSITY_ADMIN_ROLE =
        keccak256("UNIVERSITY_ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Auto increment token type ID counter. Starts at 1.
    uint256 private _nextTokenId;

    // Map tokenId to CredentialType metadata
    mapping(uint256 => CredentialType) private _credentialTypes;

    // Map student address to their issued credential token IDs
    // TokenId array is append-only. On revocation, tokenId is not removed from the array because of expensive operation.
    // Use hasCredential() and getStudentCredentials() that checks the live balance.
    mapping(address => uint256[]) private _studentCredentials;

    // Guard against duplicate entries in _studentCredentials
    // Map student address to a mapping of tokenId to bool indicating if the credential is tracked
    mapping(address => mapping(uint256 => bool)) private _trackedCredential;

    // Initialize the contract with the admin role granted to the provided address.
    // Provided address should be a multi-sig or a hardware wallet in production.
    // For testnet, use the deployer address.
    constructor(address admin) ERC1155("") {
        if (!CredentialLib.isValidAddress(admin)) revert ZeroAddress();

        // Grant all roles to the admin
        // Admin can later delegate university admin and issuer roles to appropriate parties
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UNIVERSITY_ADMIN_ROLE, admin);

        // UNIVERSITY_ADMIN_ROLE manages ISSUER_ROLE to support two-tier trust model
        _setRoleAdmin(ISSUER_ROLE, UNIVERSITY_ADMIN_ROLE);

        // Start token IDs at 1. Token ID 0 is reserved as "no credential"
        _nextTokenId = 1;
    }

    function approveOrganizer(
        address organizer
    ) external onlyRole(UNIVERSITY_ADMIN_ROLE) {
        if (!CredentialLib.isValidAddress(organizer)) revert ZeroAddress();
        _grantRole(ISSUER_ROLE, organizer);
        emit OrganizerApproved(organizer, msg.sender);
    }

    function revokeOrganizer(
        address organizer
    ) external onlyRole(UNIVERSITY_ADMIN_ROLE) {
        if (!CredentialLib.isValidAddress(organizer)) revert ZeroAddress();
        _revokeRole(ISSUER_ROLE, organizer);
        emit OrganizerRevoked(organizer, msg.sender);
    }

    function registerCredentialType(
        string calldata metadataURI
    ) external onlyRole(ISSUER_ROLE) whenNotPaused returns (uint256 tokenId) {
        if (!CredentialLib.isValidMetadataURI(metadataURI))
            revert EmptyString();
        tokenId = _nextTokenId;
        unchecked {
            ++_nextTokenId;
        }
        _credentialTypes[tokenId] = CredentialType({
            issuer: msg.sender,
            metadataURI: metadataURI,
            active: true,
            registeredAt: block.timestamp
        });
        emit CredentialTypeRegistered(tokenId, msg.sender, metadataURI);
    }

    function issueCredential(
        uint256 tokenId,
        address recipient
    ) external onlyRole(ISSUER_ROLE) whenNotPaused {
        _validateIssuance(tokenId, recipient);
        _mintCredential(tokenId, recipient);
    }

    function batchIssueCredential(
        uint256 tokenId,
        address[] calldata recipients
    ) external onlyRole(ISSUER_ROLE) whenNotPaused {
        if (!CredentialLib.isValidRecipients(recipients)) revert ZeroAddress();
        _validateCredentialType(tokenId);

        // Validate all recipients before minting any tokens to guarantee atomicity
        for (uint256 i = 0; i < recipients.length; ) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            if (balanceOf(recipients[i], tokenId) > 0) {
                revert AlreadyIssued(tokenId, recipients[i]);
            }
            unchecked {
                ++i;
            }
        }

        for (uint256 i = 0; i < recipients.length; ) {
            _mintCredential(tokenId, recipients[i]);
            unchecked {
                ++i;
            }
        }
    }

    function revokeCredential(
        uint256 tokenId,
        address recipient,
        string calldata reason
    ) external whenNotPaused {
        bool isOriginalIssuer = _credentialTypes[tokenId].issuer ==
            msg.sender &&
            hasRole(ISSUER_ROLE, msg.sender);
        bool isUniversityAdmin = hasRole(UNIVERSITY_ADMIN_ROLE, msg.sender);

        if (!isOriginalIssuer && !isUniversityAdmin) {
            revert AccessControlUnauthorizedAccount(msg.sender, ISSUER_ROLE);
        }

        if (!CredentialLib.isValidAddress(recipient)) revert ZeroAddress();
        if (bytes(reason).length == 0) revert EmptyString();

        _validateCredentialType(tokenId);

        if (balanceOf(recipient, tokenId) == 0) {
            revert NotIssued(tokenId, recipient);
        }

        _burn(recipient, tokenId, 1);

        emit CredentialRevoked(tokenId, recipient, msg.sender, reason);
    }

    // Emergency control to pause all minting and issuance operations
    // Only performed by DEFAULT_ADMIN_ROLE in case of compromised issuer key
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    // Resume operations after a pause
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function hasCredential(
        uint256 tokenId,
        address holder
    ) external view returns (bool) {
        return balanceOf(holder, tokenId) > 0;
    }

    function getCredentialType(
        uint256 tokenId
    ) external view returns (CredentialType memory) {
        _validateCredentialType(tokenId);
        return _credentialTypes[tokenId];
    }

    function getStudentCredentials(
        address student
    ) external view returns (uint256[] memory tokenIds) {
        uint256[] storage tracked = _studentCredentials[student];
        uint256 count = 0;

        // First pass: count live credentials where balance > 0 and revoked credentials are skipped
        for (uint256 i = 0; i < tracked.length; ) {
            if (balanceOf(student, tracked[i]) > 0) {
                unchecked {
                    ++count;
                }
            }
            unchecked {
                ++i;
            }
        }

        //Second pass: build the filtered result array
        tokenIds = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < tracked.length; ) {
            if (balanceOf(student, tracked[i]) > 0) {
                tokenIds[idx] = tracked[i];
                unchecked {
                    ++idx;
                }
            }
            unchecked {
                ++i;
            }
        }
    }

    function totalCredentialTypes() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        _validateCredentialType(tokenId);
        return _credentialTypes[tokenId].metadataURI;
    }

    // Override default _update to block all token transfers as credentials are souldbound
    // Only valid token movements are mint from address 0 and burn to address 0
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply, ERC1155Pausable) {
        bool isMint = from == address(0);
        bool isBurn = to == address(0);

        if (!isMint && !isBurn) revert SoulboundToken();

        super._update(from, to, ids, values);
    }

    // Check whether the contract implements a certain interface
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Validate that a credential type exists and is active
    function _validateCredentialType(uint256 tokenId) internal view {
        if (tokenId == 0 || tokenId >= _nextTokenId)
            revert TokenIdNotFound(tokenId);
        if (!_credentialTypes[tokenId].active) revert TokenIdNotFound(tokenId);
    }

    // Validate issuance preconditions for a single mint
    function _validateIssuance(
        uint256 tokenId,
        address recipient
    ) internal view {
        if (!CredentialLib.isValidAddress(recipient)) revert ZeroAddress();
        _validateCredentialType(tokenId);
        if (balanceOf(recipient, tokenId) > 0) {
            revert AlreadyIssued(tokenId, recipient);
        }
    }

    // Mint 1 token to recipient and track it in the student credential index.
    function _mintCredential(uint256 tokenId, address recipient) internal {
        _mint(recipient, tokenId, 1, "");

        if (!_trackedCredential[recipient][tokenId]) {
            _studentCredentials[recipient].push(tokenId);
            _trackedCredential[recipient][tokenId] = true;
        }

        emit CredentialIssued(tokenId, recipient, msg.sender);
    }
}
