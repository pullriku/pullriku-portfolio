import { useEffect, useMemo, useRef } from "react";
import { LIGHT_SAND } from "../lib/const";

const SVG_W = 1440;
const SVG_H = 120;
const WAVE_PROPS = {
	amplitude: 36,
	cycles: 2,
	foam: true,
	speed: 0.25,
} as const;

type WaveDividerProps = {
	width?: number;
	height?: number;
	amplitude?: number; // px
	cycles?: number; // waves across width
	sandColor?: string;
	foam?: boolean;
	speed?: number; // radians per second
};

export function WaveDivider({
	width = SVG_W,
	height = SVG_H,
	amplitude = WAVE_PROPS.amplitude,
	cycles = WAVE_PROPS.cycles,
	sandColor = LIGHT_SAND,
	foam = WAVE_PROPS.foam,
	speed = WAVE_PROPS.speed,
}: WaveDividerProps) {
	const baseline = 40;
	const amp = clamp(amplitude, 0, height / 2);

	// Refs to mutate path "d" without re-render
	const sandPathRef = useRef<SVGPathElement | null>(null);
	const foamPathRef = useRef<SVGPathElement | null>(null);

	// Initial static path (phase 0) for SSR/first paint
	const initialD = useMemo(
		() => buildWavePath(width, baseline, amp, cycles, 0),
		[width, amp, cycles],
	);

	useEffect(() => {
		// Respect prefers-reduced-motion
		const prefersReduced =
			typeof window !== "undefined" &&
			window.matchMedia &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReduced || speed === 0) return; // keep initial path

		let raf = 0;
		const start = performance.now();

		const tick = (now: number) => {
			const t = (now - start) / 1000; // seconds
			const phase = t * speed; // radians progression
			const d = buildWavePath(width, baseline, amp, cycles, phase);
			const dFoam = buildWavePath(
				width,
				baseline,
				Math.max(0, amp - 6),
				cycles,
				phase,
			);
			sandPathRef.current?.setAttribute(
				"d",
				`${d} L ${width} ${height} L 0 ${height} Z`,
			);
			foamPathRef.current?.setAttribute("d", dFoam);
			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [width, height, amp, cycles, speed]);

	return (
		<div className="relative mt-32">
			<svg
				className="absolute -bottom-px left-0 h-20 w-full md:h-24"
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path
					ref={sandPathRef}
					d={`${initialD} L ${width} ${height} L 0 ${height} Z`}
					fill={sandColor}
				/>
				{foam && (
					<path
						ref={foamPathRef}
						d={buildWavePath(width, baseline, Math.max(0, amp - 6), cycles, 0)}
						fill="none"
						stroke="white"
						strokeWidth={6}
						strokeLinecap="round"
						opacity={0.85}
					/>
				)}
			</svg>
		</div>
	);
}

function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}

/**
 *  Build a sine-like path (sampled polyline -> smooth enough for UI)
 */
function buildWavePath(
	W: number,
	baseline: number,
	amp: number,
	cycles: number,
	phase: number,
) {
	const pts: string[] = [];
	const samples = 120; // higher = smoother
	for (let i = 0; i <= samples; i++) {
		const t = i / samples; // 0..1 across width
		const x = t * W;
		const y = baseline + Math.sin(t * cycles * Math.PI * 2 + phase) * amp;
		pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
	}
	return pts.join(" ");
}
