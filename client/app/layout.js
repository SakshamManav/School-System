// app/layout.js
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./provider";  // <-- import the client boundary

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <main className="">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
