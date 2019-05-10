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

var isP1 = false;
var isP2 = false;

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

//increates the round and resets the choice selected boolians
function increaseRound() {
    round++;
    database.ref().set({
        round: round,
        p1: p1,
        p2: p2,
        player1Selected: true,
        player2Selected: true,
        player1ChoiceSelected: false,
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
$("#createPlayer").on("click", function (event) {
    event.preventDefault();

    //if no one is selected assign input name player 1 and add data to server
    if (!player1Selected && !player2Selected) {

        p1.name = $("#name-input").val().trim();

        database.ref().set({
            round: round,
            p1: p1,
            p2: p2,
            //this is the change
            player1Selected: true,
            player2Selected: false,
            player1ChoiceSelected: false,
            player2ChoiceSelected: false,

        });

        $("#display").text("Welcome " + p1.name + "! You are Player 1. Click any of the below buttons to make your first choice")
        //add choice buttons
        $("#display").append("<br><button id='rock' value='p1' class='gameButton'>Rock</button> <button id='paper' value='p1' class='gameButton'>Paper</button> <button id='scissors' value='p1' class='gameButton'>Scissors</button>");
        //create unique chat button
        $('#chatContainer').append(`<div class='row'> <button class='btn btn-primary' id='chat' value='${p1.name}' type='submit'>Send Message</button></div>`)

    }

    //if p1 aleeady selected assing new player to p2
    else if (!player2Selected) {

        p2.name = $("#name-input").val().trim();

        database.ref().set({
            round: round,
            p1: p1,
            p2: p2,
            player1Selected: true,
            //this is the change
            player2Selected: true,
            player1ChoiceSelected: false,
            player2ChoiceSelected: false,
        });

        $("#display").text("Welcome " + p2.name + "! You are Player 2. Click any of the below buttons to make your first choice")
        //add choice buttons
        $("#display").append("<br><button id='rock' value='p2' class='gameButton'>Rock</button> <button id='paper' value='p2' class='gameButton'>Paper</button> <button id='scissors' value='p2' class='gameButton'>Scissors</button>");
        //create unique chat button
        $('#chatContainer').append(`<div class='row'> <button class='btn btn-primary' id='chat' value='${p2.name}' type='submit'>Send Message</button></div>`)
    }
    else {
        $("#display").text("Sorry, the game is full.")

    }

});



//choice buttons for game
$("#display").on("click", ".gameButton", function () {
    //only can be clicked if both players assigned
    if (player2Selected) {

        if (this.value === "p1" && !player1ChoiceSelected && !player2ChoiceSelected) {

            p1.choice = this.id;

            database.ref().set({
                round: round,
                p1: p1,
                p2: p2,
                player1Selected: true,
                player2Selected: true,
                //this is the change
                player1ChoiceSelected: true,
                player2ChoiceSelected: false,
            });

            $("#display").append("<br>You chose " + p1.choice);
            game();
        }
        else if (this.value === "p1" && player2ChoiceSelected && !player1ChoiceSelected) {
            p1.choice = this.id;

            database.ref().set({
                round: round,
                p1: p1,
                p2: p2,
                player1Selected: true,
                player2Selected: true,
                //this is the change
                player1ChoiceSelected: true,
                player2ChoiceSelected: true,
            });
            $("#display").append("<br>You chose " + p1.choice);
            game();
        }
        else if (this.value === "p2" && !player2ChoiceSelected && player1ChoiceSelected) {
            p2.choice = this.id;

            database.ref().set({
                round: round,
                p1: p1,
                p2: p2,
                player1Selected: true,
                player2Selected: true,
                //this is the change
                player1ChoiceSelected: true,
                player2ChoiceSelected: true,
                commentList: commentList
            });
            $("#display").append("<br>You chose " + p2.choice);
            game();
        }
        else if (this.value === "p2" && !player2ChoiceSelected && !player1ChoiceSelected) {
            p2.choice = this.id;

            database.ref().set({
                round: round,
                p1: p1,
                p2: p2,
                player1Selected: true,
                player2Selected: true,
                //this is the change
                player1ChoiceSelected: false,
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





database.ref().on("value", function (snapshot) {
    p1 = snapshot.val().p1;
    p2 = snapshot.val().p2;
    player1Selected = snapshot.val().player1Selected;
    player2Selected = snapshot.val().player2Selected;
    player1ChoiceSelected = snapshot.val().player1ChoiceSelected;
    player2ChoiceSelected = snapshot.val().player2ChoiceSelected;
    round = snapshot.val().round;
    $("#roundCounter").html("Round: " + round);

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
























