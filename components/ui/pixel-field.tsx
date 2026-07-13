"use client"

import { useEffect, useRef } from "react"

// Design-system token: --color-accent (red-700)
const ACCENT_COLOR = "#b91c1c"
const MAX_CELLS = 4000
const CURSOR_RADIUS = 150 // px
const DECAY_TIME = 1.0 // seconds for excitation to fade
const BASE_ALPHA_MIN = 0.04
const BASE_ALPHA_MAX = 0.18

function smoothstep(edge0: number, edge1: number, x: number): number {
	const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
	return t * t * (3 - 2 * t)
}

function hexToRgb(hex: string) {
	return {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16),
	}
}

export default function PixelField() {
	const containerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const container = containerRef.current
		const canvas = canvasRef.current
		if (!container || !canvas) return
		const containerEl = container
		const canvasEl = canvas
		const ctx = canvasEl.getContext("2d")
		if (!ctx) return

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches

		const accent = hexToRgb(ACCENT_COLOR)

		let dpr = Math.min(window.devicePixelRatio || 1, 2)
		let cellSize = 16
		let cols = 0
		let rows = 0
		let excitation: Float32Array | null = null

		let cursorX = -Infinity
		let cursorY = -Infinity

		let rafId = 0
		let lastTime = 0
		let isVisible = true
		let resizeTimeout: ReturnType<typeof setTimeout> | null = null

		function updateGrid() {
			const rect = containerEl.getBoundingClientRect()
			const width = Math.max(1, rect.width)
			const height = Math.max(1, rect.height)

			canvasEl.width = Math.floor(width * dpr)
			canvasEl.height = Math.floor(height * dpr)
			canvasEl.style.width = `${width}px`
			canvasEl.style.height = `${height}px`

			// Larger cells on mobile, but keep a crisp pixel look.
			let targetCell = width < 768 ? 22 : 16
			do {
				cols = Math.ceil(width / targetCell)
				rows = Math.ceil(height / targetCell)
				if (cols * rows <= MAX_CELLS) break
				targetCell += 2
			} while (true)

			cellSize = targetCell
			excitation = new Float32Array(cols * rows)
		}

		function baseBrightness(x: number, y: number, t: number): number {
			const nx = x / Math.max(cols, 1)
			const ny = y / Math.max(rows, 1)
			const v1 = Math.sin(nx * Math.PI * 4 + t * 0.8)
			const v2 = Math.sin(ny * Math.PI * 3 - t * 0.6)
			const v3 = Math.sin((nx + ny) * Math.PI * 2 + t * 0.4)
			const combined = (v1 + v2 + v3) / 3
			const normalized = (combined + 1) / 2
			return BASE_ALPHA_MIN + normalized * (BASE_ALPHA_MAX - BASE_ALPHA_MIN)
		}

		function draw(time: number, dt: number) {
			if (!ctx || !excitation) return

			const rect = containerEl.getBoundingClientRect()
			if (rect.width === 0 || rect.height === 0) return

			ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

			const t = time * 0.001
			const cssCell = cellSize
			const dprCell = cssCell * dpr

			// Pixel square: 2–3 CSS px, centered in the cell.
			const pixelCss = Math.min(3, Math.max(2, Math.round(cssCell * 0.15)))
			const pixelSize = pixelCss * dpr
			const offset = (dprCell - pixelSize) / 2

			const cx = cursorX * dpr
			const cy = cursorY * dpr
			const radiusPx = CURSOR_RADIUS * dpr

			// Decay existing excitation (inertia / trail).
			if (dt > 0) {
				const decay = Math.exp(-dt / DECAY_TIME)
				for (let i = 0; i < excitation.length; i++) {
					excitation[i] *= decay
				}
			}

			// Add new excitation from cursor / touch.
			if (cursorX > -CURSOR_RADIUS && cursorY > -CURSOR_RADIUS) {
				for (let y = 0; y < rows; y++) {
					const py = y * dprCell + dprCell / 2
					const dy = py - cy
					const dy2 = dy * dy
					for (let x = 0; x < cols; x++) {
						const px = x * dprCell + dprCell / 2
						const dx = px - cx
						const dist = Math.sqrt(dx * dx + dy2)
						if (dist < radiusPx) {
							const idx = y * cols + x
							const falloff = 1 - smoothstep(0, radiusPx, dist)
							excitation[idx] = Math.min(1, excitation[idx] + falloff * 0.18)
						}
					}
				}
			}

			for (let y = 0; y < rows; y++) {
				const py = y * dprCell + offset
				for (let x = 0; x < cols; x++) {
					const idx = y * cols + x
					const base = baseBrightness(x, y, t)
					const intensity = Math.min(1, base + excitation[idx])

					if (intensity < 0.02) continue

					const px = x * dprCell + offset

					let r = 255
					let g = 255
					let b = 255

					if (intensity > 0.75) {
						const f = (intensity - 0.75) / 0.25
						r = 255 + (accent.r - 255) * f
						g = 255 + (accent.g - 255) * f
						b = 255 + (accent.b - 255) * f
					}

					ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(
						g
					)},${Math.round(b)},${intensity.toFixed(3)})`
					ctx.fillRect(px, py, pixelSize, pixelSize)
				}
			}
		}

		function animate(timestamp: number) {
			rafId = requestAnimationFrame(animate)
			const dt = Math.min(0.05, (timestamp - lastTime) / 1000)
			lastTime = timestamp
			draw(timestamp, dt)
		}

		function startLoop() {
			if (rafId || prefersReducedMotion) return
			lastTime = performance.now()
			rafId = requestAnimationFrame(animate)
		}

		function stopLoop() {
			if (rafId) {
				cancelAnimationFrame(rafId)
				rafId = 0
			}
		}

		function handleResize() {
			if (resizeTimeout) clearTimeout(resizeTimeout)
			resizeTimeout = setTimeout(() => {
				dpr = Math.min(window.devicePixelRatio || 1, 2)
				updateGrid()
				if (prefersReducedMotion) {
					draw(0, 0)
				}
			}, 150)
		}

		function updateCursor(clientX: number, clientY: number) {
			const rect = containerEl.getBoundingClientRect()
			cursorX = clientX - rect.left
			cursorY = clientY - rect.top
		}

		function onMouseMove(e: MouseEvent) {
			updateCursor(e.clientX, e.clientY)
		}

		function onTouchMove(e: TouchEvent) {
			if (e.touches.length > 0) {
				updateCursor(e.touches[0].clientX, e.touches[0].clientY)
			}
		}

		function onVisibilityChange() {
			if (document.hidden) {
				stopLoop()
			} else if (isVisible) {
				startLoop()
			}
		}

		updateGrid()

		if (prefersReducedMotion) {
			draw(0, 0)
		} else {
			const observer = new IntersectionObserver(
				([entry]) => {
					isVisible = entry.isIntersecting
					if (isVisible && !document.hidden) {
						startLoop()
					} else {
						stopLoop()
					}
				},
				{ threshold: 0 }
			)
			observer.observe(container)

			window.addEventListener("resize", handleResize, { passive: true })
			window.addEventListener("mousemove", onMouseMove, { passive: true })
			window.addEventListener("touchmove", onTouchMove, { passive: true })
			document.addEventListener("visibilitychange", onVisibilityChange)

			startLoop()

			return () => {
				stopLoop()
				observer.disconnect()
				window.removeEventListener("resize", handleResize)
				window.removeEventListener("mousemove", onMouseMove)
				window.removeEventListener("touchmove", onTouchMove)
				document.removeEventListener("visibilitychange", onVisibilityChange)
				if (resizeTimeout) clearTimeout(resizeTimeout)
			}
		}

		// Reduced-motion cleanup only.
		return () => {
			if (resizeTimeout) clearTimeout(resizeTimeout)
		}
	}, [])

	return (
		<div
			ref={containerRef}
			className="w-full h-full"
			style={{
				maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
				WebkitMaskImage:
					"linear-gradient(to bottom, black 75%, transparent 100%)",
			}}
		>
			<canvas
				ref={canvasRef}
				className="w-full h-full"
				style={{ pointerEvents: "none" }}
				aria-hidden="true"
			/>
		</div>
	)
}
