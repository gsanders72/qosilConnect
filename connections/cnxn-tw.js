const twPassport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const QosilUser = require('../model/user-model');

const twserializeAction = (qosilUser, done) => {
  const qosilSession = {
    userId: qosilUser._id,  //Qosil Connect ID
    connection: qosilUser.connection
  }
  done(null, qosilSession);
}

const twdeserializeAction = (qosilSession, done) => {

  const dbUserToQosSess = (err,qosilUser) => {

      const qosSess = {
        userId: qosilUser._id,
        connection: qosilUser.connection,
        token: qosilUser.token,
        tokenSecret: qosilUser.tokenSecret
      }
      done(null, qosSess);
  }

  QosilUser.findById(qosilSession.userId, dbUserToQosSess);
}

//partial info from db object stored to session.
twPassport.serializeUser(twserializeAction);
//partial info pulled from session to restore object from db saved to request.
twPassport.deserializeUser(twdeserializeAction);

//twCallback definition
const twCallback = (token, tokenSecret, profile, done) => {

  //knownUserAction definition
  const knownUserAction = (knownUser) => {
    //If user is already known to us
    if(knownUser){

      //if token has expired
      if(knownUser.token != token && knownUser.tokenSecret != tokenSecret){

        //criteria to target user for update
        const query = QosilUser.where({
          connectionID: knownUser.connectionID,
          connection: knownUser.connection
        });

        //update callback
        const executeUpdate = (err,updatedUser) => {
          const criteria = {connectionID:profile.id, connection:'twitter'};
          QosilUser.findOne(criteria).then((updatedUser)=>{
            done(null, updatedUser);
          });
        };

        //upate user token
        query.updateOne({$set: { token: token, tokenSecret: tokenSecret }},executeUpdate);

      }else{
        done(null, knownUser);
      }
    }else{
      //New user authenticated
      const userAttributes = {
        username:profile.displayName,
        connectionID: profile.id,
        connection:'twitter',
        token: token,
        tokenSecret: tokenSecret
      };

      new QosilUser(userAttributes).save().then((savedUser) =>{
        done(null,savedUser);
      });
    }
  };//knownUserAction definition**

  //====================================================================
  const criteria = {connectionID:profile.id, connection:'twitter'};
  QosilUser.findOne(criteria).then(knownUserAction);//**
};//twCallback definition**

//====================================================================
const twStrategyOpts = {
  consumerKey: process.env.TW_CONS_KEY,
  consumerSecret: process.env.TW_CONS_SECRET,
  callbackURL: "http://192.168.1.21:7863/v1/tw/return"
}

//====================================================================
twPassport.use(new TwitterStrategy(twStrategyOpts, twCallback));//**
//====================================================================
module.exports = twPassport;
