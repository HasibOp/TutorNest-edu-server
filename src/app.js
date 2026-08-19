const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);


app.get('/', (req, res) => {
    res.send('TutorNest is running')
})

module.exports =  app;