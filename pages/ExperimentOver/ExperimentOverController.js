angular.module("sudokuApp")
    .controller("ExperimentOverController", function ($scope, $http, $location, $rootScope) {

        // $(document).ready(function() {
        //     function disablePrev() { window.history.forward() }
        //     window.onload = disablePrev();
        //     window.onpageshow = function(evt) { if (evt.persisted) disableBack() }
        // });

        //lottery a letter for adding the code

            $scope.code= 0;
            var  letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q"
                    ,"r","s","t","u","v","w","x","y","z"];

            var letter = letters[Math.floor(Math.random()*letters.length)];

            $scope.init = function () {


                if(sessionStorage.getItem("compCode") == null){

                    $scope.code = letter+sessionStorage.getItem("userID");
                    sessionStorage.setItem("compCode", $scope.code);

                }else{
                    $scope.code = sessionStorage.getItem("compCode");

                }



                    //documentation
                    $http({

                            method: 'POST',
                            url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/updateCompletionCode ',
                            data: {
                                    "userID": ""+ sessionStorage.getItem("userID"),
                                    "compCode": ""+ $scope.code

                            }
                    })
                        .then(function (response) {


                        }, function (response) {
                                // $scope.records = response.statusText;
                        });


            }




    })