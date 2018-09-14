const router=require('express').Router();
const twPassport = require('../connections/cnxn-tw');
const Twitter = require("twitter-promise");
//const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//auth with twitter
//pass option to access list of accounts user manages
const rteOptions = { failureRedirect: '/tw/error', successRedirect: '/'};
const message = { status:'', code:'', description:''};

router.get('/tw/login', twPassport.authenticate('twitter', rteOptions));

//loggout with facebook
router.get('/tw/logout',(reqest,response) => {
  request.logout();
  message.status = 'OK';
  message.code = '0';
  message.description = 'logged out of twitter connection.';
  response.json(message);
});

//Error with Twitter
router.get('/tw/error',(reqest,response) => {
  response.send('Error from Twitter.');
});

router.get('/tw/return',
  twPassport.authenticate('twitter', { failureRedirect: '/tw/error', successRedirect: '/'}));

router.get('/tw/trends/:woeid',
      //twPassport.authenticate('twitter', { failureRedirect: '/tw/error'}),
      (req, res) => {
        const  woeid = req.params.woeid;
        const tw = {
                    consumer_key: process.env.TW_CONS_KEY,
                    consumer_secret:  process.env.TW_CONS_SECRET,
                    token: req.user.token,
                    token_secret: req.user.tokenSecret
                  };
        const twitter = new Twitter(tw);
        const options = {
          path: 'trends/place',
          params: { id : woeid }
        };

        twitter.get(options).then((twRes) => {
          //console.log("In response from twitter");
          //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
          //console.log(twRes);
          //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
          res.json(twRes);
          //res.send(twRes);
          //const parsedRes = JSON.parse(fbRes).data;
          //res.json(parsedRes);
        }).catch(err => {
            res.json(err);
        });
  });


module.exports = router;
