export const drumTracks = [
  { id: "kick", label: "踢鼓" },
  { id: "snare", label: "小鼓" },
  { id: "hat", label: "Hi-hat" }
] as const;

export type DrumTrack = (typeof drumTracks)[number]["id"];
export type DrumPattern = Record<DrumTrack, number[]>;

export const drumSteps: DrumPattern = {
  kick: [0, 6, 10, 16, 22, 26, 30],
  snare: [4, 12, 20, 28],
  hat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 23, 24, 26, 28, 29, 30]
};
export const beatEditorSteps = 16;
export const beatEditorBpm = { min: 60, max: 130 };

const beatStorageKey = "hiphop-exploration.my-beat.v1";
export const defaultPracticeVolume = 80;

export interface SavedPracticeBeat {
  bpm: number;
  volume: number;
  pattern: DrumPattern;
}

export function makePracticeDrumPattern(usePreset: boolean): DrumPattern {
  const pattern: DrumPattern = { kick: [], snare: [], hat: [] };
  if (usePreset) {
    for (const { id } of drumTracks) {
      pattern[id] = drumSteps[id].filter(step => step < beatEditorSteps);
    }
  }
  return pattern;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

export function readSavedPracticeBeat(): SavedPracticeBeat | null {
  try {
    const raw = localStorage.getItem(beatStorageKey);
    if (!raw) return null;
    const stored: unknown = JSON.parse(raw);
    if (!isRecord(stored) || !isIntegerInRange(stored.bpm, beatEditorBpm.min, beatEditorBpm.max)
      || !isRecord(stored.pattern)) return null;

    const pattern = makePracticeDrumPattern(false);
    for (const { id } of drumTracks) {
      const steps: unknown = stored.pattern[id];
      if (!Array.isArray(steps) || !steps.every((step: unknown): step is number =>
        isIntegerInRange(step, 0, beatEditorSteps - 1))) {
        return null;
      }
      pattern[id] = [...new Set(steps)];
    }

    return {
      bpm: stored.bpm,
      volume: isIntegerInRange(stored.volume, 0, 100) ? stored.volume : defaultPracticeVolume,
      pattern
    };
  } catch {
    return null;
  }
}

export function savePracticeBeat(beat: SavedPracticeBeat): boolean {
  try {
    localStorage.setItem(beatStorageKey, JSON.stringify(beat));
    return true;
  } catch {
    return false;
  }
}
