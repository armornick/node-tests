

angular.module('todoController', [])
	.controller('mainController', function ($scope, $http, Todos) {
		
		$scope.formData = {};

        // GET =====================================================================
        // when landing on the page, get all todos and show them
        // use the service to get all the todos
        Todos.get()
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createTodo = function() {
            
            // form validation
        	if (!$.isEmptyObject($scope.formData)) {

        		Todos.create($scope.formData)
        			.success(function (data) {
        				// clear form
        				$scope.formData = {};
        				$scope.todos = data;
        			})

        	};

        };

        // DELETE ==================================================================
        // delete a todo after checking it
        $scope.deleteTodo = function(id) {
            
        	Todos.delete(id)
        		.success(function (data) {
        			$scope.todos = data;
        		})

        };


	});