const express = require('express')
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyparser.json());

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const dataBase = {
    users: [
        {
            id: '123',
            name: 'john',
            gmail: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            gmail: 'sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: "",
            gamil: "john@gmail.com"
        }
    ]
}

bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
        // Store hash in your password DB.
    });
});

app.get('/', (req, res) => {
    res.send(dataBase.users)
})

app.post('/signin', (req, res) => {
    bcrypt.compare("apple", "$2b$10$iqGHJXHGoXGhGF8taYoGdOzYHKiOl9DS1WrnCct/XHHpUhXKU95AW", function (err, result) {
        // result == true
        console.log('first guess', result);
    });
    bcrypt.compare(someOtherPlaintextPassword, "$2b$10$iqGHJXHGoXGhGF8taYoGdOzYHKiOl9DS1WrnCct/XHHpUhXKU95AW", function (err, result) {
        // result == false
        console.log('second guess', result);
    });
    if (req.body.gmail === dataBase.users[0].gmail &&
        req.body.password === dataBase.users[0].password) {
        res.json("succes");
    } else {
        res.status(400).json("error")
    }
})

// bcrypt.hash(password, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
//     console.log(hash);
// });

const newLocal = '/register';
app.post(newLocal, (req, res) => {
    const { name, gmail, password } = req.body;
    dataBase.users.push({
        id: '125',
        name: name,
        gmail: gmail,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(dataBase.users[dataBase.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    dataBase.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json("not found");
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    dataBase.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json("not found");
    }
})





app.listen(3000, () => {
    console.log('app is running on port : 3000');
})