//sleep function if I ever need it
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

document.getElementById("jsdisabled").style.display = "none";
document.getElementById("single-error").style.display = "none";

var ua = navigator.userAgent.toLowerCase(); 
if (ua.indexOf('safari') != -1) { 
	if (ua.indexOf('chrome') > -1) {
		document.getElementById("safariwarningmessage").style.display = "none";// Chrome
	} else {
		document.getElementById("safariwarningmessage").style.display = "block";// Safari
	}
}

function hideWarningMessage() {
	document.getElementById("safariwarningmessage").style.display = "none";
}

let mode;
mode = localStorage.getItem('mode'); //it first gets the previous mode

if (mode === 'light'){ //and checks to see if it was previously light and dark, then does it.
	lightMode();
}else{
	darkMode();
}

function darkMode() {
	document.body.style.backgroundColor = "black";
	document.getElementById("bgchanger").onclick = lightMode;
	document.getElementById("bgchanger").innerHTML = "Light Mode";
	document.getElementById("bgchanger").style.fontSize = "19px";
	document.getElementById("multi-error").style.color = "white";
	document.getElementById("backgroundfavicon").style.zIndex = "4";
	localStorage.setItem('mode', 'dark');
	mode = localStorage.getItem('mode');
}

function lightMode() {//makes it light again lol
	document.body.style.backgroundColor = "#e6f6ff";
	document.getElementById("bgchanger").onclick = darkMode;
	document.getElementById("bgchanger").innerHTML = "Dark Mode";
	document.getElementById("bgchanger").style.fontSize = "20px";
	document.getElementById("multi-error").style.color = "black";
	document.getElementById("backgroundfavicon").style.zIndex = "-1";
	localStorage.setItem('mode', 'light');
	mode = localStorage.getItem('mode');
}