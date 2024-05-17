"use client";
import { ChakraProvider } from "@chakra-ui/react";

// Provider para o Chakra UI
export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
