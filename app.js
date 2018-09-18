let express = require('express'), load = require('express-load');
let mongoose = require('mongoose');
let path = require('path');
let fs = require('fs');
let logger = require('morgan');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let cookieParser = require('cookie-parser');
let multiparty = require('multiparty');
const passport = require('passport');
let app = express();

        app.set('trust proxy', 1); // trust first proxy
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.use('/images', express.static('./public'));
        app.use(logger('dev'));  //morgan
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());


    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'access-control-allow-origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');
        //res.header('Access-Control-Expose-Headers', 'Origin, Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }

        return next();
    });

    app.get('/', function (req, res) {

        return res.send({sucess: true});
    });

    app.post('/upload', (req, res, next) => {

        let form = new multiparty.Form({maxFilesSize: 1024 * 1024 * 2});

        form.parse(req, function (err, fields, files) {

            console.log('files :'+ JSON.stringify(files));

            var old_path = files.file[0].path,
                file_size = files.file[0].size,
                index = old_path.lastIndexOf('/') + 1,
                file_name = old_path.substr(index),
                new_path = path.join(process.env.PWD, '/public/', file_name);

            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        if (err) {
                            res.status(500);
                            res.json({'success': false});
                        } else {
                            res.status(200);
                            res.json({'success': true});
                        }
                    });
                });
            });

            });

    });
//passport
    app.use(passport.initialize()); //initialise passport
    app.use(passport.session()); //utilisation des sessions(cookies)

    passport.serializeUser(function(user, cb) { //encoder un user id et l'envoyer au browser(google chrome par exemple)
        cb(null, user._id);
    });

    passport.deserializeUser(function(id, cb) { //decoder le user id et faire un find de cet id en base user pour savoir
        // qu'il est authentifier.
        _db.User.findById(id, function (err, user) {
            cb(null, user);
        });
    });
// routes
            load('db')
                .then('models')
                .into(app);

            load('controllers')
                .then('routes')
                .into(app);

            global._db = app.models;


app.listen(8080);