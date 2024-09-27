import { useState, useEffect, FormEvent } from "react";
import { ethers, Contract } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, X, Award, Shield, Zap } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai"; // For the X (Twitter) logo

import Logo from "./Logo";
import HeroImage from "./HeroImage";

interface Certificate {
  recipientName: string;
  courseName: string;
  institutionName: string;
  issueDate: number; // Assuming this is a timestamp
}
export default function App() {
  const CONTRACT_ADDRESS = "0xfd71381b49CA874D269eE45A84f25744a3F9433C";
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");
  const [certificateData, setCertificateData] = useState<Certificate[]>([]); // Replace 'any' with a more specific type if known
  const [error, setError] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>("home");
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const chainId = "0x14a34"; // Example for Ethereum Mainnet (0x1). Change to desired network chain ID.
      const correctNetwork = await switchToNetwork(chainId);

      if (!correctNetwork) {
        return; // Stop if network switching failed or was canceled by user.
      }
      const res = await fetch("/CertificationNFT.json");
      const CertificationNFT = await res.json();
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
  const switchToNetwork = async (requiredChainId: string) => {
      if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed. Please install MetaMask and try again.");
    return false; // Exit the function if MetaMask is not available
  }
    try {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      // If the user is already on the correct network
      if (currentChainId === requiredChainId) {
        return true;
      }

      // Prompt user to switch to the correct network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: requiredChainId }],
      });

      return true;
    } catch (error) {
          const metamaskError = error as { code: number; message: string };

        if (metamaskError.code === 4902) {
          // If the network has not been added to MetaMask
          try {
            // Add the network
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: requiredChainId,
                  chainName: "Base Sepolia", // Add desired network details
                  nativeCurrency: {
                    name: "ETH", // Native currency (e.g., ETH for Ethereum)
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.base.org"], // RPC URL
                  blockExplorerUrls: ["https://sepolia-explorer.base.org"], // Block explorer URL
                },
              ],
            });

            return true;
          } catch (addError) {
            console.error("Failed to add the network:", addError);
            return false;
          }
        } else {
          console.error("Failed to switch the network:", error);
          return false;
        }
      }
    }
  };
  const mintCertificate = async (e: FormEvent) => {
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
      if (err instanceof Error) {
        setError(err.message);
      }
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
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <HeroImage />
                <div className="absolute inset-0 bg-indigo-700 mix-blend-multiply"></div>
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">
                    Secure Your Achievements
                  </span>
                  <span className="block text-indigo-200">
                    with Blockchain Technology
                  </span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                  SertifyMe leverages blockchain to create tamper-proof,
                  verifiable certificates for your accomplishments.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                    <Button
                      onClick={() => setCurrentView("mint")}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                    >
                      Get started
                    </Button>
                    <Button
                      onClick={() => setCurrentView("view")}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                    >
                      View Certificates
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Why Choose SertifyMe?
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Our platform offers unique advantages for both certificate
                issuers and recipients.
              </p>
            </div>
            <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8">
              {[
                {
                  name: "Blockchain Security",
                  description:
                    "Certificates are stored on the blockchain, ensuring they cannot be tampered with or forged.",
                  icon: Shield,
                },
                {
                  name: "Instant Verification",
                  description:
                    "Employers and institutions can instantly verify the authenticity of certificates.",
                  icon: Zap,
                },
                {
                  name: "Lifelong Access",
                  description:
                    "Recipients have permanent access to their certificates, independent of the issuing institution.",
                  icon: Award,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
    </div>
  );

  const renderCertificateManagement = () => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-gray-900">
                SertifyMe
              </span>
            </div>
            <div className="hidden md:flex md:space-x-8">
              <Button
                onClick={() => setCurrentView("home")}
                className={`${
                  currentView === "home"
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Button>
              <Button
                onClick={() => setCurrentView("mint")}
                className={`${
                  currentView === "mint"
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Mint Certificate
              </Button>
            </div>
            <div className="flex md:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Button
                onClick={() => {
                  setCurrentView("home");
                  setIsMenuOpen(false);
                }}
                className={`${
                  currentView === "home"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Home
              </Button>
              <Button
                onClick={() => {
                  setCurrentView("mint");
                  setIsMenuOpen(false);
                }}
                className={`${
                  currentView === "mint"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Mint Certificate
              </Button>
              <Button
                onClick={() => {
                  setCurrentView("view");
                  setIsMenuOpen(false);
                }}
                className={`${
                  currentView === "view"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                View Certificates
              </Button>
            </div>
          </div>
        )}
      </header>

      {currentView === "home" && renderHomePage()}
      {(currentView === "mint" || currentView === "view") &&
        renderCertificateManagement()}

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {[
                { name: "Facebook", icon: FaFacebookF },
                { name: "Instagram", icon: FaInstagram },
                { name: "X", icon: AiOutlineTwitter },
                { name: "GitHub", icon: FaGithub },
                { name: "LinkedIn", icon: FaLinkedinIn },
              ].map(({ name, icon: Icon }) => (
                <a
                  key={name}
                  href="#"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2024 SertifyMe, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
