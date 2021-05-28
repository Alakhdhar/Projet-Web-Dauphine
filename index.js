const express = require('express');
const app= express();
const serviceBd= require('./js/serviceBd');
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.set('view engine','ejs');
app.use(__dirname+"", express.static('/user'));
app.use("/css",express.static(__dirname + "/css"));
app.use("/assets",express.static(__dirname + "/assets"));
var id;

app.get('/connexion', (request, response) => {
    response.render("connexion.ejs")
});
app.get('/inscription', (request, response) => {
    response.render("inscription.ejs")
});
app.post('/signin', (request, response) => {
    const { nom,prenom,mdp,mail,statut} = request.body;
    const db = serviceBd.getDbServiceInstance();
    const result = db.insertNewUser(nom,prenom,mdp,mail,statut);

    result
        .then(data => response.redirect("/connexion"))
        .catch(err => console.log(err));
});
app.post('/login', (request, response) => {
    const {mail, mdp, statut} = request.body;
    const db = serviceBd.getDbServiceInstance();
    var url = "";
    if (statut == 1)
        url += "/res"
    else if (statut == 0)
        url += "/user"
    const result = db.searchByEmail(statut, mail, mdp, function (res) {
        id = res
    }); // NB gestion des erreurs si user inexistant
    if (id == -1){
        alert("User unfound ! Please try again or sign in !")
        response.redirect("/connexion")
    }else{
        result
            .then(data => response.redirect(url))
            .catch(err => console.log(err))
    }
});
app.get('/user', (request, response) => {
    const db = serviceBd.getDbServiceInstance();
    // const { idUser } = request.params;
    // id=idUser;
    db.getAllData(function (row) {res = row})
        .then(data => response.render("parcsListV2.ejs", {listparcs : res,id :id}))
        .catch(err => console.log(err));
})
app.get('/user/vote/:idParc', (request, response) => {
    const idParc = request.params.idParc;
    const db = serviceBd.getDbServiceInstance();
    let res;
    db.getParcWithId(idParc,function (row) {res = row})
        .then(data => response.render("vote.ejs", {parc: res,idParc : idParc}))
        .catch(err => console.log(err));
});

app.post('/user/votenote/:idParc', (request, response) => {
    const { note} = request.body;
    const idParc = request.params.idParc;
    const db = serviceBd.getDbServiceInstance();
    // console.log(idParc+" BLAA "+id);
    const result = db.setNoteToParc(idParc,id,note);
    console.log("NOTE ATTRIBUE "+note);
    const url ="/user/voterList";
    result
        .then(data => response.redirect(url))
        .catch(err => console.log(err))
});
app.get('/user/voterList', (request, response) => {
    const db = serviceBd.getDbServiceInstance();
    id=1;
    db.getAllDataOf(id)
        .then(data => response.render("voterList.ejs", {listVoterparcs : data}))
        .catch(err => console.log(err));
});
app.get("/user/delete/:idParc",(request, response) => {
    const idParc = request.params.idParc;
    const db = serviceBd.getDbServiceInstance();
    const result = db.deleteNoteOfUserOnParc(id, idParc);
    result
        .then(data => response.redirect("/user/voterList"))
        .catch(err => console.log(err))

});


app.get('/res/publisherList', (request, response) => {
    response.render("publisherList.ejs")
});


app.get('/res/nouvellePub', (request, response) => {
    response.render("nouvellePub.ejs")
});
//Routes
//read
app.get('/res', (request, response) => {
    const db = serviceBd.getDbServiceInstance();
    let res;
    db.getAllData(function (row) {res = row})
        .then(data => response.render("parcsListV1.ejs", {listparcs : res}))
        .catch(err => console.log(err));
})

// app.delete('/delete/:id', (request, response) => {
//     const { id } = request.params;
//     const db = serviceBd.getDbServiceInstance();
//
//     const result = db.deleteRowById(id);
//
//     result
//         .then(data => response.json({success : data}))
//         .catch(err => console.log(err));
// });
// //UPLOAD
// app.post("/uploadTest",(request, response)=>{
//     var monFrom = new formidable.IncomingForm();
//
//
//     monForm.parse(request);
//     monForm.on('fileBegin',function(name,file){
//         file.path= __dirname+"/uploads/"+file.name;
//
//     })
//     response.redirect(301,"http://localhost:8000/ParcAdviser/serveur/uploadTest.html");
//
// });
// // update
// app.patch('/update', (request, response) => {
//     const { id, name } = request.body;
//     const db = serviceBd.getDbServiceInstance();
//
//     const result = db.updateNameById(id, name);
//
//     result
//         .then(data => response.json({success : data}))
//         .catch(err => console.log(err));
// });
// app.get('/search/:name', (request, response) => {
//     const { name } = request.params;
//     const db = serviceBd.getDbServiceInstance();
//
//     const result = db.searchByName(name);
//
//     result
//         .then(data => response.json({data : data}))
//         .catch(err => console.log(err));
// })
console.log(process.env.PORT);
app.listen(process.env.PORT,()=> console.log("running"));