import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";

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

  useEffect(() => {
    if (certificates && certificates.length > 0) {
      setSelectedCertificate(certificates[0]);
    }
  }, [certificates]);

  const formatDate = (timestamp: number) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No certificates found. Mint a certificate to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Certificates</h2>
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
                Certificate of Completion
              </h3>
              <p className="text-lg text-gray-700">This certifies that</p>
              <p className="text-3xl font-serif text-blue-900">
                {selectedCertificate.recipientName}
              </p>
              <p className="text-lg text-gray-700">
                has successfully completed the course
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {selectedCertificate.courseName}
              </p>
              <p className="text-lg text-gray-700">offered by</p>
              <p className="text-xl font-semibold text-blue-700">
                {selectedCertificate.institutionName}
              </p>
              <p className="text-md text-gray-600">
                Issued on: {formatDate(selectedCertificate.issueDate)}
              </p>
              <div className="pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
