export function arrayToString(array: Array<any>) {
	if (Array.isArray(array)) {
		return array.map((item) => item.trim()).join(",");
	}
	return array;
}

export function isNumeric(value: string) {
	return /^-?\d+$/.test(value);
}

export const isObjectEmpty = (object: Object) => {
	return Object.keys(object).length === 0 && object.constructor === Object;
};

export function getCurrentDate(separator = "-") {
	let newDate = new Date();
	let date = newDate.getDate();
	let month = newDate.getMonth() + 1;
	let year = newDate.getFullYear();
	let time =
		newDate.getHours() +
		separator +
		newDate.getMinutes() +
		separator +
		newDate.getSeconds();

	return `${
		month < 10 ? `0${month}` : `${month}`
	}${separator}${date}${separator}${year}${separator}${time}`;
}

export function getDateString(date: Date) {
	return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function stringArrayTrimValueToString(orignal: string) {
	return orignal
		.split(",")
		.map((value: string) => value.trim())
		.join(",");
}
