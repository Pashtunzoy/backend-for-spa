import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000

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
