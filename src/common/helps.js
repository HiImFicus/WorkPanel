export function arrayToString(array) {
    if (Array.isArray(array)) {
        return array.map(item => item.trim()).join(", ");
    }
    return array;
}

export function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
