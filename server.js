const express = require('express');
const app = express();
const promise = require('bluebird');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const aws = require('aws-sdk');
// pg-promise initialization options:
const initOptions = {
    // Use a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,
};
const pgp = require('pg-promise')(initOptions);
const db = pgp(config);

app.use(cors());



// Session manager
app.use(session({
    secret: process.env.SECRET_KEY || 'ivegothis',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 360000
    }
}));


app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());




// let s3 = new aws.S3({
//     accessKeyId: (process.env && process.env.S3_KEY) ? process.env.S3_KEY : 'locals3key',
//     secretAccessKey: (process.env && process.env.S3_SECRET) ? process.env.S3_SECRET : 'locals3key'
//   });
  
// Step 1: This checks if (process.env && process.env.S3_KEY) exists. If it doesn, it will use process.env.S3_KEY that is assigned in Heroku
// Step 2: Otherwise it will use whatever value you need for your local host, in the above example is: 'locals3key'

app.get('/', (req, res)=>{
    res.json({succes:"success"});
})

// io.on('connection', (socket) => {
//     console.log('a user connected');
//   });

// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//     //   io.emit('chat message', msg);
//       console.log('message: ' + msg);
//     });
//   });

// http.listen(3000, ()=>{
//     console.log('listening on *:3000');
// })


// for bcrypt hashing
const saltRounds = 10;

const portNumber = process.env.PORT || 4000;




// Database connection parameters:
const config = {
    host: 'localhost',
    port: 5432,
    database: 'capstone',
    user: 'jeremy',
    password: ''
};

// Load and initialize pg-promise:

// Create the database instance:



// ---------------- Beginning of Routes ---------------- //


// -------Get ID, LAT, LNG from database ----------- //
app.get('/map', (req, res) => {
    db.query(`SELECT * FROM recording_studios WHERE recording_studios.lat = '${req.body.lat}' && recording_studios.lng = '${req.body.lng}'`)
        .then((results) => {
            db.query(`SELECT * FROM rehearsal_studios WHERE rehearsal_studios.lat = '${req.body.lat}' && rehearsal_studios.lng = '${req.body.lng}'`)
                .then((results2) => {
                    let combinedRes = { ...results, ...results2 }
                    console.log(results);
                    console.log(results2);
                    res.json(combinedRes);
                })
        });
})



// ---------- Recording Stuios ----------//
// get all items from items from recording_studio table
// ****NOT USING THE authenticatedMiddleware FUNCTIONALITY UNTIL OTHER ITEMS FROM SITE ARE WORKING****
app.get('/recording_studios', (req, res) => {
    db.query('SELECT * FROM recording_studios')
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})

// get a single item from recording_studios table
// ****NOT USING THE authenticatedMiddleware FUNCTIONALITY UNTIL OTHER ITEMS FROM SITE ARE WORKING****
app.get('/recording_studios/:id', (req, res) => {
    db.query(`SELECT * FROM recording_studios WHERE ${req.params.id} = id`)
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})

app.get('/recording_studios/:name', (req, res) => {
    db.query(`SELECT * FROM recording_studios WHERE ${req.params.zip_code} = zip_code`)
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})

//----------- Rehearsal Studios -----------------//
// get all items from rehearsal_studios table
app.get('/rehearsal_studios', (req, res) => {
    db.query('SELECT * FROM rehearsal_studios')
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})

// get a single item from rehearsal_studios table
app.get('/rehearsal_studios/:id', (req, res) => {
    db.query(`SELECT * FROM rehearsal_studios WHERE ${req.params.id} = id`)
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})


//----------- Production Studios -----------------//
// get all items from rehearsal_studios table
app.get('/production_studios', (req, res) => {
    db.query('SELECT * FROM production_studios')
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})

// get a single item from rehearsal_studios table
app.get('/production_studios/:id', (req, res) => {
    db.query(`SELECT * FROM production_studios WHERE ${req.params.id} = id`)
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})


//----------- Dance Studios -----------------//
// get all items from dance_studios table
app.get('/dance_studios', (req, res) => {
    db.query('SELECT * FROM dance_studios')
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})

// get a single item from dance_studios table
app.get('/dance_studios/:id', (req, res) => {
    db.query(`SELECT * FROM dance_studios WHERE ${req.params.id} = id`)
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})



//----Search all databases and return result -----//

app.get('/search=:id', (req, res) => {
    if (req.params.id != '') {
        db.query(`SELECT * FROM recording_studios WHERE recording_studios.name ='${req.params.id}'`)
            .then((result) => {
                db.query(`SELECT * FROM rehearsal_studios WHERE rehearsal_studios.name ='${req.params.id}'`)
                    .then((results2) => {
                        db.query(`SELECT * FROM production_studios WHERE production_studios.name = '${req.params.id}'`)
                            .then((results3) => {
                                db.query(`SELECT * FROM dance_studios WHERE dance_studios.name = '${req.params.id}'`)
                                    .then((results4) => {
                                        var combinedRes = { ...result, ...results2, ...results3, ...results4 }
                                        console.log(result);
                                        console.log(results2)
                                        console.log(results3)
                                        console.log(results4)
                                        res.json(combinedRes);
                                    });
                            });
                    });
            });
    }
    else {
        res.send("No studios match your search!");
    }
});




/*
// add item to inventory table
app.post('/inventory', (req, res) => {
    db.query(`INSERT INTO inventory (product_name, description, product_photo, price, quantity)
            VALUES('${req.body.product_name}', '${req.body.description}', '${req.body.product_photo}', '${req.body.price}', '${req.body.quantity}')`)
})

// delete an item from inventory using the 'is_deleted' column to represent this functionality. This is so we don't remove an item that may be referenced in order history, but it can be "hidden"
app.put('/inventory/:id', (req, res) => {
    db.query(`UPDATE inventory
              SET is_deleted = true
              WHERE ${req.params.id} = id`)
})
*/

// ---------------- Routes for Authentication ---------------- //

// check if user is already authenticated and has a session
app.get('/login', authenticatedMiddleware, (req, res) => {
    res.send("yah, you good to go");
})


// register a user
app.post('/register', (req, res) => {
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.password) {
        res.status(404).send("Password is required");
    } else {
        let fName = req.body.first_name;
        let lName = req.body.last_name;
        let address = req.body.address;
        let address2 = req.body.apt_num;
        let city = req.body.city;
        let state = req.body.state;
        let zip = req.body.zip;
        let email = req.body.email;
        let password = req.body.password;
        //let admin = false;

        bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            passHash = hash;
            //for postman testing....can delete
            // res.json({
            //     status: "User successfuly registered",
            //     "hash": passHash
            // })

            db.query(`INSERT INTO register ("first_name", "last_name", 
            "address", "apt_num", "city", "state", "zip", 
            "email",
            "password" ) 
            VALUES('${fName}', '${lName}', 
            '${address}', '${address2}', 
            '${city}', '${state}', '${zip}', 
            '${email}', '${passHash}')`)
            console.log("You've been registered...");
            //send redirect to main index page
            res.send('Ok');

        });
    }
})


// login for user
app.post('/login', (req, res) => {
    //console.log(req);
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.pw) {
        res.status(404).send("Password is required");
    }

    db.query(`SELECT * FROM register WHERE email = '${req.body.email}'`)
        .then((results) => {
            // json for postman test
            res.json(results);
            console.log(results);

            bcrypt.compare(req.body.password, results[0].pw, function (err, results) {
                //console.log(req.body.password, results.account_password);
                //res.send("Yay..logged in");
                //console.log(results);
                //console.log(`the results...${results[0].account_password}`);
                if (results === true) {
                    // assign results from db.query above to a session

                    req.session.user = results;

                    console.log(req.session.user);
                    res.send({
                        "message": "Ok",
                        "session": req.session.user,
                        "isAuthenticated": true
                    });
                } else {
                    res.send("Invalid Credentials");
                }
            })
        })
        .catch((err) => {
            console.log(`Error while logging in...${err}`);
        })
})


// ---------------- Functions ---------------- //

// Middleware to check if user has session
function authenticatedMiddleware(req, res, next) {
    // if user is authenticated let request pass
    if (req.session.user) {
        next();
    } else { // user is not authenticated send them to login
        console.log('Middleware check...user not authenticated');

    }
}




app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});