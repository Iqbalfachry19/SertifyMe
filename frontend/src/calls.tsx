export const sertifymeContractAddress =
  "0x3D3e32E56D0a0E23721E4B3C231EA6920878c4ed";
export const sertifymeContractAbi = [
  {
    type: "function",
    name: "mintCertificate",
    inputs: [
      { name: "recipient", type: "address", internalType: "address" },
      { name: "recipientName", type: "string", internalType: "string" },
      { name: "courseName", type: "string", internalType: "string" },
      { name: "institutionName", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
