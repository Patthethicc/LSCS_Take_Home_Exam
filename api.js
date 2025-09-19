const express = require('express');
const sql = require('mysql2/promise');
require('dotenv').config()

const app = express();
const PORT = process.env.DB_PORT;
const connection = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

app.use(express.json());

async function connect() {
    try {
        const connectDB = (await connection).connect();
        console.log("connected succesfully!");
        return connectDB;
    } catch(err) {
        console.log(err);
    }
}

connect();

app.post('/products', async (req, res) => {
    try {
        const {name, price, sellerName, rating} = req.body;
        
        const result = (await connection)
            .query('INSERT INTO product (name, price, sellerName, rating) VALUES (?,?,?,?)',
                [name, price, sellerName, rating]);

        res.status(201).json({
            message: `Product '${name}' added Successfully!`,
        });
    } catch(err) {
        console.log(err)
       res.status(500).json({
            message: 'Failed to add the product.'
        });
    }
})

app.get('/products', async (req, res) => {
    try {
        const [rows] = await (await connection).query('SELECT * FROM product');
        console.log(rows)

        res.status(200).json(rows);
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to gather the products'
        });
    }
})

app.get('/products/:id', (req, res) => {

})

app.put('/products/:id', (req, res) => {

})

app.delete('/products/:id', (req, res) => {

})

app.listen(PORT, (error) =>{
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);