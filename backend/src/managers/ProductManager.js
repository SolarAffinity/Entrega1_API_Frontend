
const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  }

  async _writeFile(content) {
    await fs.writeFile(this.filePath, JSON.stringify(content, null, 2), 'utf-8');
  }

  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const list = await this._readFile();
    return list.find(p => String(p.id) === String(id)) || null;
  }

  _validateProductFields(p) {
    const required = ['title','description','code','price','status','stock','category','thumbnails'];
    for (const field of required) {
      if (p[field] === undefined) return `Falta el campo requerido: ${field}`;
    }
    if (!Array.isArray(p.thumbnails)) return 'thumbnails debe ser un array de strings';
    return null;
  }

  async create(productData) {
    const err = this._validateProductFields(productData);
    if (err) throw new Error(err);

    const list = await this._readFile();
    // id autoincremental simple
    const nextId = list.length ? Math.max(...list.map(p => Number(p.id) || 0)) + 1 : 1;
    const newProduct = { id: nextId, ...productData };
    list.push(newProduct);
    await this._writeFile(list);
    return newProduct;
  }

  async update(id, updates) {
    const list = await this._readFile();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error('Producto no encontrado');
    // No permitir cambiar/eliminar id
    const { id: _ignore, ...rest } = updates || {};
    list[idx] = { ...list[idx], ...rest };
    await this._writeFile(list);
    return list[idx];
  }

  async delete(id) {
    const list = await this._readFile();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error('Producto no encontrado');
    const [deleted] = list.splice(idx, 1);
    await this._writeFile(list);
    return deleted;
  }
}

module.exports = ProductManager;
