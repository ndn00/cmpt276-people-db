const { Pool } = require('pg');
const { type } = require('jquery');
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  connectionString: 'postgres://postgres:billduy007@localhost/assn2',
});

var currentSelect = "";


const getPeople = (req, res) => {
  currentSelect = 'SELECT * FROM people ORDER BY id DESC ';
  pool.query(currentSelect, (error, results) => {
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

// const getPeopleByFilter = (req, res) => {
//   const name = req.params.name;
//   const size = parseInt(req.params.size);
//   const height = parseInt(req.params.height);
//   const type = req.params.type;
//   var cnt = 1;
//   console.log(name);
//   console.log(size);
//   console.log(height);
//   console.log(type);
//   console.log(desc);
//   var list = [];

//   currentSelect = 'SELECT * FROM people WHERE ';
//   if (name != 'undefined') {
//     currentSelect += 'name = $' + cnt.toString() + ' ';
//     cnt++;
//     list.push(name);
//   }
//   if (!isNaN(size)) {
//     currentSelect += 'AND size = $' + cnt.toString() + ' ';
//     cnt++;
//     list.push(size);
//   }
//   if (!isNaN(height)) {
//     currentSelect += 'AND height = $' + cnt.toString() + ' ';
//     cnt++;
//     list.push(height);
//   }
//   if (type != 'undefined') {
//     currentSelect += 'AND type = $' + cnt.toString() + ' ';
//     cnt++;
//     list.push(type);
//   }
//   if (cnt == 1) {
//     currentSelect = 'SELECT * FROM people ';
//   }
//   console.log(currentSelect);
//   pool.query(currentSelect, list, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows);
//   })
// }

const getPeopleByFilter = (req, res) => {
  const name = req.params.name;
  const size = parseInt(req.params.size);
  const height = parseInt(req.params.height);
  const type = req.params.type;
  var cnt = 1;
  console.log(name);
  console.log(size);
  console.log(height);
  console.log(type);
  var list = [];

  currentSelect = 'SELECT * FROM people WHERE ' +
    ((name != 'undefined') ? ('name = \'' + name + '\' AND ') : '') +
    ((!isNaN(size)) ? ('size = ' + size + ' AND ') : '') +
    ((!isNaN(height)) ? ('height = ' + height + ' AND ') : '') +
    ((type != 'undefined') ? ('type = \'' + type + '\'') : '');
  currentSelect.trim();
  var tmp = currentSelect.split(' ');
  console.log(tmp);
  while (tmp[tmp.length - 1] == 'WHERE' || tmp[tmp.length - 1] == 'AND' || tmp[tmp.length - 1] == '') {
    tmp.pop()
  }
  currentSelect = tmp.join(' ');
  console.log(currentSelect);
  pool.query(currentSelect, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
}
const getCurrSorted = (req, res) => {
  const col = req.params.col;
  const order = req.params.order;

  console.log(col + ' ' + order);
  var sortBy = ' ORDER BY ' + col + ' ' + order;
  console.log(sortBy);

  pool.query(currentSelect + sortBy, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};
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
  getPeopleByFilter,
  getCurrSorted,
  createPerson,
  updatePerson,
  deletePerson,
  pool,
}