/*
 * A simple File object for the specific purposes of this project
 */

var CustomFile = function(file, filename){
    this.file = file;
    this.filename = filename;
};

CustomFile.prototype.isImage = function(filename){
    return imageExtensions.indexOf(splitFileRe.exec(filename)[2]) > -1;
};

CustomFile.prototype.generateMdFileText = function(){
    var str = this.isImage() ? "!": "";
    var dir = this.isImage() ? images_dir : data_dir;
    str += "[" + this.filename + "]"+"("+dir+"/"+this.filename+")";
    return str;
};

