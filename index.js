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
var stat;

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
    stat = statut; //test
    if (statut == 1)
        url += "/user" //sinon res
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
    db.getAllData(function (row) {res = row})
        .then(data => response.render("parcsList.ejs", {listparcs : res,id :id,statut : stat}))
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
    let res;
    db.getParcWithId(idParc,function (row) {res = row})
        .then(data => response.render("vote.ejs", {parc: res,idParc : idParc}))
        .catch(err => console.log(err));
});
app.get('/user/nouvellePub', (request, response) => {
    response.render("nouvellePub.ejs")
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