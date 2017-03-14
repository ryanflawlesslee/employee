var myapp = angular.module('myapp', ['ngRoute']);

// Route
myapp.config(function($routeProvider) {
    $routeProvider
    .when(
        '/', {
            templateUrl: './views/home.html'
        })
    .when(
        '/show', {
            templateUrl: './views/show.html'
        })
    .when(
        '/contact', {
            templateUrl: './views/contact.html'
        })
    .otherwise({
            redirectTo: "/"
        })
})

// Controller
myapp.controller('homeController', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.createUser = createUser;
    $scope.deleteUser = deleteUser;
    $scope.editUser   = editUser;
    $scope.updateUser = updateUser;

    showAllUsers();

    function updateUser(user) {
        $http.put('/api/users/' + user._id, user)
             .then(showAllUsers);
    }

    function editUser(userId) {
        $http.get('/api/users/' + userId)
             .then(function(user) {
                 $scope.user = user.data;
             });
    }

    function deleteUser(userId) {
        $http.delete('api/users/' + userId)
             .then(showAllUsers);
    }

    function createUser(user) {
        console.log(user);
        $http.post('/api/users', user)
             .then(showAllUsers);
        $location.path('/show');
        window.location.reload();

    }


    function showAllUsers() {
        $scope.user = null;
        $http.get('/api/users')
             .then(function(users) {
                 $scope.users = users.data;
             });
    }
}])