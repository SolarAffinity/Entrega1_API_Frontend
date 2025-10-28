
const fs = require('fs').promises;

class CartManager {
  constructor(cartsPath, productsPath) {
    this.cartsPath = cartsPath;
    this.productsPath = productsPath;
  }

  async _read(file) {
    try {
      const data = await fs.readFile(file, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  }
  async _write(file, content) {
    await fs.writeFile(file, JSON.stringify(content, null, 2), 'utf-8');
  }

  async _readCarts() { return this._read(this.cartsPath); }
  async _writeCarts(c) { return this._write(this.cartsPath, c); }
  async _readProducts() { return this._read(this.productsPath); }

  async createCart() {
    const carts = await this._readCarts();
    const nextId = carts.length ? Math.max(...carts.map(c => Number(c.id) || 0)) + 1 : 1;
    const newCart = { id: nextId, products: [] };
    carts.push(newCart);
    await this._writeCarts(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readCarts();
    return carts.find(c => String(c.id) === String(cid)) || null;
  }

  async addProduct(cid, pid, quantity = 1) {
    const carts = await this._readCarts();
    const cartIdx = carts.findIndex(c => String(c.id) === String(cid));
    if (cartIdx === -1) throw new Error('Carrito no encontrado');

    // validar existencia de producto
    const products = await this._readProducts();
    const exists = products.find(p => String(p.id) === String(pid));
    if (!exists) throw new Error('Producto no existe');

    const prodIdx = carts[cartIdx].products.findIndex(p => String(p.product) === String(pid));
    if (prodIdx === -1) {
      carts[cartIdx].products.push({ product: pid, quantity: Number(quantity) || 1 });
    } else {
      carts[cartIdx].products[prodIdx].quantity += Number(quantity) || 1;
    }
    await this._writeCarts(carts);
    return carts[cartIdx];
  }

  // Utilidad: cart con productos poblados
  async getCartPopulated(cid) {
    const cart = await this.getCartById(cid);
    if (!cart) return null;
    const products = await this._readProducts();
    const detailed = cart.products.map(item => ({
      product: products.find(p => String(p.id) === String(item.product)) || { id: item.product, missing: true },
      quantity: item.quantity
    }));
    return { id: cart.id, products: detailed };
  }
}

module.exports = CartManager;
