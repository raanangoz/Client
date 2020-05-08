angular.module("sudokuApp")
    .controller("FeedbackController", function ($scope,$window, $http,$rootScope, $location) {


            $scope.go = function () {

                let exam = $scope.exam;
                let tutorial = $scope.tutorial;
                let other = $scope.other;
                let games = $scope.games;

                if ($scope.exam == undefined) {
                    //console.log("exam undef");
                    exam = "NULL";
                }
                if ($scope.tutorial == undefined)
                    tutorial = "NULL";
                if ($scope.other == undefined)
                    other = "NULL";
                if ($scope.games == undefined)
                    games = "NULL";

                $http({

                    method: 'POST',
                    url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/updateRecommendations',
                    data: {
                        "userID": ""+ sessionStorage.getItem("userID"),
                        "exam":""+exam,
                        "tutorial":""+tutorial,
                        "games":""+games,
                        "other":""+other

                    }
                })
                    .then(function (response) {


                    }, function (response) {
                        // $scope.records = response.statusText;
                    });
                $location.url('/ExperimentOver');


            }
        });