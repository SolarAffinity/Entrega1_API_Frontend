
# Entrega N°1 — API de Productos y Carritos

Servidor Node.js + Express con persistencia en archivos JSON (`products.json` y `carts.json`) y un cliente web simple para probar la API.

## Requisitos previos
- Node.js 18+
- npm
- Postman/Insomnia para probar endpoints

## Instalación (backend)
```bash
cd backend
npm install
npm run start
```
El servidor escucha en **http://localhost:8080**.

## Endpoints
- **Productos** (`/api/products`)
  - `GET /api/products` — lista todos los productos
  - `GET /api/products/:pid` — obtiene un producto por id
  - `POST /api/products` — crea un producto
  - `PUT /api/products/:pid` — actualiza campos del producto
  - `DELETE /api/products/:pid` — elimina un producto por id

**Campos de producto (POST):**
```json
{
  "title": "String",
  "description": "String",
  "code": "String",
  "price": 123.45,
  "status": true,
  "stock": 100,
  "category": "String",
  "thumbnails": ["ruta1.jpg", "ruta2.png"]
}
```

- **Carritos** (`/api/carts`)
  - `POST /api/carts` — crea un carrito
  - `GET /api/carts/:cid` — lista los productos de un carrito
  - `POST /api/carts/:cid/product/:pid` — agrega producto al carrito (incrementa `quantity` si existe)


## Frontend
- Lista de productos
- Crear/actualizar/eliminar productos
- Crear carrito
- Agregar productos a un carrito
- Ver detalles de un carrito

## Estructura
```
entrega1-api-frontend-backend/
  backend/
    data/
      products.json
      carts.json
    src/
      app.js
      managers/
        ProductManager.js
        CartManager.js
      routes/
        products.js
        carts.js
    package.json
    README.md
  frontend/
    index.html
    js/
      api.js
```
