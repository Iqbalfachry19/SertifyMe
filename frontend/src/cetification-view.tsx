import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, Wand2 } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { Input } from "./components/ui/input";

interface Certificate {
  recipientName: string;
  courseName: string;
  institutionName: string;
  issueDate: number;
}
type PDFColors = {
  background: {
    start: [number, number, number];
    end: [number, number, number];
  };
  text: [number, number, number];
  border: [number, number, number];
  header: [number, number, number];
};
// Simulated AI design function
const simulateAIDesign = (
  prompt: string
): {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  pdfColors: PDFColors;
} => {
  if (prompt.toLowerCase().includes("modern")) {
    return {
      backgroundColor: "bg-gradient-to-r from-purple-400 to-pink-500",
      textColor: "text-white",
      borderColor: "border-white",
      pdfColors: {
        background: { start: [167, 139, 250], end: [236, 72, 153] },
        text: [255, 255, 255],
        border: [255, 255, 255],
        header: [167, 139, 250],
      } as PDFColors,
    };
  } else if (prompt.toLowerCase().includes("classic")) {
    return {
      backgroundColor: "bg-gradient-to-r from-yellow-100 to-yellow-200",
      textColor: "text-gray-800",
      borderColor: "border-gray-800",
      pdfColors: {
        background: { start: [254, 249, 195], end: [254, 240, 138] },
        text: [31, 41, 55],
        border: [31, 41, 55],
        header: [31, 41, 55],
      } as PDFColors,
    };
  } else if (prompt.toLowerCase().includes("minimalist")) {
    return {
      backgroundColor: "bg-white",
      textColor: "text-gray-900",
      borderColor: "border-gray-300",
      pdfColors: {
        background: { start: [255, 255, 255], end: [255, 255, 255] },
        text: [17, 24, 39],
        border: [209, 213, 219],
        header: [17, 24, 39],
      } as PDFColors,
    };
  } else {
    return {
      backgroundColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
      pdfColors: {
        background: { start: [219, 234, 254], end: [224, 231, 255] },
        text: [30, 64, 175],
        border: [59, 130, 246],
        header: [30, 64, 175],
      } as PDFColors,
    };
  }
};

export default function CertificateView({
  certificates,
}: {
  certificates: Certificate[] | undefined;
}) {
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [designPrompt, setDesignPrompt] = useState("");
  const [certificateStyle, setCertificateStyle] = useState({
    backgroundColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-500",
    pdfColors: {
      background: { start: [219, 234, 254], end: [224, 231, 255] },
      text: [30, 64, 175],
      border: [59, 130, 246],
      header: [30, 64, 175],
    },
  });

  useEffect(() => {
    if (certificates && certificates.length > 0) {
      setSelectedCertificate(certificates[0]);
    }
  }, [certificates]);

  const formatDate = (timestamp: number) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString(
      t("languageCode"),
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const downloadCertificate = async () => {
    if (!selectedCertificate) return;
    setIsLoading(true);
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Set background gradient
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Create gradient background
      for (let i = 0; i < height; i++) {
        const factor = i / height;
        const [r, g, b] = [
          Math.round(
            certificateStyle.pdfColors.background.start[0] * (1 - factor) +
              certificateStyle.pdfColors.background.end[0] * factor
          ),
          Math.round(
            certificateStyle.pdfColors.background.start[1] * (1 - factor) +
              certificateStyle.pdfColors.background.end[1] * factor
          ),
          Math.round(
            certificateStyle.pdfColors.background.start[2] * (1 - factor) +
              certificateStyle.pdfColors.background.end[2] * factor
          ),
        ];
        doc.setDrawColor(r, g, b);
        doc.setFillColor(r, g, b);
        doc.rect(0, i, width, 1, "F");
      }

      // Add decorative border
      const [borderR, borderG, borderB] = certificateStyle.pdfColors.border;
      doc.setDrawColor(borderR, borderG, borderB);
      doc.setLineWidth(2);
      doc.roundedRect(10, 10, 277, 190, 5, 5);

      // Add header background
      const [headerR, headerG, headerB] = certificateStyle.pdfColors.header;
      doc.setFillColor(headerR, headerG, headerB);
      doc.rect(10, 10, 277, 30, "F");

      // Add title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255); // White text for header
      doc.text(t("certificateOfCompletion"), 148.5, 30, { align: "center" });

      // Add content with proper text color
      const [textR, textG, textB] = certificateStyle.pdfColors.text;
      doc.setTextColor(textR, textG, textB);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text(t("thisCertifiesThat"), 148.5, 60, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text(selectedCertificate.recipientName, 148.5, 75, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text(t("hasSuccessfullyCompleted"), 148.5, 90, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(selectedCertificate.courseName, 148.5, 105, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text(t("offeredBy"), 148.5, 120, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.text(selectedCertificate.institutionName, 148.5, 135, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text(
        `${t("issuedOn")} ${formatDate(selectedCertificate.issueDate)}`,
        148.5,
        155,
        { align: "center" }
      );

      // Save the PDF
      doc.save(
        `${selectedCertificate.recipientName}_${selectedCertificate.courseName}_Certificate.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const shareCertificate = (platform: string) => {
    if (!selectedCertificate) return;

    const text = `${t("checkOutMyCertificate")}: ${
      selectedCertificate.courseName
    } ${t("from")} ${selectedCertificate.institutionName}`;
    const url = `https://sertifyme.netlify.app`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          t("checkOutMyCertificate")
        )}&body=${encodeURIComponent(text + "\n\n" + url)}`;
        break;
    }
  };
  const applyDesign = () => {
    const newStyle = simulateAIDesign(designPrompt);
    setCertificateStyle(newStyle);
  };
  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t("noCertificates")}</p>
      </div>
    );
  }

  return (
    <div className="grid pt-4 grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("yourCertificates")}
        </h2>
        <div className="space-y-2">
          {certificates.map((cert, index) => (
            <Button
              key={index}
              variant={selectedCertificate === cert ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedCertificate(cert)}
            >
              <Award className="mr-2 h-4 w-4" />
              {cert.courseName}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{t("customizeDesign")}</h3>
          <Input
            type="text"
            placeholder={t("enterDesignPrompt")}
            value={designPrompt}
            onChange={(e) => setDesignPrompt(e.target.value)}
          />
          <Button onClick={applyDesign} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {t("applyDesign")}
          </Button>
        </div>
      </div>
      {selectedCertificate && (
        <Card
          className={`${certificateStyle.backgroundColor} ${certificateStyle.borderColor} border-4 rounded-lg shadow-lg overflow-hidden`}
        >
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Award className={`h-16 w-16 ${certificateStyle.textColor}`} />
              </div>
              <h3
                className={`text-2xl font-bold ${certificateStyle.textColor}`}
              >
                {t("certificateOfCompletion")}
              </h3>
              <p className={`text-lg ${certificateStyle.textColor}`}>
                {t("thisCertifiesThat")}
              </p>
              <p
                className={`text-3xl font-serif ${certificateStyle.textColor}`}
              >
                {selectedCertificate.recipientName}
              </p>
              <p className={`text-lg ${certificateStyle.textColor}`}>
                {t("hasSuccessfullyCompleted")}
              </p>
              <p className={`text-2xl font-bold ${certificateStyle.textColor}`}>
                {selectedCertificate.courseName}
              </p>
              <p className={`text-lg ${certificateStyle.textColor}`}>
                {t("offeredBy")}
              </p>
              <p
                className={`text-xl font-semibold ${certificateStyle.textColor}`}
              >
                {selectedCertificate.institutionName}
              </p>
              <p className={`text-md ${certificateStyle.textColor}`}>
                {t("issuedOn")} {formatDate(selectedCertificate.issueDate)}
              </p>
              <div className="pt-4 flex flex-col justify-center items-center">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={downloadCertificate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {t("downloadCertificate")}
                    </>
                  )}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 mt-2 hover:bg-green-700">
                      <Share2 className="mr-2 h-4 w-4" />
                      {t("shareCertificate")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("shareCertificate")}</DialogTitle>
                      <DialogDescription>
                        {t("choosePlatformToShare")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center space-x-4 mt-4">
                      <Button
                        onClick={() => shareCertificate("facebook")}
                        className="bg-blue-600 hover:bg-blue-700"
                        aria-label={t("shareFacebook")}
                      >
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                      </Button>
                      <Button
                        onClick={() => shareCertificate("twitter")}
                        className="bg-sky-500 hover:bg-sky-600"
                        aria-label={t("shareTwitter")}
                      >
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                      </Button>
                      <Button
                        onClick={() => shareCertificate("linkedin")}
                        className="bg-blue-700 hover:bg-blue-800"
                        aria-label={t("shareLinkedIn")}
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Button>
                      <Button
                        onClick={() => shareCertificate("email")}
                        className="bg-red-600 hover:bg-red-700"
                        aria-label={t("shareEmail")}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
