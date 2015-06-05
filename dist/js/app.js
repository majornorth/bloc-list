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

blocList.controller('Landing.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var url = 'https://bloc-list.firebaseio.com/todos';
    var fireRef = new Firebase(url);

    $scope.todos = $firebaseArray(fireRef);

    $scope.newTodoObject = {
        todoTitle: '',
        todoPriority: null
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

        var sevenDaysFromNow = 604800000;

        $scope.todos.$add({
            title: newTodo,
            priority: $scope.newTodoObject.todoPriority.value,
            completed: false,
            submitted: Date.now(),
            expiryDate: Date.now() + sevenDaysFromNow
        });

        $scope.newTodoObject.todoTitle = '';
        $scope.newTodoObject.todoPriority = null;
    };

    $scope.hideExpired = function () {
        var expiryDate = this.todo.expiryDate;
        var timeNow = Date.now();
        var result = expiryDate < timeNow;
        return result;
    };
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
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.logAuthData = function() {
        authData = Auth.$getAuth();
        console.log(Auth);
        return authData;
    };
}]);

},{}]},{},[1]);