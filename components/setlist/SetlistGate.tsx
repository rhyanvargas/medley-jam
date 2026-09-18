"use client";

type SetlistGateProps = {
	canCreate: boolean;
	locked: boolean;
	onCreate: () => void;
	onStartNew: () => void;
};

export function SetlistGate({
	canCreate,
	locked,
	onCreate,
	onStartNew,
}: SetlistGateProps) {
	if (locked) {
		return (
			<div
				className="space-y-3 rounded-2xl border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-6"
				role="status"
			>
				<p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
					Setlist locked
				</p>
				<p className="text-sm text-[var(--ink-muted)]">
					Progression is frozen for this POC. Start a new setlist to edit again.
				</p>
				<button
					type="button"
					onClick={onStartNew}
					className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--paper)]"
				>
					Start new setlist
				</button>
			</div>
		);
	}

	if (!canCreate) return null;

	return (
		<button
			type="button"
			onClick={onCreate}
			className="rounded-full border border-[var(--ink)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-[var(--paper)]"
		>
			Create Setlist
		</button>
	);
}
