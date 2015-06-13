[Source](https://scotch.io/tutorials/node-and-angular-to-do-app-controllers-and-services "Permalink to Node and Angular To-Do App: Controllers and Services")

# Node and Angular To-Do App: Controllers and Services

  
In the last part of our [Node and Angular To-Do App][1] Series, we played mostly on the Node side of things dealing with application organization and structure. Today we will be handling the Angular side of things.

Here is what we'll be doing:

* **Organizing**: Moving our Angular $http elements into a separate _services_ file.
* **Services**: Creating a service for our Todos
* **Controllers**: Moving our entire controller into its own file so its not a global controller.
* Upgrading our app to Angular 1.2.4 from 1.0.8 (just link to the new version)
* Fixing a little bug where a user could hold down the enter button keep creating the same Todo

This entire article will be on the frontend of our application. We used Node to create our backend RESTful API and that will not change. This is the beauty of creating an API. Frontend and backend remain independent of each other. This will also be great in the future if we ever want to use our API to build more than just a website. Maybe we would want to create a mobile app or something else in the future.

Let's get started with some basic organization for our app. Nowhere near as extensive as what we did for Node. We'll just be moving our javascript files and Angular modules into separate files.

## Organizing Our Application

Before, we had all of our Angular code in one `core.js` file. This isn't what we want moving forward. We want our application to be **modular** so that our controller and all of our $http requests are in their own files.

**Why modular?** Having all of your functionality in different modules helps for many reason.
* The overall layout of your application is easier to understand.
* You can see how the parts work together since modules have to be injected before use.
* Code is reusable since all of the necessary functionality is contained inside the module.
* Testing your code is much easier

## Application Files

For this tutorial, we will only be looking in our applications `public` folder since that's where all the frontend code lives.

Here is how we want our new public file structure to look.

    -- public
    -------- js
    -------------- controllers
    --------------------- main.js
    -------------- services
    --------------------- todos.js
    -------------- core.js
    -------- index.html

Let's go ahead and open up our `index.html` file and load up the files we need. We will also upgrade our Angular 1.0.8 to 1.2.4.

    <!-- index.html -->
    ...
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular.min.js"></script><!-- load angular 1.2.4 -->

        <script src="https://scotch.io/js/controllers/main.js"></script> <!-- load up our controller -->
        <script src="https://scotch.io/js/services/todos.js"></script> <!-- load our todo service -->
        <script src="https://scotch.io/js/core.js"></script> <!-- load our main application -->

    </head>
    ...

There are many changes from 1.0.8 to 1.2.x, but they don't seem to affect our app. If you want to see a full changelog, visit the [migration guide][2].

## To-do Service js/services/todos.js

Let's create our service. The to-do service is meant to interact with our Node API. We want to have all the code to **get**, **create**, or **delete** a to-do inside our service. This ensures that we can test this code separate of our overall application. Let's get all that $http code out of our main application file (core.js).

    // js/services/todos.js
    angular.module('todoService', [])

        // super simple service
        // each function returns a promise object
        .factory('Todos', function($http) {
            return {
                get : function() {
                    return $http.get('/api/todos');
                },
                create : function(todoData) {
                    return $http.post('/api/todos', todoData);
                },
                delete : function(id) {
                    return $http.delete('/api/todos/' + id);
                }
            }
        });

That's all there is to it. We have defined our service using `.factory` with three different functions. `get`, `create` and `delete` will all return **promise objects** that we can use in our controller.

**Declaring Services** There are many different ways to declare a service (`.service`, `.factory` and `.provider`). To understand the differences a little better, here's a [Stackoverflow question and answer][3].

## To-do Main Controller js/controllers/main.js

Now that we have our service, let's create our Angular module for our controller. We will be moving most of the code out of `core.js` into our controller file.

    // js/controllers/main.js

    angular.module('todoController', [])

        .controller('mainController', function($scope, $http) {
            $scope.formData = {};

            // when landing on the page, get all todos and show them
            $http.get('/api/todos')
                    .success(function(data) {
                            $scope.todos = data;
                    })
                    .error(function(data) {
                            console.log('Error: ' + data);
                    });

            // when submitting the add form, send the text to the node API
            $scope.createTodo = function() {
                    $http.post('/api/todos', $scope.formData)
                            .success(function(data) {
                                    $scope.formData = {}; // clear the form so our user is ready to enter another
                                    $scope.todos = data;
                            })
                            .error(function(data) {
                                    console.log('Error: ' + data);
                            });
            };

            // delete a todo after checking it
            $scope.deleteTodo = function(id) {
                    $http.delete('/api/todos/' + id)
                            .success(function(data) {
                                    $scope.todos = data;
                            })
                            .error(function(data) {
                                    console.log('Error: ' + data);
                            });
            };

        });

We have moved our controller code out of `core.js`. While we now have our controller and service in their own modules, they won't be able to work together until we inject them into our main application module.

## Getting All Modules Working Together js/core.js

To get everything working together, we just have to load our controller and services (we did that already in our index.html), and then inject our controller and service into the main module.

Make sure you move your original `core.js` file from the root directory into the `js` folder. This ensures that all our javascript code will be located in the same location.

Here is the **entire code** for our new `core.js`.

    // js/core.js

    angular.module('scotchTodo', ['todoController', 'todoService']);

That's it! You can see how easy that is to read. We have our main module `scotchTodo` and then we inject our controller and service.

Now that our application is set to work together again, we need to use

## Using Our Service in Our Controller

We have linked everything but we are not using our new service yet. Let's inject that into our controller and use it!

    // js/controllers/main.js
    angular.module('todoController', [])

        // inject the Todo service factory into our controller
        .controller('mainController', function($scope, $http, Todos) {
            $scope.formData = {};

            // GET =====================================================================
            // when landing on the page, get all todos and show them
            // use the service to get all the todos
            Todos.get()
                .success(function(data) {
                    $scope.todos = data;
                });

            // CREATE ==================================================================
            // when submitting the add form, send the text to the node API
            $scope.createTodo = function() {

                // validate the formData to make sure that something is there
                // if form is empty, nothing will happen
                // people can't just hold enter to keep adding the same to-do anymore
                if (!$.isEmptyObject($scope.formData)) {

                    // call the create function from our service (returns a promise object)
                    Todos.create($scope.formData)

                        // if successful creation, call our get function to get all the new todos
                        .success(function(data) {
                            $scope.formData = {}; // clear the form so our user is ready to enter another
                            $scope.todos = data; // assign our new list of todos
                        });
                }
            };

            // DELETE ==================================================================
            // delete a todo after checking it
            $scope.deleteTodo = function(id) {
                Todos.delete(id)
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.todos = data; // assign our new list of todos
                    });
            };
        });

As you can see, the code looks very similar to how it used to be. That is because the main thing we did was move the old `$http` code outside of our controller and into our service. The service will return a **promise** object so we can use the data using `.success` promise.

## Conclusion

Now we have organized the frontend of our application. We have separated **controller** and **service** and gotten our modules to work together via injection.

Our application should work the exact same as before, but when we eventually want to grow our application, it will be far more scalable and testable.

In the next few tutorials, we will be doing more frontend work and adding filtering and searching to our application. We will also be working on the backend again and adding Node authentication with Passport.

[1]: https://scotch.io/series/node-and-angular-to-do-app
[2]: http://docs.angularjs.org/guide/migration
[3]: http://stackoverflow.com/questions/13937318/convert-angular-http-get-function-to-a-service