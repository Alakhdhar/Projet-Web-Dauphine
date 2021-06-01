const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    port : process.env.DB_PORT,
});

connection.connect((err)=> {
    if(err){
        console.log(err.message);
    }
    console.log('bd'+connection.state);
});
class ServiceBd{
    static getDbServiceInstance() {
        return instance ? instance : new ServiceBd();
    }
    async getAllData(arendre) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM parc where parc.publie=1;";

                connection.query(query, (err, rows) => {
                    if (err) reject(err.message);
                    arendre(rows);
                    resolve(rows);
                })
            });
             return response;
        } catch (error) {
            console.log(error);
        }
    }
    async setAVGToSite(idParc) {
        try {
            idParc = parseInt(idParc, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE parc SET note=(select round(avg(vote.note)) from vote, parc where parc.idparc=vote.idparc and vote.idparc=?) WHERE idparc=?";
                connection.query(query,[idParc,idParc], (err, rows) => {
                    if (err) return reject(err.message);
                    return resolve(rows);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async getAllDataOfUser(idUser,statut) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query="";
                if(statut==0){
                    query += "SELECT parc.*,(vote.note) as score FROM parc,vote where parc.idparc=vote.idparc and parc.publie=1 and vote.idutil=?;";
                }
                else if(statut==1){
                    query += "SELECT parc.* FROM parc where parc.idpublisher=?;";
                }

                connection.query(query,[idUser], (err, rows) => {
                    if (err) return  Error(err.message);
                    // arendre(rows[0]);
                    // console.log(rows[0])
                    resolve(rows);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async insertNewUser(nom,prenom,mdp,mail,statut) {
        try {

            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO utilisateur(nom,prenom,mdp,mail,statut) VALUES (?,?,?,?,?);";
                connection.query(query, [nom,prenom,mdp,mail,statut] , (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.insertId);
                })
            });
            return {
                id : insertId,
                name : nom,
            };
        } catch (error) {
            console.log(error);
        }
    }
    async getParcWithId(id,arendre) {
        try {
            id = parseInt(id, 10);
            // console.log("IDPARC TO VOTE FOR "+id);

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM parc WHERE idparc = ?";

                connection.query(query, [id], (err, rows) => {
                    if (err) return reject(err.message);
                    arendre(rows[0])
                    return resolve(rows);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async noteTheParc(idParc,idUser,note) {
        try {
            idParc = parseInt(idParc, 10);
            idUser = parseInt(idUser, 10);
            // console.log("first call to find"+idParc+"    "+idUser+"  "+note);

            const find = await new Promise((resolve, reject) => {
                const query = "select note from vote where idparc=? and idutil=? ";
                connection.query(query, [idParc,idUser] , (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                    // console.log(" result of search has length "+ result.length);
                    if(result.length==0){
                        return this.addNoteToParc(idParc,idUser,note);
                    }else{
                        return this.updateNoteToParc(idParc,idUser,note);
                    }

                })
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateNoteToParc(idParc,idUser,note) {
        try {
            idParc = parseInt(idParc, 10);
            idUser = parseInt(idUser, 10);
            console.log("update"+idParc+"    "+idUser+"  "+note);

            const insertId = await new Promise((resolve, reject) => {
                const query = "update vote set note=? where idparc=? and idutil=?";

                connection.query(query, [note,idParc,idUser] , (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                })
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async addNoteToParc(idParc,idUser,note) {
        try {
            idParc = parseInt(idParc, 10);
            idUser = parseInt(idUser, 10);
            console.log("new"+idParc+"    "+idUser+"  "+note);

            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO vote(idparc,idutil,note) VALUES (?,?,?);";

                connection.query(query, [idParc,idUser,note] , (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                })
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async searchByEmail(statut,mail,mdp,arendre) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "SELECT idutil FROM utilisateur WHERE statut= ? and mail = ? and mdp = ?;";
                connection.query(query, [statut,mail,mdp], (err, rows) => {
                    if(rows === undefined)
                        return reject(err);
                    arendre(rows[0].idutil)
                    return resolve(rows);
                })
            });
            return insertId;
        } catch (error) {
            console.log(error);
        }

        //     let test = connection.query('SELECT idutil FROM utilisateur WHERE statut= ? and mail = ? and mdp = ?;',[statut,mail,mdp]);
        //     console.log(parseInt(test.values[0]))
        //     arendre(parseInt(test.values[0]))
        //     return parseInt(test.values[0]);
    }
    async deleteNoteOfUserOnParc(idUser,idParc) {
        try {
            idUser = parseInt(idUser, 10);
            idParc = parseInt(idParc, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM vote WHERE idutil = ? and idparc=?";

                connection.query(query, [idUser,idParc] , (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                })
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async sendNewPostForValidation(nameParc,libelle,pays,site,type,image,desc,id){
        try {
            id = parseInt(id, 10);
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO parc( nom, type, libelle, image, pays, description, note, site, publie, idpublisher)  VALUES (?,?,?,?,?,?,0,?,0,?);";

                connection.query(query, [nameParc,type,libelle,image,pays,desc,site,id] , (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                })
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deletePostOfResp(id, idPub){
        try {
            id = parseInt(id, 10);
            idPub = parseInt(idPub, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM parc WHERE idpublisher = ? and idparc=?"; // a revoir

                connection.query(query, [id,idPub] , (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                })
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
module.exports = ServiceBd;