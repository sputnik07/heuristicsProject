var stopwatch_time = 0;
var wallet = 500;
var prices = [ [10, 10, 10,  10], 
               [10, 100, 10, 10],
               [10, 20, 10,  10], 
               [10, 20, 10,  10], 
               [10, 10, 20,  10], 
               [10, 10, 20,  10], 
               [10, 10, 20,  10], 
               [10, 10, 20,  10], 
               [10, 10, 20,  10], 
               [10, 20, 10,  10], 
               [10, 20, 10,  10], 
               [10, 10, 10,  20], 
               [10, 10, 10,  20], 
               [10, 10, 10,  20], 
               [10, 100, 10, 10], 
               [10, 100, 10, 10], 
               [10, 10, 100, 10], 
               [10, 10, 100, 10], 
               [10, 10, 100, 10], 
               [10, 200, 10, 10] ];

//Bind all of the on click events
$(document).ready(function() {
    // Initilise
    setCookie("stage", 1, 3);
    setCookie("money", wallet, 3);
    $("#wallet").html(getCookie("money"));
    shuffleImages();

    // Setup timer
    $("#timer").stopwatch().bind('tick.stopwatch', function (e, elapsed) {
        if (elapsed >= 20001 && getCookie("stage") <= 20) {
            if (getCookie("stage") == 20) {
                $("#1").unbind('click');
                $("#2").unbind('click');
                $("#3").unbind('click');
                $("#4").unbind('click');

                $(this).stopwatch('stop');
                showButton();
            } 

            nextImage(0);
            $(this).stopwatch('reset');
        } stopwatch_time = elapsed;
    }).stopwatch('start');

    // Bind all of the images to the shuffling
    $("#1").bind('click', function() { nextImage(1); });
    $("#2").bind('click', function() { nextImage(2); });
    $("#3").bind('click', function() { nextImage(3); });
    $("#4").bind('click', function() { nextImage(4); });

    // Bind final button
    $("#next").on('click', "button", function() {
        // This will send AJAX Request
        alert("hi");
    });
});

// Updates all of the images
function nextImage(id) {
    var stage = getCookie("stage");

    if(stage <= 20) {
        if(stage == 20) { 
            // If the stage is 19, thne unbind the buttons
            $("#1").unbind('click');
            $("#2").unbind('click');
            $("#3").unbind('click');
            $("#4").unbind('click');

            $("#timer").stopwatch().stopwatch('stop');
            showButton();
        } else {
            // Else, save whther it was recommnded or not, and get the next image
            if(id == 0 || subtractMoney(id)) {
                storeStage(id);
                shuffleImages();
                recommened();
                $("#timer").stopwatch().stopwatch('reset');
            } else {
                // User doesn't have the money
                alert("You need more money!");
            }
        }
    }
}

// Shuffle the images to be shown
function shuffleImages() {
    // Shuffle the images of the next stage
    var images = [1, 2, 3, 4];
    images = shuffle(images);

    $("#1").attr('src', "../static/img/" + getCookie("stage") + "/" + images[0] + ".jpg");
    $("#2").attr('src', "../static/img/" + getCookie("stage") + "/" + images[1] + ".jpg");
    $("#3").attr('src', "../static/img/" + getCookie("stage") + "/" + images[2] + ".jpg");
    $("#4").attr('src', "../static/img/" + getCookie("stage") + "/" + images[3] + ".jpg");
}

// Recommend one of the images
function recommened() {
    if(getCookie("stage") > 5) {
        // Add recommened on one of them
        var images = [1, 2, 3, 4];
        images = shuffle(images);

        $("#cool" + images[0]).html("Recommended by AI:");
        $("#cool" + images[1]).html("");
        $("#cool" + images[2]).html("");
        $("#cool" + images[3]).html("");
    }
}

function storeStage(id) {
    // Store whether or not it was recommended
    if($("#cool" + id).html() == "Recommended by AI:") {
        setCookie("r" + getCookie("stage"), 1, 3);
    } else setCookie("r" + getCookie("stage"), 0, 3);

    // Store the time
    setCookie("t" + getCookie("stage"), stopwatch_time, 3);

    // Increment the stage
    var stage = getCookie("stage");
    setCookie("stage", parseInt(stage) + 1, 3);
}

function subtractMoney(id) {
    // Make sure the user has the money
    if(wallet - prices[getCookie("stage") - 1][id - 1] > 0) {
        // Subtract the price from the wallet
        wallet -= prices[getCookie("stage") - 1][id - 1];
        setCookie("money", wallet, 3);

        $("#wallet").html(getCookie("money"));
        return true;
    } else return false;
}

function showButton() {
    // Show the button to export the final results
    $("#next").html("<button class=\"btn btn-light\" id=\"final\" type=\"button\" onclick=\"return false;\">Submit Final Results</button>");
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

//Get's the cookie with name *name*
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    } return null;
}

//Sets a cookie on the document *name* to *value* for *days* daya
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    } document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}