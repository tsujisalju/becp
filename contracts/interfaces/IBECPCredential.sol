// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : IBECPCredential.sol
// Description      : Provide interfaces for functions, events and errors to be used by external contracts and frontend (via Wagmi)
// First Written on : Saturday, 7-Mar-2026
// Last Modified on :

interface IBECPCredential {
    // Emitted when a new credential type is registered
    event CredentialTypeRegistered(
        uint256 indexed tokenId,
        address indexed issuer,
        string metadataURI
    );

    // Emitted when a credential is issued to a student
    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed issuer
    );

    // Emitted when a credential is revoked from a student
    event CredentialRevoked(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed revokedBy,
        string reason
    );

    // Emitted when an organizer is approved by a university admin
    event OrganizerApproved(
        address indexed organizer,
        address indexed approvedBy
    );

    // Emitted when an organizer'approval is revoked
    event OrganizerRevoked(
        address indexed organizer,
        address indexed revokedBy
    );

    // Thrown when attempting to transfer a soulbound token.
    error SoulboundToken();

    // Thrown when a student already holds this credential.
    error AlreadyIssued(uint256 tokenId, address recipient);

    // Thrown when trying to revoke a credential the student doesn't hold.
    error NotIssued(uint256 tokenId, address recipient);

    // hrown when the token ID does not exist.
    error TokenIdNotFound(uint256 tokenId);

    // Thrown when a zero address is passed where a real address is required.
    error ZeroAddress();

    // Thrown when an empty string is passed where content is required.
    error EmptyString();

    // Thrown when batch arrays have mismatched lengths.
    error ArrayLengthMismatch();

    // On-chain metadata for a credential type (event)
    struct CredentialType {
        address issuer; // The organizer who registered this credential type
        string metadataURI; // IPFS URI for the full CredentialMetadata JSON
        bool active; // Whether the credential is still active (false = revoked globally)
        uint256 registeredAt; // Unix timestamp when this credential type was registered
    }

    // Approve an organizer, granting them ISSUER_ROLE
    // Only callable by addresses with UNIVERSITY_ADMIN_ROLE
    function approveOrganizer(address organizer) external;

    // Revoke an organizer's ISSUER_ROLE
    // Only callable by addresses with UNIVERSITY_ADMIN_ROLE
    function revokeOrganizer(address organizer) external;

    // Register a new credential type for an event
    // Only callable by addresses with ISSUER_ROLE
    // metadataURI: IPFS URI for the full CredentialMetadata JSON
    // Returns the newly-assigned ERC-1155 token ID
    function registerCredentialType(
        string calldata metadataURI
    ) external returns (uint256 tokenId);

    // Issue a credential to one student
    // Only callable by issuer who registered the credential type, or any address with ISSUER_ROLE if the type is active.
    // Reverts with AlreadyIssued error if the student already holds it.
    // Emits CredentialIssued event on success
    // tokenId: The credential type ID to issue
    // recipient: The student's wallet address
    function issueCredential(uint256 tokenId, address recipient) external;

    // Issue one credential type to many students in one transaction
    // Gas-efficient issuance for bulk credential distribution such as post-event certificate drops
    // Reverts if ANY recipient already holds the credential
    // Emits CredentialIssued event for each recipient
    // tokenId: The credential type ID to issue
    // recipients: Array of student wallet addresses
    function batchIssueCredential(
        uint256 tokenId,
        address[] calldata recipients
    ) external;

    // Revoke a credential from a recipient
    // Only callable by the original issuer, or any UNIVERSITY_ADMIN_ROLE address.
    // Burns the token from the student's wallet
    // Emits CredentialRevoked event
    // tokenId: The credential type ID to revoke
    // recipient: The student whose credential is being revoked
    // reason: Human-readable reason (stored on event log)
    function revokeCredential(
        uint256 tokenId,
        address recipient,
        string calldata reason
    ) external;

    // Check whether a student holds a specific credential
    function hasCredential(
        uint256 tokenId,
        address holder
    ) external view returns (bool);

    // Retrieve on-chain metadata for a credential type
    function getCredentialType(
        uint256 tokenId
    ) external view returns (CredentialType memory);

    // Retrieve all credentials held by a student
    function getStudentCredentials(
        address student
    ) external view returns (uint256[] memory tokenIds);

    // Returns the total number of credential types registered
    function totalCredentialTypes() external view returns (uint256);
}
