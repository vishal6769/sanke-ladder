export function computeAiMoveDelay(callback) {
    setTimeout(() => {
        callback();
    }, 1200);
}
