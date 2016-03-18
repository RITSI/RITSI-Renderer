document.addEventListener('DOMContentLoaded', function(e){
	var submitButton = document.getElementById('submit');

}, false);

var file_selector = document.getElementById("file-selector");
var form = document.getElementById("dataform");
var files = [];
var input_files = [];

file_selector.onchange = function(e){

    var re = /(.+?)(\.[^.]*$|$)/; //http://stackoverflow.com/a/624877/2628463

    var file = this.files[0];
    var same_name = files.filter(function(value, index){
       return value.name == file.name;
    });
    var file_name = file.name;
    if(same_name.length > 0){
        split = re.exec(file.name);
        if(split == null){
            file_name = file.name + Math.random().toString(36).substring(7);
        }else{
            file_name = split[1] + Math.random().toString(36).substring(7) + split[2];
        }
    }
    files.push({given_name:file_name, file:file});
    this.value = "";

    /*var input_file = document.createElement("input");
    input_file.setAttribute("type", "file");
    input_file.setAttribute("style", "display:none");
    input_file.setAttribute("name", "file_"+input_files.length);
    input_file.setAttribute("id", "id_"+input_files.length);
    form.appendChild(input_file);
    input_files.push(input_file);*/
};

form.onsubmit = function(e){
    e.preventDefault();
    var form_data = new FormData();
    var received_file_name = "render.zip";
    files.forEach(function(file){
       form_data.append(file.given_name, file.file);
    });
    form_data.append("markdown-data", document.getElementById('text-input-area').value);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/render/", true);
    xhr.setRequestHeader("Accept","application/zip");
    xhr.responseType = "blob";
    xhr.onload = function(e){
        console.log("Here")
        if(this.status==200)
            saveAs(this.response, received_file_name);
    };
    xhr.send(form_data);
};

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

var removeFile = function(htmlElement){

};

var insertText = function(htmlElement){

};

document.getElementById('files').addEventListener("click", function(e){
    e.preventDefault();
    if(e.target && (e.target.matches('i.file-control-icon') || e.target.matches('a.file-control'))){

        if(e.target.classList.contains('file-control-insert')){
            removeFile(e.target);
        }

        else if(e.target.classList.contains('file-control-delete')){
            insertText(e.target);
        }
    }
});