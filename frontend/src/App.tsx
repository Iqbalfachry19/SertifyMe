import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CertificationNFT from "../artifacts/CertificationNFT.json"; // Adjust the path to your contract's JSON file
import "./App.css";

// Replace with your smart contract address
const CONTRACT_ADDRESS = "0xfd71381b49CA874D269eE45A84f25744a3F9433C";

function App() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [certificateData, setCertificateData] = useState([]);
  const [error, setError] = useState("");

  // State to hold provider and contract instance
  const [contract, setContract] = useState(null);

  // Initialize the provider and contract instance
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CertificationNFT.abi,
        signer
      );

      setContract(contractInstance);
    };

    init();
  }, []);

  const mintCertificate = async (e) => {
    e.preventDefault();
    if (!contract) {
      setError("Contract not initialized");
      return;
    }

    try {
      const tx = await contract.mintCertificate(
        recipientAddress,
        recipientName,
        courseName,
        institutionName
      );
      await tx.wait();
      alert("Certificate minted successfully!");
      fetchCertificates();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCertificates = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }

    try {
      const totalSupply = await contract._tokenIdCounter();
      const certificates = [];

      for (let i = 1; i < Number(totalSupply); i++) {
        const cert = await contract.getCertificate(i);
        certificates.push(cert);
      }

      setCertificateData(certificates);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Certification NFT</h1>
      <form className="cert-form" onSubmit={mintCertificate}>
        <div className="form-group">
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Recipient Name:</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Institution Name:</label>
          <input
            type="text"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Mint Certificate
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <h2>Existing Certificates</h2>
      <button onClick={fetchCertificates} className="fetch-button">
        Fetch Certificates
      </button>
      <ul className="certificate-list">
        {certificateData.map((cert, index) => (
          <li key={index} className="certificate-item">
            <strong>Recipient Name:</strong> {cert?.recipientName} <br />
            <strong>Course Name:</strong> {cert?.courseName} <br />
            <strong>Institution Name:</strong> {cert?.institutionName} <br />
            <strong>Issue Date:</strong>{" "}
            {new Date(Number(cert?.issueDate) * 1000).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
