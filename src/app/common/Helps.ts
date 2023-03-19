export function arrayToString(array: Array<any>) {
	if (Array.isArray(array)) {
		return array.map((item) => item.trim()).join(", ");
	}
	return array;
}

export function isNumeric(value: string) {
	return /^-?\d+$/.test(value);
}

export const isObjectEmpty = (object: Object) => {
	return Object.keys(object).length === 0 && object.constructor === Object;
};
