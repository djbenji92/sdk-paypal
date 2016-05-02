var app = require('express')(),
    server = require('http').createServer(app),
    express = require('express')

app.use('/script', express.static(__dirname + '/script'));
app.use('/views', express.static(__dirname + '/views'));

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});


server.listen(8080);
