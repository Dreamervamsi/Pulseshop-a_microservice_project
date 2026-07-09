import express from 'express';

const app = express();

// middleware
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true}));

// routes

export default app;