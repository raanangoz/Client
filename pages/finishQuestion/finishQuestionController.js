
angular.module("sudokuApp")
    .controller("finishQuestionController", function ($scope, $http, $location,$rootScope, $window) {

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

        $scope.correctnessPercents = [];

        $rootScope.gameInstancesChosen=(JSON.parse(sessionStorage.getItem("gameInstancesChosen")));
        ////console.log("works?)");
        $rootScope.gameInstance = JSON.parse(sessionStorage.getItem("gameInstance"));
        $rootScope.boxes = JSON.parse(sessionStorage.getItem("boxes"));
        $rootScope.GameID = JSON.parse(sessionStorage.getItem("GameID"));
        var optSolution;
        var correctnessRank;
        var difficultyRank;
        var confident;
        var people;
        var fat;
        var answered = false;
        var op1;
        var op2;
        var op3;
        var op4;
        var sumTo100;
        var puzzle = sessionStorage.getItem("plaster");
        $scope.arrayOfOptionNumbers = [];
        if($rootScope.gameInstance==1 || $rootScope.gameInstance==0) {
            $scope.sudokuQuestion = true;
            $scope.knapsackquestions = false;
        }
        else{
            $scope.sudokuQuestion = false;
            $scope.knapsackquestions = true;
        }
        var countersArray = [];
        for(let i = 0; i <= 2; i++) {
            countersArray[i] = 0;
        }


        ////console.log("gameInstances[3]= "+$rootScope.gameInstancesChosen[3]);

        $scope.init = function(){
            if ($scope.sudokuQuestion == true) {
                for (let i = 0; i <= $rootScope.boxes; i++) {
                    $scope.arrayOfOptionNumbers[i] = i;
                }
                // $scope.arrayOfOptionNumbers =  [...Array($rootScope.boxes+1).keys()];// create  array with numbers between 0 to x!!
                ////console.log("numOfBoxes= " + $rootScope.boxes);
                // for (var i = 0; i <$scope.arrayOfOptionNumbers.length ; i++) {
                //     $scope.arrayOfOptionNumbers[i]= i;
                //
                // }
                for (var i = 0; i < $scope.arrayOfOptionNumbers.length; i++) {
                    ////console.log("valArray= " + $scope.arrayOfOptionNumbers[i]);

                }
                ////console.log("arrrrray= " + $scope.arrayOfOptionNumbers);
            }
            else {//knapsack
                for (let i = 1; i <= 100; i++) {
                    $scope.correctnessPercents[i] = i;
                }
                heaviestOfOpt();

            }
            //update was
            if($rootScope.gameInstance === 0 || $rootScope.gameInstance === 1 ){

                ////console.log("hereFinishSudoku123");
                sessionStorage.setItem("wasSudoko","true");


            }
            //update was
            if($rootScope.gameInstance === 2 || $rootScope.gameInstance === 3) {

                sessionStorage.setItem("wasKS","true");


            }


        }

        $scope.submitEstimates = function () {
            if($scope.sudokuQuestion == true) {

                // $scope.$watch('rankCorrectness', function(value) {
                //     correctnessRank = value;
                // })

                correctnessRank = rankCorrectness.value;
                difficultyRank = rankDifficulty.value;

                ////console.log("correct= "+correctnessRank);
                ////console.log("diffi= "+difficultyRank);

                //if the user filled the two fields
                if(correctnessRank <=$rootScope.boxes && correctnessRank >=0 && difficultyRank <=10 && difficultyRank >=1){

                    //enable the next button
                    document.getElementById("nextTask").disabled = false;


                    $http({

                        method: 'POST',
                        url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/submitFinishQuestion',
                        data: {
                            "userID": "" + sessionStorage.getItem("userID"),
                            "gameID": "" + $rootScope.GameID,
                            "difficulty": "" + difficultyRank,
                            "correctness": "" + correctnessRank
                        }
                    })
                        .then(function (response) {

                        }, function (response) {

                        });
                    answered= true;
                }

                else{
                    $window.alert("Please answer all questions");
                }
            }
            else {//knapsack
                confident = confident1.value;
                difficultyRank=rankDifficulty1.value;
                people = peopleDifficulty.value;
                fat = fatItem.value;

                if (confident <= 10 && confident >= 1 && difficultyRank <= 10 && difficultyRank >= 1 &&
                    people>=1 && people <=10 && fat>=1 ) {
                    if (sumTo100 == 100) {
                        document.getElementById("nextTask").disabled = false;


                        $http({

                            method: 'POST',
                            url: 'https://serverdecisionsmaking.herokuapp.com/Knapsack/submitFinishQuestion',
                            data: {
                                "userID": "" + sessionStorage.getItem("userID"),
                                "gameID": "" + $rootScope.GameID,
                                "confident": "" + confident,
                                "difficultyRank": "" + difficultyRank,
                                "estimatePeopleDif":""+people,
                                "heaviestItem": "" + fat,
                                "op1": "" + op1,
                                "op2": "" + op2,
                                "op3": "" + op3,
                                "op4": "" + op4

                                // "estimateOthersCorrect": ""+correctnessPercents
                            }
                        })
                            .then(function (response) {

                            }, function (response) {

                            });
                        answered = true;
                        var newProb = generateRandomNumber(2,5);
                        ////console.log("whileKSSSS: "+newProb.toString());
                        while (newProb.toString() == sessionStorage.getItem("KSProblem").toString()){
                            ////console.log("whileKSSSS: "+newProb.toString());
                            newProb = generateRandomNumber(2,5);
                        }
                        sessionStorage.setItem("KSProblem",newProb);
                    }
                    else{
                        $window.alert("Please answer the last question correctly.");
                    }
                }
                else{
                    $window.alert("Please answer all questions");
                }
            }

            if(answered== true) {

                var completed = true;
                //check if the whole games completed

                for (var i = 0; i < $rootScope.gameInstancesChosen.length; i++) {
                    ////console.log($rootScope.gameInstancesChosen[i]);
                    if ($rootScope.gameInstancesChosen[i] == false) {
                        completed = false;
                    }

                }

                ////console.log("completed= "+completed);
                if (!completed){

                    //change to *4 after the KS page
                    $rootScope.gameInstance = Math.floor(Math.random() * 4);

                    while ($rootScope.gameInstancesChosen[ $rootScope.gameInstance] == true){
                        ////console.log("hereWhileFinish");
                        $rootScope.gameInstance = Math.floor(Math.random() * 4);
                    }


                    //everyone presentation
                    $rootScope.KSpresentation = 3;

                    if($rootScope.gameInstance=='3'){

                        ////console.log("here333333");

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
                                    ////console.log("response= "+ JSON.stringify(response.data[0][place]));
                                    counterPresentation = response.data[0][place];
                                    countersArray[KSpresentation]= response.data[0][place];
                                    ////console.log("counterPresentation= "+counterPresentation);
                                    ////console.log("countersArray[0] = "+countersArray[KSpresentation]);
                                    if(KSpresentation === 2){
                                        checkCounter();
                                    }


                                }, function(response) {
                                    // $scope.records = response.statusText;
                                });


                        }


                        function checkCounter(){
                            // for (var i = 0; i <countersArray.length ; i++) {
                            ////     //console.log("cell1:"+countersArray[i]);
                            //
                            // }

                            console.dir("counterArray= "+countersArray);
                            var allZero=true;

                            for (var i = 0; i <countersArray.length  ; i++) {
                                if(countersArray[i] != 0){
                                    ////console.log("hereAllZero");
                                    allZero = false;
                                }

                            }
                            if(allZero){

                                $location.url('/ExperimentOver');
                            }else{

                                while(countersArray[$rootScope.KSpresentation] === 0){
                                    ////console.log("herePres"+ countersArray[$rootScope.KSpresentation]);
                                    $rootScope.KSpresentation = Math.floor(Math.random() * 3);
                                }


                                counterPresentation = countersArray[$rootScope.KSpresentation];

                                reduceCounter();

                            }


                        }



                        // while(counterPresentation === 0){
                        //
                        ////     //console.log("hereWhilecounterPresentation === 0")
                        //
                        ////     //console.log("KSpresentation= "+$rootScope.KSpresentation);
                        ////     //console.log('http://localhost:3000/Knapsack/getPresentationCounter/'+$rootScope.KSpresentation);
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

                        // sessionStorage.setItem("KSProblem",Math.floor(Math.random() * 4) + 2);
                        sessionStorage.setItem("KSpresentation", ""+$rootScope.KSpresentation);
                        ////console.log("KSpresentationStart= "+sessionStorage.getItem("KSpresentation"));

                        if($rootScope.gameInstancesChosen[ $rootScope.gameInstance] == false){
                            ////console.log("number= "+$rootScope.gameInstance);
                            $rootScope.gameInstancesChosen[$rootScope.gameInstance]= true;
                            sessionStorage.setItem("gameInstance",$rootScope.gameInstance);
                            sessionStorage.setItem("gameInstancesChosen",JSON.stringify($rootScope.gameInstancesChosen));

                            ////console.log("gameInstanceFinish= "+sessionStorage.getItem("gameInstance"));
                            ////console.log("wasKSfinish= "+sessionStorage.getItem("wasKS"));

                            if((sessionStorage.getItem("gameInstance")==2 || sessionStorage.getItem("gameInstance")==3)
                                && sessionStorage.getItem("wasKS") ==='true'){
                                $location.url('/pageBeforeGame');

                            }else{
                                $location.url('/Tutorial');
                            }


                        }
                    }



                } else {

                    ////console.log("hereOver123456");
                    //experiment over
                    $location.url('/Feedback');
                }
            }

            // $window.alert("Please answer both of the questions");
        }






        $scope.updateTotal = function(){

            op1 = document.getElementById("op1").value;
            op2 = document.getElementById("op2").value;
            op3 = document.getElementById("op3").value;
            op4 = document.getElementById("op4").value;
            $scope.totalV = Number(op1)+Number(op2)+Number(op3)+Number(op4);
            sumTo100 =  $scope.totalV;
            ////console.log(sumTo100);
        }


        $scope.openModal = function(){

            $('#myModalF').modal();
            $scope.presen = sessionStorage.getItem("KSpresentation");
            $scope.itemsForPres = JSON.parse(sessionStorage.getItem("items"));

            ////console.log("presKS= "+$scope.presen);
            ////console.log($scope.itemsForPres);
            $scope.top = [10,10,10,10,150,150,150,150,290,290,290,290,430]
            $scope.left = [3,20,37,54,3,20,37,54,3,20,37,54,3]
            $scope.countTopPres = 0
            $scope.countLeftPres =0;
            $scope.count= 0;

            $rootScope.instance = sessionStorage.getItem("KSProblem");
            $scope.pres2ByWeight = [6.9,12 ,11 ,6.5 ,8.5 ,10.5 ,7.5 ,7.8 ,9.7 ,9 ,7.2,7,6.7]
            $scope.pres3ByWeight = [11.5,7 ,10 ,6.5 ,6.7 ,12.2 ,9 ,9.4 ,11 ,10.7 ]
            $scope.pres4ByWeight = [8,9.5 ,6.5 ,11 ,6.5 , 7.5,6.5 ,11 ,12.5 ,9.5 ]
            $scope.pres5ByWeight = [7.4,11.8 ,10 ,7.2 ,7 , 12.5,9.8 ,9.5 ,11.8 ,6.5 ]

            $scope.pres2ByValue = [7.1,10.0 ,12.5 ,6.9 ,8.1 ,9.8 ,6.5 ,8 ,10.5 ,9 ,10.1,11,7.1]
            $scope.pres3ByValue = [11.5 ,7.4 ,8.9 ,6.5 ,6.9 ,12.5 ,7.6 ,8 ,8.5 ,10.2 ]
            $scope.pres4ByValue = [8 ,10 ,7 ,6.5 ,9 ,10.8 ,7.5 ,10 ,12.5 ,9 ]
            $scope.pres5ByValue = [6.9 ,9.2 ,12.5 ,8.4 ,8.1 ,11 ,8.5 ,9 ,7.2 ,6.5]


        }

        var sizes = [Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7)]

        $scope.drawCoins = function (isChosen, weight,value) {
            //// //console.log("isChosen-"+isChosen)
            //// //console.log("weight-"+weight)
            //// //console.log("value-"+value)
            //////console.log($scope.items);
            ////console.log("#@$@#")
            if (!isChosen) {
                if (weight==50 && value ==37)
                    return "https://i.imgur.com/HBJTrNN.png"
                if (weight==820 && value ==72)
                    return "https://i.imgur.com/n9kOTTT.png"
                if (weight==700 && value ==106)
                    return "https://i.imgur.com/pSMkyK4.png"
                if (weight==46 && value ==32)
                    return "https://i.imgur.com/Mekpbve.png"
                if (weight==220 && value ==45)
                    return "https://i.imgur.com/xjYeWBL.png"
                if (weight==530 && value ==71)
                    return "https://i.imgur.com/EqsNIWJ.png"
                if (weight==107 && value ==23)
                    return "https://i.imgur.com/7vmAb8X.png"
                if (weight==180 && value ==44)
                    return "https://i.imgur.com/3ney67d.png"
                if (weight==435 && value ==85)
                    return "https://i.imgur.com/GNrHS1I.png"
                if (weight==360 && value ==62)
                    return "https://i.imgur.com/dVZeE7s.png"

                if (weight==22 && value ==26)
                    return "https://i.imgur.com/PJwuAE1.png"
                if (weight==21 && value ==18)
                    return "https://i.imgur.com/VD6M72i.png"
                if (weight==45 && value ==40)
                    return "https://i.imgur.com/qBzZuLc.png"
                if (weight==43 && value ==33)
                    return "https://i.imgur.com/iwWA3Pd.png"
                if (weight==26 && value ==32)
                    return "https://i.imgur.com/nyWRSSd.png"
                if (weight==52 && value ==59)
                    return "https://i.imgur.com/yOaVqdR.png"
                if (weight==48 && value ==47)
                    return "https://i.imgur.com/ioH6Vof.png"
                if (weight==55 && value ==45)
                    return "https://i.imgur.com/w2eGbDq.png"
                if (weight==95 && value ==85)
                    return "https://i.imgur.com/xdGacQi.png"
                if (weight==85 && value ==79)
                    return "https://i.imgur.com/WOxDkOw.png"

                if (weight==4 && value ==3)
                    return "https://i.imgur.com/SrNc92i.png"
                if (weight==10 && value ==2)
                    return "https://i.imgur.com/Vg73rIi.png"
                if (weight==4 && value ==4)
                    return "https://i.imgur.com/Jt6WDoI.png"
                if (weight==7 && value ==5)
                    return "https://i.imgur.com/U3DHfzd.png"
                if (weight==8 && value ==7)
                    return "https://i.imgur.com/zSqrmLB.png"
                if (weight==4 && value ==7)
                    return "https://i.imgur.com/v1hQEPc.png"
                if (weight==8 && value ==8)
                    return "https://i.imgur.com/jX4QsHl.png"
                if (weight==10 && value ==8)
                    return "https://i.imgur.com/FOa3TgR.png"
                if (weight==6 && value ==9)
                    return "https://i.imgur.com/ePuV8Tu.png"
                if (weight==12 && value ==11)
                    return "https://i.imgur.com/8flbd6k.png"

                if (weight==20 && value ==30)
                    return "https://i.imgur.com/eYp1Stx.png"
                if (weight==50 && value ==42)
                    return "https://i.imgur.com/jObnw7e.png"
                if (weight==27 && value ==38)
                    return "https://i.imgur.com/MgR8Q8A.png"
                if (weight==25 && value ==66)
                    return "https://i.imgur.com/TjpPpg7.png"
                if (weight==26 && value ==69)
                    return "https://i.imgur.com/ytjxhRj.png"
                if (weight==34 && value ==70)
                    return "https://i.imgur.com/wMJpVd5.png"
                if (weight==50 && value ==86)
                    return "https://i.imgur.com/WJt5UzV.png"
                if (weight==33 && value ==85)
                    return "https://i.imgur.com/XviYYSg.png"
                if (weight==55 && value ==97)
                    return "https://i.imgur.com/Sx5L7ZU.png"
                if (weight==41 && value ==112)
                    return "https://i.imgur.com/3fbYPQQ.png"
                if (weight==35 && value ==30) // good
                    return "https://i.imgur.com/pYUGiDb.png"
                if (weight==100 && value ==74)// good
                    return "https://i.imgur.com/3MkOfFy.png"
                if (weight==95 && value ==85)// good
                    return "https://i.imgur.com/jSDRcXG.png"


            }
            else{

                if (weight==50 && value ==37)
                    return "https://i.imgur.com/FX0nbLq.png"
                if (weight==820 && value ==72)
                    return "https://i.imgur.com/Mwa4Seg.png"
                if (weight==700 && value ==106)
                    return "https://i.imgur.com/ZsumLFO.png"
                if (weight==46 && value ==32)
                    return "https://i.imgur.com/a08mzOe.png"
                if (weight==220 && value ==45)
                    return "https://i.imgur.com/rinRqzu.png"
                if (weight==530 && value ==71)
                    return "https://i.imgur.com/MGbaRNk.png"
                if (weight==107 && value ==23)
                    return "https://i.imgur.com/x4AwGTz.png"
                if (weight==180 && value ==44)
                    return "https://i.imgur.com/CBLRwne.png"
                if (weight==435 && value ==85)
                    return "https://i.imgur.com/0aQVg1e.png"
                if (weight==360 && value ==62)
                    return "https://i.imgur.com/O4z7GzW.png"

                if (weight==22 && value ==26)
                    return "https://i.imgur.com/N3yeSwb.png"
                if (weight==21 && value ==18)
                    return "https://i.imgur.com/Lr5LywE.png"
                if (weight==45 && value ==40)
                    return "https://i.imgur.com/0gbYM6i.png"
                if (weight==43 && value ==33)
                    return "https://i.imgur.com/d8UVZmC.png"
                if (weight==26 && value ==32)
                    return "https://i.imgur.com/YQdLza6.png"
                if (weight==52 && value ==59)
                    return "https://i.imgur.com/9ivTMzw.png"
                if(weight==48 && value ==47)
                    return "https://i.imgur.com/eLQw9XX.png"
                if (weight==55 && value ==45)
                    return "https://i.imgur.com/i8WWkCW.png"
                if (weight==95 && value ==85)
                    return "https://i.imgur.com/5RxTDzP.png"
                if (weight==85 && value ==79)
                    return "https://i.imgur.com/NlWp98C.png"

                if (weight==4 && value ==3)
                    return "https://i.imgur.com/TCZOyf5.png"
                if (weight==10 && value ==2)
                    return "https://i.imgur.com/je9SWnO.png"
                if (weight==4 && value ==4)
                    return "https://i.imgur.com/qxzCzTl.png"
                if (weight==7 && value ==5)
                    return "https://i.imgur.com/DPSbcPu.png"
                if (weight==8 && value ==7)
                    return "https://i.imgur.com/PBoAC1h.png"
                if (weight==4 && value ==7)
                    return "https://i.imgur.com/Xoej7Ch.png"
                if (weight==8 && value ==8)
                    return "https://i.imgur.com/9MZybHx.png"
                if (weight==10 && value ==8)
                    return "https://i.imgur.com/ubWZyzL.png"
                if (weight==6 && value ==9)
                    return "https://i.imgur.com/S8nXpJk.png"
                if (weight==12 && value ==11)
                    return "https://i.imgur.com/MsSTfhE.png"

                if (weight==20 && value ==30)
                    return "https://i.imgur.com/9YHfM7K.png"
                if (weight==50 && value ==42)
                    return "https://i.imgur.com/NEHspeN.png"
                if (weight==27 && value ==38)
                    return "https://i.imgur.com/TWOWq5k.png"
                if (weight==25 && value ==66)
                    return "https://i.imgur.com/vCn9hRf.png"
                if (weight==26 && value ==69)
                    return "https://i.imgur.com/XIHPpWG.png"
                if (weight==34 && value ==70)
                    return "https://i.imgur.com/ONP0C4z.png"
                if (weight==50 && value ==86)
                    return "https://i.imgur.com/irEHeMQ.png"
                if (weight==33 && value ==85)
                    return "https://i.imgur.com/gVdg92i.png"
                if (weight==55 && value ==97)
                    return "https://i.imgur.com/ET4ZbT2.png"
                if (weight==41 && value ==112)
                    return "https://i.imgur.com/xIHsaff.png"
                if (weight==35 && value ==30)
                    return "https://i.imgur.com/9yvt09E.png"
                if (weight==100 && value ==74)
                    return "https://i.imgur.com/SbveVWy.png"
                if (weight==95 && value ==85)
                    return "https://i.imgur.com/kvgsQzJ.png"
            }

        }


        $scope.setStylish = function (weight,value) {
            if ($scope.countTopPres>=10){
                $scope.countTopPres=0;
            }
            if ($scope.countLeftPres>=10){
                $scope.countLeftPres=0;
            }
            //value presentation
            ////console.log("countLeft: "+$scope.countLeftPres)
            ////console.log("countTop: "+$scope.countTopPres)
            ////console.log("top: "+$scope.top[$scope.countTopPres])
            ////console.log("left: "+$scope.left[$scope.countLeftPres])
            //////console.log("byValue: "+$scope.byValue)
            myObj = {
                //"cursor": "pointer",
                "width": "15%",
                "position": "absolute",
                "top": $scope.top[$scope.countTopPres]+"%",
                "left": $scope.left[$scope.countLeftPres]+"%"
                // "top": "10%",
                // "left": "10%"

            }
            $scope.countLeftPres++;
            $scope.countTopPres++;
            return myObj;
        }

        function heaviestOfOpt(){
            ////console.log("puzzle is" + puzzle);
            if(puzzle == 2){
                $scope.heavy1 = 820;
                $scope.heavy2 = 435;//correct
                $scope.heavy3 = 700;
                $scope.heavy4 = 530;
            }
            if(puzzle == 3){
                $scope.heavy1 = 26;
                $scope.heavy2 = 52;
                $scope.heavy3 = 22;
                $scope.heavy4 = 85;
            }
            if(puzzle == 4){
                $scope.heavy1 = 12;
                $scope.heavy2 = 8;
                $scope.heavy3 = 6;
                $scope.heavy4 = 10;
            }
            if(puzzle == 5){
                $scope.heavy1 = 55;
                $scope.heavy2 = 41;
                $scope.heavy3 = 50;
                $scope.heavy4 = 55;
            }




            //  puzzle   correct    random values
            //  2        435     , 360, 220, 180
            //  3        52       ,26,22, 85
            //  4         8       12  , 10, 6
            //  5         41,     50 , 55 , 34
        }
        function generateRandomNumber(min,max) {


            let highlightedNumber = Math.floor(Math.random() * (max - min) + min);
            if(highlightedNumber== 2 || highlightedNumber== 3) {
                return 2;
            }
            else return 5;


            //alert(highlightedNumber);
        };
    })
