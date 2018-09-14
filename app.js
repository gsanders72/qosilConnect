const exp = require('express');
const app = exp();
//const fbRts = require('./routes/routes-fb');
const twRts = require('./routes/routes-tw');
const qcRts = require('./routes/routes-qc');
//const fbPassports = require('./connections/cnxn-fb');
const twPassports = require('./connections/cnxn-tw');
const mongoose = require('mongoose');
const expSession = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan('combined'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(expSession({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
 }));

mongoose.connect(process.env.MONGODB_CNXN_STRING, { useNewUrlParser: true }, () => {
  console.log('Connected to MongoDB Shawty...');
});

// Initialize Passport and restore authentication state, if any, from the
// session.

app.use(twPassports.initialize());
app.use(twPassports.session());

//Use Routes.
///To Do: protect routes with authentication using JWT
//app.use('/v1/',fbRts);
app.use('/v1/',twRts);
app.use('/v1/',qcRts);

/*
const handleTwitterPromiseError = (error, req, res, next) => {
  const { twitterError } = require('twitter-promise');
  const message = { status:'', code:'', description:''};
  if (error instanceof twitterError) {
    message.description = error.message;
    message.status = 'Error';
    message.code = 500;
    return res.status(400).json(message);
  }
  next(error);
}

app.use(handleTwitterPromiseError);
*/

app.get('/',function (req,res) {
  res.status(200).send(`Welcome to Qosil Connect ${req.user ? req.user.userId + "on " + req.user.connection: '<<Error>>'}.`);
  //response.end();

})



app.listen(7863,() => {
  console.log('Qosil Connect App is running.');
});
