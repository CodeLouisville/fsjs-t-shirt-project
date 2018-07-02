# FSJS Week 7 - Change is the Only Constant

**Outline**

1. Set up for week7
2. Every shirt item has an edit button
3. Function to push changes to the server
3. PUT endpoint


## 1. Setup Project
1. Check out a clean week6 branch
```
cd fsjs-t-shirt-project
git status
git add .
git commit -m "My commit message"
git checkout --track origin/week7
npm install
```

**Strategy:**
* A User will visit the site and see an edit button beside each shirt.
* Clicking on this button will cause the Add shirt form to be populated with the shirt data
* Our user will use that form to edit the existing shirt.
* The `Submit` button will trigger a javascript function that grabs the data from the form and PUTs it to an API endpoint
* After PUTting the data and receiving a response, the page will refresh the list of shirts.

## 2. Add an edit button to each item.

1. We need to edit the template that outputs each shirt item.  Open `public/js/app.js` and edit the template found in the `listItemTemplate` function. Add a button to each item.
```javascript
// our jquery template string
function listItemTemplate(data) {
    var compiled = '';
    data.forEach(item => {
      compiled += `
        <li class="list-group-item">
          <strong>${item.name}</strong> - ${item.description} - ${item.price}
          <span class="pull-right">
            <button type="button" class="btn btn-xs btn-default">Edit</button>
          </span>
        </li>
      `;
    });
    compiled = `<ul class="list-group">${compiled}</ul>`;
    return compiled;
}
```

2. Add some functionality to that button.  Add an `onclick` event handler and its corresponding function.
```html
<button type="button" class="btn btn-xs btn-default" onclick="handleEditshirtClick()">Edit</button>
```

And the function goes in `/public/js/app.js`
```javascript
function handleEditShirtClick() {
  console.log("I will edit for you!");
}
```

This works, but every 'Edit' does the exact same thing when clicked.  We want a click to (eventually) fill the form with the data for a specific shirt.  We need somehow get the shirt data in to our `handleEditshirtClick()` function.  There are dozens of ways of accomplishing this.  Here's a straight-forward method:  

Add a custom attribute called `data-shirt-id` to the button.  Make the value of that attribute equal to the `_id` field of the shirt.  Pass the element (using `this`) to the `handleEditshirtClick` function and pull the `_id` field from the element.  Then use that id to find the shirt in an array.  We'll need to make sure we have an array of shirt objects available.

3. Pass the `_id` parameter to the funciton
  ```html
  <button type="button" class="btn btn-xs btn-default" onclick="handleEditShirtClick(this)" data-shirt-id="${shirt._id}">Edit</button>
  ```

  And now `console.log()` the result to show it works
  ```javascript
  function handleEditShirtClick(element) {
    const shirtId = element.getAttribute('data-shirt-id');
    console.log("I will edit for you", shirtId);
  }
  ```

  Take a look at the edit button element to see what's going on here.

4. Whenever we refresh the list of shirts (remember our AJAX call), save that array to a property on the global `window` object.  This is done in `refreshShirtList()`
```javascript
function refreshShirtList () {
  getShirts()
    .then(shirts => {
      window.shirtList = shirts;
      $('#list-container').html(listItemTemplate(shirts))
    })
}
```

5. In our `onclick` handler, retrieve the shirt using `Array.find()`
```javascript
function handleEditShirtClick(element) {
  const shirtId = element.getAttribute('data-shirt-id');

  const shirt = window.shirtList.find(shirt => shirt._id === shirtId);
  if (shirt) {
    console.log("I will edit you!", shirt);
  } else {
    console.log("Aw shucks, I didn't find", shirtId)
  }
}
```
[Documentation for Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find?v=control)

  Refresh the page and click on a few `Edit` buttons to see that it works.


6. Edit the `handleEditShirtClick()` function so that it opens the form we created last week.  When clicked, we should also populate the form with the data we wish to edit.
```javascript
function handleEditShirtClick (element) {
  const shirtId = element.getAttribute('data-shirt-id');

  const shirt = window.shirtList.find(shirt => shirt._id === shirtId)
  if (shirt) {
    $('#shirt-title').val(shirt.title);
    $('#shirt-description').val(shirt.description);
    $('#shirt-price').val(shirt.price);
  }

  showAddShirtForm();
}
```

7. Hey, what about the `_id` field?  That seems important.  Add a hidden input to the form and set that when we click edit.
```html
<form id="add-shirt-form">
  <input type="hidden" id="shirt-id" value="" />
  ...
```

```javascript
function handleEditShirtClick(element) {
  const shirtId = element.getAttribute('data-shirt-id')

  const shirt = window.shirtList.find(shirt => shirt._id === shirtId)
  if (shirt) {
    $('#shirt-name').val(shirt.name)
    $('#shirt-description').val(shirt.description)
    $('#shirt-price').val(shirt.price)
    $('#shirt-id').val(shirt._id)
  }

  showAddShirtForm()
}
```

## Two quick problems

1. We forgot to add the ability to clear the form
2. We can't really tell if we are adding or editing a shirt

We can solve the first problem by setting all the form fields to blank.
```javascript
function setForm() {
  $('#shirt-name').val('')
  $('#shirt-description').val('')
  $('#shirt-price').val('')
  $('#shirt-id').val('')
}
```

**BUT WAIT!**
That looks remarkably like the code we used in `handleEditShirtClick()`.  With a small change, we can reuse this function:
```javascript
function setForm(data) {
  data = data || {};

  const shirt = {
    name: data.name || '',
    description: data.description || '',
    price: data.price || '',
    _id: data._id || '',
  };

  $('#shirt-name').val(shirt.name);
  $('#shirt-description').val(shirt.description);
  $('#shirt-price').val(shirt.price);
  $('#shirt-id').val(shirt._id);
}
```

If we don't pass anything to setForm, all the fields get empty strings.  If we pass a shirt to the function, then the form gets populated.  Now we can use that...

...in `handleEdifShirtClick`
```javascript
function handleEditShirtClick(element) {
    const shirtId = element.getAttribute('data-shirt-id');

    const shirt = window.shirtList.find(shirt => shirt._id === shirtId);
    if (shirt) {
      setForm(shirt)
    }
    showAddShirtForm()
  }
```

... in `cancelShirtForm`
```javascript
function cancelShirtForm () {
  setForm()
  hideAddShirtForm()
}
```

...in `submitShirtForm` (to clear the data when we are done)
```javascript
function submitShirtForm() {
  console.log("You clicked 'submit'. Congratulations.");
 
  const shirtData = {
    title: $('#shirt-title').val(),
    description: $('#shirt-description').val(),
  };
 
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
      setForm();
      refreshshirtList();
    })
    .catch(err => {
      console.error("A terrible thing has happened", err);
    }) 
}
```

...and just to be complete, set the form on page load:
```javascript
$(document).ready(function () {
  refreshShirtList();
  setForm();
});
```

But what about the second problem?  Hey, we gotta solution for that too.  

**Strategy:**
Every time the form is set, check if there is an `_id` field.  
If yes, then the form is editing.  If no, then the form is adding. 
Change the form legend accordingly.

1. Add an `id` field to the legend element
```html
<legend id="form-label">Shirt</legend>
```

2. Add a little logic to `setForm` the set the legend text
```javascript
function setForm(data) {
  data = data || {};

  const shirt = {
    name: data.name || '',
    description: data.description || '',
    price: data.price || '',
    _id: data._id || '',
  };

  $('#shirt-name').val(shirt.name);
  $('#shirt-description').val(shirt.description);
  $('#shirt-price').val(shirt.price);
  $('#shirt-id').val(shirt._id);

  if (shirt._id) {
    $('#form-label').text("Edit shirt");
  } else {
    $('#form-label').text("Add shirt");
  }
}
```

Voila.

## Push our changes to the server.

  Most of the hard work on the front-end has been done.  Really, the only difference between creating a new shirt and editing an existing one is that when creating, we `POST` to the server and we don't have an `_id` field, while when editing, we `PUT` to the server AND the URL is slightly different (we add the `_id` field to the url).

  We can accomplish this by checking to see if `#shirt-id` has a value.  If it does, we are editing, if it doesn't we are creating.

1. In `submitShirtForm()` get the `#shirt-id` value and check if we are PUTting or POSTing
```javascript
function submitShirtForm() {
  console.log("You clicked 'submit'. Congratulations.");
 
  const shirtData = {
    title: $('#shirt-title').val(),
    description: $('#shirt-description').val(),
    price: $('#shirt-price').val(),
    _id: $('#shirt-id').val()
  };

  let method, url;
  if (shirtData._id) {
    method = 'PUT';
    url = '/api/shirt/' + shirtData._id;
  } else {
    method = 'POST';
    url = '/api/shirt';
  }
 
  fetch(url, {
    method: method,
    body: JSON.stringify(shirtData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(shirt => {
      console.log("we have updated the data", shirt);
      cancelShirtForm();
      refreshShirtList();
    })
    .catch(err => {
      console.error("A terrible thing has happened", err);
    }) 
}
```
That should do it, but when we try it, we get an error.  Why?


## Handle that PUT

1. In `/src/routes/index.js`, clear out our previous, Array-based `PUT /api/shirt/:shirtId` route:
  ```javascript
  router.put('/shirt/:shirtId', function(req, res, next) {

  });
  ```

2. Our strategy here is to find the shirt we're trying to edit in the database, then edit it, then save it
```javascript
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

    shirt.title = req.body.title;
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
```