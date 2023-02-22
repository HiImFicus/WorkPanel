// Reverse Object Keys and Values 
// Object.fromEntries(flipped);
// or
//Object.entries({ x: 1, y: 2 }).map(([key, value]) => [value, key]);
export const flip = (data) => Object.fromEntries(
    Object
        .entries(data)
        .map(([key, value]) => [value, key])
);
