const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const multer = require('multer');
const fs = require('fs');

const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { username } = req.params;
    const uploadPath = `./uploads/${username}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
app.use(cors());

app.get('/get_person/:id', (req, res) => {
  const sql = 'SELECT * FROM person WHERE id = ' + req.params.id;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
    res.status(200).send(rows);
  })
})

app.get('/get_measures/:id', (req, res) => {
  const sql = 'SELECT m.* FROM measure m JOIN user u ON m.person = u.id WHERE m.person =' + req.params.id;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
    res.status(200).send(rows);
  })
})


app.get('/get_last_measures/:id', (req, res) => {
  const sql = 'SELECT * FROM measure m WHERE m.person =' + req.params.id + ' ORDER BY m.id DESC LIMIT 1';
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
    res.status(200).send(rows);
  })
})

app.get('/get_espec_measures/:id', (req, res) => {
  const sql = 'SELECT * FROM measure WHERE id = ' + req.params.id + '';
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
    res.status(200).send(rows);
  })
})

app.get('/get_all_measures/:id', (req, res) => {
  const sql = "SELECT id, DATE_FORMAT(measureDate, '%d/%m/%Y') AS data, percentage, weight FROM measure WHERE measure.person = " + req.params.id;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500);
      return;
    }
    res.status(200).send(rows);
  })
})
const upload = multer({ storage: storage });


app.post('/set_measure/:username', upload.single('photo'), (req, res) => {
  const { username } = req.params;
  const {
    person,
    BF,
    IMC,
    abdomen,
    hips,
    leftArm,
    leftCalf,
    leftForearm,
    leftThigh,
    measureDate,
    neck,
    rightArm,
    rightCalf,
    rightForearm,
    rightThigh,
    weight,
  } = req.body;

  console.log(req.file);

  const tempImagePath = req.file.path;
  const dateOfMeasurement = new Date().toISOString().slice(0, 10);
  const newFileName = `${dateOfMeasurement}-${username}.jpg`;
  const newFilePath = path.join('./uploads/', username, newFileName);

  fs.rename(tempImagePath, newFilePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao renomear o arquivo.' });
    }

    const measurementData = {
      person,
      measureDate,
      weight,
      neck,
      abdomen,
      hips,
      leftArm,
      rightArm,
      leftForearm,
      rightForearm,
      leftThigh,
      rightThigh,
      IMC,
      percentage: BF,
      rightCalf,
      leftCalf,
      file: newFilePath,
      chest: 0
    };

    const sql = 'INSERT INTO measure SET ?';
    db.query(sql, measurementData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao salvar os dados da medição no banco de dados.' });
      }

      res.status(201).json({ message: 'Medição criada com sucesso.', measurement: measurementData });
    });
  });
});

const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "WeGYM",
})


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
  const { email, senha, nome, sobrenome, sexo, idade, altura } = req.body;
  const role = 'user';
  bcrypt.hash(senha, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Erro interno do servidor' });
    } else {
      const SQL = "INSERT INTO user (user, pass,role, nome, sobrenome,sexo,idade,altura) VALUES (?,?,?, ?,?,?,?,?)";
      const data = [email, hash, role, nome, sobrenome, sexo, idade, altura];

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
      const altura = result[0].altura;

      bcrypt.compare(pass, storedHash, (compareErr, match) => {
        if (compareErr || !match) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ user: user }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token, user, nome, sobrenome, id, role, idade, sexo, altura });
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

app.post('/salvar-treinos', (req, res) => {
  const { selectedWorkouts, id, nome } = req.body;
  // Itere pelos treinos selecionados e insira-os na tabela
  selectedWorkouts.forEach((treino) => {
    const { title, content, category, backgroundImage, video } = treino;
    const query = 'INSERT INTO treinos (title, content, category, backgroundImage,nome, video,user) VALUES (?,?,?, ?, ?, ?, ?)';

    db.query(query, [title, content, category, backgroundImage, nome, video, id], (err, results) => {
      if (err) {
        console.error('Erro ao inserir treino:', err);
      }
    });
  });

  // Responder com uma mensagem de sucesso
  res.json({ message: 'Treinos salvos com sucesso!' });
});

app.get('/obter-treinos/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário não fornecido.' });
  }

  // Consulta SQL para selecionar os treinos de um usuário específico
  const query = 'SELECT title, content, category, backgroundImage,video,nome FROM treinos WHERE user = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao consultar treinos:', err);
      return res.status(500).json({ message: 'Erro ao consultar treinos.' });
    }

    // Retorna os treinos como uma resposta JSON
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Server init");
})
