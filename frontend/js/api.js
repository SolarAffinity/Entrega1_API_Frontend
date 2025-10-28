
const BASE = 'http://localhost:8080/api';

// util
const el = (q) => document.querySelector(q);
const htmlList = (items) => '<pre>' + JSON.stringify(items, null, 2) + '</pre>';

// Productos
el('#btnListar').addEventListener('click', async () => {
  const res = await fetch(`${BASE}/products`);
  const data = await res.json();
  el('#productos').innerHTML = htmlList(data);
});

el('#formCrear').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const body = {
    title: form.get('title'),
    description: form.get('description'),
    code: form.get('code'),
    price: Number(form.get('price')),
    status: !!form.get('status'),
    stock: Number(form.get('stock')),
    category: form.get('category'),
    thumbnails: (form.get('thumbnails') || '').split(',').map(s => s.trim()).filter(Boolean)
  };
  const res = await fetch(`${BASE}/products`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const data = await res.json();
  alert(res.ok ? 'Producto creado' : ('Error: ' + data.error));
  if (res.ok) el('#btnListar').click();
  e.target.reset();
});

el('#formUpdate').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const id = form.get('id');
  let updates = {};
  try { updates = JSON.parse(form.get('json')); } catch (e) { alert('JSON inválido'); return; }
  const res = await fetch(`${BASE}/products/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(updates) });
  const data = await res.json();
  alert(res.ok ? 'Producto actualizado' : ('Error: ' + data.error));
  if (res.ok) el('#btnListar').click();
  e.target.reset();
});

el('#formDelete').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const id = form.get('id');
  const res = await fetch(`${BASE}/products/${id}`, { method:'DELETE' });
  const data = await res.json();
  alert(res.ok ? 'Producto eliminado' : ('Error: ' + data.error));
  if (res.ok) el('#btnListar').click();
  e.target.reset();
});

// Carritos
el('#btnCrearCart').addEventListener('click', async () => {
  const res = await fetch(`${BASE}/carts`, { method:'POST' });
  const data = await res.json();
  if (res.ok) {
    alert(`Carrito creado con id ${data.id}`);
  } else {
    alert('Error: ' + data.error);
  }
});

el('#formAddToCart').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const cid = form.get('cid');
  const pid = form.get('pid');
  const quantity = Number(form.get('quantity') || 1);
  const res = await fetch(`${BASE}/carts/${cid}/product/${pid}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ quantity }) });
  const data = await res.json();
  alert(res.ok ? 'Producto agregado al carrito' : ('Error: ' + data.error));
  e.target.reset();
});

el('#formVerCart').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const cid = form.get('cid');
  const res = await fetch(`${BASE}/carts/${cid}`);
  const data = await res.json();
  if (res.ok) {
    el('#carrito').innerHTML = htmlList(data);
  } else {
    alert('Error: ' + data.error);
  }
});
