/**
 * Signal alarm. Plays one of five clips when the board's *first* card clears
 * 1% profit, and exposes a volume/mute control for it.
 *
 * The clip encodes how big the opportunity is: `Math.floor(percentage)` picks
 * the track, so 1.x% plays one alarm, 2.x% two, … and 5% or more always plays
 * the five-times alarm. Anything below 1% is silent.
 *
 * `OpportunitySignal.profitPercentage` is a *ratio*, not a percentage
 * (`(sell - buy) / buy`, so 0.0125 is 1.25%), which is why everything here
 * multiplies by 100 before comparing against a percent threshold.
 *
 * It fires on every incoming board update, like the old `signal-card-ui`: the
 * stream pushes roughly every 500ms, so a hot signal keeps the alarm sounding
 * for as long as it is on top. A clip that is still playing is left alone
 * (restarting it each tick would stutter); a higher track interrupts it.
 *
 * Browsers block unmuted playback until the user has interacted with the page,
 * so `play()` is allowed to reject and the next trigger simply tries again.
 */

import { BOARD_APPLIED_EVENT, type BoardAppliedDetail } from "./board-state";

const VOLUME_KEY = "arbitrator:signal-volume";
const MUTED_KEY = "arbitrator:signal-muted";
const DEFAULT_VOLUME = 50;
const MIN_PERCENTAGE = 1;
const MAX_TRACK = 5;
const PERCENT = 100;

function readStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        // Private mode / disabled storage: fall back to the defaults.
        return null;
    }
}

function writeStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Ignore: the control still works for this page load.
    }
}

function clampVolume(value: number): number {
    if (!Number.isFinite(value)) return DEFAULT_VOLUME;
    return Math.min(100, Math.max(0, Math.round(value)));
}

let volume = clampVolume(Number(readStorage(VOLUME_KEY) ?? DEFAULT_VOLUME));
let muted = readStorage(MUTED_KEY) === "true";
let playing: HTMLAudioElement | null = null;

function alarms(): HTMLAudioElement[] {
    return Array.from(
        document.querySelectorAll<HTMLAudioElement>("audio[data-signal-alarm]"),
    );
}

/** `preload="auto"` is only a hint; a real `load()` makes the first alarm instant. */
const primed = new WeakSet<HTMLAudioElement>();

function primeAlarms() {
    for (const alarm of alarms()) {
        if (primed.has(alarm)) continue;
        primed.add(alarm);
        alarm.load();
    }
}

function applyVolume() {
    for (const alarm of alarms()) {
        alarm.volume = volume / 100;
        alarm.muted = muted || volume === 0;
    }
}

function renderControls() {
    const slider = document.querySelector<HTMLInputElement>(
        "#signal-audio-volume",
    );
    const value = document.querySelector<HTMLOutputElement>(
        "#signal-audio-volume-value",
    );
    const toggle =
        document.querySelector<HTMLButtonElement>("#signal-audio-mute");

    if (slider) slider.value = String(volume);
    if (value) value.textContent = `${volume}%`;

    if (toggle) {
        const silent = muted || volume === 0;
        toggle.setAttribute("aria-pressed", String(silent));
        toggle.setAttribute(
            "aria-label",
            silent ? "Unmute signal alarm" : "Mute signal alarm",
        );
        toggle.title = silent ? "Unmute signal alarm" : "Mute signal alarm";
        toggle
            .querySelector(".signal-audio-sound")
            ?.classList.toggle("hidden", silent);
        toggle
            .querySelector(".signal-audio-muted")
            ?.classList.toggle("hidden", !silent);
    }
}

function play(track: number) {
    if (muted || volume === 0) return;

    const alarm = document.querySelector<HTMLAudioElement>(
        `audio[data-signal-alarm="${track}"]`,
    );
    if (!alarm) return;

    // The board updates every tick; restarting the clip that is already
    // sounding would stutter, so let it finish and re-arm itself next update.
    if (alarm === playing && !alarm.paused) return;

    // Only one alarm at a time, and always from the start of the clip.
    if (playing && playing !== alarm) {
        playing.pause();
        playing.currentTime = 0;
    }
    alarm.currentTime = 0;
    void alarm.play().catch(() => {
        // Autoplay blocked: the first click/keypress on the page unlocks it.
    });
    playing = alarm;
}

/**
 * One board update arrived: alarm when the card now first clears 1%. The board
 * carries the raw ratio; the thresholds below are percentages.
 */
function onBoardApplied(event: Event) {
    const top = (event as CustomEvent<BoardAppliedDetail | undefined>).detail
        ?.top;
    const percentage = (top?.profitPercentage ?? 0) * PERCENT;
    if (!top || percentage < MIN_PERCENTAGE) return;

    play(Math.min(MAX_TRACK, Math.floor(percentage)));
}

/** Detach the current alarm when the board (and its audio) leaves the DOM. */
function stopWhenBoardGone() {
    if (document.querySelector("audio[data-signal-alarm]")) return;
    if (playing) {
        playing.pause();
        playing.currentTime = 0;
        playing = null;
    }
}

document.addEventListener(BOARD_APPLIED_EVENT, onBoardApplied);

// Delegated so the controls keep working across htmx page swaps.
document.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.id !== "signal-audio-volume") return;

    volume = clampVolume(Number(target.value));
    if (volume > 0) muted = false;
    writeStorage(VOLUME_KEY, String(volume));
    writeStorage(MUTED_KEY, String(muted));
    applyVolume();
    renderControls();
});

document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest("#signal-audio-mute")) return;

    if (muted || volume === 0) {
        muted = false;
        if (volume === 0) volume = DEFAULT_VOLUME;
    } else {
        muted = true;
    }
    writeStorage(VOLUME_KEY, String(volume));
    writeStorage(MUTED_KEY, String(muted));
    applyVolume();
    renderControls();
});

document.addEventListener("htmx:after:swap", () => {
    stopWhenBoardGone();
    primeAlarms();
    applyVolume();
    renderControls();
});

function init() {
    primeAlarms();
    applyVolume();
    renderControls();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
