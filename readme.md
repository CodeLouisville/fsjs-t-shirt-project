# FSJS Week 8 - Delete the negative; Accentuate the positive!

**Outline**

1. Set up for week8
2. What is a soft delete?
3. Update our model and handlers
4. Delete handler
5. Baby-step our way to a delete button


## 1. Setup Project

**Check out a clean week8 branch**
```
cd fsjs-t-shirt-project
git status
git add .
git commit -m "My commit message"
git checkout --track origin/week8
npm install
```

## 2. What is a soft delete

**Deleting Can Be Hazardous to your Health**
It is difficult to make deleting (as in, actually removing something from the database) save.  Meaning, if you give users the ability to destroy data, eventually they will do it by accident.  Without some means of recovering that data, deleting can make managers and clients sad.

**So Don't Do It**
Simply mark a database entry as `deleted` instead.  That way, you can exclude "deleted" items from your searches AND recover those items (undelete with ease).

## 3. So let's apply that idea to our model
1. In `/src/models/shirt.model.js`, update our model so that it has a `deleted` field:
```javascript
const ShirtSchema = new mongoose.Schema({
  name: { type: String },
  description: String,
  price: Number,
  created_at: { type: Date, default: Date.now },
  deleted: { type: Boolean }
});
```

2. Now make sure that our route handlers know to exclude "deleted" items. In `src/routes/index.js` update the `GET /file` handler:
```javascript
router.get('/shirt', function (req, res, next) {
  shirt.find({deleted: {$ne: true}}, function (err, shirts) {
    if (err) {
      console.log(err)
      return res.status(500).json(err)
    }

    res.json(shirts)
  })
})
```
So, why not just `{deleted: false}`?
[Documentation for Mongo's $ne operator](https://docs.mongodb.com/manual/reference/operator/query/ne/)

## 4. Let's do some deleting
1. We can now update the `DELETE /shirt/:shirtId` handler in `src/routes/index.js` to actually do something.  Since we aren't removing the file, "deleting" will basically be updating the file.  In other works `DELETE /shirt/:shirtId` will look really similar to `PUT /shirt/:shirtId`:
```javascript
router.delete('/shirt/:shirtId', function (req, res, next) {
  const shirtId = req.params.shirtId

  shirt.findById(shirtId, function (err, shirt) {
    if (err) {
      console.log(err)
      return res.status(500).json(err)
    }
    if (!shirt) {
      return res.status(404).json({message: 'Shirt not found'})
    }

    shirt.deleted = true

    shirt.save(function (err, doomedShirt) {
      res.json(doomedShirt)
    })
  })
})
```
How would you implement an `undelete` operation?

## 5. Baby-step our way through the front-end stuff
1. Make a "Delete" button appear by each file, just next to the "Edit" button.  Open `public/js/app.js` and add this just after the edit button, in `listItemTemplate`
```html
<button type="button" class="btn btn-xs btn-danger">Del</button>
```

2. Now make it do something by adding an `onclick` handler (we can copy/paste from the "Edit" button and then change it to suit our needs):
```html
<button type="button" class="btn btn-xs btn-danger" onclick="handleDeleteShirtClick(this)" data-shirt-id="${item._id}">Del</button>
```

3. Create the `handleDeleteShirtClick()` function in `public/js/app.js`:
```javascript
function handleDeleteShirtClick(element) {
  const shirtId = element.getAttribute('data-shirt-id');

  console.log("Shirt", shirtId, "is DOOMED!!!!!!");
}
```

4. Er....maybe we should ask for confirmation before doing this:
```javascript
function handleDeleteShirtClick(element) {
  const shirtId = element.getAttribute('data-shirt-id');

  if (confirm("Are you sure?")) {
    console.log("Shirt", shirtId, "is DOOMED!!!!!!");
  }
}
```

5. Much better.  Now instead of logging out a message, let's send an ajax `DELETE` message to `/shirt/:shirtId` to have the shirt deleted:
```javascript
function handleDeleteShirtClick(element) {
  const shirtId = element.getAttribute('data-shirt-id');

if (confirm("Are you sure?")) {
    deleteShirt(shirtId);
  }
}
```

6. Aaaaand we'll create that function (We can look at `submitShirtForm()` to remind ourselves how to do it):
```javascript
function deleteShirt(shirtId) {
  const url = '/api/shirt/' + shirtId;

  fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(response => {
      console.log("DOOOOOOOOOM!!!!!");
      refreshShirtList();
    })
    .catch(err => {
      console.error("I'm not dead yet!", err);
    });
}
```

## Bonus Time - Let's make it kinda prettify
1. Change the buttons to icons, this will be pretty right? in `app.js`
```html
<span class="glyphicon glyphicon-pencil" onclick="handleEditShirtClick(this)" data-shirt-id="${item._id}" style="cursor: pointer;"></span>
<span class="glyphicon glyphicon-remove" onclick="handleDeleteShirtClick(this)" data-shirt-id="${item._id}"   style="cursor: pointer;"></span>
```

More to come in finale....