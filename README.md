# SertifyMe -  CertificationNFT Project

## Overview

**SertifyMe** is a decentralized application (DApp) that allows institutions to issue verifiable digital certifications as NFTs (Non-Fungible Tokens) on the blockchain. This innovative approach enables recipients to securely and transparently prove their achievements, while institutions can efficiently manage the issuance and verification of these credentials.

The project leverages Solidity smart contracts and the ERC721 standard to create unique, tokenized credentials that include detailed information about the recipient, course, and institution.

Visit our website for more details: [SertifyMe Official Website](https://sertifyme.netlify.app)

## Key Features

- **ERC721 Standard:** Utilizes the ERC721 standard for creating and managing unique non-fungible tokens (NFTs) representing certificates.
- **Certificate Metadata:** Each certificate contains specific information, including the recipient's name, course name, institution name, and issue date.
- **Ownership Verification:** Allows verifiable proof of ownership using blockchain technology, ensuring each certificate is linked to a specific token.
- **Decentralization:** Eliminates the need for a centralized authority in the verification process, ensuring transparency and security.
- **Minting:** Only the contract owner (the institution) can mint new certificates, preserving integrity in the issuance process.

## Tech Stack

- **Solidity:** Smart contract programming language used for writing the CertificationNFT contract.
- **OpenZeppelin Contracts:** Industry-standard library providing reusable implementations of ERC721 and access control.
- **Ethereum L2 Blockchain:** Deployed on the Ethereum L2 blockchain, ensuring decentralization and transparency.
- **Sertifyme Ai Agents:**  An Eliza framework that integrates with blockchain applications to facilitate contract interactions, automation, and wallet management of CertificationNFT. [SertifyMe Ai Agents](https://github.com/Iqbalfachry19/sertifyme-ai-agents)

## Smart Contract Details

### Contract Name: `CertificationNFT`

The contract is designed to mint NFTs representing certificates, containing key metadata for each token issued by an institution.

### Key Functions

- **`mintCertificate(address recipient, string recipientName, string courseName, string institutionName):`**  
  Mints a new certification NFT with unique metadata for the recipient, course, and institution. This function can only be called by the contract owner (the issuing institution).

- **`getCertificate(uint256 tokenId):`**  
  Returns the certificate metadata associated with the given token ID, including the recipient's name, course name, institution, and issue date.

### Data Structure

- **`_tokenIdCounter:`**  
  A simple counter to keep track of the next available token ID for each new certificate.
  
- **`Certificate Struct:`**  
  Holds the following metadata:
  - `recipientName`: The name of the recipient.
  - `courseName`: The name of the course.
  - `institutionName`: The name of the issuing institution.
  - `issueDate`: The timestamp when the certificate was issued.

## Usage Example

1. **Deploy the Contract:**  
   The contract is deployed on an Ethereum network, with the deploying address becoming the owner (institution) capable of minting certificates.

2. **Mint a Certificate:**  
   The institution calls the `mintCertificate` function to issue a new certificate for a recipient. This creates a new NFT, assigns it to the recipient's address, and stores the certificate details on-chain.

   ```solidity
   contract.mintCertificate(
       recipientAddress,
       "John Doe",
       "Blockchain Development",
       "XYZ University"
   );

3. **Verify a Certificate:**  
   Anyone can call the `getCertificate` function by providing a valid tokenId. This returns the certificate metadata and verifies ownership.

   ```solidity
   Certificate memory cert = contract.getCertificate(1);
   ```

## Deployment

The CertificationNFT contract is deployed on the Mode Sepolia Testnet, Base Sepolia Testnet, Manta Pacific Sepolia Testnet with the following contract address:

- **Mode Sepolia Contract Address:** 0x462B9bE8180d84A01587492C2317cE8A084535F7
- **Base Sepolia Contract Address:** 0xfd71381b49CA874D269eE45A84f25744a3F9433C
- **Manta Pacific Sepolia Contract Address:** 0x0a3f3287146ce135872DCc3c2e47b51a8D431a58
### Steps to Deploy

1. Install Foundry.
2. Set up a connection to the Ethereum network (e.g., via Infura or Alchemy).
3. Deploy the contract to your desired network.

```sh
source .env  
forge script script/CertificationNFT.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast  
```

## Future Enhancements

- **Certificate Revocation:** Add functionality to allow institutions to revoke certificates if necessary.
- **Additional Metadata:** Include more fields for metadata such as grade, duration, etc.
- **Multi-institution Support:** Extend the contract to allow multiple institutions to issue certificates.
- **Cross-chain Deployment:** Support for certificates on multiple blockchains (e.g., Polygon, Binance Smart Chain).

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Founder

**Iqbal Fachry (Developer)**

Feel free to reach out to us if you have any questions or suggestions. Happy coding! 🚀

