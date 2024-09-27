import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CertificationNFT from "../artifacts/CertificationNFT.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CONTRACT_ADDRESS = "0xfd71381b49CA874D269eE45A84f25744a3F9433C";

export default function App() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [certificateData, setCertificateData] = useState([]);
  const [error, setError] = useState("");
  const [contract, setContract] = useState(null);

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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Certification NFT
        </h1>
        <Tabs defaultValue="mint" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mint">Mint Certificate</TabsTrigger>
            <TabsTrigger value="view">View Certificates</TabsTrigger>
          </TabsList>
          <TabsContent value="mint">
            <Card>
              <CardHeader>
                <CardTitle>Mint New Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={mintCertificate} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="recipientAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Recipient Address
                    </label>
                    <Input
                      id="recipientAddress"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="recipientName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Recipient Name
                    </label>
                    <Input
                      id="recipientName"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="courseName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Course Name
                    </label>
                    <Input
                      id="courseName"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="institutionName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Institution Name
                    </label>
                    <Input
                      id="institutionName"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Mint Certificate
                  </Button>
                </form>
                {error && <p className="mt-4 text-red-600">{error}</p>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle>Existing Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={fetchCertificates} className="mb-4">
                  Fetch Certificates
                </Button>
                <div className="space-y-4">
                  {certificateData.map((cert, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <p>
                          <strong>Recipient Name:</strong> {cert?.recipientName}
                        </p>
                        <p>
                          <strong>Course Name:</strong> {cert?.courseName}
                        </p>
                        <p>
                          <strong>Institution Name:</strong>{" "}
                          {cert?.institutionName}
                        </p>
                        <p>
                          <strong>Issue Date:</strong>{" "}
                          {new Date(
                            Number(cert?.issueDate) * 1000
                          ).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
