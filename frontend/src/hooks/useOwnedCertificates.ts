// hooks/useOwnedCertificates.ts
import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi"; // 'useNetwork' tidak lagi diekspor dari 'wagmi'
import { readContract } from "@wagmi/core";
import { sertifymeContractAbi, sertifymeContractAddress } from "@/calls";
import { config } from "@/wagmi";
const CHAIN_ID = 84532; // Base Sepolia
interface Certificate { recipientName: string; courseName: string; institutionName: string; issueDate: number}; // Assuming this is a timestamp }

export function useOwnedCertificates() {
  const { address } = useAccount();
  const [certificateData, setCertificateData] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);

    try {
      const totalSupplyBigInt = await readContract(config, {
        address: sertifymeContractAddress,
        abi: sertifymeContractAbi,
        functionName: "_tokenIdCounter",
        chainId: CHAIN_ID,
      });

      const totalSupply = Number(totalSupplyBigInt);
      const ids = Array.from({ length: totalSupply - 1 }, (_, i) => i + 1);
      const certs: Certificate[] = [];

      for (const id of ids) {
        const owner = await readContract(config, {
          address: sertifymeContractAddress,
          abi: sertifymeContractAbi,
          functionName: "ownerOf",
          args: [BigInt(id)],
          chainId: CHAIN_ID,
        });

        if (owner.toLowerCase() !== address.toLowerCase()) continue;

        const cert = await readContract(config, {
          address: sertifymeContractAddress,
          abi: sertifymeContractAbi,
          functionName: "getCertificate",
          args: [BigInt(id)],
          chainId: CHAIN_ID,
        });

       
        const { issueDate: rawIssueDate, ...restOfCert } = cert;
        certs.push({ ...restOfCert, issueDate: Number(rawIssueDate) });
      }

      setCertificateData(certs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Auto fetch when address changes
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Expose refetch
  return { certificateData, loading, error, refetch: fetchCertificates };
}

