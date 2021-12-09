const colors = require("colors/safe");

const from = Number(process.argv[2]);
const to = Number(process.argv[3]);

const isNumber = (from, to) => {
	if (isNaN(from) || isNaN(to)) {
		console.log('Вы ввели не число. Будьте внимательнее.');
		return false;
	}

	return true;
}

const isPrime = num => {
	if (num < 2) {
		return false;
	}

	for (let i = 2; i < num; i++) {
		if (num % i === 0) {
			return false;
		}
	}
	return true;
}

const colorNumbers = (from, to) => {
	let primeNumsArr = [];
	let colorCount = 0;

	if (isNumber(from, to)) {
		for (let i = from; i <= to; i++) {
			if (isPrime(i)) {
				primeNumsArr.push(i);
			}
		}

		if (primeNumsArr.length === 0) {
			console.log(colors.red('Простых чисел в указанном диапазоне нет. Попробуйте другой диапазон'));
		} else primeNumsArr.forEach((el) => {
			if (colorCount === 0) {
				console.log(colors.green(el));
			} else if (colorCount === 1) {
				console.log(colors.yellow(el));
			} else if (colorCount === 2) {
				console.log(colors.red(el));
			}

			colorCount++;

			if (colorCount === 3) {
				colorCount = 0;
			}
		})
	}
}

colorNumbers(from, to);