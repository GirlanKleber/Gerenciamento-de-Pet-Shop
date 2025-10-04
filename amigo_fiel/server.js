
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Disposable12.', 
  database: 'amigo_fiel'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL');
});


app.get('/api/clientes', (req, res) => {
  db.query('SELECT * FROM clientes ORDER BY id ASC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/clientes', (req, res) => {
  const { nome_completo, cpf, email, telefone, endereco } = req.body;
  if (!nome_completo || !cpf || !email || !telefone || !endereco)
    return res.status(400).json({ error: 'Todos os campos do cliente são obrigatórios.' });

  const query = 'INSERT INTO clientes (nome_completo, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nome_completo, cpf, email, telefone, endereco], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: 'Cliente cadastrado com sucesso!' });
  });
});

app.put('/api/clientes/:id', (req, res) => {
  const { nome_completo, cpf, email, telefone, endereco } = req.body;
  const query = 'UPDATE clientes SET nome_completo=?, cpf=?, email=?, telefone=?, endereco=? WHERE id=?';
  db.query(query, [nome_completo, cpf, email, telefone, endereco, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: result.affectedRows, message: 'Cliente atualizado com sucesso!' });
  });
});

app.delete('/api/clientes/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('DELETE FROM pets WHERE id_cliente=?', [clienteId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query('DELETE FROM clientes WHERE id=?', [clienteId], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ deleted: result.affectedRows, message: 'Cliente e pets relacionados excluídos com sucesso!' });
    });
  });
});


app.get('/api/pets', (req, res) => {
  const query = `
    SELECT pets.*, clientes.nome_completo AS cliente_nome 
    FROM pets 
    JOIN clientes ON pets.id_cliente = clientes.id
    ORDER BY pets.id ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/pets', (req, res) => {
  const { id_cliente, nome_pet, especie, raca, data_nascimento, observacoes } = req.body;
  if (!id_cliente || !nome_pet || !especie || !raca || !data_nascimento)
    return res.status(400).json({ error: 'Todos os campos do pet, exceto observações, são obrigatórios.' });

  const query = 'INSERT INTO pets (id_cliente, nome_pet, especie, raca, data_nascimento, observacoes) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [id_cliente, nome_pet, especie, raca, data_nascimento, observacoes || ''], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: 'Pet cadastrado com sucesso!' });
  });
});

app.put('/api/pets/:id', (req, res) => {
  const { id_cliente, nome_pet, especie, raca, data_nascimento, observacoes } = req.body;
  const query = `
    UPDATE pets SET id_cliente=?, nome_pet=?, especie=?, raca=?, data_nascimento=?, observacoes=? WHERE id=?
  `;
  db.query(query, [id_cliente, nome_pet, especie, raca, data_nascimento, observacoes || '', req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: result.affectedRows, message: 'Pet atualizado com sucesso!' });
  });
});

app.delete('/api/pets/:id', (req, res) => {
  db.query('DELETE FROM pets WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: result.affectedRows, message: 'Pet excluído com sucesso!' });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
