'use strict';

const https = require('https');
const querystring = require('querystring');

function getToken(username, password) {

	var options = {
		host: 'api.sandbox.paypal.com',
		path: '/v1/oauth2/token',
		method: 'POST',
		auth: username + ':' + password,
		headers: {
			'Accept': 'application/json',
			'Accept-Language': 'en_US'
		}
	};

	var promise = new Promise(
    	function(resolve, reject) {
    		var req = https.request(options, function(res) {
				var response = '';
				res.on('data', function(data) {
					response += data;
				});
				res.on('end', function() {
					response = JSON.parse(response);
					resolve(response.access_token);
				});
			});

			req.on('error', function(e) {
			  reject('problem with request: ' + e.message);
			});

			req.write(querystring.stringify({'grant_type': 'client_credentials'}));
			req.end();
    	}
	);

	return promise;
}

function createPayment(username, password, return_url, cancel_url, transactions) {

	return getToken(username, password)
		.then(function(token) {
			return create(token, return_url, cancel_url, transactions);
		});

	function create(token, return_url, cancel_url, transactions) {
		var options = {
			host: 'api.sandbox.paypal.com',
			path: '/v1/payments/payment',
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		};

		var params = {
			'intent': 'sale',
			'redirect_urls':{
				'return_url': return_url,
				'cancel_url': cancel_url
			},
			'payer': {
				'payment_method': 'paypal'
			},
			'transactions': transactions
		};

		var promise = new Promise(
	    	function(resolve, reject) {
	    		var req = https.request(options, function(res) {
					var response = '';
					res.on('data', function(data) {
						response += data;
					});
					res.on('end', function() {
						response = JSON.parse(response);
						var redirectUrl = getRedirectUrl(response);
						resolve(redirectUrl);
					});
				});

				req.on('error', function(e) {
				  reject('problem with request: ' + e.message);
				});

				req.write(JSON.stringify(params));
				req.end();
	    	}
		);

		return promise;

		function getRedirectUrl(createPaymentResponse) {
			var linksLength = createPaymentResponse.links.length;

			for (var i = 0; i < linksLength; i++) {
				if(createPaymentResponse.links[i].method === 'REDIRECT') {
					return createPaymentResponse.links[i].href;
				}
			}
		}
	}

}

function executePayment(paymentId, payerId, token) {
	var options = {
		host: 'api.sandbox.paypal.com',
		path: '/v1/payments/payment/' + paymentId + '/execute/',
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		}
	};

	var params = {
		'payer_id': payerId
	};

	var promise = new Promise(
    	function(resolve, reject) {
    		var req = https.request(options, function(res) {
				res.on('end', function() {
					resolve('Payment executed');
				});
			});

			req.on('error', function(e) {
			  reject('problem with request: ' + e.message);
			});

			req.write(JSON.stringify(params));
			req.end();
    	}
	);

	return promise;
}

exports.createPayment = createPayment;
exports.executePayment = executePayment;