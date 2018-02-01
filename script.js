var disp = document.getElementById('disp');
var person = document.getElementById('person');
var category = document.getElementById('category');
var again = document.getElementById('again');
again.style.display = 'none';
var btndiv = document.getElementById('btns');
var answer = document.getElementById('answer');
var hangman = document.getElementById('hangman');
var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var man = 0;
var phrase;
var newPhrase = [];
// *** FOR SIMPLE EXAMPLE UNCOMMENT
//var phrase = "Hello my name is Daren";


// setup phrase with API
// *** erase this section to test out simple example
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.response);
        phrase = result['quote'];
        for (var i = 0; i < phrase.length; i++) {
            if (phrase[i] == " ") {
                newPhrase.push(" ");
                continue;
            }
            var letterObj = {
                letter: phrase[i],
                guessed: false
            };
            newPhrase.push(letterObj);
        }
        // adjust for ';' and '.'
        for (var i = 0; i < newPhrase.length; i++) {
            if (newPhrase[i].letter == ";" || newPhrase[i].letter == "." || newPhrase[i].letter == "'" || newPhrase[i].letter == "," || newPhrase[i].letter == "?") {
                newPhrase[i].guessed = true;
            }
        }
        person.innerHTML = 'Said by: ' + result['author'];
        category.innerHTML = 'Category: ' + result['category'];
        updateDisplay();
    }
};
xhttp.open("GET", "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous&count=1", true);
xhttp.setRequestHeader('X-Mashape-Key', 'GJZ5iuPatamshMPMWagsbxwV0qbUp1FXFdxjsnx2YhcmvND5hn');
xhttp.setRequestHeader('Accept', 'application/json');
xhttp.send();


// load up the buttons
for (var i = 0; i < alphabet.length; i++) {
    var btn = document.createElement('button');
    btn.innerHTML = alphabet[i];
    // HANDLING BUTTON CLICKS
    btn.addEventListener('click', function(){
        console.log('btn is: ' + this.innerHTML);
        // when you click, check this letter against the whole phrase
        // if matching, UPDATE dsiplay & destroy btn
        // else, display 'new hangman' & destroy btn 
        
        var flag = false;
        for (var j = 0; j < newPhrase.length; j++) {
            if (newPhrase[j] == " ") {
                continue;
            }
            if (this.innerHTML == newPhrase[j].letter.toLowerCase()) {
                newPhrase[j].guessed = true;
                flag = true;
                console.log('correct guess: ' + this.innerHTML);
                updateDisplay();
            }
            if (j == newPhrase.length - 1 && flag) {
                this.parentNode.removeChild(this);
                checkForWin();
            } else if (j == newPhrase.length - 1 && !flag) {
                this.parentNode.removeChild(this);
                man++;
                if (man == 7) {
                    // 1. destroy all current buttons doneeeeee
                    // 2. display dead animation doneeee
                    // 3. play again button?
                    gameOver();
                }
                hangman.src = './images/man_0' + man + '.png';
            }
        }
    });
    btndiv.appendChild(btn);
}

// setup new phrase with properties (to display properly)
// *** FOR SIMPLE EXAMPLE UNCOMMENT
//var newPhrase = [];
//for (var i = 0; i < phrase.length; i++) {
//    if (phrase[i] == " ") {
//        newPhrase.push(" ");
//        continue;
//    }
//    var letterObj = {
//        letter: phrase[i],
//        guessed: false
//    };
//    newPhrase.push(letterObj);
//}

// initial no-guessed display, UPDATE function
function updateDisplay() {
    var displayPhrase = "";
    for (var i = 0; i < newPhrase.length; i++) {
        if (newPhrase[i] == " ") {
            displayPhrase += " ";
            continue;
        }
        if (newPhrase[i].guessed) {
            displayPhrase += newPhrase[i].letter;
        } else {
            displayPhrase += "_";
        }
    }
    answer.innerHTML = displayPhrase;
}
// ** FOR SIMPLE EXAMPLE UNCOMMENT
//updateDisplay();

// dead animation, GAME OVER
function gameOver() {
    var allBtns = btndiv.getElementsByTagName('*');
    var len = allBtns.length;
    for (var k = 0; k < len; k++) {
        btndiv.removeChild(btndiv.firstChild);
    }
    disp.innerHTML = 'GAME OVER';
    disp.className = 'bg-danger';
    again.style.display = 'inline-block';
    answer.innerHTML = phrase;
    answer.style.color = 'red';
    setInterval(function(){
        if (man == 7) {
            man++;
            hangman.src = './images/man_0' + man + '.png';
        } else {
            man = 7;
            hangman.src = './images/man_0' + man + '.png';
        }
    }, 300);
}

// Checks for win
function checkForWin() {
    for (var i = 0; i < newPhrase.length; i++) {
        if (newPhrase[i] == " ") {
            continue;
        }
        if (!newPhrase[i].guessed) {
            break;
        }
        if (i == newPhrase.length - 1 && newPhrase[i].guessed) {
            disp.innerHTML = 'YOU WIN!';
            disp.className = 'bg-success';
            again.style.display = 'inline-block';
            answer.style.color = 'green';
            var allBtns = btndiv.getElementsByTagName('*');
            var len = allBtns.length;
            for (var k = 0; k < len; k++) {
                btndiv.removeChild(btndiv.firstChild);
            }
        }
    }
}