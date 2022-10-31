// import React, { useState, useEffect, useRef } from "react";

// const FORWARD = "Forward";
// const BACKWARD = "Backward";

// export const useTypingText = (words, keySpeed = 1000, maxPauseAmound = 10) => {
// 	const [wordIndex, setWordIndex] = useState(0);
// 	const [currectWord, setCurrentWord] = useState(words[wordIndex].split(""));

// 	const direction = useRef(BACKWARD);
// 	const typingInterval = useRef();
// 	const letterIndex = useRef();

// 	useEffect(() => {
// 		typingInterval.current = setInterval(() => {
// 			console.log("backspace");
// 		}, keySpeed);

// 		return () => {
// 			clearInterval(typingInterval.current);
// 		};
// 	}, [currentWord, wordIndex, keySpeed, words, maxPauseAmount]);

// 	return {
// 		word: (
// 			<span className={`word ${currectWord.length ? "full" : "empty"}`}>
// 				<span>{currectWord.length ? currectWord.join("") : "0"}</span>
// 			</span>
// 		),
// 	};
// };
