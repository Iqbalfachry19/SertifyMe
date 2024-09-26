// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CertificationNFT is ERC721, Ownable {
    // Simple uint256 to track tokenId
    uint256 public _tokenIdCounter;

    // Structure for the certification details
    struct Certificate {
        string recipientName;
        string courseName;
        string institutionName;
        uint256 issueDate;
    }

    // Mapping of token ID to certificate data
    mapping(uint256 => Certificate) public certificates;

    constructor() ERC721("CertificationNFT", "CERT") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start token IDs from 1 (or 0 if preferred)
    }

    // Mint a new certification NFT
    function mintCertificate(
        address recipient,
        string memory recipientName,
        string memory courseName,
        string memory institutionName
    ) public onlyOwner {
        uint256 tokenId = _tokenIdCounter; // Use the current value of _tokenIdCounter
        _safeMint(recipient, tokenId);

        certificates[tokenId] = Certificate({
            recipientName: recipientName,
            courseName: courseName,
            institutionName: institutionName,
            issueDate: block.timestamp
        });

        _tokenIdCounter++; // Manually increment the token ID
    }

    // Retrieve certificate details by token ID
    function getCertificate(
        uint256 tokenId
    ) public view returns (Certificate memory) {
        require(ownerOf(tokenId) != address(0), "Certificate does not exist.");
        return certificates[tokenId];
    }
}
