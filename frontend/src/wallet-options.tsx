import * as React from "react";
import { Connector, useConnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

export function WalletOptions() {
  const { connectors, connect, error } = useConnect();

  return (
    <CardContent className="grid gap-4 p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Connect Wallet</h2>
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
      {error && (
        <p className="text-red-500 text-center mt-2" role="alert">
          {error.message}
        </p>
      )}
    </CardContent>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <Button
      variant="outline"
      className="w-full justify-start text-left font-normal"
      disabled={!ready}
      onClick={onClick}
    >
      {connector.name}
    </Button>
  );
}
