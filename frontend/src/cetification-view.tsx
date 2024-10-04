import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2 } from "lucide-react";
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

interface Certificate {
  recipientName: string;
  courseName: string;
  institutionName: string;
  issueDate: number;
}

export default function CertificateView({
  certificates,
}: {
  certificates: Certificate[] | undefined;
}) {
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const { t } = useTranslation();

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

  const downloadCertificate = () => {
    if (!selectedCertificate) return;

    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height,
      "F"
    );

    // Add border
    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(5);
    doc.rect(
      10,
      10,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 20
    );

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 128); // Navy blue
    doc.text(t("certificateOfCompletion"), 105, 40, { align: "center" });

    // Add content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(t("thisCertifiesThat"), 105, 60, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(selectedCertificate.recipientName, 105, 75, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(t("hasSuccessfullyCompleted"), 105, 90, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(selectedCertificate.courseName, 105, 105, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(t("offeredBy"), 105, 120, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text(selectedCertificate.institutionName, 105, 135, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(
      `${t("issuedOn")} ${formatDate(selectedCertificate.issueDate)}`,
      105,
      155,
      { align: "center" }
    );

    // Save the PDF
    doc.save(
      `${selectedCertificate.recipientName}_${selectedCertificate.courseName}_Certificate.pdf`
    );
  };

  const shareCertificate = (platform: string) => {
    if (!selectedCertificate) return;

    const text = `${t("checkOutMyCertificate")}: ${
      selectedCertificate.courseName
    } ${t("from")} ${selectedCertificate.institutionName}`;
    const url = `https://sertifyme.netlify.app/certificate/${selectedCertificate.courseName}`;

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
      </div>
      {selectedCertificate && (
        <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-500 rounded-lg shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Award className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800">
                {t("certificateOfCompletion")}
              </h3>
              <p className="text-lg text-gray-700">{t("thisCertifiesThat")}</p>
              <p className="text-3xl font-serif text-blue-900">
                {selectedCertificate.recipientName}
              </p>
              <p className="text-lg text-gray-700">
                {t("hasSuccessfullyCompleted")}
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {selectedCertificate.courseName}
              </p>
              <p className="text-lg text-gray-700">{t("offeredBy")}</p>
              <p className="text-xl font-semibold text-blue-700">
                {selectedCertificate.institutionName}
              </p>
              <p className="text-md text-gray-600">
                {t("issuedOn")} {formatDate(selectedCertificate.issueDate)}
              </p>
              <div
                className="pt-4 flex flex-col
               justify-center items-center "
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={downloadCertificate}
                >
                  <Download className=" h-4 w-4" />
                  {t("downloadCertificate")}
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
                      >
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                      </Button>
                      <Button
                        onClick={() => shareCertificate("twitter")}
                        className="bg-sky-500 hover:bg-sky-600"
                      >
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                      </Button>
                      <Button
                        onClick={() => shareCertificate("linkedin")}
                        className="bg-blue-700 hover:bg-blue-800"
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Button>
                      <Button
                        onClick={() => shareCertificate("email")}
                        className="bg-red-600 hover:bg-red-700"
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
