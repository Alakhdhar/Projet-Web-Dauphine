const express = require('express');
const app= express();
const serviceBd= require('./js/serviceBd');
const alert = require('alert');
const paypal = require('paypal-rest-sdk');
var id;
var stat; //statut du user

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.set('view engine','ejs');
app.use("/css",express.static(__dirname + "/css"));
app.use("/assets",express.static(__dirname + "/assets"));


app.get('/connexion', (request, response) => {
    response.render("connexion.ejs")
});
app.get('/inscription', (request, response) => {
    response.render("inscription.ejs")
});
app.get('/paypal', (request, response) => {
    response.render("paypal.ejs")
});
app.post('/signin', (request, response) => {
    const { nom,prenom,mdp,mail,statut} = request.body;
    const db = serviceBd.getDbServiceInstance();
    var url = "";
    
    if (statut == 1)
    url += "/paypal" 
    else if (statut == 0)
    url += "/connexion"
    
    db.insertNewUser(nom,prenom,mdp,mail,statut)
        .then(data => response.redirect(url))
        .catch(err => console.log(err));
});
app.post('/login', (request, response) => {
    const {mail, mdp} = request.body;
    const db = serviceBd.getDbServiceInstance();
    db.searchByEmail( mail, mdp)
        .then(data => {
            if(data.success){
                id= data.id;
                stat = data.statut;
                response.redirect("/user")
            }else{
                alert("User unfound ! Please try again or sign in !")
                response.redirect("/connexion")
            }
        })
        .catch(
            err=> console.log(err))
});
app.get('/user', (request, response) => {
    const db = serviceBd.getDbServiceInstance();
    db.getAllData()
        .then(data => response.render("parcsList.ejs", {listparcs : data,id :id,statut : stat}))
        .catch(err => console.log(err));
})
app.get('/user/userList', (request, response) => {
    const db = serviceBd.getDbServiceInstance();
    db.getAllDataOfUser(id,stat)
        .then(data =>{ response.render("userList.ejs", {listparcs : data,statut : stat})})
        .catch(err => console.log(err));
});
app.get('/user/vote/:idParc', (request, response) => {
    const idParc = request.params.idParc;
    const db = serviceBd.getDbServiceInstance();
    db.getParcWithId(idParc)
        .then(data => response.render("vote.ejs", {parc: data.arendre,idParc : idParc}))
        .catch(err => console.log(err));
});
app.get('/user/nouvellePub', (request, response) => {
    response.render("nouvellePub.ejs",{statut:stat})
});
app.post('/user/votenote/:idParc', (request, response) => {
    const { note} = request.body;
    const idParc = request.params.idParc;
    const db = serviceBd.getDbServiceInstance();
    const result = db.noteTheParc(idParc,id,note);

    console.log("NOTE ATTRIBUE "+note);
    result
        .then(data => {
            db.setAVGToSite(idParc).then(r => response.redirect("/user/userList"));
        })
        .catch(err => console.log(err))
});
app.post('/user/addingPub', (request, response) => {
    console.log("HERE");
    const {nameParc,libelle,pays,site,type,image,desc} = request.body;
    console.log("HEREeeeeeeee",nameParc,libelle,pays,site,type,image,desc);
    const db = serviceBd.getDbServiceInstance();
    const result = db.sendNewPostForValidation(nameParc,libelle,pays,site,type,image,desc,id);

    result
        .then(data => response.redirect("/user/userList"))
        .catch(err => console.log(err))
});
app.get("/user/delete/:idParc",(request, response) => {
    const idParc = request.params.idParc;
    const db = serviceBd.getDbServiceInstance();
    let result;
    if(stat==0){
         result = db.deleteNoteOfUserOnParc(id, idParc);
    }
    else if (stat==1){
         result =db.deletePostOfResp(id, idParc);
    }

    result
        .then(data => response.redirect("/user/userList"))
        .catch(err => console.log(err))

});


//PayPal

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AW7JQ28QUeSV3E7KchRFCDmqXRdaDaFDtw3cn1jn35iRy51S2s9W65laM7x0ZNEnPazxabkBx3dfdOrq',
    'client_secret': 'EBExRthtPX_NScFTKrIiRIeedx45MHR8xDWXFcyjlPhP2D86HBP4i6LfO20VT7o03K9VhSs2sD_Z8eVB'
  });

  app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:5000/success",
        "cancel_url": "http://localhost:5000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Publication d'un parc",
                "sku": "001",
                "price": "10.00",
                "currency": "EUR",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "EUR",
            "total": "10.00"
        },
        "description": "Hat for the best team ever"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "EUR",
            "total": "10.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.render("connexion.ejs");
    }
});
});

app.get('/cancel', (req, res) => res.render("paypal.ejs"));
console.log(process.env.PORT);
app.listen(process.env.PORT,()=> console.log("running"));
