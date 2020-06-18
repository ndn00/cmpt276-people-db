const express = require('express')
const path = require('path')
const db = require('./queries')
const PORT = process.env.PORT || 5000


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => { res.render('pages/index') })
  .get('/people', db.getPeople)
  .get('/people/:id', db.getPeopleById)
  .post('/people', db.createPeople)
  .put('/people/:id', db.updatePeople)
  .delete('/people/:id', db.deletePeople)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
