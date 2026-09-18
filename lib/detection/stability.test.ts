import { describe, expect, it } from "vitest";
import { createChordLock } from "./stability";

describe("createChordLock", () => {
	it("holds the last locked chord when frames are unclear (null)", () => {
		const lock = createChordLock({ consecutiveRequired: 3 });

		expect(lock.observe("G")).toBeNull();
		expect(lock.observe("G")).toBeNull();
		expect(lock.observe("G")).toBe("G");

		expect(lock.observe(null)).toBe("G");
		expect(lock.observe(null)).toBe("G");
	});

	it("does not switch until a new chord wins consecutive frames", () => {
		const lock = createChordLock({ consecutiveRequired: 3 });

		lock.observe("G");
		lock.observe("G");
		expect(lock.observe("G")).toBe("G");

		expect(lock.observe("D")).toBe("G");
		expect(lock.observe("D")).toBe("G");
		expect(lock.observe("D")).toBe("D");
	});

	it("resets the challenger streak when a different candidate appears", () => {
		const lock = createChordLock({ consecutiveRequired: 3 });

		lock.observe("G");
		lock.observe("G");
		expect(lock.observe("G")).toBe("G");

		expect(lock.observe("D")).toBe("G");
		expect(lock.observe("Em")).toBe("G");
		expect(lock.observe("D")).toBe("G");
		expect(lock.observe("D")).toBe("G");
		expect(lock.observe("D")).toBe("D");
	});

	it("clears state on reset", () => {
		const lock = createChordLock({ consecutiveRequired: 2 });
		lock.observe("Am");
		expect(lock.observe("Am")).toBe("Am");

		lock.reset();
		expect(lock.observe(null)).toBeNull();
		expect(lock.observe("C")).toBeNull();
		expect(lock.observe("C")).toBe("C");
	});
});
