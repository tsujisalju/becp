// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : CredentialLib.sol
// Description      : Pure validation helpers used by BECPCredential contract to separate business logic from guard clauses
// First Written on : Sunday, 8-Mar-2026
// Last Modified on :

library CredentialLib {
    // Validate that a metadata URI is a valid non-empty IPFS URI
    function isValidMetadataURI(
        string calldata uri
    ) internal pure returns (bool valid) {
        bytes memory b = bytes(uri);
        if (b.length <= 7) return false;

        if (
            b[0] != "i" ||
            b[1] != "p" ||
            b[2] != "f" ||
            b[3] != "s" ||
            b[4] != ":"
        ) return false;

        return b.length > 7;
    }

    // Validate that an address is not the zero address
    function isValidAddress(address addr) internal pure returns (bool valid) {
        return addr != address(0);
    }

    // Validate that a recipients array is non-empty and contains no zero addresses
    function isValidRecipients(
        address[] calldata recipients
    ) internal pure returns (bool valid) {
        if (recipients.length == 0) return false;

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) return false;
            unchecked {
                ++i;
            }
        }

        return true;
    }
}
