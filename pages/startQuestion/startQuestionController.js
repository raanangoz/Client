angular.module("sudokuApp")
    .controller("startQuestionController", function ($scope,$window, $http,$rootScope, $location) {

        // function preventBack(){window.history.forward();}
        // setTimeout("preventBack()", 0);
        // window.onunload=function(){null};
        //

        window.onbeforeunload = function(event) {
            // do some stuff here, like reloading your current state
            //this would work only if the user chooses not to leave the page
            return 'why would you do that???';
        }

        $(document).ready(function() {
            function disablePrev() { window.history.forward() }
            window.onload = disablePrev();
            window.onpageshow = function(evt) { if (evt.persisted) disableBack() }
        });

        //
        // window.history = function(event) {
        //     // do some stuff here, like reloading your current state
        //     //this would work only if the user chooses not to leave the page
        //     return 'why would you do that???';
        // }

        var countersArray = [];
        for(let i = 0; i <= 2; i++) {
            countersArray[i] = 0;
        }

        var userWorkerID;
        var userAge;
        var userGender;
        var userHand;
        var userEducation;

        // var g= $scope.gender.value;
        // console.log("g= "+g);

        //two arrays for the lottery between the games
        $rootScope.gameInstance = 1;
        //KS presentation
        $rootScope.KSpresentation = 0;
        // 0-sudokuNumbers, 1-sudokuColors, 2-KS1(everyone), 3-KS2
        $rootScope.gameInstancesChosen = [false, false, false, false];
        //boolean for the familiarity question
        $rootScope.wasSudoko="false";
        $rootScope.wasKS="false";

            //two arrays for the lottery between the games
            $rootScope.gameInstance = 1;
            sessionStorage.setItem("gameInstance","1");
            // let gameInstancesChosen= {false,false,true,true};
            // 0-sudokuNumbers, 1-sudokuColors, 2-KS1, 3-KS2
            $rootScope.gameInstancesChosen = [false, false, false, false];
            sessionStorage.setItem("gameInstancesChosen",JSON.stringify($rootScope.gameInstancesChosen));
            //boolean for the familiarity question
             $rootScope.wasSudoko="false";
             $rootScope.wasKS="false";
            sessionStorage.setItem("wasSudoko","false");
            sessionStorage.setItem("wasKS","false");

        sessionStorage.setItem("KSProblem",Math.floor(Math.random() * 4) + 2);
        //for check the worker ID
        var lettersAndNumbers = /^[0-9a-zA-Z]+$/;

            $scope.go = function () {

                userWorkerID = workerID.value;
                userAge = age.value;
                userGender = $scope.gender;
                console.log("gender= " + userGender);
                userHand = $scope.hand;
                console.log("hand= " + userHand);
                userEducation = $scope.education;
                console.log("education= " + userEducation);


                if (userWorkerID == "" || userWorkerID == undefined || !(userWorkerID.match(lettersAndNumbers))) {
                    $window.alert('Please enter a valid Worker ID');
                } else {
                    if (userAge == "" || userAge == undefined) {
                        $window.alert('Please enter your Age');
                    } else if (!(userAge >= 0 && userAge <= 150))
                        $window.alert('Please enter a valid Age');
                    else {
                        if (userGender == "" || userGender == undefined) {
                            $window.alert('Please enter your Gender');
                        } else if (userHand == "" || userHand == undefined) {
                            $window.alert('Please enter your strong hand');
                        } else if (userEducation == "" || userEducation == undefined) {
                            $window.alert('Please enter your Education');
                        } else {

                            $http({
                                method: 'POST',
                                url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/submitQuestinary', // submitQuestinary - name if the function in the server
                                data: {
                                    "workerID": userWorkerID,
                                    "age": userAge,
                                    "gender": userGender,
                                    "hand": userHand,
                                    "education": userEducation

                                }
                            })
                                .then(function (response) {


                                    $http({
                                        method: "get",
                                        url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/getUserID'


                                    }).then(function (response) {
                                        let userID = response.data[0].maxid;
                                        $rootScope.userID = userID;
                                        sessionStorage.setItem("userID",userID);

                                        $rootScope.gameInstance = Math.floor(Math.random() * 4);
                                        // $rootScope.gameInstance = 2;

                                        //everyone presentation
                                        $rootScope.KSpresentation = 3;


                                        if($rootScope.gameInstance=='3'){

                                            console.log("here333333");

                                            //0-weight presentation, 1-value presentation, 2-mix presentation
                                            $rootScope.KSpresentation = Math.floor(Math.random() * 3);

                                            var counterPresentation= 0;
                                            updateCounter(0);
                                            updateCounter(1);
                                            updateCounter(2);


                                            function updateCounter(KSpresentation){

                                                //update the counterPresentation
                                                $http ({
                                                    method: 'GET',
                                                    url:'https://serverdecisionsmaking.herokuapp.com/Knapsack/getPresentationCounter/'+KSpresentation
                                                })

                                                    .then(function(response) {
                                                        var place = "p"+KSpresentation;
                                                        console.dir("response= "+response.data[0][place]);
                                                        console.log("response= "+ JSON.stringify(response.data[0][place]));
                                                        counterPresentation = response.data[0][place];
                                                        countersArray[KSpresentation]= response.data[0][place];
                                                        console.log("counterPresentation= "+counterPresentation);
                                                        console.log("countersArray[0] = "+countersArray[KSpresentation]);
                                                        if(KSpresentation === 2){
                                                            checkCounter();
                                                        }


                                                    }, function(response) {
                                                        // $scope.records = response.statusText;
                                                    });


                                            }


                                            function checkCounter(){
                                                // for (var i = 0; i <countersArray.length ; i++) {
                                                //     console.log("cell1:"+countersArray[i]);
                                                //
                                                // }

                                                console.dir("counterArray= "+countersArray);
                                                var allZero=true;

                                                for (var i = 0; i <countersArray.length  ; i++) {
                                                    if(countersArray[i] != 0){
                                                        console.log("hereAllZero");
                                                        allZero = false;
                                                    }

                                                }
                                                if(allZero){

                                                    $location.url('/ExperimentOver');
                                                }else{

                                                    while(countersArray[$rootScope.KSpresentation] === 0){
                                                        console.log("herePres"+ countersArray[$rootScope.KSpresentation]);
                                                        $rootScope.KSpresentation = Math.floor(Math.random() * 3);
                                                    }


                                                    counterPresentation = countersArray[$rootScope.KSpresentation];

                                                    reduceCounter();

                                                }


                                            }



                                            // while(counterPresentation === 0){
                                            //
                                            //     console.log("hereWhilecounterPresentation === 0")
                                            //
                                            //     console.log("KSpresentation= "+$rootScope.KSpresentation);
                                            //     console.log('http://localhost:3000/Knapsack/getPresentationCounter/'+$rootScope.KSpresentation);
                                            //
                                            //
                                            //
                                            //  }

                                            function reduceCounter(){

                                                //reduce the counter if we chose the presentation
                                                $http({

                                                    method: 'POST',
                                                    url: 'https://serverdecisionsmaking.herokuapp.com/Knapsack/updateCounterPresentation/',
                                                    data: {
                                                        "presentation": "" + $rootScope.KSpresentation,
                                                        "counterPresentation" : ""+counterPresentation

                                                    }
                                                })
                                                    .then(function (response) {

                                                        //add to the board 2d array

                                                    }, function (response) {
                                                        // $scope.records = response.statusText;
                                                    });



                                                movePage();
                                            }


                                        }else{
                                            movePage();
                                        }


                                        function movePage(){
                                            sessionStorage.setItem("KSpresentation", ""+$rootScope.KSpresentation);
                                            console.log("KSpresentationStart= "+sessionStorage.getItem("KSpresentation"));




                                            //TO DO change to *4 after the KS page
                                            // let gameInstance = ""+Math.floor(Math.random() * 2);
                                            // $rootScope.gameInstance = gameInstance;
                                            // $rootScope.gameInstance = 0;
                                            $rootScope.gameInstancesChosen[$rootScope.gameInstance] = true;
                                            sessionStorage.setItem("gameInstancesChosen",JSON.stringify($rootScope.gameInstancesChosen));
                                            sessionStorage.setItem("gameInstance",JSON.stringify($rootScope.gameInstance));
                                            // $rootScope.gameInstance = Math.floor(Math.random() * 2);



                                            console.log("number= " + $rootScope.gameInstance);
                                            //pass to tutorial
                                            $location.url('/Tutorial');


                                        }


                                    })


                                    console.log("hereeeeee");
                                }, function (response) {
                                    // $scope.records = response.statusText;
                                });

                        }
                    }

                }

            }

        }
    )