var bloclist = angular.module("BlocList", ["firebase"]);

bloclist.controller('Landing.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    $scope.subText = "Turn the music up!";

    var url = 'https://bloc-list.firebaseio.com/todos';
    var fireRef = new Firebase(url);
}]);
