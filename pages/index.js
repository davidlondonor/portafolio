import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useTypingText } from "../components/useTypingText";

export default function Home() {
	const { word } = useTypingText(
		["Accessibility", "Frontend Developer", "User Interface", "Web designer"],
		130,
		20
	);

	return (
		<div>
			<Head>
				<title>David Dev</title>
				<meta name="description" content="Frontend Developer" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="bg-yellow-400 h-screen">
				<div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-extrabold text-black sm:text-4xl">
						<span className="block text-yellow-700 opacity-25">
							UI Developer
						</span>
						<h1 className="font-bold text-5xl">I like {word}</h1>
						<br></br>{" "}
						<p className="font-mono text-sm opacity-40">
							with <code>NextJS</code>
						</p>
						<span className="block font-semibold text-yellow-600">
							David Londono
						</span>
					</h2>
					<a
						href="#"
						className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-indigo-50 sm:w-auto"
					>
						🖥 &nbsp; ✏️ &nbsp;☕
					</a>
				</div>
			</div>
		</div>
	);
}
