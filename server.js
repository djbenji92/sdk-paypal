var app = require('express')(),
    server = require('http').createServer(app),
    express = require('express')

app.use('/script', express.static(__dirname + '/script'));
app.use('/views', express.static(__dirname + '/views'));

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
console.log("Server start on port 8080...");
console.log("Go coder les flemmards !");

server.listen(8080);
