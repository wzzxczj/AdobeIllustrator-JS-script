if (app.selection.length === 0) {
    alert("没选中挂孔点");
} else {
    // 获取当前文件名
    var fileName = app.activeDocument.name;

    // 创建窗口
    var win = new Window("dialog", "输入文字和选项");
    win.orientation = "column";

    // 添加输入框
    var inputGroup = win.add("group");
    inputGroup.add("statictext", undefined, "刀板名:");
    var inputField = inputGroup.add("edittext", undefined, fileName); // 默认显示文件名
    inputField.size = [300, 25];

    // 添加单选框
    var radioGroup = win.add("group");
    radioGroup.orientation = "column"; // 设置为垂直排列
    //radioGroup.alignment = "left";
    var radio1 = radioGroup.add("radiobutton", undefined, "薄板矮刀，红圈做5mm孔镂空");
    var radio2 = radioGroup.add("radiobutton", undefined, "2.0厚板，红圈做4mm孔镂空");
    var radio3 = radioGroup.add("radiobutton", undefined, "薄板矮刀");
    var radio4 = radioGroup.add("radiobutton", undefined, "厚板");
    radio1.value = true; // 默认选中第一个
    radio1.alignment = "left";
    radio2.alignment = "left";
    radio3.alignment = "left";
    radio4.alignment = "left";

    // 添加确认和取消按钮
    var buttonGroup = win.add("group");
    var okButton = buttonGroup.add("button", undefined, "确认");
    var cancelButton = buttonGroup.add("button", undefined, "取消");

    cancelButton.onClick = function () {
        win.close();
    }

    // 显示窗口并处理用户输入
    okButton.onClick = function () {

        var firstLineText = inputField.text;
        var secondLineText;
        if (radio1.value) {
            secondLineText = radio1.text;
        } else if (radio2.value) {
            secondLineText = radio2.text;
        } else if (radio3.value) {
            secondLineText = radio3.text;
        } else if (radio4.value) {
            secondLineText = radio4.text;
        }

        // 获取选中物件的视觉边界
        var bounds = app.selection[0].visibleBounds;

        //设置颜色
        newCMYKColor = new CMYKColor();
        newCMYKColor.black = 0;
        newCMYKColor.cyan = 0;
        newCMYKColor.magenta = 100;
        newCMYKColor.yellow = 100;

        // 在第一行文字的位置（距离物件下方100pt）
        var firstLinePosition = [bounds[0] + (bounds[2] - bounds[0]) / 2, bounds[3] - 30];

        // 创建第一行文字
        var firstLine = app.activeDocument.activeLayer.textFrames.add();
        firstLine.contents = firstLineText;
        firstLine.position = firstLinePosition;

        // 设置第一行文字的样式
        firstLine.textRange.characterAttributes.fillColor = newCMYKColor;
        firstLine.textRange.characterAttributes.textFont = app.textFonts.getByName("SIMSUN");
        firstLine.textRange.characterAttributes.size = 24;
        firstLine.textRange.characterAttributes.horizontalScale = 100;
        firstLine.textRange.characterAttributes.verticalScale = 100;
        firstLine.textRange.paragraphAttributes.justification = Justification.CENTER;

        // 在第二行文字的位置（距离第一行文字下方35pt）
        var secondLinePosition = [bounds[0] + (bounds[2] - bounds[0]) / 2, firstLinePosition[1] - 34];

        // 创建第二行文字
        var secondLine = app.activeDocument.activeLayer.textFrames.add();
        secondLine.contents = secondLineText;
        secondLine.position = secondLinePosition;

        //设置第二行为文字样式
        secondLine.textRange.characterAttributes.textFont = app.textFonts.getByName("SIMSUN");
        secondLine.textRange.characterAttributes.size = 24;
        secondLine.textRange.characterAttributes.horizontalScale = 100;
        secondLine.textRange.characterAttributes.verticalScale = 100;
        secondLine.textRange.paragraphAttributes.justification = Justification.CENTER;

        win.close();
    }

    win.show();
}