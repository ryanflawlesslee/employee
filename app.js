var express     = require('express'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser');

// app = express / port on 3000
var app  = express();
var port = 3000;

// mongoose connect and global promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/emp')
        .then(
            function() {
                console.log('Successfully connected to database');
            },
            function (err) {
                console.log(err);
            }
        )

// model
var UserSchema = mongoose.Schema({
    empNum  : {type: String, required: true},
    fname   : {type: String, required: true},
    lname   : {type: String, required: true},
    email   : {type: String},
    tel     : {type: Number},
    license : {type: String},
    gender  : {type: String},
},{collection: 'employee'});

var UserModel = mongoose.model('UserModel', UserSchema);

// static at public folder
app.use(express.static(__dirname + '/public'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// apis
app.post('/api/users'       , createUser);
app.get('/api/users'        , showAllUsers);
app.delete('/api/users/:id' , deleteUser);
app.get('/api/users/:id'    , editUser);
app.put('/api/users/:id'    , updateUser);

// res functions

function updateUser(req, res, next) {
    var userId  = req.params.id;
    var user    = req.body;
    var update  = {$set : user};
    var options = {new : true};

    UserModel.findByIdAndUpdate(userId, update, options, function(err, result){
        if(err) return next(err);
        res.status(200).send(result);

    });
    
}

function editUser(req, res) {
    var userId = req.params.id;
    UserModel.findById({_id: userId})
             .then(
                 function(user) {
                     res.json(user);
                 },
                 function(err){
                     res.sendStatus(400);
                 }
             )
}


function deleteUser(req, res) {
    var userId = req.params.id;
    UserModel.remove({_id: userId})
             .then(
                 function() {
                     res.sendStatus(200);
                 },
                 function() {
                     res.sendStatus(400);
                 }
             )
}


function showAllUsers(req, res) {
    UserModel.find()
             .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.sendStatus(400);
                }
             );
}


function createUser(req, res) {
    var user = req.body;
    console.log(user);
    UserModel.create(user)
             .then(
        function(postObj){
            res.json(200);
        },
        function(error) {
            res.sendStatus(400);
        }
    );
};

// Server start
app.listen(port, function() {
    console.log('Server is connected to localhost:' + port);
})