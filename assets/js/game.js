// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDAKA_TbeI2QyJVuXtnIrxruEpDoyKrvao",
    authDomain: "rockpaperscissors-muliplayer.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-muliplayer.firebaseio.com",
    projectId: "rockpaperscissors-muliplayer",
    storageBucket: "rockpaperscissors-muliplayer.appspot.com",
    messagingSenderId: "133937209668",
    appId: "1:133937209668:web:b679a8e62cb0a14e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database.
    var database = firebase.database();

//set up variables
var player1Selected = false;
var player2Selected = false;
var player1ChoiceSelected = false;
var player2ChoiceSelected = false;
var round = 0;
var p1 = {
    name: "",
    wins: 0,
    loses: 0,
    choice: "",

};

var p2 = {
    name: "",
    wins: 0,
    loses: 0,
    choice: "",

};


function game(){

    if(p1.choice===p2.choice){
        $("#display").append("Tie")
    }
    else if(p1.choice === "rock" && p2.choice === "scissors"){
        $("#display").append("P1 wins")
    }
    else if(p1.choice === "paper" && p2.choice === "rock"){
        $("#display").append("P1 wins")
    }
    else if(p1.choice === "scissors"&& p2.choice === "paper"){
        $("#display").append("P1 wins")
    }
    else{
        $("#display").append("P2 wins")
    }
}


$("#createPlayer").on("click", function(event){
    event.preventDefault();

if(!player1Selected && !player2Selected){
p1.name = $("#name-input").val().trim();
console.log(p1);
database.ref().set({
        round: round,
         p1: p1,
         p2: p2,
         player1Selected : true,
         player2Selected : false,
         player1ChoiceSelected : false,
         player2ChoiceSelected : false

      });
      
      $("#display").text("Welcome " + p1.name + "! You are Player 1. Click any of the below buttons to make your first choice")
      $("#display").append("<br><button id='rock' value='p1' class='gameButton'>Rock</button> <button id='paper' value='p1' class='gameButton'>Paper</button> <button id='scissors' value='p1' class='gameButton'>Scissors</button>");

    }
    else if(!player2Selected){
        p2.name = $("#name-input").val().trim();
        console.log(p2);
        database.ref().set({
            round: round,
            p1: p1,
            p2: p2,
            player1Selected : true,
            player2Selected : true,
            player1ChoiceSelected : false,
            player2ChoiceSelected : false
        });
        
        $("#display").text("Welcome " + p2.name + "! You are Player 2. Click any of the below buttons to make your first choice")
        $("#display").append("<br><button id='rock' value='p2' class='gameButton'>Rock</button> <button id='paper' value='p2' class='gameButton'>Paper</button> <button id='scissors' value='p2' class='gameButton'>Scissors</button>");
    }
    else{
        $("#display").text("Sorry, the game is full.")
    
    }

});




$("#display").on("click", ".gameButton", function(){
    console.log(this.value);
    console.log(player1ChoiceSelected)
    console.log(player2ChoiceSelected)

    if (player2Selected){ 
        if(this.value === "p1" && !player1ChoiceSelected){
            p1.choice = this.id;
            console.log(this.id);
            database.ref().set({
                round: round,
                p1: p1,
                p2: p2,
                player1Selected : true,
                player2Selected : true,
                player1ChoiceSelected : true,
                player2ChoiceSelected : false
            });
        
            $("#display").append("<br>You chose " + p1.choice);
        }
        else if(this.value === "p2" && !player2ChoiceSelected){
            p2.choice = this.id;
            console.log(this.id);
            database.ref().set({
                round: round,
                p1: p1,
                p2: p2,
                player1Selected : true,
                player2Selected : true,
                player1ChoiceSelected : true,
                player2ChoiceSelected : true
            });
            $("#display").append("<br>You chose " + p2.choice);
            game();
        }
    }
})




database.ref().on("value", function(snapshot) {
    p1 = snapshot.val().p1;
    p2 = snapshot.val().p2;
    player1Selected = snapshot.val().player1Selected;
    player2Selected = snapshot.val().player2Selected;
    player1ChoiceSelected = snapshot.val().player1ChoiceSelected;
    player2ChoiceSelected = snapshot.val().player2ChoiceSelected;
    
    console.log(p1.name + " player1 ");
    console.log(p2.name + " player2 ");
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });





















    


