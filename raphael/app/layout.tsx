import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chá de Casa Nova - Raphael e Karolaine",
  description:
    "Estamos construindo nosso lar juntos e adoraríamos contar com a sua presença nessa conquista! Escolha um presente da nossa lista de Chá de Casa Nova.",
  openGraph: {
    title: "Chá de Casa Nova - Raphael e Karolaine",
    description:
      "Escolha um presente para o nosso Chá de Casa Nova e faça parte desta conquista especial.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>
        {children}
      </body>
    </html>
  );
}
