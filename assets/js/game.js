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

// var p2Status = {
//     player2Selected: false,
//     player2ChoiceSelected: false,
// }

//sets which screen displays what becuae you only want to display certain thins to ther perrson that isP1 or is P2
var isP1 = false;
var isP2 = false;


//chat box insert
var chatBox = `
<div class="row">
<div id="chatTitle" class="col-sm-12">Talk Smack Here:</div>
</div
<div class="row">
    <div id="chatArea" class="border col-sm-12"></div>
</div>

<div class="row">
    <div class="form-group col-sm-12 mt-2" id="chatForm">
        <textarea class="form-control" rows="3" id="comment"></textarea>
    </div>
</div>`;


//choice images
var rockImage = "<img src='assets/images/rock.png' width = '100px' >";
var paperImage = "<img src='assets/images/paper.png' width = '100px'>";
var scissorImage = "<img src='assets/images/scissors.png' width = '100px'>";

//score images
var correctImage = "<img src='assets/images/correct.jpg' width = '50px'>";
var incorrectImage = "<img src='assets/images/wrong.png' width = '50px'>";
var tieImage = "<img src='assets/images/tie.png' width = '50px'>"



//signs players off when screen closed and resets their stats so that they can be replaced by next person to enter
$(window).on("beforeunload", function () {
    //signs playerr 1 off sets stats back to start and resets round
    if (isP1) {
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

        //there no longer is a P1 cuz they logged off
        isP1 = false;

    }

    //signs player 2 off resets stats
    else if (isP2) {
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

//is called after timerrr runs out clears the images of what each player played last turn and gives them their buttons back
function nextRound() {

    $("#displayP2").empty();
    $("#displayP1").empty();

    if (isP1) {
        $("#buttonsP1").append("Click any of the below buttons to make your choice <br> <button id='rock' value='p1' class='gameButton btn btn-outline-dark btn-light'>Rock</button> <button id='paper' value='p1' class='gameButton btn btn-outline-dark btn-light'>Paper</button> <button id='scissors' value='p1' class='gameButton btn btn-outline-dark btn-light'>Scissors</button>");
    }
    if (isP2) {
        $("#buttonsP2").append("Click any of the below buttons to make your choice <br> <button id='rock' value='p2' class='gameButton btn btn-outline-dark btn-light'>Rock</button> <button id='paper' value='p2' class='gameButton btn btn-outline-dark btn-light'>Paper</button> <button id='scissors' value='p2' class='gameButton btn btn-outline-dark btn-light'>Scissors</button>");
    }
}

//display both playerrs images once both have selected their choices
function displayAll() {

    if (isP1) {
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
    if (isP2) {
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
}
//compares choices made by players
function game() {

    //once both choices are selected
    if (player1ChoiceSelected && player2ChoiceSelected) {

            //tie
            if (p1.choice === p2.choice) {
                //displays all images
                displayAll();

                //shows tie images
                $("#displayP1").prepend("<br>" + tieImage + "<br><br>");
                $("#displayP2").prepend("<br>" + tieImage + "<br><br>");

                //next round
                increaseRound();
            }
            //p1 wins
            else if ((p1.choice === "rock" && p2.choice === "scissors") || (p1.choice === "paper" && p2.choice === "rock") || (p1.choice === "scissors" && p2.choice === "paper")) {

                displayAll();

                //increases wins and losses
                p1.wins++;
                p2.loses++;

                //shows win and loss images
                $("#displayP1").prepend("<br>" + correctImage + "<br><br>");
                $("#displayP2").prepend("<br>" + incorrectImage + "<br><br>");

                increaseRound();
            }
            
            //p2 wins
            else {

                displayAll();

                p2.wins++;
                p1.loses++;

                $("#displayP2").prepend("<br>" + correctImage + "<br><br>");
                $("#displayP1").prepend("<br>" + incorrectImage + "<br><br>");

                increaseRound();
            }


            //sets time out for images being displayed and the start next round
            setTimeout(nextRound, 3000)
        

    }


}

//assigns player 1 and 2
$("#login").on("click", "#createPlayer", function (event) {
    event.preventDefault();

    //if no one is selected assign input name player 1 and add data to server
    if (!player1Selected) {

        p1.name = $("#name-input").val().trim();
        isP1 = true;

        player1.set({
            p1: p1,
            player1Selected: true,
            player1ChoiceSelected: false,

        });

        //adds border to area for that player
        $(p1Area).addClass("border");

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

        player2.set({
            p2: p2,
            player2Selected: true,
            player2ChoiceSelected: false,
        });

        //adds border to area for that player
        $(p2Area).addClass("border");

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
            $("#buttonsP1").empty();

            player1.set({
                p1: p1,
                player1Selected: true,
                player1ChoiceSelected: true,
            });

            //displays image for choice
            if (p1.choice === "rock") {
                $("#displayP1").append(rockImage);
            }
            else if (p1.choice === "paper") {
                $("#displayP1").append(paperImage);
            }
            else {
                $("#displayP1").append(scissorImage);
            }

            if (!player2ChoiceSelected && player1ChoiceSelected) {
                $("#displayP2").append("<br>Still Deciding");
            }
        }

        //sets choice for p1
        else if (this.value === "p2" && !player2ChoiceSelected) {
            p2.choice = this.id;
            $("#buttonsP2").empty();


            player2.set({
                p2: p2,
                player2Selected: true,
                player2ChoiceSelected: true,
            });

            //displays image for choice
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
        if (!player1ChoiceSelected && player2ChoiceSelected) {
            $("#displayP1").append("<br>Still Deciding");
        }
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
    $("#comment").val('');

});




//retrieves p1 values from database
player1.on("value", function (snapshot) {
    p1 = snapshot.val().p1;
    player1Selected = snapshot.val().player1Selected;
    player1ChoiceSelected = snapshot.val().player1ChoiceSelected;
    //displays name
    $("#nameP1").text("Player 1: " + p1.name);
   
    //displays score
    if (p1.name !== "") {
        $("#scoreP1").html("<strong>Wins: </strong>" + p1.wins + " <strong>Loses: </strong>" + p1.loses);
    }
    else {
        $("#scoreP1").empty();
    }
    //runs game
    game();

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

//retrieves p2 values from database
player2.on("value", function (snapshot) {
    p2 = snapshot.val().p2;
    player2Selected = snapshot.val().player2Selected;
    player2ChoiceSelected = snapshot.val().player2ChoiceSelected;
    //displays name
    $("#nameP2").html("Player 2: " + p2.name);

    //displays score
    if (p2.name !== "") {
        $("#scoreP2").html("<strong>Wins: </strong>" + p2.wins + " <strong>Loses: </strong>" + p2.loses);
    }
    else {
        $("#scoreP2").empty();
    }

    //runs game
    game();


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
    
    //could not get date to display properly
    var dateUTC = moment.utc(moment(chatDateAdded, "MM-DD-YYYY HH:mm:ss"));


    $("#chatArea").append("<div><strong>" + chatName + " : </strong>" + chatComment + "</div>");


    //makes chat bar scrol to bottom
    $("#chatArea").scrollTop($("#chatArea")[0].scrollHeight);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

});























