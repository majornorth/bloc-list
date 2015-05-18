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
    $scope.newTodo = '';

    $scope.addTodo = function () {
        var newTodo = $scope.newTodo.trim();
        if (!newTodo.length) {
            return;
        }

        var todoDuration = 604800000;

        $scope.todos.$add({
            title: newTodo,
            completed: false,
            submitted: Date.now(),
            expiryDate: Date.now() + todoDuration
        });
        $scope.newTodo = '';
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

    $scope.hideActive = function () {
        var expiryDate = this.todo.expiryDate;
        var timeNow = Date.now();
        var result = expiryDate < timeNow;
        return result;
    };
}]);
