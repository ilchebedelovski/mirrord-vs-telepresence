var http = require('http');

var handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Telepresence test demo!\n');
  response.end();
};

http.createServer(handleRequest).listen(9001);
console.log('Use curl <hostname>:9001 to access this server...');
