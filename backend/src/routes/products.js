
const { Router } = require('express');

module.exports = (productManager) => {
  const router = Router();

  // GET / - lista todos
  router.get('/', async (req, res) => {
    try {
      const list = await productManager.getAll();
      res.json(list);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /:pid - uno por id
  router.get('/:pid', async (req, res) => {
    try {
      const prod = await productManager.getById(req.params.pid);
      if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(prod);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST / - crear
  router.post('/', async (req, res) => {
    try {
      const created = await productManager.create(req.body);
      res.status(201).json(created);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  // PUT /:pid - actualizar (no tocar id)
  router.put('/:pid', async (req, res) => {
    try {
      const updated = await productManager.update(req.params.pid, req.body);
      res.json(updated);
    } catch (e) {
      const status = e.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ error: e.message });
    }
  });

  // DELETE /:pid - eliminar
  router.delete('/:pid', async (req, res) => {
    try {
      const deleted = await productManager.delete(req.params.pid);
      res.json({ deleted });
    } catch (e) {
      const status = e.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ error: e.message });
    }
  });

  return router;
};
