const fs = require('fs/promises');
const {
	lstatSync
} = require('fs');
const yargs = require('yargs');
const path = require('path');
const inquirer = require('inquirer');

const options = yargs
	.usage('Использование: -p <путь> -s <строка или паттерн>')
	.option('p', {
		alias: 'path',
		default: process.cwd(),
		describe: 'Путь до файла',
		type: 'string',
	})
	.option('s', {
		alias: 'search',
		default: '',
		describe: 'Найти строку или паттерн',
		type: 'string',
	})
	.argv;

let currentDir = options.p ? options.p : process.cwd();
const regExp = new RegExp(options.s, 'gi');
const isFile = fileName => lstatSync(path.join(currentDir, fileName)).isFile();

const run = async () => {
	const list = await fs.readdir(currentDir);

	const item = await inquirer
		.prompt([{
			name: "fileName",
			type: "list",
			message: "Выберите файл или папку: ",
			choices: list,
		}, ])
		.then(({
			fileName
		}) => {
			return {
				name: fileName,
				path: path.join(currentDir, fileName)
			}
		});

	if (isFile(item.name)) {
		const data = await fs.readFile(item.path, 'utf-8');

		if (!options.s) {
			console.log(`Содержимое файла: 
${data}`);
		} else {
			const arr = data.match(regExp);
			console.log(`Количество найденных совпадений: ${arr.length}`)
		}

	} else {
		currentDir = item.path;
		return await run();
	}
}

run();