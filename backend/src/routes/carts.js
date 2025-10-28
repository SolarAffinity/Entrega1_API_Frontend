
const { Router } = require('express');

module.exports = (cartManager, productManager) => {
  const router = Router();

  // POST / - crear carrito
  router.post('/', async (req, res) => {
    try {
      const cart = await cartManager.createCart();
      res.status(201).json(cart);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /:cid - listar productos del carrito (con detalles)
  router.get('/:cid', async (req, res) => {
    try {
      const populated = await cartManager.getCartPopulated(req.params.cid);
      if (!populated) return res.status(404).json({ error: 'Carrito no encontrado' });
      res.json(populated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /:cid/product/:pid - agregar producto (incrementa quantity si existe)
  router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const qty = req.body?.quantity ?? 1;
      const cart = await cartManager.addProduct(req.params.cid, req.params.pid, qty);
      res.status(201).json(cart);
    } catch (e) {
      const status = e.message.includes('no encontrado') || e.message.includes('no existe') ? 404 : 400;
      res.status(status).json({ error: e.message });
    }
  });

  return router;
};
