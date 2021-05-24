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
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM parc;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
             return response;
        } catch (error) {
            console.log(error);
        }
    }



    // async insertNewName(name) {
    //     try {
    //         const dateAdded = new Date();
    //         const insertId = await new Promise((resolve, reject) => {
    //             const query = "INSERT INTO user(login, date_added) VALUES ('vide',?);";
    //             console.log ("login : " + name);
    //             connection.query(query, [name, dateAdded] , (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result.insertId);
    //             })
    //         });
    //         return {
    //             id : insertId,
    //             name : name,
    //             dateAdded : dateAdded
    //         };
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
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
}
module.exports = ServiceBd;