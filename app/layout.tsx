import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, VT323 } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/header/Header';
import { Providers } from '@/components/Providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const vt323 = VT323({
	variable: '--font-vt323',
	subsets: ['latin'],
	weight: '400',
});

export const metadata: Metadata = {
	title: 'sqlit',
	description: 'An SQL notebook that runs entirely in the browser.',
	applicationName: 'sqlit',
	openGraph: {
		title: 'sqlit',
		description: 'An SQL notebook that runs entirely in the browser.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'sqlit',
		description: 'An SQL notebook that runs entirely in the browser.',
	},
};

export const viewport: Viewport = {
	themeColor: '#7c3aff',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable}`}
		>
			<body>
				<Providers>
					<Header />
					{children}
				</Providers>
			</body>
		</html>
	);
}
