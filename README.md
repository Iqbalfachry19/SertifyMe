# CertificationNFT - Based Sea Hackathon Project

## Overview

CertificationNFT is an Ethereum-based decentralized application (DApp) that enables institutions to issue verifiable digital certifications as NFTs (Non-Fungible Tokens) on the blockchain. This allows recipients to prove their achievements in a secure, transparent, and immutable way, while institutions can easily manage the issuance and verification of these credentials.

The project leverages Solidity smart contracts and the ERC721 standard to create certificates, providing unique tokenized credentials with detailed information about the recipient, course, and institution. 

## Key Features
- **ERC721 Standard:** Utilizes the ERC721 standard for creating and managing unique non-fungible tokens (NFTs) to represent certificates.
- **Certificate Metadata:** Each certificate contains specific information, including the recipient's name, course name, institution name, and issue date.
- **Ownership Verification:** Each certificate is mapped to a token, allowing verifiable proof of ownership using blockchain technology.
- **Decentralization:** No centralized authority is required for the verification process, ensuring transparency and security.
- **Minting:** Only the contract owner (institution) can mint new certificates.
  
## Tech Stack
- **Solidity:** Smart contract programming language used for writing the CertificationNFT contract.
- **OpenZeppelin Contracts:** Industry-standard library that provides reusable implementations of ERC721 and access control.
- **Ethereum Blockchain:** The project is deployed on the Ethereum blockchain, ensuring decentralization and transparency.

## Smart Contract Details

### Contract Name: `CertificationNFT`
The contract is designed to mint NFTs representing certificates, containing key metadata for each token issued by an institution.

### Key Functions:

- **mintCertificate(address recipient, string recipientName, string courseName, string institutionName):**  
  Mints a new certification NFT with unique metadata for the recipient, course, and institution. This function can only be called by the contract owner (the issuing institution).

- **getCertificate(uint256 tokenId):**  
  Returns the certificate metadata associated with the given token ID, including the recipient's name, course name, institution, and issue date.

### Data Structure:
- **_tokenIdCounter:**  
  A simple counter to keep track of the next available token ID for each new certificate.
  
- **Certificate Struct:**  
  This structure holds the following metadata:
  - `recipientName`: The name of the recipient.
  - `courseName`: The name of the course.
  - `institutionName`: The name of the issuing institution.
  - `issueDate`: The timestamp when the certificate was issued.

### Usage Example

1. **Deploy the Contract:**
   The contract is deployed on an Ethereum network, and the deploying address becomes the owner (institution) that can mint certificates.

2. **Mint a Certificate:**
   The institution calls the `mintCertificate` function to issue a new certificate for a recipient. This creates a new NFT, assigns it to the recipient's address, and stores the certificate details on-chain.

   ```solidity
   contract.mintCertificate(
       recipientAddress,
       "John Doe",
       "Blockchain Development",
       "XYZ University"
   );
   ```

3. **Verify a Certificate:**
   Anyone can call the `getCertificate` function by providing a valid `tokenId`. This will return the certificate metadata and verify the ownership of the token.

   ```solidity
   Certificate memory cert = contract.getCertificate(1);
   ```

### Dependencies

The project depends on the following libraries:
- **OpenZeppelin Contracts:** Provides secure and reusable implementations for ERC721 and access control (`Ownable`).

To install these dependencies:

```bash
npm install @openzeppelin/contracts
```

## Deployment

To deploy the `CertificationNFT` contract, use the following steps:

1. Install Truffle or Hardhat.
2. Set up a connection to the Ethereum network (e.g., via Infura or Alchemy).
3. Deploy the contract to your desired network.

```solidity
const CertificationNFT = artifacts.require("CertificationNFT");

module.exports = async function(deployer) {
  await deployer.deploy(CertificationNFT);
};
```

## Future Enhancements
- **Certificate Revocation:** Add functionality to allow institutions to revoke certificates if needed.
- **Additional Metadata:** Add more fields for metadata such as grade, duration, etc.
- **Multi-institution Support:** Extend the contract to allow multiple institutions to issue certificates.
- **Cross-chain Deployment:** Support certificates on multiple blockchains (e.g., Polygon, Binance Smart Chain).

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information. 

---

**Hackathon Team:**  
- iqbal fachry (Developer)

Feel free to reach out to us if you have any questions or suggestions. Happy coding! 🚀