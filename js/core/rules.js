export function checkPlacementValidity(start, end, type, teleportMap, totalCols) {
    if (!start || !end || start === end) {
        return { valid: false, msg: "Start and end points cannot be identical." };
    }
    if (start === 100 || end === 100 || start === 1 || end === 1) {
        return { valid: false, msg: "Cannot attach elements to start (1) or victory (100) tiles." };
    }
    if (type === 'snake' && start <= end) {
        return { valid: false, msg: "Snake head must be placed higher than its tail." };
    }
    if (type === 'ladder' && start >= end) {
        return { valid: false, msg: "Ladder bottom must be placed lower than its top." };
    }
    if (teleportMap[start] || teleportMap[end]) {
        return { valid: false, msg: "Tile space already contains an entry trigger." };
    }
    if (Object.values(teleportMap).includes(start)) {
        return { valid: false, msg: "Trigger point conflicts with an existing landing." };
    }

    const startCol = (start - 1) % totalCols;
    const endCol = (end - 1) % totalCols;
    for (let key in teleportMap) {
        const existingStart = parseInt(key);
        const existingEnd = teleportMap[key];
        const existingStartCol = (existingStart - 1) % totalCols;
        const existingEndCol = (existingEnd - 1) % totalCols;

        if (startCol === existingStartCol && endCol === existingEndCol) {
            return { valid: false, msg: "Placement blocked: Line path occupies a shared channel column alignment." };
        }
    }

    return { valid: true, msg: "Valid Configuration" };
}
