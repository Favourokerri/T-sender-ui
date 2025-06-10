"use client"

import { type ReactNode } from "react";
import config from "../rainBowKitConfig";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';
import { useState } from "react";

export function Providers(props: { children: ReactNode}) {
    const [queryClient] = useState(()=> new QueryClient());
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {props.children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}