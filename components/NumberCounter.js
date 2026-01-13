import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NumberCounter({ value, duration = 2, suffix = "" }) {
	const counterRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const counter = { value: 0 };

			gsap.to(counter, {
				value: parseFloat(value),
				duration,
				ease: "power2.out",
				onUpdate: function () {
					if (counterRef.current) {
						counterRef.current.textContent =
							Math.ceil(counter.value) + suffix;
					}
				},
				scrollTrigger: {
					trigger: counterRef.current,
					start: "top 80%",
					once: true,
				},
			});
		}, counterRef);

		return () => ctx.revert();
	}, [value, duration, suffix]);

	return <span ref={counterRef}>0{suffix}</span>;
}
