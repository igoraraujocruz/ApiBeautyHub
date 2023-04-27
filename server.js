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
  console.log(req.body)
  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  try {
    // Busca o usuário pelo email
    const [rows, fields] = await pool.query('SELECT * FROM users WHERE email ='+ email + ' AND password='+ password);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

    // Compara a senha com o hash armazenado no banco de dados
    const match = await bcrypt.compare(password, rows[0].password);
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
    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);

    return res.json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }




});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log(`Usuário conectado: ${socket.id}`);

  socket.on('chat message', (user, msg) => {
    console.log(`user: ${user}, message: ${msg}`);
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