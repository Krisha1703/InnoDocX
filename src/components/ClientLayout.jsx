"use client";

import { SessionProvider } from "next-auth/react";

// This component ensures that SessionProvider is used in a Client Component
export default function ClientLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
