import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Academy — AI-автоматизация для бизнеса Кыргызстана",
  description:
    "Внедряем искусственный интеллект в реальные бизнес-процессы — документооборот, продажи, логистику. С измеримым результатом, закреплённым в договоре.",
  keywords: [
    "AI автоматизация",
    "искусственный интеллект для бизнеса",
    "AI Кыргызстан",
    "автоматизация документов",
    "AI Academy",
  ],
  openGraph: {
    title: "AI Academy — AI-автоматизация для бизнеса Кыргызстана",
    description:
      "Внедряем искусственный интеллект в реальные бизнес-процессы — документооборот, продажи, логистику. С измеримым результатом, закреплённым в договоре.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} ${unbounded.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
