const mysql = require('mysql');
require('dotenv').config();

class DB
{
    constructor()
    {
        this.options =
        {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_DATABASE || 'test',
        }
    }
    query(query)
    {
        const con = mysql.createConnection(this.options);
        let data = new Promise((resolve, reject) => 
        {
            con.query(query,  (err, results )=>
            {
                if(err) return reject(err);
                return resolve(results);
            });
        });
        con.end();
        return data
    }
}

module.exports = new DB();