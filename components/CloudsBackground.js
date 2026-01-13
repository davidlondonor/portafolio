import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CloudsBackground() {
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const clouds = containerRef.current?.querySelectorAll('.cloud');

			clouds?.forEach((cloud, i) => {
				// Animate clouds moving slowly left to right
				gsap.to(cloud, {
					x: () => gsap.utils.random(-100, 300),
					y: () => gsap.utils.random(-20, 20),
					duration: gsap.utils.random(20, 40),
					repeat: -1,
					ease: 'none',
				});

				// Subtle opacity animation
				gsap.to(cloud, {
					opacity: () => gsap.utils.random(0.3, 0.7),
					duration: gsap.utils.random(5, 10),
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
				});
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-amber-100/20 to-transparent"
			style={{ zIndex: 0 }}
		>
			{/* Cloud 1 */}
			<div
				className="cloud absolute top-10 left-10 w-96 h-32 bg-amber-200 rounded-full blur-3xl opacity-40"
				style={{ filter: 'blur(60px)' }}
			></div>

			{/* Cloud 2 */}
			<div
				className="cloud absolute top-1/4 right-20 w-80 h-28 bg-amber-100 rounded-full blur-3xl opacity-30"
				style={{ filter: 'blur(50px)' }}
			></div>

			{/* Cloud 3 */}
			<div
				className="cloud absolute top-1/2 left-1/3 w-72 h-24 bg-amber-300 rounded-full blur-3xl opacity-25"
				style={{ filter: 'blur(55px)' }}
			></div>

			{/* Cloud 4 */}
			<div
				className="cloud absolute top-2/3 right-1/4 w-96 h-32 bg-amber-200 rounded-full blur-3xl opacity-35"
				style={{ filter: 'blur(65px)' }}
			></div>

			{/* Cloud 5 */}
			<div
				className="cloud absolute bottom-20 left-1/4 w-80 h-28 bg-amber-100 rounded-full blur-3xl opacity-28"
				style={{ filter: 'blur(58px)' }}
			></div>
		</div>
	);
}
