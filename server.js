const http = require('http'),
	fs = require('fs'),
	url = require('url');

http.createServer((request, response) => {

    let filePath = '';
    const baseURL = 'http://' + request.headers.host + '/';
    const reqURL = new URL(request.url,baseURL);

	fs.appendFile(
		'log.txt',
		'URL: ' + baseURL + '\nTimestamp: ' + new Date() + '\n\n',
		(err) => err ? console.log(err) : console.log('Added to log.')
	);

	if (reqURL.pathname.includes('documentation'))
		filePath = __dirname + '/documentation.html';
    else
		filePath = 'index.html';

	fs.readFile(filePath, (err, data) => {
		if (err) throw err;
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});
}).listen(8080);

console.log('Server is running on Port 8080.');
