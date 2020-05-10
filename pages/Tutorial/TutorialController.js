angular.module("sudokuApp")
    .controller("TutorialController", function ($scope, $http, $location,$rootScope) {

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

        let familiarityAgainNextSudoku;
        let familiarityAgainPrevSudoku;

        $rootScope.gameInstance=JSON.parse(sessionStorage.getItem("gameInstance"));
        $rootScope.wasSudoko = JSON.parse(sessionStorage.getItem("wasSudoko"));
        console.log("wasSudokuuuuu= "+$rootScope.wasSudoko);

        $scope.init = function () {

            familiarityAgainNextSudoku = false;
            familiarityAgainPrevSudoku = false;
            //if numbers
            console.log("wassudoko)");
            console.log($rootScope.gameInstance);
            if($rootScope.gameInstance == 0){
                console.log("its 0");
                $scope.numbers = true;
                $scope.colors= false;
                // $rootScope.wasSudoko++;
                // sessionStorage.setItem("wasSudoko","true");
                console.log(sessionStorage.getItem("wasSudoko"));
            }

            //if colors
            if($rootScope.gameInstance == 1){
                console.log("its 1");
                $scope.numbers = false;
                $scope.colors= true;
                // $rootScope.wasSudoko++;
                // sessionStorage.setItem("wasSudoko","true");
                console.log(sessionStorage.getItem("wasSudoko"));
            }

            if($rootScope.gameInstance === 2 || $rootScope.gameInstance === 3 ){
                $scope.numbers = false;
                $scope.colors= false;
                $scope.ks= true;
                // $rootScope.wasKS++;
                // sessionStorage.setItem("wasKS","true");

            }


        }




        document.getElementById("prev").style.visibility = "hidden";
        var slideIndex = 1;
        showDivs(slideIndex);


        $scope.plusDivs = function (n) {
            showDivs(slideIndex += n, n);
            familiarityAgainNextSudoku = false;
            familiarityAgainPrevSudoku = false;

        }

        function next(){

            showDivs(slideIndex += 1,1);
            familiarityAgainNextSudoku = true;

        }

        function prev(){

            showDivs(slideIndex -= 1, -1);
            familiarityAgainPrevSudoku = true;


        }



        function showDivs(n, z) {


            document.getElementById("next").innerHTML = "Next >";
            document.getElementById("next").style.width = "70px";
            document.getElementById("next").style.height = "50px";

            if(slideIndex === 1){
                document.getElementById("prev").style.visibility = "hidden";
            }else{
                document.getElementById("prev").style.visibility = "visible";
            }


            var i;
            var x = document.getElementsByClassName("mySlides");
            if (n > x.length) {slideIndex = 1}
            if (n < 1) {slideIndex = x.length} ;
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            x[slideIndex-1].style.display = "block";
            if(slideIndex === x.length){
                document.getElementById("next").style.visibility = "hidden";
            }else{
                document.getElementById("next").style.visibility = "visible";

            }

            //hide the prev button in the last page
            if(slideIndex === x.length){
                document.getElementById("prev").style.visibility = "hidden";
            }

            if(($rootScope.gameInstance == 1 || $rootScope.gameInstance ==0) && slideIndex === x.length-2 && sessionStorage.getItem("wasSudoko") === 'true'){
                console.log("hereIFNowwwwwwww");
                document.getElementById("next").innerHTML = "Continue";
            }

            //last slide and already made a test
            if( ($rootScope.gameInstance == 1 || $rootScope.gameInstance ==0) && slideIndex === x.length && sessionStorage.getItem("wasSudoko") === 'true'
            && sessionStorage.getItem("passTest")==='true'){
                console.log("hereIfNotExam");
                console.log("wasSudoku= "+sessionStorage.getItem("wasSudoko") === 'true');
                $location.url('/pageBeforeGame');


            }

            if( ($rootScope.gameInstance == 1 || $rootScope.gameInstance ==0) && z === -1 && slideIndex === x.length-1 && !familiarityAgainNextSudoku ){

                if( sessionStorage.getItem("wasSudoko") === 'true'){
                    prev();

                }

            }else{

                if( ($rootScope.gameInstance == 1 || $rootScope.gameInstance ==0) &&  slideIndex === x.length-1 && !familiarityAgainNextSudoku ){
                    console.log("hereIFFFF");
                    //if it's the second instance of the sudoku
                    if(sessionStorage.getItem("wasSudoko") === 'true'){
                        console.log("hereWASsSSS")
                        next();


                        //first instance of sudoku
                    }else{
                        document.getElementById("next").style.visibility = "hidden";

                    }

                }

            }


            //KS case
            if(($rootScope.gameInstance == 2 || $rootScope.gameInstance ==3) &&  slideIndex === x.length-1){
                if(sessionStorage.getItem("wasKS")=== 'true'){
                    next();

                }else{
                    document.getElementById("next").style.visibility = "hidden";
                }


            }




        }


        $scope.$watch('familiar', function(value) {

            console.log("familiarity= "+value);
            document.getElementById("next").style.visibility = "visible";
            if (value !== undefined){
                document.getElementById("next").innerHTML = "Submit and continue";
                document.getElementById("next").style.width = "80px";
                document.getElementById("next").style.height = "65px";
                // if($rootScope.wasSudoko != '0'){
                //     document.getElementById("next").onclick = toThePageBeforeGame();
                //
                // }
            }

            if(value!=null && value != undefined) {
                if($rootScope.gameInstance==0||$rootScope.gameInstance==1) {
                    $rootScope.familiaritySudoku = value;
                    sessionStorage.setItem("familiaritySudoku", value);
                }
                else{
                    $rootScope.familiarityKS = value;
                    sessionStorage.setItem("familiarityKS", value);
                }
            }


        });

// function toThePageBeforeGame(){
//
//     $location.url('/pageBeforeGame');
//
//
// }



        $scope.startExam = function () {

            if($rootScope.gameInstance == 0 || $rootScope.gameInstance == 1 ){
                sessionStorage.setItem("wasSudoko", "true");
            }
            else{
                sessionStorage.setItem("wasKS", "true");
            }
            $location.url('/ExamBeforeGame');

        }




    })