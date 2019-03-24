const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();

const database = {
    users:[
        {
            id: '123',
            name: 'john',
            email: 'john@gmail.com',
            password: 'pass',
            entries : 0,
            joined: new Date()
        },
        {
            id: '1234',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'pass',
            entries : 0,
            joined: new Date()
        }
    ]
}

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req,res) => {
    console.log("heyy");
    res.send(database.users);
})

app.post('/signin', (req,res) => {

    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json('success');
        }else{
            res.status(400).json('error loggin in');
        }
})



app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    bcrypt.hash(password,null,null, function(err, hash){
        console.log(hash)
    })

    let user = {
        id: '125',
        name: name,
        email: email,
        password: password,
        entries : 0,
        joined: new Date()
    };

    database.users.push(user);
    res.send(user);
})

app.put('/image/:id', (req,res) => {
    const { id } = req.params;
    let found = true;

    database.users.forEach(user => {
        if(user.id == id){
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
