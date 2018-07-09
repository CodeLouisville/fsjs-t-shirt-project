const router = require('express').Router()
// Import all models
let shirt = require('../models/shirt.model.js')

router.get('/shirt', function (req, res, next) {
  shirt.find({}, function (err, shirts) {
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

  const shirt = SHIRTS.find(entry => entry.id === shirtId)
  if (!shirt) {
    return res.status(404).end(`Could not find shirt '${shirtId}'`)
  }

  res.json(shirt)
})

router.post('/shirt', function (req, res, next) {
  const shirtData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  }

  shirt.create(shirtData, function (err, newShirt) {
    if (err) {
      console.error(err)
      return res.status(500).json(err)
    }

    res.json(newShirt)
  })
})

<<<<<<< Updated upstream
router.put('/shirt/:shirtId', function (req, res, next) {
  const shirtId = req.params.shirtId

  shirt.findById(shirtId, function (err, shirt) {
    if (err) {
      console.error(err)
      return res.status(500).json(err)
    }
    if (!shirt) {
      return res.status(404).json({message: 'shirt not found'})
    }

    shirt.title = req.body.title
    shirt.description = req.body.description
    shirt.price = req.body.price

    shirt.save(function (err, savedshirt) {
      if (err) {
        console.error(err)
        return res.status(500).json(err)
      }
      res.json(savedshirt)
    })
  })
})
=======
router.put('/shirt/:shirtId', function(req, res, next) {
    const shirtId = req.params.shirtId;

    shirt.findById(shirtId, function(err, shirt) {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        if (!shirt) {
            return res.status(404).json({message: "shirt not found"});
        }

        shirt.name = req.body.name;
        shirt.description = req.body.description;
        shirt.price = req.body.price;

        shirt.save(function(err, savedshirt) {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.json(savedshirt);
        })

    })
});
>>>>>>> Stashed changes

router.delete('/shirt/:shirtId', function (req, res, next) {
  const { shirtId } = req.params
  const shirt = SHIRTS.find(entry => entry.id === shirtId)
  if (!shirt) {
    return res.status(404).end(`Could not find shirt '${shirtId}'`)
  }

  SHIRTS.splice(SHIRTS.indexOf(shirt), 1)
  res.json(SHIRTS)
})

module.exports = router
