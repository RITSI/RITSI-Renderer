document.addEventListener('DOMContentLoaded', function(e){
	var submitButton = document.getElementById('submit');

}, false);

var send = function(){
	var text = document.getElementById('text-input-area').value;
	console.log(text); return;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			console.log(xhttp.responseText);
		}
	};

	xhttp.open("POST", "/convert/");
	xhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhttp.send(JSON.stringify({text:"text"}))
};