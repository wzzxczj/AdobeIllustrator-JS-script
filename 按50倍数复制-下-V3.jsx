var doc = app.activeDocument;
var selectedItems = doc.selection;
var sell = selectedItems.length;
var firstSelection = doc.selection[0];
//判断是否选中 是否群组
if (sell > 0) {
    var totalheight = firstSelection.height;

    if (sell > 1) {
        //大于1个要群组
        // 记录每个物件原本所在的图层
        var originalLayers = [];
        for (var i = 0; i < selectedItems.length; i++) {
            originalLayers.push(selectedItems[i].layer);
        }

        //新建群组
        app.executeMenuCommand("group");
        var selectedGroupItems = doc.selection;
        var firstSelected = doc.selection[0];
        totalheight = firstSelected.height;
        app.executeMenuCommand("ungroup");
        //app.undo();
        //app.redraw();

        // 将物件移回原来的图层
        for (var i = selectedItems.length - 1; i >= 0; i--) {
            selectedItems[i].moveToBeginning(originalLayers[i]);
        }
        redraw();
    }

    //给长度加个10
    totalheight += new UnitValue(10, "mm").as("pt");
    //转单位为MM
    displayheight = new UnitValue(totalheight, "pt").as("mm");
    //按50的比例取整
    displayheight = Math.ceil(displayheight / 50) * 50;
    //做个窗口
    var dialog = new Window("dialog", "复制距离和数量");
    dialog.alignChildren = "left";
    var heightGroup = dialog.add("group");
    var heightLabel = heightGroup.add("statictext", undefined, "距离：");
    var heightValue = heightGroup.add("edittext", [0, 0, 80, 30], displayheight);
    var revCheck = heightGroup.add('checkbox', undefined, '反向')
    var numGroup = dialog.add("group");
    var numLabel = numGroup.add("statictext", undefined, "数量：");
    var numValue = numGroup.add("edittext", [0, 0, 80, 30], "1");
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
        var newLongjump = new UnitValue(parseInt(heightValue.text), "mm").as("pt");
        for (var i = 0; i < numCopies; i++) {
            for (var j = 0; j < sell; j++) {
                var newSelection = selectedItems[j].duplicate();
                if (revCheck.value) {
                    newSelection.translate(0, (i + 1) * newLongjump);
                } else {
                    newSelection.translate(0, -(i + 1) * newLongjump);
                }
            }
        }

        dialog.close();
    }
    dialog.show();

} else {

    alert("没选中东西啊！");
}
