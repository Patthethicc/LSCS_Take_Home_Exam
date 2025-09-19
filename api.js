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

        if(name == null || sellerName == null || name == '' || sellerName == '') {
            res.status(400).json({
                message: `Please set product name or seller name`,
            });
        } else if(price < 0 || rating < 0) {
            res.status(400).json({
                message: `Please input a positive value`,
            });
        } else if(rating > 5) {
            res.status(400).json({
                message: `Please input a rating less than 6`,
            });
        }
        
        const result = (await connection)
            .query('INSERT INTO product (name, price, sellerName, rating) VALUES (?,?,?,?)',
                [name, price, sellerName, rating]);

        res.status(201).json({
            message: `Product '${name}' added Successfully!`,
        });
    } catch(err) {
       res.status(500).json({
            message: 'Failed to add the product.'
        });
    }
})

app.get('/products', async (req, res) => {
    try {
        const [rows] = await (await connection).query('SELECT * FROM product');

        if (rows.length == 0) {
            res.status(404).json({ 
                message: 'Products not found' 
            });
        }

        res.status(200).json(rows);
    } catch(err) {
        res.status(500).json({
            message: 'Failed to gather products'
        });
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const [product] = await (await connection).query('SELECT * FROM product WHERE id = ?', [id]);

        if (product.affectedRows == 0) {
            res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        res.status(200).json(product);
    } catch(err) {
        res.status(500).json({
            message: 'Failed to gather the product'
        });
    }
})

app.put('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {name, price, sellerName, rating} = req.body;

        if(name == null || sellerName == null || name == '' || sellerName == '') {
            res.status(400).json({
                message: `Please set product name or seller name`,
            });
        } else if(price < 0 || rating < 0) {
            res.status(400).json({
                message: `Please input a positive value`,
            });
        } else if(rating > 5) {
            res.status(400).json({
                message: `Please input a rating less than 6`,
            });
        }

        const [editedProduct] = await (await connection)
        .query('UPDATE product SET name = ?, price = ?, sellerName = ?, rating = ? WHERE id = ?',
            [name, price, sellerName, rating, id]);

        if (editedProduct.affectedRows == 0) {
            res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            message: `Product '${name}' edited Successfully!`
        });
    } catch(err) {
        res.status(500).json({
            message: 'Failed to edit the product'
        });
    }
})

app.delete('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const [deleted] = await (await connection).query('DELETE FROM product WHERE id = ?', [id]);

        if (deleted.affectedRows == 0) {
            res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            message: `Product deleted Successfully!`
        });
    } catch(err) {
        res.status(500).json({
            message: 'Failed to delete the product'
        });
    }
})

app.listen(PORT, (error) =>{
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);