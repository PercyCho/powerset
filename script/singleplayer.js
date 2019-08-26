//Before we get fucking started, I'm just going to say that this document will be a few kilobytes bigger due to all of the COMMENTS I make on EVERYTHING.
//and they aren't just for other people, they're for ME. Because I need to know what the SHIT I'm writing half the time.
//You might see words after $dollar signs sometimes, and that's so I can do Ctrl + F and get to where that variable changes, or is announced, etc. Buuut I might not use it. You never know.
//And I know I said on the discord server I don't encourage cursing, but sometimes **you gotta curse anyways**
//ok let's get started

let taken = 0; //var to show how many pieces were taken
let grid = []; //for the moving grid
let roll; //var for the "dice roll" which determines the opposing piece collum 
let difficulty; //sets to the player's dificulty
let lastRoll; //sets to the player's last roll
let moveable = false; //set to false so the player doesn't move pieces before the game starts 
let firstTaken = false; //sets to true once the first piece is taken. Is set to false now so the playey can't move their leader or helper until that happens 
let firstMove = true; //
let lastMove; //to remember the last roll so we can put it in the diceRoll function and get a different number
let pieceName; //this is set here so it sets globally when set in playerPiece()
let whitePiece; //this gets the information about the piece
let whitePieceTop; //the row number from 0 to 7 
let whitePieceLeft; //the collum number from 0 to 6
let timerVar; //var to store the timer function so we can stop it
let wpt; //whitePieceTop 
let wpl; //whitePieceLeft
let powerBar = 0; //to control the height on the power  ar
let leaderSpot; //where's the leader?
let leaderTaker; //where's the leader's killer?
let gridRow; //finds the row or
let mappistMode = true; //gets set to true and false for the mappist mode because the opposing pawns move every other turn
let row; //row
let col; //collum
let opposingFirst = true; //the opposing pieces first actual move
let opposingPieces = document.getElementsByClassName("opposingpieces"); //the opposing pieces as a class. NOT the parent div (they have the same name)
let opTop = 0; //has to be set to 0 for later functions
let opLeft; //doesn't have to be set to 0 because it's not used as a function before it's defined
let whiteMoving = [0,0,""]; //the small array to tell the opposing pieces what *just* moved and has not been updated on the board yet.
let opposingTop = [5,5,5,5,5,5,5,5]; //how far each piece is from the top in PIXELS
let opMove = [0,0,0,0,0,0,0,0]; //is each piece moving or not? Differentiate it here, 0 is not moving, 1 means it is moving
let scoreCalc; //the to-be calculated score
let score; //the calculated score
let pieceSpeed; //will figure out local storage so the options don't set after reload later. Must comment first.
let pieceColor;

/*
function timer(){
	sleep(10000);
	time += 0.1;
	document.getElementById("time").innerHTML = time + "s";
	timer();
}
is this recursion? or an I just an idiot who made the HTML viewer crash?
*/

let time = document.getElementById("time"); //the final countdown element 
let totalSeconds = 0; //the countuper

function timer(){ //and thank you Chandu for the timer code on stack overflow. I modded it to fit my purposes
	totalSeconds += 1;
	time.innerHTML = totalSeconds / 10 + "s";
}

if (navigator.appVersion.indexOf("Win")!=-1) { //this bit here is because the way windows formats their browser isn't the same way everyone else does???
	document.getElementById("taken").style.top = "76px"; //I'm confused too. so here's some code to make it normal again.
	document.getElementById("time").style.top = "127px";
	document.getElementById("score").style.paddingTop = "8px";
	for (i = 0; i < document.getElementsByClassName("movingsquare").length; i++) {
		document.getElementsByClassName("movingsquare")[i].style.height = "60px";
	}
}

function boxSwitch0() { //to switch to the options block
	document.getElementById("infoblock").style.display = "none";
	document.getElementById("settingsblock").style.display = "block";
	document.getElementById("changebox").onclick = boxSwitch1;
}

function boxSwitch1() { //to switch back to the info block
	document.getElementById("infoblock").style.display = "block";
	document.getElementById("settingsblock").style.display = "none";
	document.getElementById("changebox").onclick = boxSwitch0;
}

function gridMaker() { //because we can't make matrices in js, w'll have to use arrayed arrays. ah well.
	for (i = 0; i < 8; i++) { //this loop makes the arrays in the array
		grid[i] = [];
		for (j = 0; j < 7; j++) { //and this one sets the numbers for thiose arrays in the array. They are all set to 0 because there are no pieces on the board.
			grid[i][j] = 0;
		}
	}
	for (i1 = 0; i1 < 7; i1++){ //except for the pieces that are on the board. which we fill in.
		grid[6][i1] = 1;
	}
	grid[7][1] = 1; //bump
	grid[7][3] = 1;
	grid[7][4] = 1;
}
gridMaker(); //i was wondering for a full 30 mins why this function wasn't working until I realized I never called it.

pieceSpeed = localStorage.getItem("pieceSpeed"); //But we don't want to be annoying, do we? so we're going to *save* the settings that way the user doesn't have to change them every time they refresh the page to play again
pieceColor = localStorage.getItem("pieceColor"); //along with all of the other settings
switch (pieceSpeed) { //so let's find what the speed was last time and set it this time
    case '0': //Instant
        for (i = 0; i < document.getElementsByClassName("pieces").length; i++) {
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0s";
		}
		for (i = 0; i < document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.0005s";
		}
		document.getElementById("piecespeed").value = '0'; //and set the little menu to that so you know that's the speed you're using
		break;
	case '1': //Quick
		for (i = 0; i< document.getElementsByClassName("pieces").length; i++) {
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0.13535s";
		}
		for (i = 0; i< document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.13535s";
		}
		document.getElementById("piecespeed").value = '1';
	    break;
	case '2': //Medium
		for (i = 0; i< document.getElementsByClassName("pieces").length; i++) {
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0.3s";
		}
		for (i = 0; i< document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.3s";
		}
		document.getElementById("piecespeed").value = '2';
		break;
	case '3': //Long
		for (i = 0; i< document.getElementsByClassName("pieces").length; i++) {
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0.75s";
		}
		for (i = 0; i< document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.75s";
		}
		document.getElementById("piecespeed").value = '3';
	    break;
	default:
	    break;
}

switch (pieceColor) { //whoops, I accidentally swapped the black and white conversions making these so I just changed the numbers because I was too lazy. anywho, here it is
    case '1': //to black
	    for (i = 0; i < document.getElementById("boardpieces").childElementCount; i++) {
			if ((i === 7) || (i === 9)) { //this if changes the helpers to the other color
			    document.getElementById("boardpieces").children[i].src = "images/black-helper-piece.png";
			} else if (i === 8) { //and this one the leader
			    document.getElementById("boardpieces").children[i].src = "images/black-leader-piece.png";
			} else { //and this one the pawns
			    document.getElementById("boardpieces").children[i].src = "images/pawn-opposing.png";
			}
		} //this for loop changes all the opposing pieces to the white color
		for (i = 0; i < document.getElementById("opposingpieces").childElementCount; i++) {
			document.getElementById("opposingpieces").children[i].src = "images/pawn-piece.png";
		} //and this changes the powerbar
		document.getElementById('blackpowerbar').style.backgroundColor = "white";
		document.getElementById('blackpowerbararrow').src = "images/flipped-white-powerbar-arrow.png";
		document.getElementById('whitepowerbararrow').src = "images/flipped-black-powerbar-arrow.png";
		document.getElementById('whitepowerbar').style.backgroundColor = "black";
		//now this changes the grid, so not only the pieces
		grid[7][1] = 0;
		grid[7][2] = 1;
		grid[7][4] = 0;
		grid[7][5] = 1;
		document.getElementById('whitehelper1').style.left = "195px";
		document.getElementById('whitehelper2').style.left = "375px";
		document.getElementById("piececolor").value = '1';
		break;
	case '0': //to white
	    for (i = 0; i < document.getElementById("boardpieces").childElementCount; i++) {
			if ((i === 7) || (i === 9)) {
			    document.getElementById("boardpieces").children[i].src = "images/helper-piece.png";
			} else if (i === 8) {
			    document.getElementById("boardpieces").children[i].src = "images/leader-piece.png";
			} else {
			    document.getElementById("boardpieces").children[i].src = "images/pawn-piece.png";
			}
		}
		for (i = 0; i < document.getElementById("opposingpieces").childElementCount; i++) {
			document.getElementById("opposingpieces").children[i].src = "images/pawn-opposing.png";
		}
		document.getElementById('blackpowerbar').style.backgroundColor = "black";
		document.getElementById('blackpowerbararrow').src = "images/black-powerbar-arrow.png";
		document.getElementById('whitepowerbararrow').src = "images/white-powerbar-arrow.png";
		document.getElementById('whitepowerbar').style.backgroundColor = "white";
		grid[7][1] = 1;
		grid[7][2] = 0;
		grid[7][4] = 1;
		grid[7][5] = 0;
		document.getElementById('whitehelper1').style.left = "135px";
		document.getElementById('whitehelper2').style.left = "315px";
		document.getElementById("piececolor").value = '0';
		break;
	default:
	    break;
}

function submitSettings() { //to sumbit the settings through a button click because that's probs the easiest. will make it auto save later
	if (document.getElementById("piecespeed").value === '0') { //is it set to INSTANT MOVING?
		for (i = 0; i < document.getElementsByClassName("pieces").length; i++) { //then let's change all the pieces with the "pieces" or "opposing pieces" class accordingly
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0s";
		}
		for (i = 0; i < document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.0005s";
		}
		localStorage.setItem("pieceSpeed", '0');
	} else if (document.getElementById("piecespeed").value === '1') { //Quick (default)
		for (i = 0; i< document.getElementsByClassName("pieces").length; i++) {
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0.13535s";
		}
		for (i = 0; i< document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.13535s";
		}
		localStorage.setItem("pieceSpeed", '1');
	} else if (document.getElementById("piecespeed").value === '2') { //Medium
		for (i = 0; i< document.getElementsByClassName("pieces").length; i++) {
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0.3s";
		}
		for (i = 0; i< document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.3s";
		}
		localStorage.setItem("pieceSpeed", '2');
	} else if (document.getElementById("piecespeed").value === '3') { //Long
		for (i = 0; i< document.getElementsByClassName("pieces").length; i++) {
			document.getElementsByClassName("pieces")[i].style.transitionDuration = "0.75s";
		}
		for (i = 0; i< document.getElementsByClassName("opposingpieces").length; i++) {
			document.getElementsByClassName("opposingpieces")[i].style.transitionDuration = "0.75s";
		}
		localStorage.setItem("pieceSpeed", '3');
	}
	if (document.getElementById("piececolor").value === '1') {
	    for (i = 0; i < document.getElementById("boardpieces").childElementCount; i++) {
			if ((i === 7) || (i === 9)) {
			    document.getElementById("boardpieces").children[i].src = "images/black-helper-piece.png";
			} else if (i === 8) {
			    document.getElementById("boardpieces").children[i].src = "images/black-leader-piece.png";
			} else {
			    document.getElementById("boardpieces").children[i].src = "images/pawn-opposing.png";
			}
		}
		for (i = 0; i < document.getElementById("opposingpieces").childElementCount; i++) {
			document.getElementById("opposingpieces").children[i].src = "images/pawn-piece.png";
		}
		document.getElementById('blackpowerbar').style.backgroundColor = "white";
		document.getElementById('blackpowerbararrow').src = "images/flipped-white-powerbar-arrow.png";
		document.getElementById('whitepowerbararrow').src = "images/flipped-black-powerbar-arrow.png";
		document.getElementById('whitepowerbar').style.backgroundColor = "black";
		grid[7][1] = 0;
		grid[7][2] = 1;
		grid[7][4] = 0;
		grid[7][5] = 1;
		document.getElementById('whitehelper1').style.left = "195px";
		document.getElementById('whitehelper2').style.left = "375px";
		localStorage.setItem("pieceColor", '1');
	} else if (document.getElementById("piececolor").value === '0') {
	    for (i = 0; i < document.getElementById("boardpieces").childElementCount; i++) {
			if ((i === 7) || (i === 9)) {
			    document.getElementById("boardpieces").children[i].src = "images/helper-piece.png";
			} else if (i === 8) {
			    document.getElementById("boardpieces").children[i].src = "images/leader-piece.png";
			} else {
			    document.getElementById("boardpieces").children[i].src = "images/pawn-piece.png";
			}
		}
		for (i = 0; i < document.getElementById("opposingpieces").childElementCount; i++) {
			document.getElementById("opposingpieces").children[i].src = "images/pawn-opposing.png";
		}
		document.getElementById('blackpowerbar').style.backgroundColor = "black";
		document.getElementById('blackpowerbararrow').src = "images/black-powerbar-arrow.png";
		document.getElementById('whitepowerbararrow').src = "images/white-powerbar-arrow.png";
		document.getElementById('whitepowerbar').style.backgroundColor = "white";
		grid[7][1] = 1;
		grid[7][2] = 0;
		grid[7][4] = 1;
		grid[7][5] = 0;
		document.getElementById('whitehelper1').style.left = "135px";
		document.getElementById('whitehelper2').style.left = "315px";
		localStorage.setItem("pieceColor", '0');
	}
}

function diceRoll(lastRol) {//this is the "dice roll", which is how the computer will choose where the next opposing pawn will go
	roll = Math.floor(Math.random() * 7); //idk if math.random is right, man. i'm writing this on a phone on a camping trip at 12:30 in the morning. ok my hand is getting tired from holding the phone up imma stop.
	//turns out math.random is right, just gotta floor it so we get an integer
	if (roll == lastRol) { //because you can't place two opposing pawns right after each other, this tells the computer to roll again if that happens.
		roll = Math.floor(Math.random() * 7); //wait what
		if (roll == lastRoll) { //shit
			roll = Math.floor(Math.random() * 7); //will fix once I find out why looping functions produces undefined results
			if (roll = lastRol) {
			    roll = Math.floor(Math.random() * 7);
			    return roll;
			} else {
			    return roll;
			}
		} else {
			return roll;
		}
	} else {
		return roll;
	}
	//and then we return the number for the game
} //haha! this code I wrote on a phone at 1 in the morning works!! (of course with some small bugs)

function difficultySubmit() { //user clicks the sumbit button for the difficulty
	if (document.getElementById("difficulty2").checked === true) { 
		difficulty = 2; //sets it to who ever is checked
		document.getElementById("difficultysubmit").disabled = "true";
		//and disables the sumbit box to prevent spamming and errors
		singleplayerStart(); //and then starts the game
	}else if (document.getElementById("difficulty1").checked === true) {
		difficulty = 1;
		document.getElementById("difficultysubmit").disabled = "true";
		singleplayerStart();
	}else if (document.getElementById("difficulty0").checked === true) {
		difficulty = 0; 
		document.getElementById("difficultysubmit").disabled = "true";
		singleplayerStart();
	}else{
		document.getElementById("errormes").style.display = "block";
		//and an error message in case anything goes wrong. The game will not start.
		//you will see this error message copy-pasted alot in the code
	}
	document.getElementById("piececolor").disabled = 'true';
}

function pieceClicked(pieceClicked, pieceTop, pieceLeft) {
	pieceName = pieceClicked;
	whitePieceTop = pieceTop;
	whitePieceLeft = pieceLeft;
	//for the playerMove function?? will test later.
}

function playerPiece(piece, pieceName) { //FUCKING HELL this was annoying. but I finally figured it out. let me explain what happens.
	if (moveable == false) { //has the game started yet? oh it hasn't? don't move if they click on you.
		return 0; //and return **nothing**
	}
	if (piece == 0) { //the function up top has piece and pieceName. piece says what kind of peice it is (pawn, helper, leader), and pieceName says what piece it is in that kind (it's id
		//pawn
		whitePiece = document.getElementById(pieceName).getBoundingClientRect(); //we get the diMENSIONS 
		var whitePieceTops = parseInt(whitePiece.top,10); //get it's top, remove the "px" and convert to number
		whitePieceTop = (whitePieceTops - 5) / 60; //by removing the spare pixels on the sides and dividing it by 60 (the width and height of each square), we get it's position in the "grid"
		var whitePieceLefts = parseInt(whitePiece.left,10); //and we do the same for the left.
		whitePieceLeft = (whitePieceLefts - 75) / 60; //after this line, we go one row up on the grid, and highlight the 3 squares in front.
		var whitePieceTop1 = whitePieceTop - 1; //why tf does "- 1" work but "--" doesn't?? dumb js
		var whitePieceLeft1 = whitePieceLeft - 1;
		var whitePieceLeft3 = whitePieceLeft + 1; //oh but THIS works for some fuckin reason
		if (whitePieceTop === 0) {
			whitePieceTop1 = 7;
		}
		var gridRowId = "grid" + whitePieceTop1; //we find the row by getting the id of it. I wanted to find the children of children of "movinggrid" to get the squares, but that didn't work
		document.getElementById("movinggrid").style.zIndex = "5"; //now this was the real stumper. Because the rows stack on each other, you have to make all of them invisible, not completely gone from the canvas.
		document.getElementById("movinggrid").style.display = "inline-block"; //and then display it as an inline block and make the z index 5 so it's on top and -1 which is under everything
		document.getElementById("movinggrid").children[whitePieceTop].children[whitePieceLeft].style.visibility = "visible";
		gridRow = document.getElementById(gridRowId); //then we get the grid rowww
		if ((grid[whitePieceTop1][whitePieceLeft1] == 0)||(grid[whitePieceTop1][whitePieceLeft1] == 2)){ //and see if there's another piece thereee (adding this in was easier then I though, but I don't wanna jinx it.)
			if (whitePieceLeft1 > -1){ //and then see if it's on the sides of the board (so we don't display it and get an error(even though it does anyway))
				gridRow.children[whitePieceLeft1].style.visibility = "visible";
			} //this is the top left corner of it's moving ability
		}
		if ((grid[whitePieceTop1][whitePieceLeft] == 0)||(grid[whitePieceTop1][whitePieceLeft] == 2)){ //this is straight in front of it
			gridRow.children[whitePieceLeft].style.visibility = "visible";
		}
		if ((grid[whitePieceTop1][whitePieceLeft3] == 0)||(grid[whitePieceTop1][whitePieceLeft3] == 2)){ //thi is top right
			if (whitePieceLeft3 < 8){
				gridRow.children[whitePieceLeft3].style.visibility = "visible";
			} 
		}//easy? if you call 4 hours of thinking, rewriting, and testing on a phone split up over the course of a day easy, then yeah, it was pretty fucking basic lol
	} else if (piece == 1) { //helper
		if (firstTaken == true) { //pretty much the same as the code above, except that you have to make sure the player doesn't move it before the first piece is taken
			whitePiece = document.getElementById(pieceName).getBoundingClientRect();
			var whitePieceTops = parseInt(whitePiece.top,10); //get it's top, remove the "px" and convert to number
			whitePieceTop = (whitePieceTops - 5) / 60; //by removing the spare pixels on the sides and dividing it by 60 (the width and height of each square), we get it's position in the "grid"
			wpt = whitePieceTop;
			var whitePieceLefts = parseInt(whitePiece.left,10); //and we do the same for the left.
			whitePieceLeft = (whitePieceLefts - 75) / 60;
			wpl = whitePieceLeft; //so it isn't hell to write out ever and over again
			gridRow = document.getElementById("movinggrid");
			document.getElementById("movinggrid").children[wpt].children[wpl].style.visibility = "visible";
			document.getElementById("movinggrid").style.zIndex = "5"; //now this was the real stumper. Because the rows stack on each other, you have to make all of them invisible, not completely gone from the canvas.
			document.getElementById("movinggrid").style.display = "inline-block";
			//now here's where the lOng if statements come in
			//top left
			if ((wpt-1>=0)&&(wpl-1>=0)) { //we check if the spot on the grid is actually moveable by saying it has to be above 0 or below 7 or 8
				if ((grid[wpt - 1][wpl - 1] == 0) || (grid[wpt - 1][wpl - 1] == 2)) { //*then* we check if no one is there
					gridRow.children[wpt-1].children[wpl-1].style.visibility = "visible";
				//if we wanted the piece to NOT be able to jump over pieces, we would put the if statement below right here and so on for all the other. spent a good minute thinking about this while eating too much ice cream
				}
				if ((wpt-2>=0)&&(wpl-2>=0)) {
					if ((grid[wpt - 2][wpl - 2] == 0) || (grid[wpt - 2][wpl - 2] == 2)) {
						gridRow.children[wpt-2].children[wpl-2].style.visibility = "visible";
					}
					if ((wpt-3>=0)&&(wpl-3>=0)) {
						if ((grid[wpt - 3][wpl - 3] == 0) || (grid[wpt - 3][wpl - 3] == 2)) {
							gridRow.children[wpt-3].children[wpl-3].style.visibility = "visible";
						}
					}
				}
			}
			//top right
			if ((wpt-1>=0)&&(wpl+1<=6)) {
				if ((grid[wpt - 1][wpl + 1] == 0) || (grid[wpt - 1][wpl + 1] == 2)) {
					gridRow.children[wpt-1].children[wpl+1].style.visibility = "visible";
				}
				if ((wpt-2>=0)&&(wpl+2<=6)) {
					if ((grid[wpt - 2][wpl + 2] == 0) || (grid[wpt - 2][wpl + 2] == 2)) {
						gridRow.children[wpt-2].children[wpl+2].style.visibility = "visible";
					}
					if ((wpt-3>=0)&&(wpl+3<=6)) {
						if ((grid[wpt - 3][wpl + 3] == 0) || (grid[wpt - 3][wpl + 3] == 2)) {
							gridRow.children[wpt-3].children[wpl+3].style.visibility = "visible";
						}
					}
				}
			}
			//bottom right
			if ((wpt+1<=7)&&(wpl+1<=6)) {
				if ((grid[wpt + 1][wpl + 1] == 0) || (grid[wpt + 1][wpl + 1] == 2)) {
					gridRow.children[wpt+1].children[wpl+1].style.visibility = "visible";
				}
				if ((wpt+2<=7)&&(wpl+2<=6)) {
					if ((grid[wpt + 2][wpl + 2] == 0) || (grid[wpt + 2][wpl + 2] == 2)) {
						gridRow.children[wpt+2].children[wpl+2].style.visibility = "visible";
					}
					if ((wpt+3<=7)&&(wpl+3<=6)) {
						if ((grid[wpt + 3][wpl + 3] == 0) || (grid[wpt + 3][wpl + 3] == 2)) {
							gridRow.children[wpt+3].children[wpl+3].style.visibility = "visible";
						}
					}
				}
			}
			//bottom left
			if ((wpt+1<=7)&&(wpl-1>=0)) {
				if ((grid[wpt + 1][wpl - 1] == 0) || (grid[wpt + 1][wpl - 1] == 2)) {
					gridRow.children[wpt+1].children[wpl-1].style.visibility = "visible";
				}
				if ((wpt+2<=7)&&(wpl-2>=0)) {
					if ((grid[wpt + 2][wpl - 2] == 0) || (grid[wpt + 2][wpl - 2] == 2)) {
						gridRow.children[wpt+2].children[wpl-2].style.visibility = "visible";
					}
					if ((wpt+3<=7)&&(wpl-3>=0)) {
						if ((grid[wpt + 3][wpl - 3] == 0) || (grid[wpt + 3][wpl - 3] == 2)) {
							gridRow.children[wpt+3].children[wpl-3].style.visibility = "visible";
						}
					} //will fix this messey code on a COMPUTER 
				}
			}
		} else if (firstTaken == false) {
			return 0; //*this is fine*
		}
	} else if (piece == 2) { //Leader
		if (firstTaken == true) {
			whitePiece = document.getElementById("whiteleader").getBoundingClientRect();
			var whitePieceTops = parseInt(whitePiece.top,10); //get it's top, remove the "px" and convert to number
			wpt = (whitePieceTops - 5) / 60; //by removing the spare pixels on the sides and dividing it by 60 (the width and height of each square), we get it's position in the "grid"
			var whitePieceLefts = parseInt(whitePiece.left,10); //and we do the same for the left.
			wpl = (whitePieceLefts - 75) / 60;
			whitePieceLeft = wpl; //because i'm an idiot
			whitePieceTop = wpt;
			document.getElementById("movinggrid").children[wpt].children[wpl].style.visibility = "visible";
			gridRow = document.getElementById("movinggrid");
			document.getElementById("movinggrid").style.zIndex = "5"; //now this was the real stumper. Because the rows stack on each other, you have to make all of them invisible, not completely gone from the canvas.
			document.getElementById("movinggrid").style.display = "inline-block";
			if(wpt-1>=0){ //starts pointing up, goes clockwise
				if((grid[wpt-1][wpl] == 0) || (grid[wpt-1][wpl] == 2)) {
					gridRow.children[wpt-1].children[wpl].style.visibility = "visible";
				}
			}
			if((wpt-1>=0)&&(wpl+1<=6)){ //top right
				if((grid[wpt-1][wpl+1] == 0) || (grid[wpt-1][wpl+1] == 2)) {
					gridRow.children[wpt-1].children[wpl+1].style.visibility = "visible";
				}
			}
			if((wpl+1<=6)){ //right
				if((grid[wpt][wpl+1] == 0) || (grid[wpt][wpl+1] == 2)) {
					gridRow.children[wpt].children[wpl+1].style.visibility = "visible";
				}
			}
			if((wpt+1<=7)&&(wpl+1<=6)){ //bottom right
				if((grid[wpt+1][wpl+1] == 0) || (grid[wpt+1][wpl+1] == 2)) {
					gridRow.children[wpt+1].children[wpl+1].style.visibility = "visible";
				}
			}
			if((wpt+1<=7)){ //bottom
				if((grid[wpt+1][wpl] == 0) || (grid[wpt+1][wpl] == 2)) {
					gridRow.children[wpt+1].children[wpl].style.visibility = "visible";
				}
			}
			if((wpt+1<=7)&&(wpl-1>=0)){ //bottom left
				if((grid[wpt+1][wpl-1] == 0) || (grid[wpt+1][wpl-1] == 2)) {
					gridRow.children[wpt+1].children[wpl-1].style.visibility = "visible";
				}
			}
			if((wpl-1>=0)){ //left
				if((grid[wpt][wpl-1] == 0) || (grid[wpt][wpl-1] == 2)) {
					gridRow.children[wpt].children[wpl-1].style.visibility = "visible";
				}
			}
			if((wpt-1>=0)&&(wpl-1>=0)){ //and top left
				if((grid[wpt-1][wpl-1] == 0) || (grid[wpt-1][wpl-1] == 2)) {
					gridRow.children[wpt-1].children[wpl-1].style.visibility = "visible";
				}
			}
		} else if (firstTaken == false) {
			return 0;
		}
	}//save this `if else` for later
	/*if (difficulty == 0) {
		if (mappistMove == true) {
			mappistMove = false;
			//function to do playerMove again
		}else if (mappistMove == false){
			mappistMove = true;
			//continue with opposing move
		}
	}*/
	pieceClicked(pieceName, whitePieceTop, whitePieceLeft); //this is needed for some reason to get pieceName global so playerMove() can use it lol
}

function playerMove(row, col) { //thiz was easier than I thought it was going to be
	if ((whitePieceTop == row)&&(whitePieceLeft == col)) {
		document.getElementById("movinggrid").style.zIndex = "-1";  //and then we move the grid backk
		document.getElementById("movinggrid").style.display = "none";
		var gridReset = document.getElementsByClassName("movingsquare");
		for (i = 0; i < gridReset.length; i++) { 
			gridReset[i].style.visibility = "hidden";
		}
	} else {
		rowSet = row; //we make unchanged coppies
		colSet = col;
		row = row * 60 + 5; //then change the originals and convert them to pixels so we can place the pieces on the board
		col = col * 60 + 75;
		whiteMoving = [rowSet, colSet, pieceName];
		grid[whitePieceTop][whitePieceLeft] = 0; //then with the *unchanged* ones, we make where the piece was 0 and where it is now 1
		if (grid[rowSet][colSet] == 2) { //and then we check to see if we got any pieces!
			var rowTop = rowSet * 60 + 5; //we get the top... (because that's all we need)
			for (i = 0; i < opposingTop.length ; i++) { //and ruffle through all the opposing pieces...
				if (rowTop == document.getElementById("opposingpieces").children[i].getBoundingClientRect().top){ //found a match?
					document.getElementById("opposingpieces").children[i].style.opacity = "0"; //hide it
					document.getElementById("opposingpieces").children[i].style.top = "5px"; //and set it back to the beginning  
					document.getElementById("opposingpieces").children[i].style.left = (i * 60 + 75) + "px";
					opposingTop[i] = 5; //set the top back to 5
					opMove[i] = 0; //and set it to 0 so it will not added to keep moving
					++taken; //and then of course add the score
					document.getElementById("taken").innerHTML = taken;
					if (firstTaken == false){ //prety self explanatory 
						firstTaken = true;
					}
				}
			}
		}
		grid[rowSet][colSet] = 1; //and then after all that
		//we set that place 1
		document.getElementById(pieceName).style.top = row + "px"; //there we go
		document.getElementById(pieceName).style.left = col + "px";
		document.getElementById("movinggrid").style.zIndex = "-1";  //and then we move the grid backk
		document.getElementById("movinggrid").style.display = "none";
		var gridReset = document.getElementsByClassName("movingsquare");
		for (i = 0; i < gridReset.length; i++) { //and change all the tiles too (the board looks quite funny after a few moves if you don't)
			gridReset[i].style.visibility = "hidden";
		}
		if (firstMove == true){
			firstMove = false; //and then to start the timer, which works perfectly :)
			timerVar = setInterval(timer, 100);
		}
		opposingMove();
	} //it is currently 11:56pm, my computer is at 15% and I don't have a charger, I have band camp at 7:50am tomorrow, but I am the happiest person in the world because I pretty much just finished v0.1 of the game (excluding cleaning up the code). YAYY
}

function singleplayerStart() { //this gets called when you click "submit"
	lastRoll = diceRoll(3); //this sets the roll as the last roll, which will be used later so the next opposing pawn doesn't go in the same row twice in a row.
	document.getElementById("opposingpieces").children[lastRoll].style.opacity = "0.4"; //and this (somehow) makes the first opposing pawn lighter so you know it'a not on the board yet.
	moveable = true; //and we can now move
}

function opposingMove(){ //this function wasn't that bad (as long as you knew what the HECK you were typing) so i was good
	if (opposingFirst == true){ //is it the first move? let's shade that poor pawn up
		opposingFirst = false;
		document.getElementById("opposingpieces").children[lastRoll].style.opacity = "1"; //like so
		grid[0][lastRoll] = 2; //and give it a space on the board
		opMove[lastRoll] = 1; //and keep it moving
	} else { //not the first move?
		for (i = 0; i < opMove.length; i++) { //whatever pawns are set to 'keep moving', keep moving them
			if (opMove[i] == 1){ //but only if they are *set* to
				opposingTop[i] += 60; //this is only set on the ARRAY, not the board yet
			}
		}
		for (i1 = 0; i1 < opposingPieces.length; i1++) { //HERE we change the pieces on the board (but they only *really* move when the function finishes)
			opposingPieces[i1].style.top = opposingTop[i1] + "px";
		}
		lastRoll = diceRoll(lastRoll); //once all the previous pieces are seeeet, we get the new one!
		opPieceGrid(); //we update the grid[] now, because we're going to use it in this next section
		if (grid[0][lastRoll] == 1) { //this was annoying (and I actually think I don't need half of it) because i needed it ***just** to see if a piece was on the back line
			for (i3 = 0; i3 < 9 ; i3++){ //do a loooooooop
				rowLeft = document.getElementById("boardpieces").children[i3].getBoundingClientRect().left; //we get the left position of each piece
				if ((5 == document.getElementById("boardpieces").children[i3].getBoundingClientRect().top) && (rowLeft == lastRoll * 60 + 75)){ //and if the piece is somewhere on the back row, the opposing pieces take it
					if(i3 == 8) { //if it's the king, the game ends
						endGame();
					}
					document.getElementById("boardpieces").children[i3].style.display = "none"; //and we hide it
					if (firstTaken == false){ //and if it's the first take, the helpers can move now
						firstTaken = true;
					}
				}
			}
		}
		if (opMove[7] == 1) { //when all opposing pieces are on the board
			return 0;
		} else if (opMove[lastRoll] == 1) { //looks like that spot is already taken! let's move a piece in there to fill it
			for (i2 = 0; ; i2++) { //kinda forgot how this part worked. oh right!
				if (opMove[i2] == 0) { //you keep going till u find a free piece, then you slide it to where lastRoll is
					document.getElementById("opposingpieces").children[i2].style.left = (lastRoll * 60 + 75) + "px";
					document.getElementById("opposingpieces").children[i2].style.opacity = "1";
					grid[0][lastRoll] = 2;
					opMove[i2] = 1;
					break;
				} else if (i2 == 7) { //for the *eighth* piece
					document.getElementById("opposingpieces").children[i2].style.left = (lastRoll * 60 + 75) + "px";
					document.getElementById("opposingpieces").children[i2].style.opacity = "1";
					grid[0][lastRoll] = 2;
					opMove[i2] = 1;
					break;
				} else {
					continue;
				}
			}
		} else { //piece *not* taken? here we go
			document.getElementById("opposingpieces").children[lastRoll].style.opacity = "1";
			grid[0][lastRoll] = 2;
			opMove[lastRoll] = 1;
		}
	}
	console.log(grid[0][lastRoll]);
	powerBarControler();
	//and then we print the board! how nice
	console.log("move----------");
	for(i4 = 0; i4 < 8; i4++){
		console.log(grid[i4]);
	}
}

function powerBarControler() { //this is control the ***********************useless*********************** bar on the left side (to be fair, it's usefull in multiplayer)
	powerBar = 0; //it's 0
	for (i = 0; i < opposingTop.length; i++){ //and we set it to the farthest opposing piece across 
		if (opposingTop[i] - 5 > powerBar) {
			powerBar = opposingTop[i] - 5;
		}
	}
	if (powerBar <= 360){ //and convert it to the bar accordingly
		document.getElementById("blackpowerbar").style.height = powerBar + "px";
	}
	if (powerBar <= 360) {
		document.getElementById("blackpowerbararrow").style.top = (powerBar +	4) + "px";
	}
	if (powerBar >= 60) {
		document.getElementById("whitepowerbar").style.height = (362 - powerBar) + "px";
	}
	if ((powerBar >= 60)&&(powerBar <= 360)) {
		document.getElementById("whitepowerbararrow").style.top = (powerBar + 64) + "px";
	}
}

//this function here was HELL, because it was placed with opposingMove(), meaning nothing moved (and no data collected) until BOTH were done.
function opPieceGrid() { //so I made it a function and placed right after the player clicks the next piece, or after everything has moved.
	for (i = 0; i < opMove.length; i++) { //this makes a loop, like the the one in opposing move (which was where this originally was)
		if (opMove[i] == 1) { //same thing
			opLeft = (document.getElementById("opposingpieces").children[i].getBoundingClientRect().left - 75) / 60;
			//we get the collum
			if(opTop < 8) {
				opTop = (document.getElementById("opposingpieces").children[i].getBoundingClientRect().top - 5) / 60 + 1;
			}
			//we get its row
			var opTop1 = opTop - 1;
			//we subtract 1 to erase where it
			if(opTop == 8) { //if it's the king we end the game
				document.getElementById("opposingpieces").children[i].style.top = "425px";
				endGame();
			}
			if ((opTop == whiteMoving[0])&&(opLeft == whiteMoving[1])) { //and if the a white piece JUST MOVED THERE FR NO REASON, theeeeeen we use the whiteMoving[] to say it just moved there because the board hasn't updated yet
				if (whiteMoving[2] == "whiteleader") { //if it's the leader, we end the game
					document.getElementById(whiteMoving[2]).style.display = "none";
					endGame();
				}
				document.getElementById(whiteMoving[2]).style.display = "none";
			}
			if (grid[opTop][opLeft] == 1) { //we see if a white piece is already there
				var rowTop = opTop * 60 + 5; //and we convert the coordinates to pixels
				var rowLeft = opLeft * 60 + 75;
				for (i1 = 0; i1 < 9 ; i1++){ //we check all the white pieces to see which white piece is in that spot
					if ((rowTop == document.getElementById("boardpieces").children[i1].getBoundingClientRect().top) && (rowLeft == document.getElementById("boardpieces").children[i1].getBoundingClientRect().left)){
						if(i1 == 8) { //**if it's the king we end the game**
							endGame(); //no duh
						}
						document.getElementById("boardpieces").children[i1].style.display = "none"; //and then we make the piece we found disapear
						if (firstTaken == false){
							firstTaken = true;
						}
					}
				}
			}
			//we triangulate the position and mark it with a 2, bulldozing everything in the path
			if (opTop > 0) { //if it's above 0, we make it disapear
				grid[opTop][opLeft] = 2;
			}
			if (opTop1 > -1) { //and make sure we don't stop the function because something is on the backline
				grid[opTop1][opLeft] = 0;
			}
			
		} else {
			continue;
		}
	}
}

function endGame() { //looks like you lost the game, now - WAIT - I LOST THE GAAME! 
	clearInterval(timerVar); //we stop the timer
	scoreCalc = parseInt(document.getElementById("taken").innerHTML);
	if (difficulty == 0) { //and calculate the score based on the difficulty
		score = scoreCalc * 0;
	} else if (difficulty == 1) {
		score = scoreCalc * 100;
	} else if (difficulty == 2) {
		score = scoreCalc * 150;
		//will make score calculation for creator level more percise
	}
	document.getElementById("score").innerHTML = score; //and update the score!
	document.getElementById("movinggrid").style.zIndex = "5"; //and make the board unmoveable because you lost
	document.getElementById("movinggrid").style.display = "inline-block";
}
//over vacation, I wrote 410 lines of code on a phone over the course of a week with little help from the internet and alot of time. Just a landmark to say that if you really put your mind to something, you can do it.