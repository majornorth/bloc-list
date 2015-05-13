(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    $scope.subText = "Barnie!";
}]);

},{}]},{},[1]);