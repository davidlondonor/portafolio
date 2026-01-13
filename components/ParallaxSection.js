import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxSection({ children, speed = 0.5 }) {
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.to(containerRef.current, {
				y: (i, target) => {
					return ScrollTrigger.getScrollDirection() === -1
						? 0
						: gsap.getProperty(target, "y");
				},
				scrollTrigger: {
					trigger: containerRef.current,
					onUpdate: (self) => {
						gsap.to(containerRef.current, {
							y: self.getVelocity() * -0.05,
							overwrite: "auto",
							duration: 0.5,
						});
					},
				},
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return <div ref={containerRef}>{children}</div>;
}
