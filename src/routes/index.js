const router = require('express').Router()
// Import all models
let Shirt = require('../models/shirt.model.js')

router.get('/shirt', function (req, res, next) {
  Shirt.find({ deleted: { $ne: true } }, function (err, shirts) {
    if (err) {
      console.log(err)
      return res.status(500).json(err)
    }

    res.json(shirts)
  })
})

router.get('/shirt/:shirtId', function (req, res, next) {
  const { shirtId } = req.params
  // same as 'const shirtId = req.params.shirtId'

  Shirt.findById(shirtId, function(err, shirt) {
    if(err) {
      return res.status(500).json(err);
    }

    res.json(shirt);
  })
})

router.post('/shirt', function (req, res, next) {
  const shirtData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  }

  Shirt.create(shirtData, function (err, newShirt) {
    if (err) {
      console.error(err)
      return res.status(500).json(err)
    }

    res.json(newShirt)
  })
})

router.put('/shirt/:shirtId', function (req, res, next) {
  const shirtId = req.params.shirtId;

  Shirt.findById(shirtId, function (err, shirt) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!shirt) {
      return res.status(404).json({ message: "shirt not found" });
    }

    shirt.name = req.body.name;
    shirt.description = req.body.description;
    shirt.price = req.body.price;
    shirt.deleted = req.body.deleted;

    shirt.save(function (err, savedshirt) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedshirt);
    })

  })
});

router.delete('/shirt/:shirtId', function (req, res, next) {
  const shirtId = req.params.shirtId

  Shirt.findById(shirtId, function (err, shirt) {
    if (err) {
      console.log(err)
      return res.status(500).json(err)
    }
    if (!shirt) {
      return res.status(404).json({ message: 'Shirt not found' })
    }

    shirt.deleted = true;

    shirt.save(function (err, doomedShirt) {
      res.json(doomedShirt)
    })
  })
})

module.exports = router
