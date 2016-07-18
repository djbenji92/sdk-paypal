Paypal Nodejs API
========================

#Importer la librairie

```node
const paypal = require('./paypal.js');
```

#Fonctions de la la librairie


###Récupérer un token
```node
function getToken(username, password)
```

#####Paramètres
* username: identifiant client de votre app paypal
* password: secret de votre app paypal

#####Return
Un token paypal pour votre application


###Créer un paiement
```node
function createPayment(token, return_url, cancel_url, transactions)
```
#####Paramètres
* token: token renvoyé par la fonction getToken
* return_url: url de retour
* cancel_url: url d'annulation
* transactions: transactions à effectuer  
  exemple de transaction (voir doc API paypal pour plus de détails):  
```node
var transactions = [
  {
    amount: {
      total: '1.00',
      currency: 'EUR'
    }
  }
];
```

#####Return
Une url de redirection vers paypal pour que l'utilisateur entre ses identifiants


###Exécuter un paiement
```node
function executePayment(paymentId, payerId, token)
```

#####Paramètres
* paymentId: paramèrtre retourner par paypal après création du paiement
* payerId: paramèrtre retourner par paypal après création du paiement
* token: paramèrtre retourner par paypal après création du paiement

#Démo
Vous pouvez voir une démo de notre API en lançant les commandes suivantes :

```Shell
npm install
```

```Shell
node server.js
```
Puis en allant à l'adresse:
[http://localhost:8080](http://localhost:8080)
