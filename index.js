let express = require('express');
let mongoose= require('mongoose');
//let bcrypt = require('bcrypt');
const app= require('./app');

//const url='mongodb+srv://osama:53164299@cluster0.vsvsp.mongodb.net/guc?retryWrites=true&w=majority';
const url='mongodb+srv://advancedLab35:advancedLab35@cluster0.a967h.mongodb.net/advancedLab35?retryWrites=true&w=majority'

mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log('Successfully Connected to The Database'));


app.listen(8080,() => console.log('API is running on http://localhost:8080/login'));