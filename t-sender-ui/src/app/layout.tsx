"use client";
import type { Metadata } from "next";
import { type ReactNode } from "react";
import {Providers} from "./providers";
import Navbar from "./components/navBar";

import "./globals.css";

export default function RootLayout(props: { children: ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>
            <Navbar />
            {props.children}
        </Providers>
      </body>
    </html>
  );
}
