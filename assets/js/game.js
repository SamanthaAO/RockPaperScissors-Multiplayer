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




$("#createPlayer").on("click", function(event){
    event.preventDefault();

if(!player1Selected && !player2Selected){
p1.name = $("#name-input").val().trim();
console.log(p1);
database.ref().set({
         p1: p1,
         p2: p2,
         player1Selected : true,
         player2Selected : false,

      });
      
      $("#p1-display").text(p1.name + "You are Player 1")
    }
    else if(!player2Selected){
        p2.name = $("#name-input").val().trim();
        console.log(p2);
        database.ref().set({
            p1: p1,
            p2: p2,
            player1Selected : true,
            player2Selected : true,
        });
        
        $("#p2-display").text(p2.name + "You are Player 2")

    }
    else{
        $("#display").text("Sorry, the game is full.")
    
    }

});


database.ref().on("value", function(snapshot) {
p1.name = snapshot.val().p1.name;
p2.name = snapshot.val().p2.name;
player1Selected = snapshot.val().player1Selected;
player2Selected = snapshot.val().player2Selected;
console.log(p1.name + " player1 ");
console.log(p2.name + " player2 ");
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});








    


