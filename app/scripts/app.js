var blocList = angular.module("BlocList", ['firebase', 'ui.router']);

blocList.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
    .state('landing', {
        url: '/',
        controller: 'Landing.controller',
        templateUrl: '/templates/turnup.html'
    })
    .state('second', {
        url: '/second',
        controller: 'Second.controller',
        templateUrl: '/templates/second.html'
    });
}]);

blocList.controller('Landing.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    $scope.subText = "Turn the music up!";

    var url = 'https://bloc-list.firebaseio.com/todos';
    var fireRef = new Firebase(url);

    $scope.todos = $firebaseArray(fireRef);
    $scope.newTodo = '';

    $scope.addTodo = function () {
        var newTodo = $scope.newTodo.trim();
        if (!newTodo.length) {
            return;
        }
        $scope.todos.$add({
            title: newTodo,
            completed: false
        });
        $scope.newTodo = '';
    };
}]);

blocList.controller('Second.controller', ['$scope', function($scope) {
    $scope.subText = "Barnie and Friends!";
}]);
