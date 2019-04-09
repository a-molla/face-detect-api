const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'ahmadmolla',
        password: '',
        database: 'smart-brain'
    }
})

const app = express();


app.use(bodyParser.json())
app.use(cors())

app.get('/', (req,res) => {
    console.log("heyy");
    res.send(database.users);
})

app.post('/signin', (req,res) => {

    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0]);
        }else{
            res.status(400).json('error loggin in');
        }
})



app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    bcrypt.hash(password,null,null, function(err, hash){
        console.log(hash)
    })

    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(response => {
        res.json(response)
    })
    .catch(err => res.status(400).json('UNABLE TO REGISTER'))
})

app.put('/image/', (req,res) => {
    const { id } = req.body;
    let found = true;

    database.users.forEach(user => {
        if(user.id == id){
            console.log(user.name)
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })

    if(!found){
        res.status(400).json("NOT FOUND");
    }
})


app.get('/profile/:id', (req,res) => {
    const { id } = req.params;

    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.send(user);
        }
    });

    if(!found){
        return res.status(400).send("NOT FOUND")
    }
})

app.listen(3000, () =>{
    console.log('app is running on port 3000');
})
