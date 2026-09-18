"use client";

type FindSongsButtonProps = {
	visible: boolean;
	disabled?: boolean;
	onClick: () => void;
};

export function FindSongsButton({ visible, disabled, onClick }: FindSongsButtonProps) {
	if (!visible) return null;

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--paper)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Find songs
		</button>
	);
}
