var blocList = angular.module("BlocList", ['firebase', 'ui.router']);

blocList.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
    .state('landing', {
        url: '/',
        views: {
            'landing': {
                controller: 'Landing.controller',
                templateUrl: '/templates/landing.html'
            }
        }
    })
    .state('history', {
        url: '/history',
        views: {
            'history': {
                controller: 'History.controller',
                templateUrl: '/templates/history.html'
            }
        }
    });
}]);

blocList.directive('ngAuth', function () {
    return {
        templateUrl: '/templates/auth.html'
    }
});

blocList.service('CurrentList', function() {
    return {
        defaults: { name: 'todos' }
    }
});

blocList.controller('Landing.controller', ['$scope', '$firebaseArray', 'Auth', 'CurrentList', 'AuthData', function($scope, $firebaseArray, Auth, CurrentList, AuthData) {

    console.log(AuthData);

    $scope.logSomeMethod = function () {
        console.log(CurrentList.defaults.name);
    }

    if (AuthData) {
        $scope.newListObject = {
            listTitle: ''
        };

        var listsUrl = 'https://bloc-list.firebaseio.com/' + AuthData.uid + '/' + 'lists';
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

        var currentList = CurrentList.defaults.name || 'todos';
        var todosUrl = 'https://bloc-list.firebaseio.com/' + AuthData.uid + '/' + currentList;
        var todosRef = new Firebase(todosUrl);
    } else {
        return
    }

    // Move code below into a service
    $scope.getList = function (title) {
        CurrentList.defaults.name = title;
        var currentList = CurrentList.defaults.name;
        if (currentList != 'todos') {
            var todosUrl = 'https://bloc-list.firebaseio.com/' + AuthData.uid + '/' + currentList;
            var todosRef = new Firebase(todosUrl);
            $scope.todos = $firebaseArray(todosRef);
        } else {
            var todosUrl = 'https://bloc-list.firebaseio.com/' + AuthData.uid + '/' + title;
            var todosRef = new Firebase(todosUrl);
            $scope.todos = $firebaseArray(todosRef);
        }
    };

    $scope.setSelectedClass = function ($event) {
        var taskLists = document.getElementById("task-lists");
        var selectedList = null;
        for (var i = 0; i < taskLists.childNodes.length; i++) {
            if (taskLists.childNodes[i].className == "selected-list") {
              selectedList = taskLists.childNodes[i];
              break;
            }
        }
        if (selectedList != null) {
            selectedList.removeAttribute("class", "selected-list");
        }
        $event.currentTarget.setAttribute("class", "selected-list");
    };

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

    $scope.logScope = function () {
        console.log($scope);
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

blocList.controller('History.controller', ['$scope', 'CurrentList', 'Auth', '$firebaseArray', function($scope, CurrentList, Auth, $firebaseArray) {

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
    } else {
        return
    }

    $scope.todos = $firebaseArray(todosRef);

    var currentList = CurrentList.defaults.name;
    if (currentList != 'todos') {
        var todosUrl = 'https://bloc-list.firebaseio.com/' + authData.uid + '/' + currentList;
        var todosRef = new Firebase(todosUrl);
        $scope.todos = $firebaseArray(todosRef);
    } else {
        var todosUrl = 'https://bloc-list.firebaseio.com/' + authData.uid + '/' + 'todos';
        var todosRef = new Firebase(todosUrl);
        $scope.todos = $firebaseArray(todosRef);
    }

    $scope.getList = function (title) {
        CurrentList.defaults.name = title;
        var currentList = CurrentList.defaults.name;
        if (currentList != 'todos') {
            var todosUrl = 'https://bloc-list.firebaseio.com/' + authData.uid + '/' + currentList;
            var todosRef = new Firebase(todosUrl);
            $scope.todos = $firebaseArray(todosRef);
        } else {
            var todosUrl = 'https://bloc-list.firebaseio.com/' + authData.uid + '/' + title;
            var todosRef = new Firebase(todosUrl);
            $scope.todos = $firebaseArray(todosRef);
        }
    };

    $scope.showExpired = function (todo) {
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

blocList.factory("AuthData", ["Auth",
    function(Auth) {
        var authData = Auth.$getAuth();
        return authData;
    }
]);

blocList.controller('Auth.controller', ['$scope', 'Auth', 'CurrentList', '$state', function($scope, Auth, CurrentList, $state) {

    $scope.logSomeMethod = function () {
        console.log(CurrentList.defaults.name);
    }

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
            // document.location.reload(true);
            // $state.go('landing');
            $state.reload();
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    };

    $scope.logUserOut = function () {
        // console.log($scope);
        // $scope.signin.email = '';
        // $scope.signin.password = '';
        Auth.$unauth();
        $state.go('landing');
    };

    $scope.logAuthData = function() {
        authData = Auth.$getAuth();
        console.log(Auth);
        return authData;
    };
}]);
