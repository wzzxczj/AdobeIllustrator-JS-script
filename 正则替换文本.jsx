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
var textFrames = [];
var currentIndex = 0;
var regex = null;
var matches = [];
var currentMatchIndex = -1;

// 初始化
function initialize() {
    textFrames = getAllTextFrames(app.activeDocument);
    if (textFrames.length === 0) {
        alert("文档中没有文本对象");
        dialog.close();
        return;
    }
    currentIndex = 0;
    currentMatchIndex = -1;
    updatePreview();
}

// 获取文档中所有文本对象
function getAllTextFrames(doc) {
    var frames = [];
    for (var i = 0; i < doc.pageItems.length; i++) {
        var item = doc.pageItems[i];
        if (item.typename === "TextFrame") {
            frames.push(item);
        }
    }
    return frames;
}

// 更新预览框
function updatePreview() {
    if (currentMatchIndex < 0 || currentMatchIndex >= matches.length) {
        previewText.text = "无匹配项";
        return;
    }
    var match = matches[currentMatchIndex];
    var textContent = match.textFrame.contents;
    var newText = textContent.replace(regex, replaceInput.text);
    previewText.text = newText;
}

// 查找所有匹配项
function findAllMatches() {
    matches = [];
    for (var i = 0; i < textFrames.length; i++) {
        var textFrame = textFrames[i];
        var textContent = textFrame.contents;
        var match;
        while ((match = regex.exec(textContent)) !== null) {
            matches.push({
                textFrame: textFrame,
                match: match
            });
        }
    }
    if (matches.length === 0) {
        alert("未找到匹配项");
    } else {
        currentMatchIndex = 0;
        selectCurrentMatch();
        updatePreview();
    }
}

// 选中当前匹配项
function selectCurrentMatch() {
    if (currentMatchIndex < 0 || currentMatchIndex >= matches.length) return;
    var match = matches[currentMatchIndex];
    var textFrame = match.textFrame;
    var textContent = textFrame.contents;
    var matchText = match.match[0];
    var startIndex = match.match.index;
    var endIndex = startIndex + matchText.length;

    // 选中匹配的文本
    textFrame.textRange.select(startIndex, endIndex);
}

// 查找下一个匹配项
function findNext() {
    if (matches.length === 0) return;
    currentMatchIndex = (currentMatchIndex + 1) % matches.length;
    selectCurrentMatch();
    updatePreview();
}

// 查找上一个匹配项
function findPrev() {
    if (matches.length === 0) return;
    currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
    selectCurrentMatch();
    updatePreview();
}

// 替换并查找下一个匹配项
function replaceAndFind() {
    if (matches.length === 0) return;
    var match = matches[currentMatchIndex];
    var textFrame = match.textFrame;
    var textContent = textFrame.contents;
    var newText = textContent.replace(regex, replaceInput.text);
    textFrame.contents = newText;
    findNext();
}

// 替换所有匹配项
function replaceAll() {
    if (matches.length === 0) return;
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var textFrame = match.textFrame;
        var textContent = textFrame.contents;
        var newText = textContent.replace(regex, replaceInput.text);
        textFrame.contents = newText;
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
    findAllMatches();
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
    findAllMatches();
    replaceAll();
};

cancelButton.onClick = function () {
    dialog.close();
};

// 初始化
initialize();

// 显示窗口
dialog.show();
