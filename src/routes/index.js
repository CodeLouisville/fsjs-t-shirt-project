const router = require('express').Router();

const SHIRTS = [
    { id: 'a', name: 'Cat tree', description: 'A cute cat shirt', price: 20.0 },
    { id: 'b', name: 'iron man', description: 'tony stark in a suit', price: 10.0 },
    { id: 'c', name: 'snow man', description: 'A cool shirt', price: 12.50 },
    { id: 'd', name: 'coffee', description: 'A pick me up', price: 15.0 }
];

router.get('/shirt', function (req, res, next) {
    res.json(SHIRTS);
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