angular.module("sudokuApp")
    .controller("descriptionController", function ($scope, $http, $location, $rootScope, $window) {

        $rootScope.gameInstance=JSON.parse(sessionStorage.getItem("gameInstance"));
        $rootScope.wasSudoko=JSON.parse(sessionStorage.getItem("wasSudoko"));
        //TODO UPDATE AFTER KS PAGE
        if ($rootScope.gameInstance === 0){
            desSudokuNum.style.display = 'block';
            desSudokuColors.style.display = 'none';
            desKS1.style.display = 'none';
            desKS2.style.display = 'none';
            KSFamiliar.style.display = 'none';

            if($rootScope.wasSudoko > 1){
                console.log("hereWas= "+$rootScope.wasSudoko);
                sudokuFamiliar.style.display = 'none';
                familiarOptions.style.display = 'none';
                desSudokuNum.style.align = "center";


            }
            $rootScope.wasSudoko++;
            sessionStorage.setItem("wasSudoko",$rootScope.wasSudoko);

        }

        if ($rootScope.gameInstance === 1){
            desSudokuColors.style.display = 'block';
            desSudokuNum.style.display = 'none';
            desKS1.style.display = 'none';
            desKS2.style.display = 'none';
            KSFamiliar.style.display = 'none';

            if($rootScope.wasSudoko > 1){
                console.log("hereWas= "+$rootScope.wasSudoko);
                sudokuFamiliar.style.display = 'none';
                familiarOptions.style.display = 'none';
                desSudokuColors.style.align = "center";

            }
            $rootScope.wasSudoko++;
            sessionStorage.setItem("wasSudoko",$rootScope.wasSudoko);
        }


        $scope.startGame = function(){
            $location.url('sudokuGame');

        }

        $scope.startTrial = function () {
            //$location.url('sudokuGame');


        }

        $scope.continue = function () {

            if( sudokuFamiliar.style.display != 'none' && $scope.familiar == undefined){
                $window.alert("Please mark your familiarity with the next problem");
            }else{
                //TODO change to tutorial
                $location.url('/Tutorial');
            }

        }





    })