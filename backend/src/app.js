
const express = require('express');
const cors = require('cors');
const path = require('path');

const ProductManager = require('./managers/ProductManager');
const CartManager = require('./managers/CartManager');

const productsRouterFactory = require('./routes/products');
const cartsRouterFactory = require('./routes/carts');

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, '..', 'data');
const productsPath = path.join(dataDir, 'products.json');
const cartsPath = path.join(dataDir, 'carts.json');

const productManager = new ProductManager(productsPath);
const cartManager = new CartManager(cartsPath, productsPath);

// Rutas
app.use('/api/products', productsRouterFactory(productManager));
app.use('/api/carts', cartsRouterFactory(cartManager, productManager));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
