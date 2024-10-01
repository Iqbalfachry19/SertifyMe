'use client'

import * as React from "react"
import { createConfig, http, WagmiProvider, useConnect, useAccount, useDisconnect } from "wagmi"
import { mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Wallet, LogOut } from "lucide-react"

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

const queryClient = new QueryClient()

export function NavigationComponent() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NavigationContent />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function NavigationContent() {
  const [currentView, setCurrentView] = React.useState("home")
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/placeholder.svg?height=32&width=32"
                alt="Logo"
              />
            </div>
            <div className="hidden md:flex md:space-x-8 ml-10">
              <Button
                onClick={() => setCurrentView("home")}
                variant="ghost"
                className={`${
                  currentView === "home"
                    ? "text-white border-indigo-500"
                    : "text-gray-300 hover:text-white hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Button>
              <Button
                onClick={() => setCurrentView("mint")}
                variant="ghost"
                className={`${
                  currentView === "mint"
                    ? "text-white border-indigo-500"
                    : "text-gray-300 hover:text-white hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Mint Certificate
              </Button>
            </div>
          </div>
          <div className="flex items-center">
            <ConnectWallet />
            <MobileNav currentView={currentView} setCurrentView={setCurrentView} />
          </div>
        </div>
      </div>
    </nav>
  )
}

function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-36 justify-start text-left font-normal text-white border-gray-600">
            <Wallet className="mr-2 h-4 w-4" />
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-white border-gray-600">Connect Wallet</Button>
      </SheetTrigger>
      <SheetContent>
        <WalletOptions />
      </SheetContent>
    </Sheet>
  )
}

function MobileNav({ currentView, setCurrentView }: { currentView: string, setCurrentView: (view: string) => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-4 md:hidden text-white border-gray-600">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => setCurrentView("home")}
            variant="ghost"
            className={`${
              currentView === "home"
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            } justify-start text-sm font-medium`}
          >
            Home
          </Button>
          <Button
            onClick={() => setCurrentView("mint")}
            variant="ghost"
            className={`${
              currentView === "mint"
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            } justify-start text-sm font-medium`}
          >
            Mint Certificate
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function WalletOptions() {
  const { connectors, connect, error, isPending, pendingConnector } = useConnect()

  return (
    <div className="grid gap-4 py-4">
      <h2 className="text-lg font-semibold mb-2">Connect Wallet</h2>
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={!connector.ready || isPending}
          onClick={() => connect({ connector })}
        >
          {isPending && pendingConnector?.uid === connector.uid ? (
            <span className="mr-2 h-4 w-4 animate-spin">◌</span>
          ) : (
            <img
              src={`/placeholder.svg?height=24&width=24`}
              alt=""
              className="mr-2 h-6 w-6"
            />
          )}
          {connector.name}
        </Button>
      ))}
      {error && (
        <p className="text-red-500 text-sm mt-2" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}