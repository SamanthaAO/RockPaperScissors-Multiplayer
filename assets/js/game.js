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
var chat = database.ref("/chat");
var player1 = database.ref("/player1");
var player2 = database.ref("/player2");
var roundRef = database.ref("/roundRef");


        

//set up variables
var player1Selected = false;
var player2Selected = false;
var player1ChoiceSelected = false;
var player2ChoiceSelected = false;
var round = 1;
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

var isP1 = false;
var isP2 = false;



   $(window).on("beforeunload", function() {
    if(isP1){
        p1.name = "";
        p1.wins = 0;
        p1.loses = 0;
        p1.choice = "";

        player1.set({
            p1: p1,
            player1Selected: false,
            player1ChoiceSelected: false,
        });

        round = 1;

        roundRef.set({
            round: round,
        });

        isP1 = false;

    }
    else if(isP2){
        p2.name = "";
        p2.wins = 0;
        p2.loses = 0;
        p2.choice = "";

        player2.set({
            p2: p2,
            player2Selected: false,
            player2ChoiceSelected: false,
    
        });

        round = 1;

        roundRef.set({
            round: round,
        });

        isP2 = false;
    }
      
    });

    $( document ).ready(function(){ 

    var login = `<form role="form" class="col-sm-6" id="nameForm">
    <div class="form-group">
        <label for="name-input">Name:</label>
        <input class="form-control" id="name-input" type="text">

    </div>
    <button class="btn btn-outline-dark btn-light" id="createPlayer" type="submit">Submit</button>
</form>`

$("#login").append(login);

    });
  




//increases the round and resets the choice selected boolians
function increaseRound() {
    round++;
    console.log(round);
    roundRef.set({
        round: round,
    });

    player1.set({
        p1: p1,
        player1Selected: true,
        player1ChoiceSelected: false,
    });

    player2.set({
        p2: p2,
        player2Selected: true,
        player2ChoiceSelected: false,
    });
}

//compares choices made by players
function game() {

    if (player1ChoiceSelected && player2ChoiceSelected) {

        if (p1.choice === p2.choice) {
            $("#display").append("Tie");
            increaseRound();
        }
        else if ((p1.choice === "rock" && p2.choice === "scissors") || (p1.choice === "paper" && p2.choice === "rock") || (p1.choice === "scissors" && p2.choice === "paper")) {
            $("#display").append("<br> P1 wins! " + p1.choice + " beats " + p2.choice)
            p1.wins++;
            p2.loses++;
            increaseRound();
        }
        else {
            $("#display").append("<br>P2 wins! " + p2.choice + " beats " + p1.choice);
            p2.wins++;
            p1.loses++;
            increaseRound();
        }
    }
}

//assigns player 1 and 2
$("#login").on("click", "#createPlayer",function (event) {
    event.preventDefault();

    //if no one is selected assign input name player 1 and add data to server
    if (!player1Selected) {

        p1.name = $("#name-input").val().trim();
        isP1 = true;
        console.log(isP1);

        player1.set({
            p1: p1,
            player1Selected: true,
            player1ChoiceSelected: false,

        });

        $("#login").empty();

        $("#display").text("Welcome " + p1.name + "! You are Player 1. Click any of the below buttons to make your first choice")
        //add choice buttons
        $("#display").append("<br><button id='rock' value='p1' class='gameButton btn btn-outline-dark btn-light'>Rock</button> <button id='paper' value='p1' class='gameButton btn btn-outline-dark btn-light'>Paper</button> <button id='scissors' value='p1' class='gameButton btn btn-outline-dark btn-light'>Scissors</button>");
        //create unique chat button
        $('#chatForm').append(`<button class='btn btn-outline-dark btn-light p-2 float-right mt-2' id='chat' value='${p1.name}' type='submit'>Send Message</button>`)

    }

    //if p1 aleeady selected assign new player to p2
    else if (!player2Selected) {

        p2.name = $("#name-input").val().trim();
        isP2 = true;
        console.log(isP2);

        player2.set({
            p2: p2,
            player2Selected: true,
            player2ChoiceSelected: false,
        });

        $("#login").empty();

        $("#display").text("Welcome " + p2.name + "! You are Player 2. Click any of the below buttons to make your first choice")
        //add choice buttons
        $("#display").append("<br><button id='rock' value='p2' class='gameButton btn btn-outline-dark btn-light'>Rock</button> <button id='paper' value='p2' class='gameButton btn btn-outline-dark btn-light'>Paper</button> <button id='scissors' value='p2' class='gameButton btn btn-outline-dark btn-light'>Scissors</button>");
        //create unique chat button
        $('#chatForm').append(`<button class='btn btn-outline-dark btn-light float-right mt-2' id='chat' value='${p2.name}' type='submit'>Send Message</button>`)
    }
    else {
        $("#login").empty();
        $("#display").text("Sorry, the game is full.")


    }

});



//choice buttons for game
$("#display").on("click", ".gameButton", function () {
    //only can be clicked if both players assigned
    if (player2Selected) {

        if (this.value === "p1" && !player1ChoiceSelected) {

            p1.choice = this.id;

            player1.set({
                p1: p1,
                player1Selected: true,
                player1ChoiceSelected: true,
            });

            $("#display").append("<br>You chose " + p1.choice);
            game();
        }

        else if (this.value === "p2" && !player2ChoiceSelected) {
            p2.choice = this.id;

            player2.set({
                p2: p2,
                player2Selected: true,
                player2ChoiceSelected: true,
            });
            $("#display").append("<br>You chose " + p2.choice);
            game();
        }

    }
})

$("#chatContainer").on("click", "#chat", function (event) {
    event.preventDefault();

    comment = $("#comment").val().trim();
    comment = chat.push({
        comment: comment,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        name: this.value
    })

});





player1.on("value", function (snapshot) {
    p1 = snapshot.val().p1;
    player1Selected = snapshot.val().player1Selected;
    player1ChoiceSelected = snapshot.val().player1ChoiceSelected;

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

player2.on("value", function (snapshot) {
    p2 = snapshot.val().p2;
    player2Selected = snapshot.val().player2Selected;
    player2ChoiceSelected = snapshot.val().player2ChoiceSelected;
    

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

roundRef.on("value", function (snapshot) {
    round = snapshot.val().round;
    $("#roundCounter").html("<strong>Round: </strong>" + round);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

chat.orderByChild("dateAdded").limitToLast(1).on("child_added", function (childSnapshot) {
    var sv = childSnapshot.val();

    var chatComment = sv.comment;
    var chatDateAdded = sv.dateAdded;
    var chatName = sv.name;
    console.log(sv.comment + sv.dateAdded + sv.name)
    //could not get date to display properly
    var dateUTC = moment.utc(moment(chatDateAdded, "MM-DD-YYYY HH:mm:ss"));

    $("#chatArea").append("<div><strong>" + chatName + " : </strong>" + chatComment + "</div>");

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

});



// When first player submits name isP1 = true
// When second player submits name isP2 = true

// When first player leaves game (closes window, etc) - clear data in firebase for P1 (set P1 data to "")
   // on unload event... if (P2) { set P2.name = "", P2.wins = ""} (submit to Firebase)

// When second player leaves game (closes window, etc) - clear data in firebase for P2 (set P2 data to "")
   // on unload event... if (P1) { set P1.name = "", P1.wins = ""} (submit to Firebase)


// // All of our connections will be stored in this directory.
//         var connectionsRef = database.ref("/connections");

//         // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
//         var isConnected = database.ref(".info/connected");

//         // When the client's connection state changes...
//         isConnected.on("value", function(snap) {

//             // If they are connected..
//             if (snap.val()) {
        
//             // Add user to the connections list.
//             var con = connectionsRef.push(true);
//             // Remove user from the connection list when they disconnect.
//             con.onDisconnect().remove();
//             }
//         });
        
//         // When first loaded or when the connections list changes...
//         connectionsRef.on("value", function(snap) {
        
//             // Display the viewer count in the html.
//             // The number of online users is the number of children in the connections list.
//             $("#chatArea").text(snap.numChildren());
//         });






















