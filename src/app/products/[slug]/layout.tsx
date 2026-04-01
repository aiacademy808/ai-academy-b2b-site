import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | AI Academy",
    default: "Продукты — AI Academy",
  },
  description:
    "AI-продукты для автоматизации бизнес-процессов. Документооборот, CRM, ML-модели, боты и BI-аналитика.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
