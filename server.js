const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const app = express();

const pool = require('./db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



// Rota para fazer login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  try {
    // Busca o usuário pelo email
    const [rows, fields] = await pool.query('SELECT * FROM users WHERE email = "'+ email + '"');
    // console.log(rows)
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

    // Compara a senha com o hash armazenado no banco de dados
    const match = await bcrypt.compare(password, rows[0].senha);
    if (!match) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

    // Gera um token de acesso com o ID do usuário
    const token = jwt.sign({ userId: rows[0].id }, 'segredo', { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
});

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  try {
    // Verifica se o email já está em uso
    const [rows, fields] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    // Gera o hash da senha
    const hash = await bcrypt.hash(password, 10);

    // Insere o novo usuário no banco de dados
    await pool.query('INSERT INTO users (email, senha) VALUES (?, ?)', [email, hash]);

    return res.json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }




});



// Rota para registrar uma nova reserva de lab
app.post('/register/booking/classroom', async (req, res) => {
  var { nome, dia } = req.body;
  // console.log(req.body)
  if (!nome || !dia) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  dia = dia.split('/').reverse().join('-');

  // console.log(dia);

  try {
    // Verifica se o email já está em uso
    const [rows, fields] = await pool.query('SELECT * FROM rooms WHERE nome = "'+ nome + '" ORDER BY dia DESC');
    
    if (rows.length > 0) {
      console.log(rows)
    const date1 = new Date(rows[0].dia);
    const date2 = new Date(dia);

    const diffTime = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    console.log("diferenca em dias", diffDays)

    if (diffDays < 15) {
      diffDays = 0
      return res.status(400).json({ message: 'Sua ultima reserva foi feita em menos de 15 dias.' });

    }

    if (diffDays > 31) {
      diffDays = 0
      return res.status(400).json({ message: 'Data da reserva muito antiga.' });
    }

  }

    // Insere o novo usuário no banco de dados
    await pool.query('INSERT INTO rooms (nome, sala, dia) VALUES (?, ?, ?)', [nome,'Laboratório 2',dia]);

    return res.status(201).json({ message: 'Reserva feita com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao realizar a reserva.' });
  }
});



// Rota para buscar as reservas
app.get('/buscar/booking/classroom', async (req, res) => {
  try {
    // Verifica se o email já está em uso
    const [rows, fields] = await pool.query('SELECT * FROM rooms');
    
    if (rows.length > 0) {
      console.log(rows)

  }

    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao obter as reservas.' });
  }
});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});



let messages = []

io.on('connection', (socket) => {
  // console.log(`Usuário conectado: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('chat message', (user, msg) => {


    let obj = {
      "usuario": user,
      "mesagem": msg
    }

    messages.push(obj);
    // console.log(`user: ${user}, message: ${msg}`);
    io.emit('chat message', user, msg);
  });

  socket.on('disconnect', () => {
    // console.log(`Usuário desconectado: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});