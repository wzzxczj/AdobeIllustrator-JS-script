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
var a = 0;

//创建一个窗口
var dialog = new Window("dialog", "Find and Replace");
dialog.alignChildren = "right";
//dialog.alignChildren = "left";
//查找框
var findGroup = dialog.add("group");
findGroup.add("statictext", undefined, "Find:");
var findInput = findGroup.add("edittext", [0, 0, 110, 25], "");
//findInput.characters = 54;
//替换框
var replaceGroup = dialog.add("group");
replaceGroup.add("statictext", undefined, "Replace:");
var replaceInput = replaceGroup.add("edittext", [0, 0, 110, 25], "");
//replaceInput.characters = 52;
//按钮组
var buttonGroup = dialog.add("group");
var cancelButton = buttonGroup.add("button", undefined, "Cancel");
var okButton = buttonGroup.add("button", undefined, "OK");

//取消按钮功能
cancelButton.onClick = function () {
    dialog.close();
};

//确认按钮功能
okButton.onClick = function () {
    var jsfind = findInput.text;
    var jsreplace = replaceInput.text;
    var jsfindREGEX = new RegExp(jsfind, "g");
    var nameArr = [];
    for (var i = 0; i < doc.artboards.length; i++) {
        var oldName = doc.artboards[i].name;
        nameArr.push(oldName);
        doc.artboards[i].name = oldName.replace(jsfindREGEX, jsreplace);
    }
    var a =0;   
    for (var j = 0; j < doc.artboards.length; j++) {
        if (!nameArr.includes(doc.artboards[j].name)) {
            a++;
        }
    }
    alert("修改了" + a + "个画板名字");
    
    dialog.close();
};

dialog.show();
