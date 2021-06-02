const express = require('express');
const app= express();
const serviceBd= require('./js/serviceBd');
const alert = require('alert');
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
app.post('/signin', (request, response) => {
    const { nom,prenom,mdp,mail,statut} = request.body;
    const db = serviceBd.getDbServiceInstance();
    db.insertNewUser(nom,prenom,mdp,mail,statut)
        .then(data => response.redirect("/connexion"))
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

console.log(process.env.PORT);
app.listen(process.env.PORT,()=> console.log("running"));