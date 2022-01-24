const http = require('http');
const fs = require('fs');
const path = require('path');

const host = 'localhost';
const port = 3001;

const isFile = (path) => fs.lstatSync(path).isFile();

const server = http.createServer((req, res) => {
	if (req.url == '/favicon.ico') {
		return res.end();
	}

	const fullPath = path.join(process.cwd(), req.url);

	if (isFile(fullPath)) {
		const readStream = fs.createReadStream(fullPath);
		return readStream.pipe(res);
	}

	let list = '<ul class="catalog">';
	fs.readdirSync(fullPath).forEach((fileName) => {
		const filePath = path.join(req.url, fileName);
		list += `\n\t\t<li class="catalog__item"><a href="${filePath}">${fileName}</a></li>`;
	});
	list += '\n\t</ul>';

	const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
	res.writeHead(200, 'OK', {
		'Content-Type': 'text/html',
	});
	res.end(html.replace('#__CONTENT__#', list));
});

server.listen(port, host, () => {
	console.log(`Сервер работает на адресе http://${host}:${port}`);
});