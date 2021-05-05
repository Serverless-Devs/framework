const express = require('express');
const path = require('path');
const app = express();
const apiRouter = require('./routes/index');

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err.message)
});


module.exports = app;
