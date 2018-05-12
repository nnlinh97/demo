
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var listUsers = require('./models/users.js').User;

var path = require('path');

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/index', function (req, res) {
    res.render('index', { data: "Hello World", name: "linhdz" });
});

var userName = 'User';
var count = 1;
for (var i = 0; i < listUsers.length; i++) {
    listUsers[i].id = userName + count;
    count++;
}

//khi goi domain khong thi no se xuat cai nay
app.get('/', function (req, res) { //phuong thuc get
    var info = {
        id: '001',
        name: 'linh',
        age: 21
    }
    res.send(info);
});
var info = {
    id: '004',
    name: 'linh dep trai',
}
app.get('/user', function (req, res) { //phuong thuc get
    var info1 = {
        id: '1512288',
        name: 'linh dep trai',
    }
    res.send(info1);
});
var users = [
    { id: '001', name: 'linh' },
    { id: '002', name: 'dep' },
    { id: '003', name: 'trai' }
];
users.push(info);
app.get('/users', function (req, res) { //phuong thuc get
    res.send(users);
});

app.get('/users/:id', function (req, res) { //phuong thuc get
    console.log(req.params);
    var temp = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === req.params.id) { //tránh đặt res.send trong vòng for
            temp = users[i];
            break;
        }
    }
    if (temp !== null)
        res.send(temp);
    else res.send('fail');
});

app.get('/users1', function (req, res) { //phuong thuc get
    console.log(req.query);
    res.send(true);
});


var MongoClient = require('mongodb').MongoClient;
// Connection URL
var url = 'mongodb://localhost:27017';
// Database Name
var dbName = 'QLNS';
app.get('/userMongo', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }

        var db = client.db(dbName);

        res.send({ result: "linh dep trai" });
    });
});
app.post('/createUser', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }

        var db = client.db(dbName);
        var userCollection = db.collection('user');
        userCollection.insertMany(listUsers).then(function (result) {
            res.send(result);
        }).catch(function (err) {
            res.send({ error: 400, message: err });
        });
    });
});
app.get('/getUser', function (req, res) {

    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }

        var db = client.db(dbName);
        var userList = db.collection('user');

        //cach viet kieu moi theo promise
        userList.find({}).toArray().then(function (result) {
            res.send(result);
        }).catch(function (err) {
            res.send({ error: 400, message: err });
        });

        //cach viet nodejs thuan
        // userList.find({}).toArray(function (err, result) {
        //     if (err)
        //         res.send({ error: 400, message: err });
        //     else res.send(result);
        // });

    });

})
app.post('/removeUser', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }

        var db = client.db(dbName);
        var userList = db.collection('user');

        //cach viet kieu moi theo promise
        userList.deleteMany({}).then(function (result) {
            res.send(result);
        }).catch(function (err) {
            res.send({ error: 400, message: err });
        });

        //cach viet nodejs thuan
        // userList.remove({}).toArray(function (err, result) {
        //     if (err)
        //         res.send({ error: 400, message: err });
        //     else res.send(result);
        // });

    });
});

app.post('/delete1User/:name', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }

        var db = client.db(dbName);
        var userList = db.collection('user');
        var name = req.params.name;

        var myquery = { "username": name };
        //cach viet kieu moi theo promise
        userList.deleteOne(myquery).then(function (result) {
            res.send(result);
        }).catch(function (err) {
            res.send({ error: 400, message: err });
        });
    });
});

app.post('/updateUser/:id', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }

        var db = client.db(dbName);
        var userList = db.collection('user');
        var id = { id: req.params.id };
        //req.body la lay object o trong body -> raw
        newvalue = { $set: { email: req.body.email, birthday: req.body.birthday, name: req.body.name } }


        userList.updateOne(id, newvalue).then(function (result) {
            res.send('updated successfully');
        }).catch(function (err) {
            res.send('update fail');
        });
    });
});

app.post('/sort/:number', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }
        var db = client.db(dbName);
        var userList = db.collection('user');
        var number = { birthdate: parseInt(req.params.number) };
        userList.find({}).sort(number).toArray().then(function (result) {
            res.send(result);
            client.close();
        }).catch(function (err) {
            res.send(err);
        });
    });
});

app.post('/login', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }
        var db = client.db(dbName);
        var userList = db.collection('user');
        var login = {
            "username": req.body.username,
            "password": req.body.password
        }
        userList.find(login).toArray().then(function (result) {
            if (result != '')
                res.send(result);
            else res.send('fail');
        }).catch(function (err) {
            res.send(err);
        });
    });
});



app.post('/newUser', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            return res.send({ error: "mongoError", message: err });
        }
        var db = client.db(dbName);
        var userList = db.collection('user');
        var login = {
            username: req.body.username,
            password: req.body.password
        }
        userList.find(login).toArray().then(function (result) {
            if (result != '')
                res.send('username đã tồn tại!!!')
            else userList.insertOne(login).then(function (result1) {
                res.send('insert thanh cong');
            }).catch(function (err) {
                res.send('insert that bai');
            });
        }).catch(function (err) {
            res.send(err);
        });
    });
});
app.listen(4200);