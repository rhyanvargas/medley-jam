import { displayLabel } from "@/lib/music/chords";
import type { ChordId } from "@/lib/music/types";
import { CHORD_DIAGRAMS, type FretboardDiagram } from "@/lib/music/diagrams";

const STRING_NAMES = ["E", "A", "D", "G", "B", "e"] as const;

type FretboardDiagramProps = {
	chord: ChordId;
	className?: string;
};

function fretSpan(diagram: FretboardDiagram): { min: number; max: number } {
	const fretted = diagram.strings.filter((v): v is number => typeof v === "number" && v > 0);
	if (fretted.length === 0) return { min: 1, max: 4 };
	const min = Math.min(...fretted);
	const max = Math.max(Math.max(...fretted), min + 3);
	return { min: Math.max(1, min), max };
}

export function FretboardDiagramView({ chord, className }: FretboardDiagramProps) {
	const diagram = CHORD_DIAGRAMS[chord];
	const { min, max } = fretSpan(diagram);
	const frets = Array.from({ length: max - min + 1 }, (_, i) => min + i);

	return (
		<figure
			className={["w-40 text-[var(--ink)]", className].filter(Boolean).join(" ")}
			aria-label={`${displayLabel(chord)} open-position diagram`}
		>
			<figcaption className="mb-2 text-center text-sm font-semibold">
				{displayLabel(chord)}
			</figcaption>
			<svg viewBox="0 0 120 140" className="h-auto w-full" role="img">
				{/* nut or fret marker */}
				{min === 1 ? (
					<line x1="20" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="4" />
				) : (
					<text x="8" y="28" fontSize="10" fill="currentColor">
						{min}fr
					</text>
				)}
				{STRING_NAMES.map((_, stringIndex) => {
					const x = 20 + stringIndex * 16;
					return (
						<line
							key={`string-${stringIndex}`}
							x1={x}
							y1="20"
							x2={x}
							y2={20 + frets.length * 22}
							stroke="currentColor"
							strokeWidth="1.5"
						/>
					);
				})}
				{frets.map((fret, fretIndex) => {
					const y = 20 + (fretIndex + 1) * 22;
					return (
						<line
							key={`fret-${fret}`}
							x1="20"
							y1={y}
							x2="100"
							y2={y}
							stroke="currentColor"
							strokeWidth="1"
						/>
					);
				})}
				{diagram.strings.map((value, stringIndex) => {
					const x = 20 + stringIndex * 16;
					if (value === "x") {
						return (
							<text
								key={`mute-${stringIndex}`}
								x={x}
								y="14"
								textAnchor="middle"
								fontSize="10"
								fill="currentColor"
							>
								×
							</text>
						);
					}
					if (value === 0) {
						return (
							<circle
								key={`open-${stringIndex}`}
								cx={x}
								cy="12"
								r="4"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							/>
						);
					}
					const fretIndex = value - min;
					if (fretIndex < 0 || fretIndex >= frets.length) return null;
					const y = 20 + fretIndex * 22 + 11;
					return <circle key={`dot-${stringIndex}`} cx={x} cy={y} r="6" fill="currentColor" />;
				})}
			</svg>
		</figure>
	);
}
