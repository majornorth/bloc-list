(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

blocList.controller('Landing.controller', ['$scope', '$firebaseArray', 'Auth', function($scope, $firebaseArray, Auth) {
    var authData = Auth.$getAuth();
    $scope.currentList = 'todos';

    if (authData) {
        $scope.newListObject = {
            listTitle: ''
        };

        var listsUrl = 'https://bloc-list.firebaseio.com/' + authData.uid + '/' + 'lists';
        var listsRef = new Firebase(listsUrl);
        $scope.lists = $firebaseArray(listsRef);

        $scope.addList = function () {
            var newListTitle = $scope.newListObject.listTitle.trim();
            if (!newListTitle.length) {
                return;
            }

            var newList = $scope.newListObject.listTitle;

            $scope.newListObject = {
                listTitle: newList
            }

            $scope.lists.$add({
                title: newList
            });

            $scope.newListObject.listTitle = '';
        }

        var todosUrl = 'https://bloc-list.firebaseio.com/' + authData.uid + '/' + 'todos';
        var todosRef = new Firebase(todosUrl);

        $scope.logScope = function () {
            console.log($scope);
        };
    } else {
        return
    }

    $scope.getList = function (title) {
        $scope.currentList = title;
        var currentList = $scope.currentList;
        if (currentList != 'todos') {
            var todosUrl = 'https://bloc-list.firebaseio.com/' + authData.uid + '/' + currentList;
            var todosRef = new Firebase(todosUrl);
            $scope.todos = $firebaseArray(todosRef);
        }
    };

    $scope.logTodosRef = function () {
        console.log(todosUrl);
        console.log($scope.selectedList);
        console.log($scope);

    }

    $scope.todos = $firebaseArray(todosRef);

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

    $scope.addTodo = function (currentList) {
        if(!currentList){
            console.log("resetting")
            var currentList = 'todos'
        }
        console.log(currentList);
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
}]);

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

blocList.controller('History.controller', ['$scope', '$firebaseArray', 'Auth', function($scope, $firebaseArray, Auth) {
    var authData = Auth.$getAuth();
        if (authData) {
        var url = 'https://bloc-list.firebaseio.com/todos/' + authData.uid;
        var fireRef = new Firebase(url);
    } else {
        return
    }
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
            // console.log("Logged in as:", authData);
            // console.log($scope);
            document.location.reload(true);
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.logUserOut = function () {
        // console.log($scope);
        // $scope.signin.email = '';
        // $scope.signin.password = '';
        Auth.$unauth();
    };

    $scope.logAuthData = function() {
        authData = Auth.$getAuth();
        console.log(Auth);
        return authData;
    };
}]);

},{}]},{},[1]);