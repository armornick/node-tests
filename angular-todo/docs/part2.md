[Source](https://scotch.io/tutorials/node-and-angular-to-do-app-application-organization-and-structure "Permalink to Node and Angular To-Do App: Application Organization and Structure")

# Node and Angular To-Do App: Application Organization and Structure

This article will look into best practices for laying out and organizing a Node and Angular (MEAN stack) app.

In the process of extending our Node and Angular To-Do App with authorization, I ran into a problem: the tutorial was going to be huge. In our first tutorial, we placed everything (variables, configuration, models, routes, and more) in our `server.js` file. While this is fine for demonstration purposes and small Node applications, it wasn't going to work with how far we wanted to take this To-Do app.

**Demo:** The demo will be the same as the first demo. The underlying code will be different however.

## Application Structure

The structure of the files in our application is very important. It can help us expand and grow the app as we will inevitably get more and more popular (hopefully), or it could make coming back to the code an absolute nightmare.

There are so many different ways to lay out a MEAN (MongoDB, Express, Angular, Node) app, and the tutorials online show that. This tries to lean close to best practices and the best ideas taken from many of those MEAN stack tutorials.

In this article, we'll look at how we can separate the core functions of our app into a sensible and sane file structure. Let's begin.

## Our Current Application

Since this is an extension of our first article, we will be using the same code. If you haven't done so already, [download][1] that code so you can follow along, or if you have a ton of RAM in that brain of yours (or good memory), just read on through.

The code from the first article isn't really necessary if you don't want to pull it down. The concepts still apply to any MEAN application.

Our application **stores all functionality in server.js**. Here is our current file structure:

    <!-- old file structure -->

        - public            <!-- holds all our files for our frontend angular application -->
        ----- core.js       <!-- all angular code for our app -->
        ----- index.html    <!-- main view -->
        - package.json      <!-- npm configuration to install dependencies/modules -->
        - server.js         <!-- Node configuration -->

Here is our server.js. Super long and could get confusing to read through in the future.

    <!-- server.js -->

    // set up ======================================================================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var port = process.env.PORT || 8080;

    // configuration ===============================================================

    mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // define model ================================================================
    var Todo = mongoose.model('Todo', {
        text : String,
        done : Boolean
    });

    // routes ======================================================================

        // api ---------------------------------------------------------------------
        // get all todos
        app.get('/api/todos', function(req, res) {
            ...
        });

        // create todo and send back all todos after creation
        app.post('/api/todos', function(req, res) {
            ...
        });

        // delete a todo
        app.delete('/api/todos/:todo_id', function(req, res) {
            ...
        });

        // application -------------------------------------------------------------
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });

    // listen (start app with node server.js) ======================================
    app.listen(port);
    console.log("App listening on port " + port);

This single file approach is obviously not idea for expanding our app.

### Moving Forward

In the future, we want our app to-do cool things like:

* Creating more models
* Have custom configs
* Authentication using Passport for local, Facebook, and Google
* Real time updating with Socket.io
* and so much more…

In order for that to happen, we will need to move some parts around so that each section is extendable. We want flexibility to add more models, config options, features, routes, and whatever else easily.

## New File Structure

We will show off an overview of what our site structure will move to and then go through each part and explain it. **Our app will function the same as before**, it will just be better set up for the future.

    <!-- new file structure -->

        - app               <!-- holds all our files for node components (models, routes) -->
        ----- models
        ---------- todo.js  <!-- defines the todo model -->
        ----- routes.js     <!-- all routes will be handled here -->

        - config            <!-- all our configuration will be here -->
        ----- database.js

        - public            <!-- holds all our files for our frontend angular application -->
        ----- core.js       <!-- all angular code for our app -->
        ----- index.html    <!-- main view -->

        - package.json      <!-- npm configuration to install dependencies/modules -->
        - server.js         <!-- Node configuration -->

This file structure took a lot of inspiration from [mean.io][2] and [Express][3]. Those both have a more complex file structure and inner workings. This will be much simpler to show off the basic concepts of file separation.

### Config, Models, and Routes

Our old application had everything in `server.js`. You can imagine how large this one file would become. We'll go through that file and move everything out one by one.

## Database Config config/database.js

Connecting to our database is currently handled in `server.js` in the **configuration** section.

    // server.js (old)
    ...

        mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

    ...

Let's separate out the URL for connecting to the database into our **config/database.js**.

    // config/database.js

        module.exports = {
            url : 'mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'
        };

Now in our `server.js`, we can pull that database config.

    // server.js (new)

        // load the config
        var database = require('./config/database');

        mongoose.connect(database.url);     // connect to mongoDB database on modulus.io

**Why do this?** I know it seems a little useless since it's only the one configuration setting. It will pay off in the future though when we have multiple settings across multiple files (auth, database, application, environment).

__ **Understanding module.exports:** module.exports allows you to pass data from one file to another. Just using `require('./config/database')` doesn't automagically give you access to those variables. module.exports exposes those variables (or functions or anything else) to other files. For a more thorough understanding, there's this [great article][4] by Karl Seguin.

There are many different ways to use module.exports, and we'll be sure to write up an article in the future for all the ways to use it. Now that our config is separated out, we'll move onto the models.

## Model app/models/todo.js

Here is our old code for the todo model in our giant `server.js`.

    // server.js (old)
    ...

        // define model ================================================================
        var Todo = mongoose.model('Todo', {
            text : String,
            done : Boolean
        });

    ...

We'll move our current models entirely out of `server.js`. In our new **app/models/todo.js**, let's use module.exports and expose our Todo mongoose model to the file that needs it whenever it is loaded using **require**.

    // app/models/todo.js

        // load mongoose since we need it to define a model
        var mongoose = require('mongoose');

        module.exports = mongoose.model('Todo', {
            text : String,
            done : Boolean
        });

Since this model is used by our **routes** in `server.js`, and we are moving the routes out of server.js into `app/routes.js`, we won't need to load the model there. **We will load this model in the app/routes.js file**. Just remove the lines for defining the model in server.js.

With models out of the main server.js file, our file is that much cleaner. The bulk of the code is the routes however and we'll get that separated out next.

## Routes app/routes.js

We are going to move all of the routes in `server.js` out to the **app/routes.js** file. I personally prefer to hold all routes in a single file. This let's me see a top down view of my entire application without having to dig through other files. If any of my routes start getting overly code heavy, I'll move that code into a controller and load the controller in the routes.

Of course, this is up to your own preference to separate routes into separate files or into controllers. Some people like to separate the different routes into different files (ie api, auth, application).

Here's our old code that we'll move out of server.js.

    // server.js (old)

    // this file condensed since there's so much code

    ...

    // routes ======================================================================

        // api ---------------------------------------------------------------------
        // get all todos
        app.get('/api/todos', function(req, res) {

            ...

        });

        // create todo and send back all todos after creation
        app.post('/api/todos', function(req, res) {

            ...

        });

        // delete a todo
        app.delete('/api/todos/:todo_id', function(req, res) {

            ...

        });

        // application -------------------------------------------------------------
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });

    ...

Move all of that code out of `server.js` and let' go over to our `app/routes.js` file.

We will **load our todo model**, and use module.exports to **expose the routes to our app**.

    // app/routes.js

    // load the todo model
    var Todo = require('./models/todo');

    // expose the routes to our app with module.exports
    module.exports = function(app) {

        // api ---------------------------------------------------------------------
        // get all todos
        app.get('/api/todos', function(req, res) {

            ...

        });

        // create todo and send back all todos after creation
        app.post('/api/todos', function(req, res) {

            ...

        });

        // delete a todo
        app.delete('/api/todos/:todo_id', function(req, res) {

            ...

        });

        // application -------------------------------------------------------------
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });

    };

Now that we've defined our routes file, we'll just load that in our `server.js` and pass in our **app** variable to the function. This way the routes file has access to **app** and **express**. Now the routes we have defined are accessible in our server.js file thanks to module.exports.

    // server.js
    ...

        // load the routes
        require('./app/routes')(app);

    ...

That's it for the routes. That's it for everything actually.

## Clean App, Clean Mind

Look at how clean our `server.js` is now.

    // server.js (final)

        // set up ======================================================================
        var express  = require('express');
        var app      = express();                               // create our app w/ express
        var mongoose = require('mongoose');                     // mongoose for mongodb
        var port     = process.env.PORT || 8080;                // set the port
        var database = require('./config/database');            // load the database config
            var morgan = require('morgan');             // log requests to the console (express4)
        var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
        var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

        // configuration ===============================================================
        mongoose.connect(database.url);     // connect to mongoDB database on modulus.io

        app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
        app.use(morgan('dev'));                                         // log every request to the console
        app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                                     // parse application/json
        app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        app.use(methodOverride());

        // routes ======================================================================
        require('./app/routes.js')(app);

        // listen (start app with node server.js) ======================================
        app.listen(port);
        console.log("App listening on port " + port);

Compare that to the giant monster it used to be. That might be a bit of an exaggeration, but still, cleaner is better. Now we've moved **configuration**, **models**, and **routes** into their own separate files. Separation never felt so good.

Notice how everything in our public folder didn't have to change. Our Angular side of our application, the frontend, didn't have to change one bit. The separation of duties we established in our first app holds strong here. Node is the API level backend and Angular is the separate frontend.

If anyone has any suggestions, I'd be happy to hear them. I'm still on the long search for best practices in all things MEAN stack so any improvements are welcome.

## Moving Forward

Stay on the lookout for the next articles in this series. We'll be going over Authentication with Passport next. We'll be able to authenticate our users locally, with Facebook, or using Google.

[1]: https://github.com/scotch-io/node-todo/archive/v1.0.zip
[2]: http://mean.io
[3]: http://expressjs.com/guide.html
[4]: http://openmymind.net/2012/2/3/Node-Require-and-Exports/