const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const host = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
	const chatPath = path.join(__dirname, 'chat.html');
	const readStream = fs.createReadStream(chatPath);

	readStream.pipe(res);
});

const io = socket(server);
let clients = 0;

io.on('connection', (client) => {
	clients++;
	const userName = `Пользователь №${Date.now().toString().substring(8)}`;
	console.log(`${userName} подключился.`);

	client.emit('clients-count', {
		message: `Количество пользователей онлайн: ${clients}`
	});

	client.broadcast.emit('clients-count', {
		message: `Количество пользователей онлайн: ${clients}`
	});

	client.broadcast.emit('server-msg', {
		message: ' вошёл в чат.',
		name: userName
	});

	client.on('client-msg', (data) => {
		const payload = {
			message: `: ${data.message.split('').reverse().join('')}`,
			name: userName
		};
		client.broadcast.emit('server-msg', payload);
		client.emit('server-msg', payload);
	});

	client.on('reconnect', () => {
		console.log(`${userName} переподключился.`);
		client.broadcast.emit('server-msg', {
			message: ' перезашёл в чат.',
			name: userName
		});
	});

	client.on('disconnect', () => {
		console.log(`${userName} отключился.`);
		clients--;
		client.broadcast.emit('server-msg', {
			message: ' вышел из чата.',
			name: userName
		});
	});
});

server.listen(port, host, () => {
	console.log(`Сервер работает на адресе http://${host}:${port}`);
});