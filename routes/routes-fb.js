const router=require('express').Router();
const passportfb = require('../connections/cnxn-fb');
const request = require('request-promise');
//const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//auth with facebook
//pass option to access list of accounts user manages
router.get('/fb/login',
  passportfb.authenticate('facebook',{ scope: ['manage_pages'] }));

//loggout with facebook
router.get('/fb/logout',(reqest,response) => {
  //handle with passport.
  request.logout();
  response.send('logged out of facebook connection.');
});

//Error with facebook
router.get('/fb/error',(reqest,response) => {
  response.send('Error from facebook.');
});

router.get('/fb/return',
  passportfb.authenticate('facebook', { failureRedirect: '/fb/error', successRedirect: '/'}),
  (req, res) => {
    const responseMessage = {
      Status: 'Good',
      Message: 'Authenticated with Facebook.'
    }
    res.json(responseMessage);
  });

  // you'll need to have requested 'user_about_me' permissions
  // in order to get 'quotes' and 'about' fields from search
  const userFieldSet = 'name, link, is_verified, picture';
  const pageFieldSet = 'name, category, link, picture, is_verified';

router.get('/fb/search/:queryTerm-:searchType', (req, res) => {
    console.log("In Search.");
    const token = req.user.token;
    //console.log(req.user.token);
    //res.json(JSON.stringify(req.user.token));

    const  { queryTerm, searchType } = req.params;

    const options = {
      method: 'GET',
      uri: 'https://graph.facebook.com/v3.1/search',
      qs: {
        access_token: token,
        q: queryTerm,
        type: searchType,
        fields: searchType === 'page' ? pageFieldSet : userFieldSet
      }
    };

    try{
      request(options)
        .then(fbRes => {
  // Search results are in the data property of the response.
  // There is another property that allows for pagination of results.
  // Pagination will not be covered in this post,
  // so we only need the data property of the parsed response.
        console.log("In response from facebook.");
        res.send(fbRes);
          //const parsedRes = JSON.parse(fbRes).data;
          //res.json(parsedRes);
        })
      }catch(err){
        res.json(err);
      }
  });


module.exports = router;
