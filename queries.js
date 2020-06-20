const { Pool } = require('pg');
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  connectionString: 'postgres://postgres:billduy007@localhost/assn2',
});

const getPeople = (req, res) => {
  pool.query('SELECT * FROM people ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

const getPersonById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM people WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
}

const createPerson = (req, res) => {
  const [name, size, height, type] = req.body

  pool.query('INSERT INTO people (name, size, height, type) VALUES ($1, $2, $3, $4)', [name, size, height, type]
    , (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`People added with ID: ${results.insertId}`);
    })
}

const updatePerson = (req, res) => {
  const id = parseInt(req.params.id)
  console.log(req.body);
  const [name, size, height, type] = req.body
  pool.query(
    'UPDATE people SET name = $1, size = $2, height = $3, type = $4 WHERE id = $5',
    [name, size, height, type, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`People modified with ID: ${id}`);
    }
  )
}

const deletePerson = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM people WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`People deleted with ID: ${id}`);
  })
}

module.exports = {
  getPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
  pool,
}