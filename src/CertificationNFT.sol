// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
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

    // Mapping to track authorized minters
    mapping(address => bool) public authorizedMinters;

    constructor() ERC721("CertificationNFT", "CERT") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start token IDs from 1 (or 0 if preferred)
        authorizedMinters[msg.sender] = true; // Owner is authorized by default
    }

    // Add or remove authorized minters
    function setMinterRole(address minter, bool authorized) public onlyOwner {
        authorizedMinters[minter] = authorized;
    }

    // Mint a new certification NFT - modified to allow authorized minters
    function mintCertificate(
        address recipient,
        string memory recipientName,
        string memory courseName,
        string memory institutionName
    ) public {
        // Allow either owner or authorized minters to call this function
        require(
            owner() == msg.sender || authorizedMinters[msg.sender],
            "Not authorized to mint certificates"
        );

        uint256 tokenId = _tokenIdCounter; // Fixed syntax error: *tokenIdCounter → _tokenIdCounter
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
        require(_exists(tokenId), "Certificate does not exist.");
        return certificates[tokenId];
    }

    // Helper function to check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }
}
