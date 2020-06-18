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

const getPeopleById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM people WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
}

const createPeople = (req, res) => {
  const { id, name, size, height, type } = req.body

  pool.query('INSERT INTO people VALUES ($1, $2, $3, $4, $5)', [id, name, size, height, type]
    , (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`People added with ID: ${result.insertId}`);
    })
}

const updatePeople = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body

  pool.query(
    'UPDATE people SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`People modified with ID: ${id}`);
    }
  )
}

const deletePeople = (req, res) => {
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
  getPeopleById,
  createPeople,
  updatePeople,
  deletePeople,
}