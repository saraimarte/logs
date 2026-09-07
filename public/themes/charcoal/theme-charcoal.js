
let charcoalIntroAudio = null;
let charcoalIntroFinished = true;
let charcoalIntroFallback = null;

const CHARCOAL_INTRO_SRC =
    "/sounds/intros/freesound_community-hello-what-you-doing-42455.mp3";
const CHARCOAL_INTRO_VOLUME = 0.31;

function removeCharcoalIntroFallback() {
    if (!charcoalIntroFallback) return;
    window.removeEventListener("pointerdown", charcoalIntroFallback);
    window.removeEventListener("keydown", charcoalIntroFallback);
    charcoalIntroFallback = null;
}

function finishCharcoalIntro() {
    charcoalIntroFinished = true;
    removeCharcoalIntroFallback();

    if (charcoalIntroAudio) {
        try {
            charcoalIntroAudio.pause();
            charcoalIntroAudio.currentTime = 0;
        } catch (_) {}
    }

    charcoalIntroAudio = null;
}

function playCharcoalIntro() {
    finishCharcoalIntro();
    charcoalIntroFinished = false;

    const audio = new Audio(CHARCOAL_INTRO_SRC);
    charcoalIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = CHARCOAL_INTRO_VOLUME;

    audio.addEventListener("ended", finishCharcoalIntro, { once: true });
    audio.addEventListener("error", finishCharcoalIntro, { once: true });
    audio.addEventListener("playing", removeCharcoalIntroFallback);

    const attempt = () => {
        if (charcoalIntroAudio !== audio) return;

        const promise = audio.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (charcoalIntroFallback || charcoalIntroAudio !== audio) return;

                charcoalIntroFallback = () => {
                    if (charcoalIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", charcoalIntroFallback);
                window.addEventListener("keydown", charcoalIntroFallback);
            });
        }
    };

    attempt();
}

export function mount() {
    playCharcoalIntro();
}

export function unmount() {
    finishCharcoalIntro();
}
