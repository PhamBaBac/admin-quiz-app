/** @format */

import { FooterComponent, HeaderComponent } from "@/components";
import { locales } from "@/i18n";
import Router from "@/routers/Router";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export async function generateStaticParams() {
  return locales.map((l) => ({ locale: l }));
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <AntdRegistry>
        <Router children={children} />
      </AntdRegistry>
    </NextIntlClientProvider>
  );
}
