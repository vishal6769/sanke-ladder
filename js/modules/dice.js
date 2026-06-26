export function animateDiceRoll(diceElement) {
    return new Promise((resolve) => {
        const value = Math.floor(Math.random() * 6) + 1;
        const rotations = {
            1: { x: 0, y: 0 }, 6: { x: 0, y: 180 }, 2: { x: 0, y: -90 },
            5: { x: 0, y: 90 }, 3: { x: -90, y: 0 }, 4: { x: 90, y: 0 }
        };

        const spinX = (Math.floor(Math.random() * 2) + 3) * 360;
        const spinY = (Math.floor(Math.random() * 2) + 3) * 360;

        diceElement.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        diceElement.style.transform = `rotateX(${rotations[value].x + spinX}deg) rotateY(${rotations[value].y + spinY}deg)`;

        setTimeout(() => {
            diceElement.style.transition = 'none';
            diceElement.style.transform = `rotateX(${rotations[value].x}deg) rotateY(${rotations[value].y}deg)`;
            resolve(value);
        }, 800);
    });
}
