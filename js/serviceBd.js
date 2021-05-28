const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();
let idutil=0;

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
                const query = "SELECT * FROM parc;";

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
    async getAllDataOf(idUser) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT parc.* FROM parc,vote where parc.idparc=vote.idparc and vote.idutil=?;";

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

    async setNoteToParc(idParc,idUser,note) {
        try {
            idParc = parseInt(idParc, 10);
            idUser = parseInt(idUser, 10);
            // console.log(idParc+"    "+idUser+"  "+note);
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
    // async deleteRowById(id) {
    //     try {
    //         id = parseInt(id, 10);
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "DELETE FROM user WHERE idUser = ?";
    //
    //             connection.query(query, [id] , (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result.affectedRows);
    //             })
    //         });
    //
    //         return response === 1 ? true : false;
    //     } catch (error) {
    //         console.log(error);
    //         return false;
    //     }
    // }
    // async updateNameById(id, name) {
    //     try {
    //         id = parseInt(id, 10);
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "UPDATE user SET login = ? WHERE idUser = ?";
    //
    //             connection.query(query, [name, id] , (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result.affectedRows);
    //             })
    //         });
    //
    //         return response === 1 ? true : false;
    //     } catch (error) {
    //         console.log(error);
    //         return false;
    //     }
    // }
    // async searchByName(name) {
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "SELECT * FROM user WHERE login = ?;";
    //
    //             connection.query(query, [name], (err, results) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(results);
    //             })
    //         });
    //
    //         return response;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
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
}
module.exports = ServiceBd;