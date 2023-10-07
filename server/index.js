const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "WeGYM",
})


app.use(cors());
app.use(express.json());

const getUserRole = (username) => {
  return new Promise((resolve, reject) => {

    db.query('SELECT role FROM user WHERE username = ?', [username], (err, result) => {
      if (err) reject(err);
      else {
        if (result.length > 0) {
          resolve(result[0].role);
        } else {
          reject(new Error('Usuário não encontrado'));
        }
      }
    });
  });
};


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ error: 'Token não fornecido' });
  }
};

app.post('/register', (req, res) => {
  const { email, senha, nome, sobrenome, sexo, idade } = req.body;
  const role = 'user';
  bcrypt.hash(senha, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Erro interno do servidor' });
    } else {
      const SQL = "INSERT INTO user (user, pass,role, nome, sobrenome,sexo,idade) VALUES (?,?,?, ?,?,?,?)";
      const data = [email, hash, role, nome, sobrenome, sexo, idade];

      db.query(SQL, data, (dbErr, result) => {
        if (dbErr) {
          console.error(dbErr);
          res.status(500).send({ error: 'Erro interno do servidor' });
        } else {
          res.status(200).json({ message: 'Usuário registrado com sucesso' });
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { user, pass } = req.body;
  const SQL = "SELECT * FROM user WHERE user = ?";

  db.query(SQL, [user], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'Erro interno do servidor' });
    }

    if (result.length > 0) {
      const storedHash = result[0].pass;
      const nome = result[0].nome;
      const sobrenome = result[0].sobrenome;
      const id = result[0].id;
      const role = result[0].role;
      const idade = result[0].idade;
      const sexo = result[0].sexo;
      bcrypt.compare(pass, storedHash, (compareErr, match) => {
        if (compareErr || !match) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ user: user }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token, user, nome, sobrenome, id, role, idade, sexo });
      });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
});

app.get('/treinos/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'select * from treinos where aluno = ' + id;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('erro');
      return;
    }
    res.status(200).send(rows);
  })
})
app.get('/treinosA/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'select * from treinos where aluno = ' + id + ' and treino = "A"';
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('erro');
      return;
    }
    res.status(200).send(rows);
  })
})
app.get('/treinosB/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'select * from treinos where aluno = ' + id + ' and treino = "B"';
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('erro');
      return;
    }
    res.status(200).send(rows);
  })
})

app.post('/save-date', (req, res) => {
  const { selectedDate, user, duration, calories } = req.body;
  console.log(selectedDate);
  // Execute a lógica para salvar a data no banco de dados MySQL usando o pacote mysql2
  const query = "INSERT INTO datas (data,user,duration,calories) VALUES (STR_TO_DATE(?, '%d/%m/%Y'), ?,?,?);";
  db.query(query, [selectedDate, user, duration, calories], (err, result) => {
    if (err) {
      console.error('Erro ao salvar a data:', err);
      res.status(500).json({ error: 'Erro ao salvar a data.' });
      return;
    }

    res.status(200).json({ message: 'Data salva com sucesso.' });
  });
});


app.post('/delete-date', (req, res) => {
  const { selectedDate, user } = req.body;
  console.log(selectedDate);
  // Execute a lógica para salvar a data no banco de dados MySQL usando o pacote mysql2
  const query = "delete from datas where user = ? and data = (STR_TO_DATE(?, '%d/%m/%Y'))";
  db.query(query, [user, selectedDate], (err, result) => {
    if (err) {
      console.error('Erro ao salvar a data:', err);
      res.status(500).json({ error: 'Erro ao salvar a data.' });
      return;
    }

    res.status(200).json({ message: 'Data excluida com sucesso.' });
  });
});

app.post('/get-date', (req, res) => {
  const { user } = req.body;
  // Execute a lógica para salvar a data no banco de dados MySQL usando o pacote mysql2
  const query = "SELECT * FROM datas WHERE user = ?";
  db.query(query, [user], (err, result) => {
    if (err) {
      console.error('Erro ao salvar a data:', err);
      res.status(500).json({ error: 'Erro ao salvar a data.' });
      return;
    }
    res.status(200).json(result);
  });
});



app.listen(5000, () => {
  console.log("Server init");
})
