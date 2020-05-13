angular.module("sudokuApp")
    .controller("homeController", function ($scope, $http, $location, $window) {

        //TODO raanan refresh during game - save board , time, maybe check for each move if 15 minutes passed since when board was shown firstly compared to DB time.
        window.history.forward();
        function noBack() { window.history.forward(); }


        $scope.continue = function () {

            if(!($scope.termsCheckBox)){
                $window.alert("You have to agree the conditions of the experiment first");

            }else{
                $location.url('/startQuestion');
            }


            // window.open("http://http://localhost:63342/Sudoku/index.html?_ijt=p6sksmnjl0rbnb3hqiohvcg5qd#!/startQuestion", "_self", "toolbar=no");

            // window.onpopstate = function (e) { window.history.forward(1); }
            // $location.url('/startQuestion');

            }




    })