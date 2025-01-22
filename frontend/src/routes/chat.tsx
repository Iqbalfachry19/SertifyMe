import { useParams, useNavigate } from "react-router-dom";
import Chat from "@/components/chat";
import { UUID } from "@elizaos/core";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
export default function AgentRoute() {
  const { agentId } = useParams<{ agentId: UUID }>();
  const navigate = useNavigate();

  if (!agentId) return <div>No data.</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#007BFF",
        }}
      >
        <ArrowLeftIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        Back
      </button>
      <Chat agentId={agentId} />
    </div>
  );
}
