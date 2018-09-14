const router=require('express').Router();
const qConnections = require('../model/connections');


const getConnections = (req,res) =>{
  qConnections.find({}, function(err, data) {
    res.status(200).json({ data: data })
    //console.log(err, data, data.length);
  });
}

router.get('/connections',getConnections);

module.exports = router;
