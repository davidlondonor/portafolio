import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StaggeredList({ items, renderItem, className = "" }) {
	const listRef = useRef(null);

	useEffect(() => {
		if (!listRef.current) return;

		const ctx = gsap.context(() => {
			const listItems = listRef.current.querySelectorAll(".list-item");

			gsap.from(listItems, {
				opacity: 0,
				x: -30,
				duration: 0.6,
				stagger: 0.08,
				ease: "power2.out",
				scrollTrigger: {
					trigger: listRef.current,
					start: "top 70%",
					once: true,
				},
			});
		}, listRef);

		return () => ctx.revert();
	}, [items.length]);

	return (
		<div ref={listRef} className={className}>
			{items.map((item, i) => (
				<div key={i} className="list-item">
					{renderItem(item, i)}
				</div>
			))}
		</div>
	);
}
