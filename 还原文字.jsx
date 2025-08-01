// 获取当前选中的对象
var selection = app.activeDocument.selection;

// 判断是否未选中任何对象
if (selection.length === 0) {
    alert("未选中任何对象，请先选择要处理的文本。");
    exit(); // 终止脚本执行
}

// 初始化计数器
var replacedCount = 0;

// 从后往前遍历选中的对象
for (var i = selection.length - 1; i >= 0; i--) {
    var item = selection[i];

    // 检查对象是否为文字对象或群组
    if (item.typename === "TextFrame") {
        // 处理文字对象
        processTextFrame(item);
    } else if (item.typename === "GroupItem") {
        // 创建一个新群组
        var newGroup = app.activeDocument.activeLayer.groupItems.add();
        // 如果是群组，遍历群组内的所有子对象
        for (var j = item.pageItems.length - 1; j >= 0; j--) {
            var subItem = item.pageItems[j];
            if (subItem.typename === "TextFrame") {
                // 处理群组内的文字对象，并获取新创建的文字对象
                var newSubText = processTextFrame(subItem);
                // 将新文字添加到新群组中
                newSubText.moveToBeginning(newGroup);
            }
        }
    }
}


// 显示弹窗，提示替换了多少个文本
alert("成功替换了 " + replacedCount + " 个文本。");

function processTextFrame(item) {
    // 获取原始文字的属性
    var textContent = item.contents; // 文字内容
    var textFont = item.textRange.characterAttributes.textFont; // 字体
    var textSize = item.textRange.characterAttributes.size; // 字体大小
    var textColor = item.textRange.characterAttributes.fillColor; // 文字颜色
    var textStrokeColor = item.textRange.characterAttributes.strokeColor; // 描边颜色
    var textStrokeWidth = item.textRange.characterAttributes.strokeWeight; // 描边宽度
    var anchorPoint = item.position; // 锚点位置

    // 获取字符属性
    var characterAttributes = item.textRange.characterAttributes;
    var fontWeight = characterAttributes.fontStyle; // 字重（如粗体）
    var italic = characterAttributes.italic; // 斜体
    var underline = characterAttributes.underline; // 下划线
    var strikethrough = characterAttributes.strikethrough; // 删除线
    var tracking = characterAttributes.tracking; // 字距
    var baselineShift = characterAttributes.baselineShift; // 基线偏移
    var horizontalScale = characterAttributes.horizontalScale; // 横向缩放
    var verticalScale = characterAttributes.verticalScale; // 纵向缩放

    // 获取段落属性
    var paragraphAttributes = item.textRange.paragraphAttributes;
    var alignment = paragraphAttributes.justification; // 对齐方式
    var leading = paragraphAttributes.leading; // 行距
    var spaceBefore = paragraphAttributes.spaceBefore; // 段前间距
    var spaceAfter = paragraphAttributes.spaceAfter; // 段后间距
    var firstLineIndent = paragraphAttributes.firstLineIndent; // 首行缩进
    var leftIndent = paragraphAttributes.leftIndent; // 左缩进
    var rightIndent = paragraphAttributes.rightIndent; // 右缩进


    // 在原始位置重新创建未变形的文字
    var newText = app.activeDocument.activeLayer.textFrames.add();

    // 删除变形的文字对象
    item.remove();

    newText.contents = textContent; // 设置文字内容
    newText.textRange.characterAttributes.textFont = textFont; // 设置字体
    newText.textRange.characterAttributes.size = textSize; // 设置字体大小
    newText.textRange.characterAttributes.fillColor = textColor; // 设置文字颜色
    newText.textRange.characterAttributes.stroked = true; // 设置文字描边
    newText.textRange.characterAttributes.strokeColor = textStrokeColor; // 设置描边颜色
    newText.textRange.characterAttributes.strokeWeight = textStrokeWidth; // 设置描边宽度
    newText.position = anchorPoint; // 设置锚点位置

    // 重新应用字符属性
    newText.textRange.characterAttributes.fontStyle = fontWeight; // 字重
    newText.textRange.characterAttributes.italic = italic; // 斜体
    newText.textRange.characterAttributes.underline = underline; // 下划线
    newText.textRange.characterAttributes.strikethrough = strikethrough; // 删除线
    newText.textRange.characterAttributes.tracking = tracking; // 字距
    newText.textRange.characterAttributes.baselineShift = baselineShift; // 基线偏移
    newText.textRange.characterAttributes.horizontalScale = horizontalScale; // 横向缩放
    newText.textRange.characterAttributes.verticalScale = verticalScale; // 纵向缩放

    // 重新应用段落属性
    newText.textRange.paragraphAttributes.justification = alignment; // 对齐方式
    newText.textRange.paragraphAttributes.leading = leading; // 行距
    newText.textRange.paragraphAttributes.spaceBefore = spaceBefore; // 段前间距
    newText.textRange.paragraphAttributes.spaceAfter = spaceAfter; // 段后间距
    newText.textRange.paragraphAttributes.firstLineIndent = firstLineIndent; // 首行缩进
    newText.textRange.paragraphAttributes.leftIndent = leftIndent; // 左缩进
    newText.textRange.paragraphAttributes.rightIndent = rightIndent; // 右缩进

    // 增加计数器
    replacedCount++;

    // 返回新创建的文字对象
    return newText;
}
