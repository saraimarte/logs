
let noirIntroAudio = null;
let noirIntroFinished = true;
let noirIntroFallback = null;

const NOIR_INTRO_SRC =
    "/sounds/intros/freesound_community-cartoon-hello-41328.mp3";
const NOIR_INTRO_VOLUME = 0.31;

function removeNoirIntroFallback() {
    if (!noirIntroFallback) return;
    window.removeEventListener("pointerdown", noirIntroFallback);
    window.removeEventListener("keydown", noirIntroFallback);
    noirIntroFallback = null;
}

function finishNoirIntro() {
    noirIntroFinished = true;
    removeNoirIntroFallback();

    if (noirIntroAudio) {
        try {
            noirIntroAudio.pause();
            noirIntroAudio.currentTime = 0;
        } catch (_) {}
    }

    noirIntroAudio = null;
}

function playNoirIntro() {
    finishNoirIntro();
    noirIntroFinished = false;

    const audio = new Audio(NOIR_INTRO_SRC);
    noirIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = NOIR_INTRO_VOLUME;

    audio.addEventListener("ended", finishNoirIntro, { once: true });
    audio.addEventListener("error", finishNoirIntro, { once: true });
    audio.addEventListener("playing", removeNoirIntroFallback);

    const attempt = () => {
        if (noirIntroAudio !== audio) return;

        const promise = audio.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (noirIntroFallback || noirIntroAudio !== audio) return;

                noirIntroFallback = () => {
                    if (noirIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", noirIntroFallback);
                window.addEventListener("keydown", noirIntroFallback);
            });
        }
    };

    attempt();
}

export function mount() {
    playNoirIntro();
}

export function unmount() {
    finishNoirIntro();
}
