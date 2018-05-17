# FSJS Week 2 - Our Superlative Web Page

**Outline**

* Set up the project for the front end
* Serve a static page
* Add a template engine

## Set up the project
_It should still be setup from *week 1* branch_

1. Clean the project
_If you did something you want to keep, last week, you can make a branch and commit, or copy those files out.  To continue here, we are going to grab the week2 branch._
```
cd FSJS-class-project
git status
git add .
git commit -m "My commit message"
git checkout --track origin/week2
```

2. Install dependencies
```
npm install
```

## Serve a static page
1. Create a "public" directory inside the `src` directory
```
cd src
mkdir public
```

2. Set up our express application to serve static files.
Add a reference to Node's `path` module to the top of the page in the `server.js`
```javascript
const path = require('path');
```
[[Documentation for path](https://nodejs.org/api/path.html)]

Then add the following line to `server.js` BEFORE any routes
```javascript
const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));
```
[[Documentation for Node Modules (dirname)](https://nodejs.org/api/modules.html)]
[[Guide for ExpresJS static](https://expressjs.com/en/starter/static-files.html)]

`express.static()` will search the `public` directory for a file that matches the requested path. For example: `index.html`, `img/puppy.jpg`, etc.  If there is a match, that file is streamed back to the requester, otherwise, express moves on to the next route.

3. Add an `index.html` to the public folder.
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Our Glorious Node Project</title>
  </head>
  <body>
    <h1>A wild webpage appears...</h1>

  </body>
</html>
```

4. Start the server and check that you can access a static `html` page

Note: We previously had a "Hello World" endpoint that was served when user's requested the path `/`.  That path is now unreachable, because all requests for `/` will receive `index.html`.

`/doc` still works, though.


## Add a template engine
1. We'll be using jQuery, so let's add them to our `index.html` at the end of the `<body>` tag
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```
[[Documentation for jQuery](https://api.jquery.com/)]
[[Documentation for Handlebars](http://handlebarsjs.com/reference.html)]

2. Drop a quick template in `index.html` to see how jQuery renders content:
```html
<script>
  $(document).ready(function() {
    // setup the title of the page and greeting
    const welcome = { name: "Code Louisvillains" }
    // jquery template string
    const greetingTemplate = `<p>Hello ${welcome.name}! I am a template!<p>`;
    // put the template data into the actual page
    $('body h1').first().after(greetingTemplate);
  });
</script>
```

3. Render a list of fake data.  Start by adding a place in the html to render the list after the `<h1>`:
```html
<div id="list-container"></div>
```

4. Create some fake data in another script tag, add this to the *bottom* of the `$(document).ready(function() {` before the `});`.
```javascript
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
```

5. Create a template for each list item, add this *above* the `$(document).ready(function() {`.
```javascript
// our jQuery template string
function getList(data) {
  var compiled = '';
  data.forEach(item => {
    compiled += `
      <div class="row">
        <div class="col-xs-6"><strong>${item.name}</strong></div>
        <div class="col-xs-6">${item.description}</div>
      </div>
    `;
  });
  return compiled;
}
```

6. Right below the `list` array, compile the template and render it into the container.
```javascript
// pass out data.list and then insert the generated string of html
$('#list-container').html(getList(data.list));
```

7. Refresh the page

8. Add some style in the `<head>`
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
```
