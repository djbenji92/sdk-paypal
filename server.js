var app = require('express')(),
    server = require('http').createServer(app),
    express = require('express');

const paypal = require('./paypal.js');
const token = undefined;

app.use('/script', express.static(__dirname + '/script'));
app.use('/views', express.static(__dirname + '/views'));

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/pay', function (req, res) {
	paypal.getToken('AYjeNPR31RzSk33-YyPDWHiAyV-a5TCxXSOqzDD4Dh6_W0Pxx3RW_l5B2H66n_j5QKxrT88g1_QI8Dct',
					'EFnkSRUJp0_8jdTFqmAKrQL_yFhSu5Q09joh6XIA-RZNcxa_gtN_-GB4Xh6hEA7ijhwsOC-pTz32Azxg')
		.then(createPayment);

	function createPayment(token) {
		token = token;

		var transactions = [
			{
				amount: {
					total: '1.00',
					currency: 'EUR'
				}
			}
		];

		paypal.createPayment(token,
						 'http://localhost:8080/success',
						 'http://localhost:8080/canceled',
						 transactions)
			.then(redirectToPaypal)
			.catch(function(error) {
				console.log(error);
			});

		function redirectToPaypal(redirectUrl) {
			res.writeHead(302, {
			  'Location': redirectUrl
			});
			res.end();
		}
	}
});

app.get('/success', function (req, res) {
	paypal.executePayment(req.query.paymentId, req.query.PayerID, token)
		.then(function(response) {
			console.log(response);		
		})
		.catch(function(error) {
			console.log(error);
		});
	res.sendFile(__dirname + '/views/success.html');
});

app.get('/canceled', function (req, res) {
  res.sendFile(__dirname + '/views/cancel.html');
});

server.listen(8080);
