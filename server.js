const express = require('express');
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.json())

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

app.get('/', (req,res) => {
    console.log("heyy");
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    
})



app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
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
