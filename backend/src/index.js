const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;
const multer = require('multer');
const xlsx = require('xlsx');

app.use(cors());
app.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#05nov2002',
    database: 'inventory_db'
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
    }
    console.log("Connected to MySQL");
});

app.get('/test', (req, res) => {
    res.send("Server is running!");
});

app.put('/api/updateProduct/:id', (req, res) => {
    const { id } = req.params; // Get the product ID from the request parameters
    const { quantity, operation } = req.body; // Get quantity and operation from request body

    // Validate quantity input
    if (isNaN(quantity) || quantity < 0) {
        return res.status(400).json({ error: "Invalid quantity value" });
    }

    const query = "SELECT quantity FROM inventory WHERE id = ?"; // SQL query to get current stock
    db.query(query, id, (err, results) => {
        if (err) {
            console.error("Error fetching product: " + err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const currentQuantity = results[0].quantity;
        let newQuantity;

        // Calculate the new quantity based on the operation
        if (operation === 'add') {
            newQuantity = currentQuantity + quantity; // Add to existing stock
        } else if (operation === 'reduce') {
            newQuantity = currentQuantity - quantity; // Reduce from existing stock
            // Ensure the new quantity doesn't go below zero
            if (newQuantity < 0) {
                return res.status(400).json({ error: "Stock quantity cannot be less than zero." });
            }
        } else {
            return res.status(400).json({ error: "Invalid operation specified" });
        }

        // Update the stock quantity in the database
        const updateQuery = "UPDATE inventory SET quantity = ? WHERE id = ?"; // SQL query to update the quantity
        db.query(updateQuery, [newQuantity, id], (err, result) => {
            if (err) {
                console.error("Error updating product: " + err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ id, quantity: newQuantity }); // Return the updated product with new quantity
        });
    });
});


app.get('/api/getProducts', (req, res) => {
    const query = "SELECT * FROM inventory";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching products: " + err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.post('/api/addProduct', (req, res) => {
    const { name, category, sub_category, manufacturer_id, warranty_period, quantity, stock_alert } = req.body; 
    const data = { 
        name, 
        category, 
        sub_category, 
        manufacturer_id, 
        warranty_period, 
        quantity, 
        stock_alert 
    };
    
    const query = "INSERT INTO inventory SET ?";
    db.query(query, data, (err, result) => {
        if (err) {
            console.error("Error adding product: " + err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ id: result.insertId, ...data });
    });
});

app.post('/api/bulkOrder', upload.single('file'), async (req, res) => {
    console.log('Received file:', req.file);
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const products = xlsx.utils.sheet_to_json(worksheet);
    console.log('Parsed products:', products);

    for (const product of products) {
        const { 
            'Product Name': name, 
            Category: category, 
            'Sub-Category': sub_category, 
            'Manufacturer ID': manufacturer_id, 
            'Warranty Period': warranty_period, 
            Quantity: quantity, 
            'Stock Alert': stock_alert 
        } = product;

        if (!name || !category || !sub_category || !manufacturer_id || !warranty_period || !quantity) {
            console.log('Invalid product data:', product);
            return res.status(400).json({ error: "Invalid product data." });
        }

        const data = { 
            name, 
            category, 
            sub_category, 
            manufacturer_id, 
            warranty_period, 
            quantity, 
            stock_alert: stock_alert || null 
        };

        const query = "INSERT INTO inventory SET ?";
        db.query(query, data, (err, result) => {
            if (err) {
                console.error("Error adding product: " + err);
            }
        });
    }

    res.json({ message: "Bulk order processed successfully!" });
});

app.delete('/api/deleteProduct/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM inventory WHERE id = ?";
    db.query(query, id, (err, result) => {
        if (err) {
            console.error("Error deleting product: " + err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
