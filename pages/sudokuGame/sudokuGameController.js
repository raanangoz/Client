
//numberOfCellsChanged
angular.module("sudokuApp")
    .controller("sudokuGameController", function ($scope, $http, $location,$rootScope, $window, $timeout, $interval) {

        window.onbeforeunload = function(event) {
            // do some stuff here, like reloading your current state
            //this would work only if the user chooses not to leave the page
            return 'why would you do that???';
        }

        $rootScope.userID = JSON.parse(sessionStorage.getItem("userID"));
        $rootScope.gameInstance=JSON.parse(sessionStorage.getItem("gameInstance"));

        //range in the modal
        $scope.rangeValue = "---";


        $(document).ready(function() {
            function disablePrev() { window.history.forward() }
            window.onload = disablePrev();
            window.onpageshow = function(evt) { if (evt.persisted) disableBack() }
        });

        // document.getElementById("submitRange").disabled = "true";
        // var rangeModal = document.getElementById("myRange");
        // var defaultVal = rangeModal.defaultValue;
        // var currentVal = rangeModal.value;
        // rangeModal.defaultValue = currentVal;
        // //console.log("defaultRange= "+rangeModal.defaultValue);

        //for saving the board in case of refresh
        $scope.gameStarted = false;

        $rootScope.numberOfCellsChanged= 0;
        sessionStorage.setItem("numberOfCellsChanged","0");
        //object for the board
        var box = {value:"0", isIcon:"true"};
        var board_initial_to_compare;

        // var userID = $rootScope.userId;
        var PuzzleID;
        var interval;
        var GameID;
        var PuzzleIDRandom;

        $scope.initialBoard = [];


        let second = 1000;
        let minute = 1000 * 60;

        $scope.colors = false;

        //false if the type is numbers
        $scope.typeCase = false;
        $scope.loading = true;
        $scope.message = null;

        //false if the user did not clicked yet
        $scope.clicked=false;

        var gameTypeToSQL = 'number';

        if($scope.colors)
            gameTypeToSQL = 'color';
        else
            gameTypeToSQL = 'number';



        //var for the user chose the range of difficulty
        document.getElementById("startGame").disabled = true;
        //load at start
        $scope.move = function(field, sudokuBoard, row, col, val) {

            //console.log("row: " + row + ", col : " + col + ", val: " + val);
            let stringsecond = second;
            if (second < 10)
                stringsecond = "0" + second;
            let stringminute = minute;
            if (minute < 10)
                stringminute = "0" + minute;
            $scope.sudokuBoard[row][col] = '';
            //console.log("gameID===="+GameID);

            var value;
            var legalNum = false;

            //move of delete
            if(val == "" ){
                //console.log("hereDelete123");
                value = "";

            }

            //move of insert
            else{

                value = Number(val);
                //console.log("value= "+value);
                if (value >= 1 && value <= 9) {
                    $scope.sudokuBoard[row][col] = value;
                    legalNum = true;
                }
            }

            if( value == "" || legalNum){

                $http({

                    method: 'POST',
                    url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/move',
                    data: {
                        "GameID": "" + GameID,
                        "stepValueAndCords": "" + row + "" + "" + col + "" + "" + value + "",
                        "time": "" + stringminute + ":" + stringsecond + ""
                    }
                })
                    .then(function (response) {
                        updateSessionBoard(row,col,value);
                        //add to the board 2d array

                    }, function (response) {
                        // $scope.records = response.statusText;
                    });


            }



            // if(val == 1){
            //     $scope.sudokuBoard[row][col]= 1;
            // }

            //
            //
            //
            //     $scope.conflictRow = null;
            //     $scope.conflictCol = null;
            //
            //     if( val != '') {
            //
            //         var data = {
            //             sudokuBoard : sudokuBoard,
            //             moveRow : row,
            //             moveColumn : col,
            //             moveValue : val
            //
            //         }
            //
            //         $http.put('https://afternoon-mountain-94217.herokuapp.com/sudoku/', JSON.stringify(data) )
            //             .then(
            //
            //                 function(response){
            //                     //console.log(response);
            //                     $scope.message = response.statusText;
            //                     if(response.statusText == "OK" && response.data.gameOver == true){
            //                         $scope.message = "You won!"
            //                     }
            //                     //setting values to null if the response is OK
            //                     //$scope.conflictRow = null;
            //                     //$scope.conflictCol = null;
            //                 },
            //                 function(response){
            //                     //setting values to null if the response is bad request
            //
            //                     $scope.message = response.statusText;
            //                     // invalid response
            //                     if(response.statusText == "Conflict"){
            //                         //$scope.conflict = true;
            //                         $scope.conflictRow = response.data.conflictRow;
            //                         $scope.conflictCol = response.data.conflictColumn;
            //                     }
            //                 }
            //             );
            //     }

            // strip out the non-numbers


        };

        // $scope.pressedKey = function(keyObj) {
        //     $scope.myKey = keyObj.key;
        // }

        //stop after 15 minutes
        $scope.timer = function (){



            $scope.gameStarted = true;
            //document.getElementById("finish").disabled = "false";
            //console.log("hereTimer");

            // let second = 1000;
            // let minute = 1000 * 60;
            let countDown = new Date();

            //define the time + 15 minutes
            countDown.setMinutes ( countDown.getMinutes() + 15 );  //15
            // let now = new Date().getTime();
            let distance = 0;

            //init an interval of countdown
            interval= $interval(function() {

                let now = new Date().getTime();
                // let distance= countDown - now;
                // if(sessionStorage.getItem("distance") != null){
                //     distance = sessionStorage.getItem("distance");
                // }else{
                //     distance= countDown - now;
                // }

                let distance = countDown - now;
                //console.log("distance= "+distance);
                // if(sessionStorage.getItem("distance") == null){
                //     distance = countDown - now;
                // }else{
                //     distance = sessionStorage.getItem("distance");
                // }
                // sessionStorage.setItem("distance", distance);

                // if(sessionStorage.getItem("minute") != 1000){
                //     minute = sessionStorage.getItem("minute");
                // }else{
                //     minute =  Math.floor((distance % (60 *60 *1000)) / (60*1000));
                // }
                //
                // if(sessionStorage.getItem("second") != 1000 * 60){
                //     minute = sessionStorage.getItem("minute");
                // }else{
                //     minute =  Math.floor((distance % (60 *1000)) / 1000);
                // }

                // minute = sessionStorage.getItem("minute");
                minute = Math.floor((distance % (60 *60 *1000)) / (60*1000));
                // sessionStorage.setItem("minute", minute);

                // second = sessionStorage.getItem("second");
                second = Math.floor((distance % (60 *1000)) / 1000);
                // sessionStorage.setItem("second", second);

                var length = $location.absUrl().length;
                var gameLocation = $location.absUrl().substring(length-4,length);
                // //console.log("length= "+length);
                // //console.log("yes: "+$location.absUrl().substring(length-4,length));

                if(gameLocation != "Game"){
                    clearInterval(interval);

                }

                if(document.getElementById("status") != null){

                    //console.log("hereInnerrrr");
                    document.getElementById("status").innerHTML = "Time Left: "
                        + minute + "m " + second + "s ";
                }

                //game over
                if (distance < 0) {
                    $interval.cancel(interval);
                    document.getElementById("status").innerHTML = "Game Over";
                    $window.alert("Game Over");
                    $scope.finishGame();
                    $location.url('/finishQuestion');
                }

            }, 1000)

            //show "game over" after 15 minutes
            // $timeout(function() {
            //     document.getElementById("status").innerHTML = "Game Over";
            //     alert("Game Over");
            //     clearInterval(interval);
            //     //console.log("hereTimeOut101010");
            //     $location.url('/finishQuestion');
            //
            // },8000);   //900000



        };


        //init board and game
        $scope.init = function(){

            if(sessionStorage.getItem("second")== null){
                second = 1000;

            }else{
                second = sessionStorage.getItem("second");
            }
            if(sessionStorage.getItem("minute")== null){

                minute = 1000 * 60;

            }else{
                minute = sessionStorage.getItem("second");
            }


            //document.getElementById("finish").disabled = "true";
            $rootScope.gameInstance=JSON.parse(sessionStorage.getItem("gameInstance"));
            $rootScope.userID = JSON.parse(sessionStorage.getItem("userID"));

            //random 1/2 for choosing the instance of the board
            if(sessionStorage.getItem("PuzzleIDRandom") == null){
                //console.log("hereSessionPuzzle");
                PuzzleIDRandom = Math.floor(Math.random() * 2);
                sessionStorage.setItem("PuzzleIDRandom", ""+PuzzleIDRandom);

            }else{
                if(sessionStorage.getItem("PuzzleIDRandom") =="0"){
                    PuzzleIDRandom = 1;

                }else{
                    PuzzleIDRandom = 0;
                }
            }

            //console.log("hereInitttttttttttttttttttttttttt");
            //requests
            $http ({

                method: 'GET',
                url:'https://serverdecisionsmaking.herokuapp.com/Sudoku/getBoard/'+PuzzleIDRandom})
                .then(function(response) {
                    PuzzleID = response.data[0].PuzzleID;
                    const boardString = response.data[0].board;
                    board_initial_to_compare = boardString;
                    // //console.log(response.data)
                    // //console.log("boardString = "+boardString);
                    const numbersArray = boardString.split(',');
                    let board = [], rowSliced, rowSliced2;
                    for(let i = 0; i < 81; i = i + 9) {
                        rowSliced = numbersArray.slice(i, i + 9);
                        rowSliced2 = numbersArray.slice(i, i + 9);

                        // rowSliced2 = rowSliced2.map(function(strVal){return {value: strVal, isIcon: false} });
                        board.push(rowSliced);
                        $scope.initialBoard.push(rowSliced2);
                    }

                    var objectArray = [];

                    // //console.log("board = " + board);
                    // //console.log("zzz= "+JSON.stringify(response.data[0].board,4,null));
                    // for(let j=0; j<9; j++){
                    //     var box1 = new box();
                    //     objectArray[j][j]= new box(board[j][j], false);
                    // }
                    $scope.sudokuBoard = board;
                    sessionStorage.setItem("solutionBoard", JSON.stringify(board));

                    //numbers type
                    if($rootScope.gameInstance==0){


                        /** replace the zeros with white spaces */
                        for(var i= 0; i< $scope.sudokuBoard.length; i++){

                            angular.forEach($scope.sudokuBoard[i], function (val, key) {
                                if( val == 0){
                                    $scope.sudokuBoard[i][key] = '';
                                }
                            });
                        }

                        //colors type
                    }else{

                        $scope.colors = !$scope.colors;
                        $scope.typeCase = !$scope.typeCase;

                        //update gameType
                        if($scope.colors)
                            gameTypeToSQL = 'color';
                        else
                            gameTypeToSQL = 'number';

                        /** replace the zeros with white spaces */
                        for(var i= 0; i< $scope.sudokuBoard.length; i++){

                            angular.forEach($scope.sudokuBoard[i], function (val, key) {
                                if( val == 0){
                                    $scope.sudokuBoard[i][key] = '';
                                }

                                if(val==1){
                                    // //console.log("here111111");
                                    // $scope.sudokuBoard[$scope.row][$scope.index] =1;
                                    // $scope.sudokuBoard[i][key] = '';
                                    $scope.sudokuBoard[i][key] = 1;
                                }
                                if(val==2){
                                    // //console.log("here2222222");
                                    $scope.sudokuBoard[i][key] = 2;
                                }
                                if(val==3){
                                    $scope.sudokuBoard[i][key] = 3;
                                }
                                if(val==4){
                                    $scope.sudokuBoard[i][key] = 4;
                                }
                                if(val==5){
                                    $scope.sudokuBoard[i][key] = 5;
                                }
                                if(val==6){
                                    $scope.sudokuBoard[i][key] = 6;
                                }
                                if(val==7){
                                    $scope.sudokuBoard[i][key] = 7;
                                }
                                if(val==8){
                                    $scope.sudokuBoard[i][key] = 8;
                                }
                                if(val==9){
                                    $scope.sudokuBoard[i][key] = 9;
                                }

                            });

                        }

                        //console.log("print board initial: ");
                        console.dir($scope.sudokuBoard);
                    }

                    $scope.loading = false;

                    //post request for create new game in SudokuToUser
                    $http ({


                        method: 'POST',
                        url:'https://serverdecisionsmaking.herokuapp.com/Sudoku/createNewGame',
                        data: {
                            "userID":""+sessionStorage.getItem("userID"),
                            "puzzleID":""+PuzzleIDRandom,
                            "type":""+gameTypeToSQL
                        }})
                        .then(function(response) {

                            $http ({
                                method: 'GET',
                                url:'https://serverdecisionsmaking.herokuapp.com/Sudoku/getGameID'
                            })
                                .then(function(response) {
                                    // GameID = response.data.length;
                                    ////console.log("GameID=== "+response.data.length);
                                    GameID = Object.values(response.data[0])[0];
                                    $rootScope.GameID = GameID;
                                    sessionStorage.setItem("GameID",GameID);
                                    console.dir(GameID);


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
                //console.log("hereTIMEOUT");
                $('#myModal').modal();
            }, 2000);
            // setTimeout(modalQuestion, 1000);



        }



        function modalQuestion(){

            exampleModal.style.display = 'block';


        }


        $scope.finishGameYesOrNo = function(){

            var filledWhole = true;
            // check if filled the whole boxes
            for (var i = 0; i < $scope.initialBoard.length ; i++) {
                for (var j = 0; j < $scope.initialBoard.length ; j++) {

                    if($scope.initialBoard[i][j] === '0' && filledWhole){
                        if($scope.sudokuBoard[i][j] === ''){
                            $window.alert("You have to finish the puzzle first");
                            filledWhole = false;
                        }
                    }
                }

            }

            if(filledWhole){
                $('#myModal2').modal();

            }



        }

        //documentation solution and totalTime
        $scope.finishGame = function(){

            sessionStorage.setItem("newGame","true");
            $interval.cancel(interval);

            //check how many boxes filled
            $rootScope.boxes = 0;
            sessionStorage.setItem("boxes","0");
            for (var i = 0; i < $scope.initialBoard.length ; i++) {
                for (var j = 0; j < $scope.initialBoard.length ; j++) {

                    if($scope.initialBoard[i][j] === '0'){

                        if($scope.sudokuBoard[i][j] != ''){
                            //console.log("hereIfBoxes");
                            $rootScope.boxes ++;
                            sessionStorage.setItem("boxes",$rootScope.boxes);
                            //console.log("boxes"+sessionStorage.getItem("boxes"));
                        }
                    }

                }
            }

            //console.log("newBoxes= "+$rootScope.boxes);

            let totalTime = calculateTotalTime();
            solutionAndTimeToDB(totalTime);

            //pass to the finish questionarrie
            $location.url('/finishQuestion');

        }

        $scope.color = function (field,row,col) {

            if(field==1){

                // //console.log("input= "+sudokuBoard);
                // //console.log("field= "+field);
                //field.style.backgroundColor = "blue";
                //sudokuBoard[$parent.$index][$index].style.backgroundColor= "blue";
                //console.log("row= "+row);
                //console.log("col= "+col);
                //$scope.sudokuBoard[row][col].style.backgroundColor = "blue";
                //document.getElementById("board")[row][col].style.backgroundColor = "blue";
                //console.log("ans= "+document.getElementById("temp"));
                document.getElementById("temp").style.backgroundColor = "blue";
                // $scope.putColor = {
                //
                //     "color" : "white",
                //     "background-color" : "coral",
                //     "font-size" : "10",
                //     "padding" : "50px"
                // }
            }



        }

        //relevant for colors type only
        $scope.onBoxClick = function(field, colIndex, rowIndex){

            if ($scope.initialBoard[rowIndex][colIndex] === '0' && $scope.typeCase) {

                if($scope.sudokuBoard[rowIndex][colIndex] !== ''){

                    //move of delete in colors type
                    var value="";
                    let stringsecond = second;
                    if (second < 10)
                        stringsecond = "0" + second;
                    let stringminute = minute;
                    if (minute < 10)
                        stringminute = "0" + minute;

                    $http({

                        method: 'POST',
                        url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/move',
                        data: {
                            "GameID": "" + $rootScope.GameID,
                            "stepValueAndCords": "" + rowIndex + "" + "" + colIndex + "" + "" + value + "",
                            "time": "" + stringminute + ":" + stringsecond + ""
                        }
                    })
                        .then(function (response) {

                            updateSessionBoard(rowIndex,colIndex,value);
                            //add to the board 2d array

                        }, function (response) {
                            // $scope.records = response.statusText;
                        });


                }

                //press the cell (not for delete)
                $scope.sudokuBoard[rowIndex][colIndex] = '';

            }

        }

        $scope.submitDifficultyAndFamiliarity = function () {

            document.getElementById("startGame").disabled = false;
            var answer = document.getElementById("myRange").value;
            //console.log("userIDNew= "+$rootScope.userID);
            //console.log("gameIDNew= "+$rootScope.GameID);
            //console.log("gameIDNew= "+$rootScope.GameID);
            //console.log("fam iss" +(sessionStorage.getItem("familiaritySudoku")));
            //console.log("fam iss" +(JSON.parse(sessionStorage.getItem("familiaritySudoku"))));


            //documentation
            $http({


                method: 'POST',
                url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/submitFamiliarityAndDifficultyEstimateBefore',
                data: {
                    "gameID": "" + $rootScope.GameID,
                    "userID": ""+ sessionStorage.getItem("userID"),
                    "difBefore": ""+ answer,
                    "familiarity": sessionStorage.getItem("familiaritySudoku")

                }
            })
                .then(function (response) {


                }, function (response) {
                    // $scope.records = response.statusText;
                });




        }

        $scope.changeRange = function () {

            $scope.rangeValue = document.getElementById("myRange").value;



        }

        function solutionAndTimeToDB(time){

            $http({

                method: 'POST',
                url: 'https://serverdecisionsmaking.herokuapp.com/Sudoku/finishGame',
                data: {
                    "gameID": "" + $rootScope.GameID,
                    "solutionBoard":JSON.parse(sessionStorage.getItem("solutionBoard")),
                    "totalTime":""+time,
                    "originalBoard":board_initial_to_compare

                }
            })
                .then(function (response) {
                    let numberOfCellsChanged = response.data[1];
                    $rootScope.numberOfCellsChanged=numberOfCellsChanged;
                    sessionStorage.setItem("numberOfCellsChanged",""+numberOfCellsChanged);
                    //console.log("boxesServer= "+ $rootScope.numberOfCellsChanged);
                }, function (response) {

                });

        }
        function calculateTotalTime(){
            var stringsecond = second;
            if (second < 10){
                stringsecond = "0" + second;

            }
            var intsecond = Number(stringsecond);
            //console.log("intSecond= "+intsecond);

            var stringminute = minute;
            if (minute < 10){
                stringminute = "0" + minute;

            }
            var intminute = Number(stringminute);
            //console.log("intMinute= "+intminute);

            if(intsecond === 00){
                intsecond = 60;
                intminute = intminute -1;
            }

            var totalSeconds = 60- intsecond;
            var totalMinutes = 14- intminute;

            var totalTime = totalMinutes + ":"+ totalSeconds;
            //console.log("totalTime= "+totalTime);
            return totalTime;
        }

        $scope.$watch('range', function(value) {
            //console.log("rangeValue= "+ value);

            if( $scope.rangeValue !== "---"){

                //document.getElementById("submitRange").disabled = "false";
                //console.log("hereIFrRange");
            }


        })

        function updateSessionBoard(row,col,value){

            var storedSolutionBoard = JSON.parse(sessionStorage.getItem("solutionBoard"));
            storedSolutionBoard[row][col]=""+value;


            //console.log(value+"1"+value);
            if(value == ""){

                storedSolutionBoard[row][col]=""+0;

            }
            sessionStorage.setItem("solutionBoard", JSON.stringify(storedSolutionBoard));
        }

    });










