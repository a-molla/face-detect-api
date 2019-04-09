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
    db.select('email','hash').from('login')
    .where('email','=',req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json("UNABLE TO GET USER"))
        }else{
            res.status(400).json("WRONG CREDENTIALS")
        }
    })
    .catch(err => res.status(400).json("DENIED"))
})



app.post('/register', (req, res) => {
    const {email, name, password } = req.body;

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('UNABLE TO REGISTER'))
})

app.put('/image', (req,res) => {
    console.log("here")
    const { id } = req.body;
    db('users').where('id','=',id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('UNABLE TO GET ENTRIES'))
})


app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    db.select('*').from('users')
    .where({id})
    .then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('NOT FOUND')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.listen(3000, () =>{
    console.log('app is running on port 3000');
})
