const express = require("express");
const cors = require ('cors')

const routes = require('./routes/products');

const app = express();

app.use(cors());

app.use('/api', routes);

app.listen(5000, () => {
    console.log('Servidor corriendo');
});
