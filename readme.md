# FSJS Week 4 - The Full Stackey

**Outline**

* Set up the project
* Render data from the server on our page
* Add POST and PUT endpoints

## Set up the project
_It should still be setup from *week 3* branch_
1. Clean the project
_If you did something you want to keep, last week, you can make a branch and commit, or copy those files out.  To continue here, we are going to grab the week4 branch._
```
cd FSJS-class-project
git status
git add .
git commit -m"My commit message"
git checkout --track origin/week4
```

2. Install dependencies
```
npm install
```

## Render data from the server
We have a nice API endpoint to spit out data (albeit static data from an array).  Let's use that in our front-end.

1. Create a new file in a new directory: `public\js\app.js`.
(We could continue to put all our javascript in `script` tags in `index.html`, but placing this code in a separate file will help keep things neat and organized)

2. Load this in to our `index.html`.  At the bottom of the file, just below the `script` tag that loads the handlebars library, add:
```html
<script src="/js/app.js"></script>
```

3. Update our jQuery template to render a file and not a BTVS character list.  Replace the `getList` function in `index.html` with the following:
```javascript
// our jquery template string
function listItemTemplate(data) {
  var compiled = '';
  data.forEach(item => {
    compiled += `
      <li class="list-group-item">
        <strong>${item.name}</strong> - ${item.description}
      </li>
    `;
  });
  return compiled;
}
```
While we are at it let's move that function over to `app.js`.

3. Let's also delete the old render code:
```
// let's setup some fake data array of javascript objects
// each javascript object has a name and a value property
const data = {
  list: [
    {name: 'iron man shirt', description: 'iron man flying high'},
    {name: 'cats-r-us', description: 'toys-r-us logo saying cats-r-us'},
    {name: 'coffee', description: 'a cup of coffee elegantly portrayed'},
    {name: 'dogs', description: 'need i say more?'},
  ],
};

// pass out data.list and then insert the generated string of html
$('#list-container').html(getList(data.list));
```

4. In `app.js`, create a function to get the file list:
```javascript
function getShirts() {
  return $.ajax('/api/shirt')
    .then(res => {
      console.log("Results from getShirts()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getShirts()", err);
      throw err;
    });
}
```

5. Create a function to refresh the list
```javascript
function refreshShirtList() {
  getShirts()
    .then(shirts => {
      const data = {shirts: shirts};
      $('#list-container').html(listItemTemplate(data.shirts));
    })
}
```
Test it out by refreshing the page, opening a debugging console, and typing `refreshShirtList()`;

6. Refresh the list automatically when the page first loads by adding  `refreshShirtList()` to the remaining `$(document).ready(function() {` function in `index.html`

## Finish What we started
1. We are going to be sending data from the client back to the server.  To do that, we will convert a plain JS object to a JSON-formatted string (really, jQuery will do that for us).  We need to set up our express server to parse that JSON string and turn it back in to an object.

Fortunately, there a library for that:
```
npm install body-parser --save
```
[[Documentation for body-parser](https://github.com/expressjs/body-parser)]

`body-parser` will look at the body of a request and, if the `Content-Type` is `application/json`, will parse the body using `JSON.parse()`.  The results of that (if successful) will be put in `req.body` for use by any middleware.

2. At the top of `server.js`, require the body-parser module:
```javascript
const bodyParser = require('body-parser');
```

3. Tell our server to use it.  In `server.js`, right AFTER we set up static files serving, add the following:
```javascript
app.use(function(req, res, next) {
  console.log("req.body BEFORE parsing", req.body);
  next();
})

app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log("req.body AFTER parsing", req.body);
  next();
})
```
Head over to postman. Create a POST request to ANY endpoint.  Tell postman that the content is JSON (use the dropdown).  Type in any valid JSON-formatted string and hit send.  You'll see the contents outputted by the two middleware we added before and after the bodyParser middleware.

4. Delete the logging middleware

5. Go back to our routes and add the POST and PUT endpoints. In `routes/index.js`, swap out the `router.put()` and `router.post()` callbacks (which were just placeholders) with the following:
```javascript
router.post('/shirt', function(req, res, next) {
  const newId = '' + SHIRTS.length;
  const data = req.body;
  data.id = newId;

  SHIRTS.push(data);
  res.status(201).json(data);
});
```
and
```javascript
router.put('/shirt/:shirtId', function(req, res, next) {
  const {shirtId} = req.params;
  const shirt = SHIRTS.find(entry => entry.id === shirtId);
  if (!shirt) {
    return res.status(404).end(`Could not find shirt '${shirtId}'`);
  }

  shirt.name = req.body.name;
  shirt.description = req.body.description;
  res.json(shirt);
});
```
