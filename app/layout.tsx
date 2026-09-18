import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Fraunces({
	variable: "--font-display",
	subsets: ["latin"],
	axes: ["SOFT", "WONK", "opsz"],
});

const sans = Source_Sans_3({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Medley Jam",
	description: "Find songs that share the same chord progression.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${display.variable} ${sans.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col font-sans">{children}</body>
		</html>
	);
}
