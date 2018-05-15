# FSJS Week 1 - Our Glorious Node Project

**Outline**

* Install NodeJS
* Set up the project
* npm init
* Install core packages
* Organize the project
* "Hello World" web server

## Install NodeJS

- [Windows (http://blog.teamtreehouse.com/install-node-js-npm-windows)](http://blog.teamtreehouse.com/install-node-js-npm-windows)
- [Mac (http://blog.teamtreehouse.com/install-node-js-npm-mac)](http://blog.teamtreehouse.com/install-node-js-npm-mac)
- [Linux (http://blog.teamtreehouse.com/install-node-js-npm-linux)](http://blog.teamtreehouse.com/install-node-js-npm-linux)

## Set up the project
1. Clone the project
```
git clone https://github.com/CodeLouisville/FSJS-class-project.git
cd FSJS-class-project
```

2. Checkout `week1` locally and track it with the github version
```
git checkout --track origin/week1
```

## Start a project with `npm init`

Starting a project in node is simple:
```
npm init
```

`npm init` simply creates a `package.json` file a populates it with the answers to some questions.  You can edit it in a text editor.


## Install code packages

First, take a look at `package.json`, then run this command:
```
npm install express --save
```

Now, go back to `package.json` and look at the 'dependencies' section.
Also, a new directory has appeared: `node_modules`

The above command tells `npm` to download the [express](https://expressjs.com/) package, save it in a newly created `node_modules` directory, and then add a line in `package.json` to make note of the fact that we need 'express' for this project (that's what the `--save` part does).


## Organize this thing

When starting a project, a good practice is to lay out your directory structure and create some empty, basic files:
```
.
├── package.json
└── src
    ├── config        // application configuration
    │   └── index.js
    ├── models        // Database models
    │   └── index.js
    ├── routes        // HTTP(S) routing/controllers
    │   └── index.js
    └── server.js     // Set up server and listen on port
```

## Hello World

Open `src/config/index.js`
```javascript
// src/config/index.js

module.exports = {
  appName: 'Our Glorious Node Project',
  port: 3030
}
```

Open `src/server.js`
Pull in some needed modules
```javascript
// src/server.js

const express = require('express');
const config = require('./config');
```

Create our application object
```javascript
const app = express();
```

Tell it what to do
```javascript
app.use(function(req, res, next) {
  res.end("Hello World!");
});
```

Start the server
```javascript
app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});
```

On the command line:
```
node src/server.js
```


Test it out by going to `http://localhost:3030` in your browser.

Now, mix it up a bit.  Put this code **BEFORE** the other `app.use` bit in `src/server.js`
```javascript
app.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});
```

Visit `http://localhost:3030/doc`
Move the `/doc` route below the original `app.use` code and refresh.  What happened?

## Bonus material

### require() is a big deal
Yes it is.  The full documentation for require() (really, for Node modules in general) can be found [here (https://nodejs.org/api/modules.html)](https://nodejs.org/api/modules.html).

`require()` is what allows you to organize your code in to easy-to-understand (hopefully) directories and files, but join them all together in to a single application.

For comparison: in a browser environment, if you want to make content from multiple file available to the larger application you can 1) concatenate them all in to one file or 2) load them individually via a `<script>` tag.  Then, the objects or functions in the file need to be made available by putting them in the global scope (which is `window` in a browser) or be added to some global object (like, say, `jQuery` via a plugin);

`require()` serves that purpose on the server side by reading the contents of the file you specify, executing it, and making whatever you export available.
```javascript
// index.js
var myRandomObject = require('./myFile');

// myFile.js
module.exports = {some: {random: ['object']}};
```

### What's with all these index.js files
You will see (and create) a lot of `index.js` files in your Node lifetime.  The reason for this has to do with how `require()` behaves.

When you pass the name of a directory to `require()`, it will specifically seek out a file in that directory named `index.js` (if it doesn't find one, it looks for index.node, but that's a story for another time)


### So this can be confusing.
Your text editor may have half a dozen open tabs - all with the name `index.js`. That's annoying, but the `index.js` naming convention is there for good reason and it is an important aspect of nodejs development.

Remember, you don't HAVE to have an `index.js` file in a directory, but you should know how Node treats that file if you do.
