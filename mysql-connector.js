const { rejects } = require('assert');
const mysql = require('mysql');


module.exports = class mysqlconnector
{
    /*
     * creates our instance, database and table.
     */

    async Setup(_host, _user, _pass)
    {
        this.mysqlcon = mysql.createConnection({
            host: _host,
            port: 3306,
            user: _user,
            password: _pass
        });
        
        // Connecting to mysql server.
        this.mysqlcon.connect(err => {
            if (err)
                throw err;
            console.log('🟢 MySQL Connection: Success.');

            // Creating shoppy database.
            this.mysqlcon.query('create database if not exists shoppy', err => {
                if (err)
                    throw err;
                console.log('🟢 Database: Created.');

                // Selecting shoppy database.
                this.mysqlcon.query('USE shoppy', err => {
                    if (err)
                        throw err;
                    console.log('🟢 Database: Selected.');

                    // Creating orders table.
                    this.mysqlcon.query('create table if not exists orders(id int not null primary key auto_increment, discord varchar(255) not null, purchase varchar(255) not null, order_id varchar(255) not null, date timestamp default current_timestamp)', async (err) => {
                        if (err)
                            throw err;
                        console.log('🟢 Table: Created.');
                    });
                });
            });
        });
    };

    /*
     * Authenticates the order.
     */
    AuthenticateOrder(discord, orderId, purchase)
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.mysqlcon.ping(err => {
                    if (err)
                    {
                        console.log('mysql server is down!');
                        throw err;
                    }

                    // security: if orderId contains ' or ` we will return false.
                    if (discord.includes('\'')  || discord.includes('\´') )
                    {
                        return resolve(false);
                    }

                    this.mysqlcon.query('use shoppy', err => {
                        if (err) throw reject(err);
    
                        this.mysqlcon.query(`select discord, order_id from orders where order_id = '${orderId}'`, (err, row) => {
                            if (err) throw reject(err);
    
                            let result = Object.values(JSON.parse(JSON.stringify(row)));
    
                            if (result <= 0)
                            {
                                this.mysqlcon.query(`insert into orders (discord, order_id, purchase) values ('${discord}', '${orderId}', '${purchase}')`);
                                return resolve(true);
                            }
                            return resolve(false);
                        });
                    });
                });
            }, 1500);
        });
    }
}