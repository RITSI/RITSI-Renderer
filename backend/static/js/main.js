document.addEventListener('DOMContentLoaded', function(e){
	var submitButton = document.getElementById('submit');

}, false);

var file_selector = document.getElementById("file-selector");
var form = document.getElementById("dataform");
var files = [];
var imageExtensions = ['.jpeg', '.jpg', '.png', '.pdf', '.eps']; // LaTeX allowed image formats
var splitFileRe = /(.+?)(\.[^.]*$|$)/; //http://stackoverflow.com/a/624877/2628463
var input_files = [];
var data_dir = "data";
var images_dir = "images";

file_selector.onchange = function(e){


    var file = this.files[0];
    var same_name = files.filter(function(value, index){
       return value.name == file.name;
    });
    var file_name = file.name;
    if(same_name.length > 0){
        split = splitFileRe.exec(file.name);
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

/**
 * Get closest DOM element up the tree that contains a class, ID, or data attribute
 * From http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
 * @param  {Node} elem The base element
 * @param  {String} selector The class, id, data attribute, or tag to look for
 * @return {Node} Null if no match
 */
var getClosest = function (elem, selector) {

    var firstChar = selector.charAt(0);

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

        // If selector is a class
        if ( firstChar === '.' ) {
            if ( elem.classList.contains( selector.substr(1) ) ) {
                return elem;
            }
        }

        // If selector is an ID
        if ( firstChar === '#' ) {
            if ( elem.id === selector.substr(1) ) {
                return elem;
            }
        }

        // If selector is a data attribute
        if ( firstChar === '[' ) {
            if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                return elem;
            }
        }

        // If selector is a tag
        if ( elem.tagName.toLowerCase() === selector ) {
            return elem;
        }

    }

    return false;

};

var isImage = function(filename){
    return imageExtensions.indexOf(splitFileRe.exec(filename)[2]) > -1;
};

var generateMdFileText = function(filename, image){
    var str = image ? "!": "";
    var dir = image ? images_dir : data_dir;
    str += "[" + filename + "]"+"("+dir+"/"+filename+")";

    return str;

};

var insertText = function(htmlElement){
    var file = getClosest(htmlElement, '.file').dataset.file;

    var text = generateMdFileText(file, isImage(file));

    var markdownField = document.getElementById("text-input-area");
    //IE support
    if(document.selection){
        markdownField.focus();
    }else if(markdownField.selectionStart || markdownField.selectionStart == '0'){
        var startPos = markdownField.selectionStart;
        var endPos = markdownField.selectionEnd;
        markdownField.value = markdownField.value.substring(0, startPos) + text
                                + markdownField.value.substring(endPos, markdownField.value.length);
        markdownField.selectionStart = markdownField.selectionEnd = startPos + text.length;
        //TODO: Consider using selectionEnd = endPos + text.length to have the inserted text highlighted
    }else{
        markdownField.value += text;
    }
};

document.getElementById('files').addEventListener("click", function(e){
    e.preventDefault();
    if(e.target && (e.target.matches('i.file-control-icon') || e.target.matches('a.file-control'))){

        if(e.target.classList.contains('file-control-insert')){
            insertText(e.target);
        }

        else if(e.target.classList.contains('file-control-delete')){
            removeFile(e.target);
        }

    }
});