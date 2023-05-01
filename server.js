const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'messenger_app',
  password: 'triride3007',
  port: 5432,
});

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', async (message) => {
    console.log('Message received: ', message);
    const result = await pool.query('INSERT INTO messages(message) VALUES($1) RETURNING *', [message]);
    const savedMessage = result.rows[0];
    io.emit('message', savedMessage);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
