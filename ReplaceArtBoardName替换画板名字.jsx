/*
//第一版，弹出2个窗口来修改    
    
//#target illustrator

if (app.documents.length === 0) {
    // No document is open, do nothing
} else {
    var doc = app.activeDocument;
    
    var jsfind = prompt("Find: ", "");
    var jsreplace = prompt("Replace: ", "");
    
    var jsfindREGEX = new RegExp(jsfind,"g");

    for (var i = 0; i < doc.artboards.length; i++) {
        var aBoard = doc.artboards[i].active;
        var oldName = doc.artboards[i].name;
        doc.artboards[i].name = oldName.replace(jsfindREGEX, jsreplace);
    }
}
**///

//#target illustrator
//第二版，弹出一个窗口来修改
//可以在输入框中输入正则表达式

var doc = app.activeDocument;

var dialog = new Window("dialog", "Find and Replace");
dialog.alignChildren = "left";

var findGroup = dialog.add("group");
findGroup.add("statictext", undefined, "Find:");
var findInput = findGroup.add("edittext", undefined, "");

var replaceGroup = dialog.add("group");
replaceGroup.add("statictext", undefined, "Replace:");
var replaceInput = replaceGroup.add("edittext", undefined, "");

var buttonGroup = dialog.add("group");
var cancelButton = buttonGroup.add("button", undefined, "Cancel");
var okButton = buttonGroup.add("button", undefined, "OK");

cancelButton.onClick = function() {
    dialog.close();
};

okButton.onClick = function() {
    var jsfind = findInput.text;
    var jsreplace = replaceInput.text;
    var jsfindREGEX = new RegExp(jsfind, "g");

    for (var i = 0; i < doc.artboards.length; i++) {
        var oldName = doc.artboards[i].name;
        doc.artboards[i].name = oldName.replace(jsfindREGEX, jsreplace);
    }

    dialog.close();
};

dialog.show();