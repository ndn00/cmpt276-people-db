const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const db = require('./queries')
const PORT = process.env.PORT || 5000


express()
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({ extended: false, })
  )
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  })
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => { res.render('pages/index') })
  .get('/people', db.getPeople)
  .get('/people/:id', db.getPersonById)
  .post('/people', db.createPerson)
  .put('/people/:id', db.updatePerson)
  .delete('/people/:id', db.deletePerson)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
