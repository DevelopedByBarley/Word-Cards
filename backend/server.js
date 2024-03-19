require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var colors = require('colors/safe');

const csrf = require('csurf');
const csrfProtection = csrf({
  cookie: true
});



const port = process.env.PORT;
const db = require('./config/database');
const userRoutes = require('./app/routes/user');
const themeRoutes = require('./app/routes/themes');
const cardRoutes = require('./app/routes/cards')
const { token } = require('./app/helpers/generateToken');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/themes', themeRoutes);
app.use('/cards', cardRoutes);
app.get('/get-token', token);
/* app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
}); */

db();


app.listen(port, () => {
  console.log(colors.green('App is listening on port ' + port));
})










/* 

app.post('', csrfProtection, (req, res) => {
  res.send('CSRF token is valid');
}); */