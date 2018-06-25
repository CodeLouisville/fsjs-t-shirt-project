# FSJS Week 6 - Something from Nothing

**Outline**

1. Set up for week6
2. Create form to add shirts
4. Client-side function to POST a new shirts
5. Server-side handler that creates shirt


## 1. Setup Project
1. Check out a clean week6 branch
```
cd fsjs-t-shirt-project
git status
git add .
git commit -m "My commit message"
git checkout --track origin/week6
npm install
```

**Strategy:** 
* A User will visit the site and see a form for adding a shirt.  
* Our user will use that form to add a new shirt to the database.  
* The form has fields for `name`, `description`, and `price` fields, a `Submit` and a `Cancel` button.  
* The `Submit` and `Cancel` buttons do exactly what you think they would do.  
* The `Submit` button will trigger a javascript function that grabs the data from the form and POSTs it to an API endpoint (we already have one...remember it?)
* After POSTing the data and receiving a response, the page will refresh the list of shirts.
* The `Cancel` button will clear the form without POSTing the data

## 2. Create a form

1. Where we gonna put this form?  How about somewhere below the list
```html
<div id="form-container" class="panel">
  <form id="add-shirt-form">
    <legend>Shirt</legend>
  </form>
</div>
```

2. That's cool, but maybe a little more....
```html
<div id="form-container" class="panel">
  <form id="add-shirt-form">
    <legend>Shirt</legend>
    <div class="form-group">
      <label for="shirt-name">Name</label>
      <input type="text" class="form-control" id="shirt-name" placeholder="Name">
    </div>
    <div class="form-group">
      <label for="shirt-description">Description</label>
      <input type="text" class="form-control" id="shirt-description" placeholder="Description">
    </div>
    <div class="form-group">
      <label for="shirt-price">Price</label>
      <input type="text" class="form-control" id="shirt-price" placeholder="Price">
    </div>
    <button type="button" onclick="submitShirtForm()" class="btn btn-success">Submit</button>
    <button type="button" onclick="cancelShirtForm()" class="btn btn-link">cancel</button>
  </form>
</div>
```
Reload the browser and look at our beautiful form.

3. Update the list
```javascript
// our jquery template string
function listItemTemplate(data) {
  var compiled = '';
  data.forEach(item => {
    compiled += `
      <li class="list-group-item">
        <strong>${item.name}</strong> - ${item.description} - ${item.price}
      </li>
    `;
  });
  return compiled;
}
```


4. What about those `onclick` functions?  We already know what 'cancel' should do (clear the form), but will figure out what `submit` does later.  In `app.js` add the following stubs:
```javascript
function submitShirtForm() {
  console.log("You clicked 'submit'. Congratulations.");
}

function cancelShirtForm() {
  console.log("Someone should clear the form");
}
```
Test the buttons to make sure they work....

Great! They work, but they don't do much. Let's change that, one step at a time.

5. Add the following to our `submitShirtForm` function after the `console.log` line:
  ```javascript
 function submitShirtForm() {
   console.log("You clicked 'submit'. Congratulations.");

   const shirtData = {
       name: $('#shirt-name').val(),
       description: $('#shirt-description').val(),
       price: $('#shirt-price').val()
   };

   console.log("Your shirt data", shirtData);
 }
 ```

## Fetch, our POSTing hero

We're going to POST json-formatted data to an endpoint on our server which will do all the hard work.  We already have a `POST /api/file` route, but currently it appends the file data to a static array (remember?  We never changed that).

First, we'll use fetch to POST the data, then we'll fix our POST route.

1. Add the following to our `submitShirtForm` function AFTER we create the shirtData object.
  ```javascript
  fetch('/api/shirt', {
    method: 'post',
    body: JSON.stringify(shirtData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(shirt => {
      console.log("we have posted the data", shirt);
      refreshShirtList();
    })
    .catch(err => {
      console.error("A terrible thing has happened", err);
    }) 
  ```
  If we refresh the page and test this, it will NOT work. Why?


## Now, fix the POST route handler

1. Open the shirt `src/routes/index.js` and delete everything in our `POST /shirt` handler.  It should look like this when we're done:
  ```javascript
  router.post('/shirt', function(req, res, next) {

  });
  ```

2. Instead of appending to an array, we will use our mongoose model to insert a new "shirt" in to the database.  Change the `POST /shirt` handler to the following:
```javascript
router.post('/shirt', function(req, res, next) {
    const shirtData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    };

    shirt.create(shirtData, function(err, newShirt) {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(newShirt);
    });
});
```
  [Documentation for mongoose Model.create](http://mongoosejs.com/docs/api.html#model_Model.create)

  Restart the server, go back to our website and add a new Shirt.  Our list of shirts should update.  We can reload the page and/or restart the server and we will still have our newly added shirt in the list.
  
  
 #Now let's make it pretty
 1. Add Header to list, add the following right above the `<div id="list-container"></div>` line in `index.html`
 ```javascript
<div><legend>Shirts: <span class="glyphicon glyphicon-align-left glyphicon-plus-sign" aria-hidden="true" onclick="toggleAddShirtForm()"></span></legend></div>
```

 2. Hide the form on start
```javascript
<form id="add-shirt-form" style="display: none;">
```

 3. Add `toggleAddShirtForm` to `app.js`
 ```javascript
function toggleAddShirtForm(){
    $('#add-shirt-form').toggle();
}
```

 4. Update `cancelShirtForm` to also toggle
```javascript
function cancelShirtForm() {
    toggleAddShirtForm();
}
```

