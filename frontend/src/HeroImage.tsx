interface HeroImageProps {
  className?: string;
}

export default function HeroImage({
  className = "h-full w-full",
}: HeroImageProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Blockchain Certification Illustration"
    >
      <rect width="1200" height="600" fill="#4F46E5" />
      <circle cx="600" cy="300" r="200" fill="#6366F1" />
      <path
        d="M400 300L500 400L700 200"
        stroke="white"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Blockchain representation */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${200 + i * 200}, 450)`}>
          <rect width="150" height="100" rx="10" fill="#818CF8" />
          <line
            x1="75"
            y1="0"
            x2="75"
            y2="100"
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1="50"
            x2="150"
            y2="50"
            stroke="white"
            strokeWidth="2"
          />
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={350 + i * 200}
          y1="500"
          x2={400 + i * 200}
          y2="500"
          stroke="white"
          strokeWidth="4"
        />
      ))}
      {/* Certificate icon */}
      <rect x="525" y="250" width="150" height="200" rx="10" fill="white" />
      <rect x="550" y="280" width="100" height="10" rx="5" fill="#4F46E5" />
      <rect x="550" y="310" width="100" height="10" rx="5" fill="#4F46E5" />
      <rect x="550" y="340" width="100" height="10" rx="5" fill="#4F46E5" />
      <path
        d="M560 390L590 420L640 370"
        stroke="#4F46E5"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
