//app.preferences.undoRedo = true;
var doc = app.activeDocument;
var selectedItems = doc.selection;
var sell = selectedItems.length;
var firstSelection = doc.selection[0];
//判断是否选中 是否群组
if (sell > 0) {

    if (selectedItems.length === 1 && selectedItems[0].typename !== "GroupItem") {
        //alert("进入判断1");
        var totalWidth = firstSelection.width;
    } else {
        //alert("进入判断2");
        var listBounds = [];  // 将初始化移到循环外
        for (var xSel = 0; xSel < selectedItems.length; xSel++) {
            var item = selectedItems[xSel];
            // 排除被锁定和隐藏的对象
            if (!item.hidden && !item.locked) {
                listBounds = getGeometricBounds(item, listBounds);
            }
        }
        
        if (listBounds.length === 0) {
            throw new Error("没有可用的有效对象！");
        }
        
        var bounds = calInitialBounds(listBounds);
        var cellWidth = bounds[1];
        var cellHeight = bounds[0];
        var totalWidth = cellWidth;
    }

    //给长度加个10
    totalWidth += new UnitValue(10, "mm").as("pt");
    //转单位为MM
    displayWidth = new UnitValue(totalWidth, "pt").as("mm");
    //按50的比例取整
    displayWidth = Math.ceil(displayWidth / 50) * 50;
    //做个窗口
    var dialog = new Window("dialog", "复制距离和数量");
    dialog.alignChildren = "left";
    var widthGroup = dialog.add("group");
    var widthLabel = widthGroup.add("statictext", undefined, "距离：");
    var widthValue = widthGroup.add("edittext", [0, 0, 80, 30], displayWidth);
    var revCheck = widthGroup.add('checkbox', undefined, '反向')
    var numGroup = dialog.add("group");
    var numLabel = numGroup.add("statictext", undefined, "数量：");
    var numValue = numGroup.add("edittext", [0, 0, 80, 30], "5");
    var tipGroup = dialog.add("group");
    //var tipText1 = tipGroup.add("statictext", undefined, "禁止用撤消来删除复制出来的物件，会导致AI崩溃。");
    var buttonGroup = dialog.add("group");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK");

    //取消
    cancelButton.onClick = function () {
        dialog.close();
    }
    //确认后运行
    okButton.onClick = function () {
        var numCopies = parseInt(numValue.text);
        var newLongjump = new UnitValue(parseInt(widthValue.text), "mm").as("pt");
        for (var i = 0; i < numCopies; i++) {
            for (var j = 0; j < sell; j++) {
                var newSelection = selectedItems[j].duplicate();
                if (revCheck.value) {
                    newSelection.translate(-(i + 1) * newLongjump, 0);
                } else {
                    newSelection.translate((i + 1) * newLongjump, 0);
                }
            }
        }

        dialog.close();
    }
    dialog.show();

} else {

    alert("没选中东西啊！");
}


// 这里是取最大值函数
function calInitialBounds(listBounds) {
    var initialBounds = listBounds[0];
    for (var i = 1; i < listBounds.length; i++) {
        if (listBounds[i]) {
            initialBounds = [
                Math.min(initialBounds[0], listBounds[i][0]),
                Math.max(initialBounds[1], listBounds[i][1]),
                Math.max(initialBounds[2], listBounds[i][2]),
                Math.min(initialBounds[3], listBounds[i][3])
            ];
        }
    }
    return [
        initialBounds[1] - initialBounds[3],  // height
        initialBounds[2] - initialBounds[0]   // width
    ];
}

//这里是列出范围函数，排除被剪切蒙版的物件
function getGeometricBounds(item, listBounds) {
    // 处理普通对象
    if (item.typename !== "GroupItem" && item.typename !== "TextFrame") {
        if (!item.clipping) {  // 排除蒙版对象
            listBounds.push(item.geometricBounds);
        }
    }
    // 处理群组对象
    else if (item.typename === "GroupItem") {
        for (var i = 0; i < item.pageItems.length; i++) {
            getGeometricBounds(item.pageItems[i], listBounds);
        }
    }
    // 处理文本框架
    else if (item.typename === "TextFrame") {
        var textPath = item.duplicate();
        textPath = textPath.createOutline();
        listBounds.push(textPath.geometricBounds);
        textPath.remove();
    }
    return listBounds;
}