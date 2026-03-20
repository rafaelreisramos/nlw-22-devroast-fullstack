type OpenGraphData = {
	score: number;
	language: string;
	verdict: string;
	roastQuote: string;
	lineCount: number;
};

export function OpenGraphImageTemplate(data: OpenGraphData) {
	const { score, language, verdict, roastQuote, lineCount } = data;

	const verdictColor = verdict.includes("urgent")
		? "#ef4444"
		: verdict.includes("serious")
			? "#ef4444"
			: verdict.includes("improvement")
				? "#f59e0b"
				: "#10b981";

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#0a0a0a",
				padding: "64px",
				gap: "28px",
				fontFamily: "Geist, system-ui, sans-serif",
			}}
		>
			{/* Logo */}
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				<span style={{ color: "#10b981", fontSize: "24px", fontWeight: 700 }}>
					{">"}
				</span>
				<span style={{ color: "#e5e5e5", fontSize: "20px", fontWeight: 500 }}>
					devroast
				</span>
			</div>

			{/* Score */}
			<div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
				<span
					style={{
						color: "#f59e0b",
						fontSize: "160px",
						fontWeight: 900,
						lineHeight: 1,
					}}
				>
					{Math.round(score)}
				</span>
				<span
					style={{
						color: "#737373",
						fontSize: "56px",
						fontWeight: 400,
						lineHeight: 1,
						marginBottom: "20px",
					}}
				>
					/10
				</span>
			</div>

			{/* Verdict */}
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				<div
					style={{
						width: "12px",
						height: "12px",
						borderRadius: "50%",
						backgroundColor: verdictColor,
					}}
				/>
				<span style={{ color: verdictColor, fontSize: "20px" }}>
					{verdict.replace(/_/g, " ")}
				</span>
			</div>

			{/* Language info */}
			<span
				style={{
					color: "#737373",
					fontSize: "16px",
					fontFamily: "Geist Mono, monospace",
				}}
			>
				lang: {language} · {lineCount} lines
			</span>

			{/* Quote */}
			{roastQuote && (
				<div
					style={{
						maxWidth: "100%",
						textAlign: "center",
					}}
				>
					<span
						style={{
							color: "#e5e5e5",
							fontSize: "22px",
							lineHeight: 1.5,
						}}
					>
						"{roastQuote}"
					</span>
				</div>
			)}
		</div>
	);
}
