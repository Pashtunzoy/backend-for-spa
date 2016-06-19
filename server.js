import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 4000

app.get('*', function(req, res) {
  res.json({'Initial Message': 'Welcome to NodeJs User Crud Backend fro SPAs.'});
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`http://localhost:${port}`);
  }
});
