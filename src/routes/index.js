const router = require('express').Router();
// Import all models
let shirt = require("../models/shirt.model.js");

router.get('/shirt', function (req, res, next) {
  shirt.find({}, function(err, shirts) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  
    res.json(shirts);
  });
});

router.get('/shirt/:shirtId', function (req, res, next) {
    const { shirtId } = req.params;
    // same as 'const shirtId = req.params.shirtId'

    const shirt = SHIRTS.find(entry => entry.id === shirtId);
    if (!shirt) {
        return res.status(404).end(`Could not find shirt '${shirtId}'`);
    }

    res.json(shirt);
});

router.post('/shirt', function(req, res, next) {
  const newId = '' + SHIRTS.length;
  const data = req.body;
  data.id = newId;

  SHIRTS.push(data);
  res.status(201).json(data);
});

router.put('/shirt/:shirtId', function(req, res, next) {
  const { shirtId } = req.params;
  const shirt = SHIRTS.find(entry => entry.id === shirtId);
  if (!shirt) {
    return res.status(404).end(`Could not find shirt '${shirtId}'`);
  }

  shirt.name = req.body.name;
  shirt.description = req.body.description;
  res.json(shirt);
});

router.delete('/shirt/:shirtId', function (req, res, next) {
  const { shirtId } = req.params;
  const shirt = SHIRTS.find(entry => entry.id === shirtId);
  if (!shirt) {
    return res.status(404).end(`Could not find shirt '${shirtId}'`);
  }

  SHIRTS.splice(SHIRTS.indexOf(shirt), 1);
  res.json(SHIRTS);
});


module.exports = router;