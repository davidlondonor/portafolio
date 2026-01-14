import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoginForm({ onSubmit, t, language, toggleLanguage }) {
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [attemptsRemaining, setAttemptsRemaining] = useState(null);
	const [retryAfter, setRetryAfter] = useState(null);
	const loginFormRef = useRef(null);

	useEffect(() => {
		if (loginFormRef.current) {
			gsap.fromTo(
				loginFormRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
			);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const res = await fetch("/api/portfolio-auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});

			if (res.ok) {
				window.location.reload();
			} else {
				const data = await res.json();
				setError(data?.error || t.portfolio.errorPassword);
				setPassword("");

				if (data?.attemptsRemaining !== undefined) {
					setAttemptsRemaining(data.attemptsRemaining);
				}

				if (data?.retryAfter) {
					setRetryAfter(data.retryAfter);
				}

				setIsLoading(false);
			}
		} catch (err) {
			setError(t.portfolio.errorPassword);
			setPassword("");
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
			<div ref={loginFormRef} className="w-full max-w-md px-6">
				<div className="text-center mb-12">
					<h1 className="display-md mb-4">{t.portfolio.title}</h1>
					<p className="body-lg text-[var(--color-text-light)]">
						{t.portfolio.subtitle}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="password"
							className="block body-sm mb-2"
						>
							{t.portfolio.password}
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 pr-12 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
								placeholder={t.portfolio.passwordPlaceholder}
								autoFocus
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
								title={
									showPassword
										? "Hide password"
										: "Show password"
								}
							>
								{showPassword ? (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="w-5 h-5"
									>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
								) : (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="w-5 h-5"
									>
										<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
										<line x1="1" y1="1" x2="23" y2="23" />
									</svg>
								)}
							</button>
						</div>
						{error && (
							<div className="mt-2 space-y-1">
								<p className="text-sm text-red-500">{error}</p>
								{attemptsRemaining !== null && attemptsRemaining > 0 && (
									<p className="text-xs text-[var(--color-text-light)]">
										{attemptsRemaining} {attemptsRemaining === 1 ? 'intento restante' : 'intentos restantes'}
									</p>
								)}
								{retryAfter && (
									<p className="text-xs text-amber-500">
										Espera {Math.ceil(retryAfter / 1000 / 60)} minutos antes de intentar nuevamente
									</p>
								)}
							</div>
						)}
					</div>

					<button
						type="submit"
						disabled={isLoading || retryAfter}
						className="w-full btn-minimal justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:border-[var(--color-accent)] hover:scale-105"
					>
						{isLoading ? (
							<>
								<span>Verificando...</span>
								<svg
									className="animate-spin h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
							</>
						) : (
							<>
								<span>{t.portfolio.access}</span>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M7 17L17 7M17 7H7M17 7V17" />
								</svg>
							</>
						)}
					</button>
				</form>

				<div className="mt-8 text-center">
					<a href="/" className="nav-link">
						{t.portfolio.backHome}
					</a>
				</div>

				<div className="mt-4 text-center">
					<button
						onClick={toggleLanguage}
						className="nav-link text-sm uppercase"
						title="Change language"
					>
						{language === "es" ? "EN" : "ES"}
					</button>
				</div>
			</div>
		</div>
	);
}
