var app = require('express')(),
    server = require('http').createServer(app),
    express = require('express');

const paypal = require('./paypal.js');

app.use('/script', express.static(__dirname + '/script'));
app.use('/views', express.static(__dirname + '/views'));

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var transactions = [
	{
		amount: {
			total: '1.00',
			currency: 'EUR'
		}
	}
];

paypal.createPayment('AYjeNPR31RzSk33-YyPDWHiAyV-a5TCxXSOqzDD4Dh6_W0Pxx3RW_l5B2H66n_j5QKxrT88g1_QI8Dct',
					 'EFnkSRUJp0_8jdTFqmAKrQL_yFhSu5Q09joh6XIA-RZNcxa_gtN_-GB4Xh6hEA7ijhwsOC-pTz32Azxg',
					 'http://example.com/your_redirect_url.html',
					 'http://example.com/your_cancel_url.html',
					 transactions)
	.then(function(response) {
		console.log(response);
	})
	.catch(function(error) {
		console.log(error);
	});
//server.listen(8080);
