// 创建窗口
var dialog = new Window("dialog", "正则表达式查找替换");
dialog.orientation = "column";
dialog.alignChildren = ["left", "top"];

// 查找输入框
var findGroup = dialog.add("group");
findGroup.add("statictext", undefined, "查找:");
var findInput = findGroup.add("edittext", [0, 0, 300, 25], "");

// 替换输入框
var replaceGroup = dialog.add("group");
replaceGroup.add("statictext", undefined, "替换:");
var replaceInput = replaceGroup.add("edittext", [0, 0, 300, 25], "");

// 预览框
var previewGroup = dialog.add("group");
previewGroup.add("statictext", undefined, "预览:");
var previewText = previewGroup.add("edittext", [0, 0, 300, 50], "");
previewText.enabled = false; // 预览框不可编辑

// 按钮组
var buttonGroup = dialog.add("group");
var prevButton = buttonGroup.add("button", undefined, "上一个");
var nextButton = buttonGroup.add("button", undefined, "下一个");
var findButton = buttonGroup.add("button", undefined, "查找");
var replaceFindButton = buttonGroup.add("button", undefined, "替换并查找");
var replaceAllButton = buttonGroup.add("button", undefined, "替换全部");
var cancelButton = buttonGroup.add("button", undefined, "取消");

// 全局变量
var selectedItems = [];
var currentIndex = 0;
var regex = null;

// 初始化
function initialize() {
    selectedItems = app.activeDocument.selection;
    if (selectedItems.length === 0) {
        alert("未选中任何文本对象");
        dialog.close();
        return;
    }
    currentIndex = 0;
    updatePreview();
}

// 更新预览框
function updatePreview() {
    if (currentIndex < 0 || currentIndex >= selectedItems.length) return;
    var item = selectedItems[currentIndex];
    if (item.typename === "TextFrame") {
        var textContent = item.contents;
        if (regex) {
            var newText = textContent.replace(regex, replaceInput.text);
            previewText.text = newText;
        } else {
            previewText.text = textContent;
        }
    }
}

// 查找下一个
function findNext() {
    if (!regex) return;
    for (var i = currentIndex + 1; i < selectedItems.length; i++) {
        var item = selectedItems[i];
        if (item.typename === "TextFrame" && regex.test(item.contents)) {
            currentIndex = i;
            updatePreview();
            return;
        }
    }
    alert("未找到匹配项");
}

// 查找上一个
function findPrev() {
    if (!regex) return;
    for (var i = currentIndex - 1; i >= 0; i--) {
        var item = selectedItems[i];
        if (item.typename === "TextFrame" && regex.test(item.contents)) {
            currentIndex = i;
            updatePreview();
            return;
        }
    }
    alert("未找到匹配项");
}

// 替换并查找下一个
function replaceAndFind() {
    if (!regex || currentIndex < 0 || currentIndex >= selectedItems.length) return;
    var item = selectedItems[currentIndex];
    if (item.typename === "TextFrame") {
        item.contents = item.contents.replace(regex, replaceInput.text);
        findNext();
    }
}

// 替换全部
function replaceAll() {
    if (!regex) return;
    for (var i = 0; i < selectedItems.length; i++) {
        var item = selectedItems[i];
        if (item.typename === "TextFrame") {
            item.contents = item.contents.replace(regex, replaceInput.text);
        }
    }
    alert("替换完成");
}

// 按钮事件
prevButton.onClick = function () {
    findPrev();
};

nextButton.onClick = function () {
    findNext();
};

findButton.onClick = function () {
    var findPattern = findInput.text;
    if (findPattern === "") {
        alert("查找内容不能为空");
        return;
    }
    regex = new RegExp(findPattern, "g");
    findNext();
};

replaceFindButton.onClick = function () {
    replaceAndFind();
};

replaceAllButton.onClick = function () {
    var findPattern = findInput.text;
    if (findPattern === "") {
        alert("查找内容不能为空");
        return;
    }
    regex = new RegExp(findPattern, "g");
    replaceAll();
};

cancelButton.onClick = function () {
    dialog.close();
};

// 初始化
initialize();

// 显示窗口
dialog.show();