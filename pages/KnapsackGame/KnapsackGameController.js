

angular.module("sudokuApp")
    .controller("KnapsackGameController", function ($scope, $http, $location,$rootScope, $interval, $window) {


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

        $rootScope.userID = sessionStorage.getItem("userID");
        
        var GameID;
        var items;// array, for each item : weight,value,inbag
        var bagsize;
        var sizeUsed = 0;
        var valueGained = 0;
        var weightRemain = bagsize - sizeUsed;
        var objNum=0;
        var presentation = 2;
        var interval;
        var second;
        var minute;
        let a = Math.floor(Math.random()* (5)+7)
        $scope.sizes = [Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7),Math.floor(Math.random()* (5)+7)]
        //$scope.sizes = [15,18,22,23,19,18,17,15,16,19]
        ////console.log($scope.sizes)
        $scope.count= 0;

        $scope.gameStarted = false;

        //range in the modal
        $scope.rangeValue = "---";

        $scope.colors = false;
        $scope.typeCase = false;
        $scope.loading = true;
        $scope.message = null;

        ///////////////////////////
        $scope.top = [10,10,10,10,35,35,35,35,60,60,60,60,85,85,85,85];
        $scope.left = [3,20,37,54,3,20,37,54,3,20,37,54,3,20,37];
        $scope.countTop = 0;
        $scope.countLeft =0;
        $scope.pres = sessionStorage.getItem("KSpresentation");
        ////console.log("presKS= "+$scope.pres);
        // $rootScope.leftBool = false;
        // $rootScope.topBool = false;

        $rootScope.instance = sessionStorage.getItem("KSProblem");
        sessionStorage.setItem("plaster",$rootScope.instance);
        var PuzzleID = $rootScope.instance;
        
        $scope.pres2ByWeight = [6.9,12 ,11 ,6.5 ,8.5 ,10.5 ,7.5 ,7.8 ,9.7 ,9 ,7.2,7,6.7]
        $scope.pres3ByWeight = [11.5,7 ,10 ,6.5 ,6.7 ,12.2 ,9 ,9.4 ,11 ,10.7 ]
        $scope.pres4ByWeight = [8,9.5 ,6.5 ,11 ,6.5 , 7.5,6.5 ,11 ,12.5 ,9.5 ]
        $scope.pres5ByWeight = [7.4,11.8 ,10 ,7.2 ,7 , 12.5,9.8 ,9.5 ,11.8 ,6.5 ]

        $scope.pres2ByValue = [7.1,10.0 ,12.5 ,6.9 ,8.1 ,9.8 ,6.5 ,8 ,10.5 ,9 ,10.1,11,7.1]
        $scope.pres3ByValue = [11.5 ,7.4 ,8.9 ,6.5 ,6.9 ,12.5 ,7.6 ,8 ,8.5 ,10.2 ]
        $scope.pres4ByValue = [8 ,10 ,7 ,6.5 ,9 ,10.8 ,7.5 ,10 ,12.5 ,9 ]
        $scope.pres5ByValue = [6.9 ,9.2 ,12.5 ,8.4 ,8.1 ,11 ,8.5 ,9 ,7.2 ,6.5]


        /////////////////////~!~!~!~
        $scope.txtPos = 7;
        $scope.valueGained =0;
        $scope.sizeUsed = 0;
        $scope.objectNumber = null;

        $scope.bagsize = 0;
        $scope.weightRemain = $scope.bagsize - $scope.sizeUsed;
        $scope.coins = [
            { value: 8, weight: 1, checked: false},
            { value: 7, weight: 2, checked: false},
            { value: 6, weight: 3, checked: false},
            { value: 5, weight: 4, checked: false},
            { value: 8, weight: 1, checked: true},
            { value: 7, weight: 2, checked: true},
            { value: 6, weight: 3, checked: true},
            { value: 5, weight: 4, checked: true}
        ];
        /////////////////////~!~!~!~

        var gameTypeToSQL = $scope.pres;
        // if($scope.colors)
        //     gameTypeToSQL = 'color';
        // else
        //     gameTypeToSQL = 'number';
        //load at start

        ////console.log("no init"+$rootScope.userID);


        //var for the user chose the range of difficulty
        document.getElementById("startGameKS").disabled = true;


        $rootScope.userID = JSON.parse(sessionStorage.getItem("userID"));
        $rootScope.gameInstance=JSON.parse(sessionStorage.getItem("gameInstance"));


        $scope.move = function(field, sudokuBoard, row, col, val) {

            let stringsecond = second;
            if (second < 10)
                stringsecond = "0" + second;
            let stringminute = minute;
            if (minute < 10)
                stringminute = "0" + minute;

            $http({

                method: 'POST',
                url: 'https://serverdecisionsmaking.herokuapp.com/Knapsack/insertMove',
                data: {
                    "GameID": "" +sessionStorage.getItem("GameID"),
                    "itemWeight": + itemWeight,
                    "var itemValue": + itemValue,
                    "time": "" + stringminute + ":" + stringsecond + ""
                }
            })
                .then(function (response) {

                    //add to the board 2d array

                }, function (response) {
                    // $scope.records = response.statusText;
                });
        };

        //stop after 4 minutes
        $scope.timer = function (){

            $scope.gameStarted = true;
            console.log("hereTimer");

            second = sessionStorage.getItem("second") || 1;
            minute = sessionStorage.getItem("minute") || 2;  //TODO CHANGE TO 4

            //init an interval of countdown
            interval= $interval(function() {
                second = second - 1;
                if(second <= -1) {
                    minute = minute - 1;
                    second = 59;
                }

                sessionStorage.setItem("minute", minute);
                sessionStorage.setItem("second", second);

                if(minute <= -1) {
                    //finish game
                    second= 0;
                    minute = 0;
                    $interval.cancel(interval);
                    document.getElementById("statusKS").innerHTML = "Game Over";
                    $window.alert("Game Over");
                    $scope.finishGame();
                    $location.url('/finishQuestion');
                }

                var length = $location.absUrl().length;
                var gameLocation = $location.absUrl().substring(length-4,length);

                if(gameLocation != "Game"){
                    clearInterval(interval);

                }

                if(document.getElementById("statusKS") != null){

                    console.log("hereInnerrrr");
                    document.getElementById("statusKS").innerHTML = "Time Left: "
                        + minute + "m " + second + "s ";
                }


            }, 1000)


        };


        //init board and game
        $scope.init = function(){

            second = sessionStorage.getItem("second") || 1;
            minute = sessionStorage.getItem("minute") || 2; //TODO CHANGE TO 4

            ////console.log("inittttttttttttt");
            $scope.beginDate = new Date()


            /**
             * get board
             */
            $http ({

                method: 'GET',
                url:'https://serverdecisionsmaking.herokuapp.com/Knapsack/getBoard/'+$rootScope.instance})
                .then(function(response) {

                    // PuzzleID = response.data[0].PuzzleID;
                    // // $scope.sudokuBoard = board;
                    //// //console.log(PuzzleID);
                    let stringweights = response.data[0].itemweights;
                    let stringvalues =  response.data[0].itemvalues;
                    bagsize = parseFloat(response.data[0].bagsize);
                    $scope.byWeight = []
                    $scope.byValue = []
                    $scope.bagsize = bagsize
                    $scope.weightRemain = $scope.bagsize - $scope.sizeUsed;
                    const weights = stringweights.split(',');
                    const values = stringvalues.split(',');
                    items = new Array (weights.length);
                    $scope.objectNumber = weights.length;

                    for(let index = 0 ; index < weights.length; index++){
                        $scope.noOfItems= $scope.noOfItems +1;
                        items[index] = new Array(3);
                        items[index][0] = parseFloat(weights[index]);
                        items[index][1] = parseFloat(values[index]);
                        items[index][2] = false;
                        $scope.byWeight[index] = (Math.floor(items[index][0])/1000)+1;
                        $scope.byValue[index] = (Math.floor(items[index][1])/120)+1;
                    }
                    //////console.log(items+" init");
                    $scope.items = items;
                    $scope.loading = false;

                    //post request for create new game in KSToUser
                    ////console.log(gameTypeToSQL);
                    ////console.log("~!~");
                    ////console.log($rootScope.userID);
                    $http ({


                        method: 'POST',
                        url:'https://serverdecisionsmaking.herokuapp.com/Knapsack/createNewGame',
                        data: {
                            "userID":""+$rootScope.userID,
                            "puzzleID":""+$rootScope.instance,
                            "type":""+gameTypeToSQL

                        }})
                        .then(function(response) {

                            $http ({
                                method: 'GET',
                                url:'https://serverdecisionsmaking.herokuapp.com/Knapsack/getGameID'
                            })
                                .then(function(response) {
                                    // GameID = response.data.length;
                                    //////console.log("GameID=== "+response.data.length);
                                    GameID = Object.values(response.data[0])[0];
                                    $rootScope.GameID = GameID;
                                    sessionStorage.setItem("GameID",GameID);
                                    $scope.bagSize=bagsize;


                                }, function(response) {
                                    // $scope.records = response.statusText;
                                });
                        }, function(response) {
                            // $scope.records = response.statusText;
                        });

                }, function(response) {
                    // $scope.records = response.statusText;
                });


            setTimeout(function() {
                console.log("hereTIMEOUT");
                if(sessionStorage.getItem("second")== null){
                    $('#myModalKS').modal();
                }else{
                    $scope.timer();
                }

            }, 2000);

        }

        $scope.submitDifficultyAndFamiliarity = function () {

            document.getElementById("startGameKS").disabled = false;
            var answer = document.getElementById("myRangeKS").value;
            ////console.log("userIDNew= "+$rootScope.userID);
            ////console.log("gameIDNew= "+$rootScope.GameID);
            ////console.log("gameIDNew= "+$rootScope.GameID);
            ////console.log("fam iss" +(sessionStorage.getItem("familiarityKS")));
            ////console.log("fam iss" +(JSON.parse(sessionStorage.getItem("familiarityKS"))));
            //documentation
            $http({

                method: 'POST',
                url: 'https://serverdecisionsmaking.herokuapp.com/Knapsack/submitFamiliarityAndDifficultyEstimateBefore',
                data: {
                    "gameID": "" + sessionStorage.getItem("GameID"),
                    "userID": ""+ $rootScope.userID,
                    "difBefore": ""+ answer,
                    "familiarity": JSON.parse(sessionStorage.getItem("familiarityKS"))

                }
            })
                .then(function (response) {


                }, function (response) {
                    // $scope.records = response.statusText;
                });


        }

        $scope.changeRange = function () {

            $scope.rangeValue = document.getElementById("myRangeKS").value;



        }

        $scope.finishGameYesOrNo = function(){

            $('#myModal2KS').modal();



        }



        $scope.finishGame = function(){

            $interval.cancel(interval);
            sessionStorage.removeItem("minute");
            sessionStorage.removeItem("second");

            var newProb = generateRandomNumber(2,5);
            ////console.log("whileKSSSS: "+newProb.toString());
            while (newProb.toString() == sessionStorage.getItem("KSProblem").toString()){
                ////console.log("whileKSSSS: "+newProb.toString());
                newProb = generateRandomNumber(2,5);
            }
            sessionStorage.setItem("KSProblem",newProb);
            endDate = new Date();
            let diff = Math.abs($scope.beginDate-endDate); //game time in ms
            let userAns = "";
            let solValue = 0;
            let solWeight = 0;
            ////console.log(GameID+"!@!");
            ////console.log(PuzzleID+"~!~");
            //////console.log(userID);
            sessionStorage.setItem("items",JSON.stringify(items));
            for (let i=0;i<items.length; i++){

                if (items[i][2]){
                    userAns = userAns+"{"+items[i][0].toString()+","+items[i][1].toString()+"}";
                    solWeight = solWeight + items[i][0];
                    solValue = solValue + items[i][1];
                }
            }
            ////console.log(solValue+"!@!");
            ////console.log(solWeight+"~!~");
            diff = diff *0.001;

            $http({

                method: 'POST',
                url: 'https://serverdecisionsmaking.herokuapp.com/Knapsack/finishGame',
                data: {
                    "totalTime": "" + diff,
                    "Solution": "" + userAns,
                    "GameID": "" + sessionStorage.getItem("GameID"),
                    "PuzzleID": "" + PuzzleID,
                    "solutionWeight": "" + solWeight,
                    "solutionValue": "" + solValue,


                }
            })
                .then(function (response) {
                    ////console.log("fuck");

                }, function (response) {
                    ////console.log("shit");
                    //TODO fail
                });

            //////console.log(userAns)
            //////console.log(diff*0.001+"rewq")

            // document.getElementById("status").innerHTML = "Game Over";
            // document.getElementById("finish").hidden= true;

            //pass to the finish questionarrie
            // clearInterval(interval);
            $location.url('/finishQuestion');
            let weightSol = ""
            //for (let i = 0; i<)



        }
        $scope.coinClicked = function (item) {
            console.log("clicked")
            let stringsecond = second;
            if (second < 10)
                stringsecond = "0" + second;
            let stringminute = minute;
            if (minute < 10)
                stringminute = "0" + minute;
            //////console.log(item);
            let itemWeight = item[0];
            let itemValue = item[1];
            let itemInBag = item[2];
            let Uid = $rootScope.userID;
            var type;
            if (!itemInBag)
                type = "insert";
            else
                type = "extract";
            if ((itemWeight + sizeUsed <= bagsize && itemInBag == false) || itemInBag) {//legal move
                console.log("min: "+stringminute)
                console.log("sec: "+stringsecond)
                console.log(stringminute + ":" + stringsecond)
                var timeToDb = stringminute + ":" + stringsecond;
                $http({

                    method: 'POST',
                    url: 'https://serverdecisionsmaking.herokuapp.com/Knapsack/insertMove',
                    data: {
                        "GameID": "" + sessionStorage.getItem("GameID"),
                        "itemWeight": "" + itemWeight,
                        "itemValue": "" + itemValue,
                        "userID":""+ Uid,
                        "type": "" + type,
                        "time": "" + timeToDb
                    }
                })
                    .then(function (response) {
                        updateBag(item[0], item[1],itemInBag);
                        item[2] = !item[2];

                    }, function (response) {
                        //TODO fail
                    });
            }
            else{
                //TODO
                window.alert("impossible move, not enough space in the bag");
            }

        }


        function updateBag(changedWeight, changedValue, itemInBag){
            // positive values for insertion.
            
            if(itemInBag) {
                changedWeight *= -1;
                changedValue *= -1;
            }
            valueGained+=changedValue;
            sizeUsed+=changedWeight;
            //// //console.log(sizeUsed);
            //// //console.log(valueGained);
            $scope.sizeUsed = sizeUsed;
            $scope.valueGained = valueGained;
            $scope.weightRemain = $scope.bagsize - $scope.sizeUsed;

        }
        $scope.drawCoin = function (isChosen, weight,value) {
            //// //console.log("value-"+value)
            //// //console.log("weight-"+weight)
            //// //console.log($scope.items);

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
                if (weight==35 && value ==30)
                    return "https://i.imgur.com/9yvt09E.png"
                if (weight==100 && value ==74)
                    return "https://i.imgur.com/SbveVWy.png"
                if (weight==95 && value ==85)
                    return "https://i.imgur.com/kvgsQzJ.png"

            }
            else{
                if (weight==35 && value ==30)
                    return "https://i.imgur.com/pYUGiDb.png"
                if (weight==100 && value ==74)
                    return "https://i.imgur.com/3MkOfFy.png"
                if (weight==95 && value ==85)
                    return "https://i.imgur.com/jSDRcXG.png"
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
                if (weight==48 && value ==47)
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

            }
            // if (!item)
            //     return $scope.coin;
            // else
            //     return $scope.chosen;

        }
        $scope.setStyle = function (weight,value) {
            //// //console.log(weight);
            //// //console.log(value);
            //// ////console.log(a)

            //standart presentation
            if ($scope.pres == 3) {
                     myObj = {
                     "cursor": "pointer",
                     "width": "10%",
                     "position": "absolute",
                     "top": $scope.top[$scope.countTop]+"%",
                     "left": $scope.left[$scope.countLeft]+"%"
                }
                $scope.countLeft++;
                $scope.countTop++;

                return myObj;
            }

            //mix presentation
            if ($scope.pres == 2) {
                var a = $scope.sizes[$scope.count];
                $scope.count++;
                myObj = {
                    "cursor": "pointer",
                    "width": a + "%",
                    "position": "absolute",
                    "top": $scope.top[$scope.countTop]+"%",
                    "left": $scope.left[$scope.countLeft]+"%"
                }
                $scope.countLeft++;
                $scope.countTop++;
                return myObj;
            }



            //weight presentation
            if ($scope.pres == 0){
                //////console.log("byWeight: "+$scope.byWeight)
                if ($scope.instance == 2)
                    var a = $scope.pres2ByWeight[$scope.count];
                if ($scope.instance == 3)
                    var a = $scope.pres3ByWeight[$scope.count];
                if ($scope.instance == 4)
                    var a = $scope.pres4ByWeight[$scope.count];
                if ($scope.instance == 5)
                    var a = $scope.pres5ByWeight[$scope.count];

                $scope.count = $scope.count + 1
                myObj = {
                    "cursor": "pointer",
                    "width": a + "%",
                    "position": "absolute",
                    "top": $scope.top[$scope.countTop]+"%",
                    "left": $scope.left[$scope.countLeft]+"%"
                }
                $scope.countLeft++;
                $scope.countTop++;
                return myObj;

            }


            //value presentation
            if ($scope.pres == 1){

                //////console.log("byValue: "+$scope.byValue)
                if ($scope.instance == 2)
                    var a = $scope.pres2ByValue[$scope.count];
                if ($scope.instance == 3)
                    var a = $scope.pres3ByValue[$scope.count];
                if ($scope.instance == 4)
                    var a = $scope.pres4ByValue[$scope.count];
                if ($scope.instance == 5)
                    var a = $scope.pres5ByValue[$scope.count];

                $scope.count = $scope.count + 1
                myObj = {
                    "cursor": "pointer",
                    "width": a + "%",
                    "position": "absolute",
                    "top": $scope.top[$scope.countTop]+"%",
                    "left": $scope.left[$scope.countLeft]+"%"

                }
                $scope.countLeft++;
                $scope.countTop++;
                return myObj;

                //// //console.log($scope.byValue)
                // var a = $scope.byValue[$scope.count]*10;
                // $scope.count = $scope.count + 1
                //
                // myObj = {
                //     "width": a + "%",
                //     "position": "absolute",
                //     "top": $scope.top[$scope.countTop]+"%",
                //     "left": $scope.left[$scope.countLeft]+"%"
                // }
                // $scope.countLeft++;
                // $scope.countTop++;
                // return myObj;
            }
        }
        function generateRandomNumber(min,max) {

                let highlightedNumber = Math.floor(Math.random() * (max - min) + min);
                if(highlightedNumber== 2 || highlightedNumber== 3)
                    return 2;
                else return 5;


            //alert(highlightedNumber);
        };


    });










