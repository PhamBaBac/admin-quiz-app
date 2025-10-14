/** @format */

import { FooterComponent, HeaderComponent } from '@/components';
import { locales } from '@/i18n';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export async function generateStaticParams() {
	return locales.map((l) => ({ locale: l }));
}

export default async function LocaleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const messages = await getMessages(); // có messages/vi.json & en.json
	return (
		<NextIntlClientProvider messages={messages}>
			<AntdRegistry>
				<HeaderComponent />
				<div className='main-container'>
					<div className='container-fluid mt-5'>{children}</div>
				</div>
				<FooterComponent />
			</AntdRegistry>
		</NextIntlClientProvider>
	);
}
