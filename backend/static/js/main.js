/*
 * Checks if the drag and drop functionality is available.
 */
var supportsDragAndDrop = (function() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
})();

/*
* TODO: Here should be all the logic, since it will fire when the document is reqdy
*/
document.addEventListener('DOMContentLoaded', function(e){
	var submitButton = document.getElementById('submit');

}, false);



var file_selector = document.getElementById("file-selector");
var form = document.getElementById("dataform");
var files = {};
var imageExtensions = ['.jpeg', '.jpg', '.png', '.pdf', '.eps']; // LaTeX allowed image formats
var splitFileRe = /(.+?)(\.[^.]*$|$)/; //http://stackoverflow.com/a/624877/2628463
var input_files = [];
var data_dir = "data";
var images_dir = "images";

/*
 * Allows for files with same names. Not really necessary, the API should cover everything
 */
var generateRandomSuffix = function(filename){
    split = splitFileRe.exec(filename);
    if(split == null){
        file_name = filename + Math.random().toString(36).substring(7);
    }else{
        file_name = split[1] + Math.random().toString(36).substring(7) + split[2];
    }
};

/*
 * Create a CustomFile file object and append it to the list
 */
file_selector.onchange = function(e){

    var file = this.files[0];
    var same_name = files[file.name];
    var file_name = file.name;

    if(same_name !== undefined){
        file_name = generateRandomSuffix(file_name);
    }

    insertFileInList(new CustomFile(file, file_name));

    this.value = "";

};

/*
 * Processes the list of files and sends the data.
 */
form.onsubmit = function(e){
    e.preventDefault();
    var form_data = new FormData();
    var received_file_name = "render.zip";

    for(var index in files){
        form_data.append(index, files[index].file);
    }

    form_data.append("markdown-data", document.getElementById('text-input-area').value);
    //añadir plantilla seleccionada y tamaño de la imagen
    if(document.getElementById('use-template').checked) {
        form_data.append("selected-template", document.getElementById('select-template').value)
    }
    if(document.getElementById('set-size').checked) {
        form_data.append("image-width", document.getElementById('width').value);
        form_data.append("image-height", document.getElementById('height').value);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/render/", true);
    xhr.setRequestHeader("Accept","application/zip");
    xhr.responseType = "blob";
    xhr.onload = function(e){
        if(this.status==200)
            saveAs(this.response, received_file_name);
    };
    xhr.send(form_data);
};

/*
 * AJAX!
 * TODO: This function is no longer in use
 */
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

/*
 * Inserts the file in the array and also creates the frontend functionality
 * @param file {Object} The File object
 *
 */
var insertFileInList = function(file){
    var fileHtml = '<li data-file="'+file.filename+'" class="file">'+file.filename +
        '<a href="" class="file-control file-control-insert pull-right">' +
        '<span title="Insertar referencia en el texto"><i class="file-control-icon file-control-insert fa fa-edit"></i></span></a>' +
        '<a href="" class="file-control file-control-delete pull-right">' +
        '<span title="Eliminar fichero"><i class="file-control-icon file-control-delete fa fa-times"></i></span></a></li>';

    var fileList = document.getElementById('files');
    var wrapper = document.createElement('div');
    wrapper.innerHTML = fileHtml;
    fileList.appendChild(wrapper.firstChild);
    files[file.filename]= file;
};

/*
 * Removes file in list and in the interface.
 */
var deleteFileInList = function(element){
    var file = getClosest(element, '.file');
    var filename = file.dataset.file;

    delete files[filename];

    document.getElementById('files').removeChild(file);

};

/*
 * Appends text to the input area when the 'paste in text' button is clicked
 */
var insertText = function(htmlElement){

    var file = files[getClosest(htmlElement, '.file').dataset.file];

    var text = file.generateMdFileText();

    var markdownField = document.getElementById("text-input-area");

    //IE support
    if(document.selection){
        markdownField.focus();
    }
    else if(markdownField.selectionStart || markdownField.selectionStart == '0'){
        var startPos = markdownField.selectionStart;
        var endPos = markdownField.selectionEnd;
        markdownField.value = markdownField.value.substring(0, startPos)
                                + text
                                + markdownField.value.substring(endPos, markdownField.value.length);

        markdownField.selectionStart = markdownField.selectionEnd = startPos + text.length;
        //TODO: Consider using selectionEnd = endPos + text.length to have the inserted text highlighted
    }
    else{
        markdownField.value += text;
    }
};

/*
 * Event binding
 */
document.getElementById('files').addEventListener("click", function(e){
    e.preventDefault();
    if(e.target && (e.target.matches('i.file-control-icon') || e.target.matches('a.file-control'))){

        if(e.target.classList.contains('file-control-insert')){
            insertText(e.target);
        }

        else if(e.target.classList.contains('file-control-delete')){
            deleteFileInList(e.target);
        }

    }
});

/*
 * Drag and Drop functionality.
 */
var fileInput = document.getElementById('file-input');
fileInput.addEventListener('dragenter', function(e){
    e.stopPropagation();
    e.preventDefault();
    //$(this).css('border', '2px solid #0B85A1');
});

fileInput.addEventListener('dragover', function(e){
    e.stopPropagation();
    e.preventDefault();

});

fileInput.addEventListener('drop', function(e){
    e.stopPropagation();
    //$(this).css('border', '2px dotted #0B85A1');
    e.preventDefault();
    var event = e.originalEvent === undefined ? e : e.originalEvent;
    var draggedFiles = event.dataTransfer.files;
    for(var i = 0; i < draggedFiles.length; ++i){
        var fileName = draggedFiles[i].name;

        if(files[fileName] !== undefined){
            fileName = generateRandomSuffix(fileName);
        }

        var newFile = new CustomFile(draggedFiles[i], fileName);
        insertFileInList(newFile);
    }

});

/*var obj = $("#dragandrophandler");


    obj.on('drop', function(e) {


        e.preventDefault();
        var files = e.originalEvent.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
            files_to_upload.push({file: files[i]});
            fileCount++;
            addToList(files[i]);
        }
    });*/
