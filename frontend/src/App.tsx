import { useState, useEffect, FormEvent } from "react";
import { ethers, Contract } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Menu,
  X,
  Award,
  Shield,
  Zap,
  AlertCircle,
  Sparkles,
  Globe,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut } from "lucide-react";
import { WalletOptions } from "./wallet-options";
import Logo from "./Logo";
import HeroImage from "./HeroImage";
import { useAccount, useDisconnect } from "wagmi";
import { AlertPopup } from "./Alert";
import { Alert, AlertDescription } from "./components/ui/alert";
import Footer from "./Footer";
import CertificateView from "./cetification-view";
import { useTranslation } from "react-i18next";
import * as tf from "@tensorflow/tfjs";
interface AISuggestions {
  courseName: string;
  institutionName: string;
}
function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { t } = useTranslation();
  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-36 justify-start text-left font-normal text-black border-gray-600"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("disconnect")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-black border-gray-600">
          {t("connectWallet")}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <WalletOptions />
      </SheetContent>
    </Sheet>
  );
}
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
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("mint");
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(
    null
  );
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
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
  useEffect(() => {
    if (contract) {
      fetchCertificates();
    }
  }, [contract]);
  const switchToNetwork = async (requiredChainId: string) => {
    if (typeof window.ethereum === "undefined") {
      alert(
        "MetaMask is not installed. Please install MetaMask and try again."
      );
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
  };
  const renderLanguageSelector = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-36">
          <Globe className="mr-2 h-4 w-4" />
          {t("language")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("id")}>
          Bahasa Indonesia
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("ms")}>
          Bahasa Melayu
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("th")}>
          ภาษาไทย
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("vi")}>
          Tiếng Việt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
      setShowAlert(true);
      fetchCertificates();
      setActiveTab("view");
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
  const fetchAISuggestions = () => {
    setIsLoadingAI(true);
    setError("");
    try {
      setTimeout(async () => {
        const suggestions = await generateAISuggestions(recipientName);
        setAiSuggestions(suggestions);
        setIsLoadingAI(false);
      }, 1000); // Simulate API delay
    } catch (err) {
      if (err instanceof Error) {
        setError("Failed to generate AI suggestions: " + err.message);
      }
      setIsLoadingAI(false);
    }
  };
  function nameHash(name: string) {
    return name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
  const generateAISuggestions = async (
    name: string
  ): Promise<AISuggestions> => {
    // Load the saved model from the filesystem
    const model = await tf.loadLayersModel("/ai-suggestions-model/model.json");

    // Hash the name and create the input tensor
    const nameHashValue = nameHash(name) % 1000;
    const inputTensor = tf.tensor2d([[nameHashValue]]);

    // Predict using the model
    const predictions = model.predict(inputTensor) as tf.Tensor[]; // Cast to an array of tensors
    // console.log(predictions);
    // console.log(predictions[0].argMax(1).dataSync()[0]);
    // console.log(predictions[1].argMax(1).dataSync()[0]);
    // Get the predicted indices for courses and institutions
    const predictedCourseIndex = predictions[0].argMax(1).dataSync()[0]; // First output for courses
    const predictedInstitutionIndex = predictions[1].argMax(1).dataSync()[0]; // Second output for institutions

    // Clean up
    inputTensor.dispose();

    // Course and institution lists
    const courses = [
      "Smart Contract Development",
      "Blockchain Fundamentals",
      "Decentralized Finance",
      "Cryptocurrency Economics",
      "Web3 Application Development",
      "NFT Creation and Marketing",
      "Blockchain for Business",
      "Cryptocurrency Trading Strategies",
      "Web3 Security Essentials",
      "Decentralized App Development",
      "Tokenomics and ICO Strategies", // New
      "Blockchain Governance and Regulation", // New
      "Advanced Blockchain Programming", // New
      "Web3 Marketing and Community Building", // New
      "Introduction to Cryptocurrency Mining", // New
      "Interoperability in Blockchain", // New
      "Data Privacy in Web3", // New
      "Building Decentralized Autonomous Organizations (DAOs)", // New
      "Blockchain Project Management", // New
      "Smart Contract Security Auditing", // New
      "Cross-Chain Development", // New
    ];

    const institutions = [
      "Ethereum Academy",
      "Blockchain University",
      "Crypto Institute",
      "DeFi School",
      "Web3 College",
      "Future of Finance Institute",
      "Digital Currency Academy",
      "Tech Blockchain School",
      "Crypto Innovation Lab",
      "Web3 Development Institute",
      "Blockchain Research Institute", // New
      "Global Blockchain Institute", // New
      "Crypto Academy Online", // New
      "NextGen Blockchain School", // New
      "Fintech & Blockchain Academy", // New
      "Decentralized Tech University", // New
      "Digital Ledger Academy", // New
      "Crypto Currency Academy", // New
      "Metaverse Development Institute", // New
      "Distributed Ledger Technologies Institute", // New
      "Blockchain Strategy Institute", // New
    ];

    return {
      courseName: courses[predictedCourseIndex],
      institutionName: institutions[predictedInstitutionIndex],
    };
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
                  <span className="block text-white">{t("heroTitle1")}</span>
                  <span className="block text-indigo-200">
                    {t("heroTitle2")}
                  </span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                  {t("heroDescription")}
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                    <Button
                      onClick={() => {
                        setCurrentView("mint");
                        setActiveTab("mint");
                      }}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                    >
                      {t("getStarted")}
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentView("view");
                        setActiveTab("view");
                      }}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                    >
                      {t("viewCertificates")}
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
                {t("whyChooseUs")}
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                {t("platformAdvantages")}
              </p>
            </div>
            <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8">
              {[
                {
                  name: t("blockchainSecurity"),
                  description: t("blockchainSecurityDesc"),
                  icon: Shield,
                },
                {
                  name: t("instantVerification"),
                  description: t("instantVerificationDesc"),
                  icon: Zap,
                },
                {
                  name: t("lifelongAccess"),
                  description: t("lifelongAccessDesc"),
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
          {t("certificationNFT")}
        </h1>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger onClick={() => setCurrentView("mint")} value="mint">
              {t("mintCertificate")}
            </TabsTrigger>
            <TabsTrigger onClick={() => setCurrentView("view")} value="view">
              {t("viewCertificates")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="mint">
            <Card>
              <CardHeader>
                <CardTitle>{t("mintNewCertificate")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={mintCertificate} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="recipientAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("recipientAddress")}
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
                      {t("recipientName")}
                    </label>
                    <Input
                      id="recipientName"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={fetchAISuggestions}
                    disabled={isLoadingAI || !recipientName}
                    className="w-full"
                  >
                    {isLoadingAI ? (
                      t("generating")
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t("generateAISuggestions")}
                      </>
                    )}
                  </Button>
                  {aiSuggestions && (
                    <div className="space-y-2 p-4 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium text-blue-800">
                        {t("aiSuggestions")}:
                      </p>
                      <p className="text-sm text-blue-700">
                        {t("course")}: {aiSuggestions.courseName}
                      </p>
                      <p className="text-sm text-blue-700">
                        {t("institution")}: {aiSuggestions.institutionName}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCourseName(aiSuggestions.courseName);
                            setInstitutionName(aiSuggestions.institutionName);
                          }}
                        >
                          {t("useSuggestions")}
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label
                      htmlFor="courseName"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("courseName")}
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
                      {t("institutionName")}
                    </label>
                    <Input
                      id="institutionName"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t("mintCertificate")}
                  </Button>
                </form>
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="ml-2 break-words">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="view">
            <Card>
              <CardContent>
                <CertificateView certificates={certificateData} />
              </CardContent>
            </Card>
          </TabsContent>
          <AlertPopup
            message={t("certificateMinted")}
            isVisible={showAlert}
            onClose={() => setShowAlert(false)}
          />
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
                {t("home")}
              </Button>
              <Button
                onClick={() => {
                  setCurrentView("mint");
                  setActiveTab("mint");
                }}
                className={`${
                  currentView === "mint"
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-500 hover:text-indigo-600 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {t("mintCertificate")}
              </Button>
              <Button
                onClick={() => {
                  setCurrentView("view");
                  setActiveTab("view");
                }}
                className={`${
                  currentView === "view"
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-500 hover:text-indigo-600 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {t("viewCertificates")}
              </Button>
              {renderLanguageSelector()}
              <ConnectWallet />
            </div>
            <div className="flex md:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span className="sr-only">{t("openMainMenu")}</span>
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
                {t("home")}
              </Button>
              <Button
                onClick={() => {
                  setCurrentView("mint");
                  setActiveTab("mint");
                  setIsMenuOpen(false);
                }}
                className={`${
                  currentView === "mint"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                {t("mintCertificate")}
              </Button>
              <Button
                onClick={() => {
                  setCurrentView("view");
                  setActiveTab("view");
                  setIsMenuOpen(false);
                }}
                className={`${
                  currentView === "view"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                {t("viewCertificates")}
              </Button>
              {renderLanguageSelector()}
              <ConnectWallet />
            </div>
          </div>
        )}
      </header>

      {currentView === "home" && renderHomePage()}
      {(currentView === "mint" || currentView === "view") &&
        renderCertificateManagement()}

      <Footer />
    </div>
  );
}
