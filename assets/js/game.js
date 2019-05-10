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
var game = database.ref("/game");




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


//inserts
var chatBox = `<div class="row">
<div id="chatArea" class="border col-sm-6"></div>

<div class="form-group col-sm-6"id="chatForm">
    <label for="comment">Talk Smack Here!</label>
    <textarea class="form-control" rows="5" id="comment"></textarea>
</div>
</div>`;

var rockImage = "<img src='assets/images/rock.png' width = '100px' >";
var paperImage = "<img src='assets/images/paper.png' width = '100px'>";
var scissorImage = "<img src='assets/images/scissors.png' width = '100px'>";
var correctImage = "<img src='assets/images/correct.png' width = '50px'>";
var incorrectImage = "<img src='assets/images/wrong.png' width = '50px'>";



//signs players off when screen closed and resets their stats so that they can be replaced by next person to enter
$(window).on("beforeunload", function () {
    if (isP1) {
        p1.name = "";
        p1.wins = 0;
        p1.loses = 0;
        p1.choice = "";

        player1.set({
            p1: p1,
            player1Selected: false,
        });

        round = 1;

        roundRef.set({
            round: round,
        });

        isP1 = false;

    }
    else if (isP2) {
        p2.name = "";
        p2.wins = 0;
        p2.loses = 0;
        p2.choice = "";

        player2.set({
            p2: p2,
            player2Selected: false,

        });

        round = 1;

        roundRef.set({
            round: round,
        });

        isP2 = false;
    }

});

//create login when doc loads
$(document).ready(function () {

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
            $("#displayP1").append(" <br> Tie");
            $("#displayP2").append(" <br> Tie");
            increaseRound();
        }
        else if ((p1.choice === "rock" && p2.choice === "scissors") || (p1.choice === "paper" && p2.choice === "rock") || (p1.choice === "scissors" && p2.choice === "paper")) {
            $("#displayP1").append("<br> P1 wins! " + p1.choice + " beats " + p2.choice);
            $("#displayP2").append("<br> P1 wins! " + p1.choice + " beats " + p2.choice);
            p1.wins++;
            p2.loses++;
            increaseRound();
        }
        else {
            $("#displayP1").append("<br>P2 wins! " + p2.choice + " beats " + p1.choice);
            $("#displayP2").append("<br>P2 wins! " + p2.choice + " beats " + p1.choice);
            p2.wins++;
            p1.loses++;
            increaseRound();
        }
    }


}

//assigns player 1 and 2
$("#login").on("click", "#createPlayer", function (event) {
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
        $("#loginInfo").empty();

        $("#greeting").text("Welcome " + p1.name + "! You are Player 1.")
        //add choice buttons
        $("#buttonsP1").append("Click any of the below buttons to make your choice <br> <button id='rock' value='p1' class='gameButton btn btn-outline-dark btn-light'>Rock</button> <button id='paper' value='p1' class='gameButton btn btn-outline-dark btn-light'>Paper</button> <button id='scissors' value='p1' class='gameButton btn btn-outline-dark btn-light'>Scissors</button>");

        //create chat container
        $("#chatContainer").append(chatBox);

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
        $("#loginInfo").empty();

        $("#greeting").text("Welcome " + p2.name + "! You are Player 2.")
        //add choice buttons
        $("#buttonsP2").append("Click any of the below buttons to make your choice <br> <button id='rock' value='p2' class='gameButton btn btn-outline-dark btn-light'>Rock</button> <button id='paper' value='p2' class='gameButton btn btn-outline-dark btn-light'>Paper</button> <button id='scissors' value='p2' class='gameButton btn btn-outline-dark btn-light'>Scissors</button>");
        //create unique chat button
        $("#chatContainer").append(chatBox);
        $('#chatForm').append(`<button class='btn btn-outline-dark btn-light float-right mt-2' id='chat' value='${p2.name}' type='submit'>Send Message</button>`);
    }
    else {
        $("#login").empty();
        $("#greeting").text("Sorry, the game is full.")


    }

});



//choice buttons for game
$("#display").on("click", ".gameButton", function () {
    //only can be clicked if both players assigned
    if (player2Selected && player1Selected) {

        //sets choice for p1
        if (this.value === "p1" && !player1ChoiceSelected) {

            p1.choice = this.id;

            player1.set({
                p1: p1,
                player1Selected: true,
            });
            game.set({
                player1ChoiceSelected: true,
            })

            //displays image for choice
            $("#displayP1").empty();
            if (p1.choice === "rock") {
                $("#displayP1").append(rockImage);
            }
            else if (p1.choice === "paper") {
                $("#displayP1").append(paperImage);
            }
            else {
                $("#displayP1").append(scissorImage);
            }
        }

        //sets choice for p1
        else if (this.value === "p2" && !player2ChoiceSelected) {
            p2.choice = this.id;

            player2.set({
                p2: p2,
                player2Selected: true,
            });

            game.set({
                player1ChoiceSelected: true,
            })

            //displays image for choice
            $("#displayP2").empty();
            if (p2.choice === "rock") {
                $("#displayP2").append(rockImage);
            }
            else if (p2.choice === "paper") {
                $("#displayP2").append(paperImage);
            }
            else {
                $("#displayP2").append(scissorImage);
            } 
        }
    //runs game
    game();
    }
})

//submits text written in chat
$("#chatContainer").on("click", "#chat", function (event) {
    event.preventDefault();

    comment = $("#comment").val().trim();
    comment = chat.push({
        comment: comment,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        name: this.value
    })

});




//retrieves p1 values from database
player1.on("value", function (snapshot) {
    p1 = snapshot.val().p1;
    player1Selected = snapshot.val().player1Selected;
    //displays name
    $("#nameP1").text(p1.name);
    //displays score
    $("#scoreP1").html("<strong>Wins: </strong>" + p1.wins + "<strong>Loses: </strong>" + p1.loses);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

//retrieves p2 values from database
player2.on("value", function (snapshot) {
    p2 = snapshot.val().p2;
    player2Selected = snapshot.val().player2Selected;
    
    //displays name
    $("#nameP2").html(p2.name);
    //displays score
    $("#scoreP2").html("<strong>Wins: </strong>" + p2.wins + " <strong>Loses: </strong>" + p2.loses);


}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

player2.on("value", function (snapshot) {
    player1ChoiceSelected = snapshot.val().player1ChoiceSelected;
    player2ChoiceSelected = snapshot.val().player2ChoiceSelected;
    
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

//retrieves rounds from database
roundRef.on("value", function (snapshot) {
    round = snapshot.val().round;
    $("#roundCounter").html("<strong>Round: </strong>" + round);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

//displays chat items
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





















