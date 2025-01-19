import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "./lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

// Configure the Plus Jakarta Sans font
const geistSans = Plus_Jakarta_Sans({
  variable: "--jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Define metadata for the app
export const metadata: Metadata = {
  title: "Aayush Bharat",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Use suppressHydrationWarning to avoid hydration errors */}
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          geistSans.variable
        )}
      >
        {/* ThemeProvider manages light/dark themes */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}



