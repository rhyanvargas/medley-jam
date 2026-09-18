"use client";

import { displayLabel } from "@/lib/music/chords";
import type { ChordId } from "@/lib/music/types";

type ListenPanelProps = {
	listening: boolean;
	liveDetected: ChordId | null;
	micError: string | null;
	locked: boolean;
	onConfirm: () => void;
	onRetryPermission: () => void;
	onSwitchToManual: () => void;
};

export function ListenPanel({
	listening,
	liveDetected,
	micError,
	locked,
	onConfirm,
	onRetryPermission,
	onSwitchToManual,
}: ListenPanelProps) {
	if (micError) {
		return (
			<div
				className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-6"
				role="alert"
			>
				<p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
					Microphone blocked
				</p>
				<p className="text-sm text-[var(--ink-muted)]">{micError}</p>
				<div className="flex flex-wrap gap-3">
					<button
						type="button"
						onClick={onRetryPermission}
						className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)]"
					>
						Try again
					</button>
					<button
						type="button"
						onClick={onSwitchToManual}
						className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--paper)]"
					>
						Switch to Manual
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-6">
			<p className="text-sm text-[var(--ink-muted)]">
				Play a chord into the mic. The estimate locks onto a stable reading and holds through
				brief silence — confirm when it looks right, or keep playing to switch.
			</p>
			<div className="flex items-end justify-between gap-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
						{listening ? "Detected chord" : "Idle"}
					</p>
					<p className="mt-1 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
						{liveDetected ? displayLabel(liveDetected) : "—"}
					</p>
				</div>
				<button
					type="button"
					disabled={locked || !liveDetected}
					onClick={onConfirm}
					className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--paper)] disabled:cursor-not-allowed disabled:opacity-40"
				>
					Confirm chord
				</button>
			</div>
		</div>
	);
}
