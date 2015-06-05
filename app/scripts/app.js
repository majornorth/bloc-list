var blocList = angular.module("BlocList", ['firebase', 'ui.router']);

blocList.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
    .state('landing', {
        url: '/',
        controller: 'Landing.controller',
        templateUrl: '/templates/landing.html'
    })
    .state('history', {
        url: '/history',
        controller: 'History.controller',
        templateUrl: '/templates/history.html'
    });
}]);

blocList.controller('Landing.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var url = 'https://bloc-list.firebaseio.com/todos';
    var fireRef = new Firebase(url);

    $scope.todos = $firebaseArray(fireRef);

    $scope.newTodoObject = {
        todoTitle: '',
        todoPriority: ''
    };

    $scope.priorityOptions = [
        {
          name: 'Low',
          value: 'low'
        },
        {
          name: 'Medium',
          value: 'medium'
        },
        {
          name: 'Urgent',
          value: 'urgent'
        },
    ];

    $scope.addTodo = function () {
        var newTodo = $scope.newTodoObject.todoTitle.trim();
        if (!newTodo.length) {
            return;
        }

        var priorityValue = $scope.newTodoObject.todoPriority.value;

        if (priorityValue === undefined) {
            $scope.priorityUndefinedError = 'Please select a priority level for your todo';
            $scope.priorityUndefinedTrue = true;
            return;
        }

        var sevenDaysFromNow = 604800000;

        $scope.todos.$add({
            title: newTodo,
            priority: priorityValue,
            completed: false,
            submitted: Date.now(),
            expiryDate: Date.now() + sevenDaysFromNow
        });

        $scope.newTodoObject.todoTitle = '';
        $scope.newTodoObject.todoPriority = '';
        $scope.priorityUndefinedTrue = false;
    };

    $scope.hideExpired = function () {
        var expiryDate = this.todo.expiryDate;
        var timeNow = Date.now();
        var result = expiryDate < timeNow;
        return result;
    };

    /* This directive allows us to pass a function in on an enter key to do what we want. */
    blocList.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
}]);

blocList.controller('History.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var url = 'https://bloc-list.firebaseio.com/todos';
    var fireRef = new Firebase(url);

    $scope.todos = $firebaseArray(fireRef);

    $scope.hideActive = function (todo) {
        var expiryDate = this.todo.expiryDate;
        var timeNow = Date.now();
        var result = expiryDate < timeNow;
        return result;
    };
}]);

blocList.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://bloc-list.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

blocList.controller('Auth.controller', ['$scope', 'Auth', function($scope, Auth) {
    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
      $scope.authData = authData;
    });

    $scope.createUser = function() {
        Auth.$createUser({
            email: $scope.signup.email,
            password: $scope.signup.password
        }).then(function(userData) {
            Auth.$authWithPassword({
                email: $scope.signup.email,
                password: $scope.signup.password
            }).then(function(authData) {
                console.log("Logged in as:", authData);
            }).catch(function(error) {
                console.error("Authentication failed:", error);
            });
        }).catch(function(error) {
            console.log("There was an error: " + error);
        });
    };

    $scope.signUserIn = function() {
        Auth.$authWithPassword({
            email: $scope.signin.email,
            password: $scope.signin.password
        }).then(function(authData) {
            console.log("Logged in as:", authData);
            console.log($scope);
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.logUserOut = function () {
        console.log($scope);
        $scope.signin.email = '';
        $scope.signin.password = '';
        Auth.$unauth();
    };

    $scope.logAuthData = function() {
        authData = Auth.$getAuth();
        console.log(Auth);
        return authData;
    };

    /* This directive allows us to pass a function in on an enter key to do what we want. */
    blocList.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
}]);
