const fbPassport = require('passport');
const FBStrategy = require('passport-facebook').Strategy;
const QosilUser = require('../model/user-model');

const serializeAction = (qosilUser, done) => {
  console.log('In zz passport serializeUser.');
  const qosilSession = {
    userId: qosilUser._id,  //Qosil Connect ID
    connection: qosilUser.connection
  }
  done(null, qosilSession);
}

const deserializeAction = (qosilSession, done) => {
  console.log('In zz deserializeUser.');

  const dbUserToQosSess = (err,qosilUser) => {
      console.log('In call back action fb: dbUserToQosSess');

      const qosSess = {
        userId: qosilUser._id,
        connection: qosilUser.connection,
        token: qosilUser.token,
        tokenSecret: null
      }
      console.log('fb qosSess on save to user object.')
      console.log(JSON.stringify(qosSess));
      done(null, qosSess);
  }

  console.log('Executing query...fb dbUserToQosSess');
  QosilUser.findById(qosilSession.userId, dbUserToQosSess);
}

//partial info from db object stored to session.
fbPassport.serializeUser(serializeAction);
//partial info pulled from session to restore object from db saved to request.
fbPassport.deserializeUser(deserializeAction);

//====================================================================
const stratCallBack = (accessToken, refreshToken, profile, done) => {

  const knownUserAction = (knownUser) => {
    console.log('FB KnownUser Callback Action fired.')
    //If user is already known to us
    if(knownUser){

      //if token has expired
      if(knownUser.token != accessToken){
        console.log('Token expired');

        //criteria to target user for update
        const query = QosilUser.where({
          connectionID: knownUser.connectionID,
          connection: knownUser.connection
        });

        //update callback
        const executeUpdate = (err,updatedUser) => {
          console.log(`Number of users updated: ${updatedUser.ok}`);
          const criteria = {connectionID:profile.id, connection:'facebook'};
          QosilUser.findOne(criteria).then((knownUser)=>{
            console.log("savedUser: facebook");
            console.log(JSON.stringify(updatedUser));
            done(null, knownUser);
          });
        };

        //upate user token
        query.updateOne({$set: { token: accessToken }},executeUpdate);

      }else{
        console.log('fb knownUser token still valid.');
        done(null, knownUser);
      }
    }else{
      //New user autheticated
      const userAttributes = {
        username:profile.displayName,
        connectionID: profile.id,
        connection:'facebook',
        token: accessToken
      };

      new QosilUser(userAttributes).save().then((savedUser) =>{
        console.log('New user saved: '+ savedUser);
        done(null,savedUser);
      });
    }
  };//knownUserAction definition**

  //====================================================================
  console.log('Executing fb knownUserAction');
  const criteria = {connectionID:profile.id, connection:'facebook'};
  QosilUser.findOne(criteria).then(knownUserAction);//**
};//stratCallBack definition**

//====================================================================
const stratOpts = {
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: 'http://localhost:3000/v1/fb/return'
}

//====================================================================
fbPassport.use(new FBStrategy(stratOpts, stratCallBack));//**
//====================================================================
//module.exports = fbPassport;
