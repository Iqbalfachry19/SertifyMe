// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {CertificationNFT} from "../src/CertificationNFT.sol"; // Adjust the path accordingly
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CertificationNFTTest is Test {
    CertificationNFT private certificationNFT;

    // Set up the contract before each test
    function setUp() public {
        certificationNFT = new CertificationNFT();
    }

    // Test minting a new certificate
    function testMintCertificate() public {
        // Arrange
        address recipient = address(1);
        string memory recipientName = "John Doe";
        string memory courseName = "Blockchain Basics";
        string memory institutionName = "OpenAI Academy";

        // Act
        certificationNFT.mintCertificate(
            recipient,
            recipientName,
            courseName,
            institutionName
        );

        // Assert
        CertificationNFT.Certificate memory certificate = certificationNFT
            .getCertificate(1); // Use 1 since we start token IDs at 1

        assertEq(certificate.recipientName, recipientName);
        assertEq(certificate.courseName, courseName);
        assertEq(certificate.institutionName, institutionName);
        assertGt(certificate.issueDate, 0); // Ensure the issue date is greater than 0
    }

    // Test retrieving a certificate
    function testGetCertificate() public {
        // Arrange
        address recipient = address(1);
        string memory recipientName = "Jane Doe";
        string memory courseName = "Solidity Programming";
        string memory institutionName = "OpenAI Academy";

        // Mint the certificate first
        certificationNFT.mintCertificate(
            recipient,
            recipientName,
            courseName,
            institutionName
        );

        // Act
        CertificationNFT.Certificate memory certificate = certificationNFT
            .getCertificate(1); // Use 1 since we start token IDs at 1

        // Assert
        assertEq(certificate.recipientName, recipientName);
        assertEq(certificate.courseName, courseName);
        assertEq(certificate.institutionName, institutionName);
        assertGt(certificate.issueDate, 0);
    }

    // Test minting by a non-owner
    function testMintCertificateByNonOwner() public {
        // Arrange
        address nonOwner = address(2);
        string memory recipientName = "Alice";
        string memory courseName = "Web Development";
        string memory institutionName = "Tech Institute";

        // Act & Assert
        vm.prank(nonOwner); // Simulate the call as non-owner
        vm.expectRevert(); // Expect error with custom error signature
        certificationNFT.mintCertificate(
            nonOwner,
            recipientName,
            courseName,
            institutionName
        );
    }
}
