const express = require('express');
const app= express();
const serviceBd= require('./js/serviceBd');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.set('view engine','ejs');
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
    const { mail,mdp,statut} = request.body;
    const db = serviceBd.getDbServiceInstance();
    var url="";
    if(statut ==1)
        url+="/res"
    else if(statut==0)
        url+="/user"
    const result = db.searchByEmail(statut,mail,mdp); //ne verifie pas
    result
        .then(data => response.redirect(url),{id: result })
        .catch(err => console.log(err))
});

app.get('/user/voterList', (request, response) => {
    response.render("voterList.ejs")
});



app.get('/res/publisherList', (request, response) => {
    response.render("publisherList.ejs")
});
app.get('/user/vote', (request, response) => {
    response.render("vote.ejs")
});
app.get('/res/nouvellePub', (request, response) => {
    response.render("nouvellePub.ejs")
});
app.post('/user', (request, response) => {
    id=1;
    statut="U";
    response.render("parcsListV2.ejs",
        {
            idUser : id,
            statut : statut
        })
});
app.get('/user', (request, response) => {
    id=1;
    statut="U";
    response.render("parcsListV2.ejs",
        {
            idUser : id,
            statut : statut
        })
});
//Routes
//read
app.get('/res', (request, response) => {
    const db = serviceBd.getDbServiceInstance();
    db.getAllData()
        .then(data => response.render("parcsListV1.ejs", {listparcs : data}))
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