var doc = app.activeDocument;
var selectedItems = doc.selection;

if (selectedItems.length > 0) {
    // 获取所有可见对象的bounds
    var listBounds = [];
    for (var xSel = 0; xSel < selectedItems.length; xSel++) {
        var item = selectedItems[xSel];
        if (!item.hidden && !item.locked) {
            listBounds = getGeometricBounds(item, listBounds);
        }
    }

    // 检查是否有有效对象
    if (listBounds.length === 0) {
        throw new Error("没有可用的有效对象！");
    }

    // 计算最大高度
    var bounds = calInitialBounds(listBounds);
    var totalHeight = bounds[0];
    totalHeight += new UnitValue(10, "mm").as("pt");
    var displayheight = new UnitValue(totalHeight, "pt").as("mm");
    displayheight = Math.ceil(displayheight / 50) * 50;

    // 创建对话框
    var dialog = new Window("dialog", "复制距离和数量");
    dialog.alignChildren = "left";
    
    var heightGroup = dialog.add("group");
    heightGroup.add("statictext", undefined, "距离：");
    var heightValue = heightGroup.add("edittext", [0, 0, 80, 30], displayheight);
    var revCheck = heightGroup.add('checkbox', undefined, '反向');
    
    var numGroup = dialog.add("group");
    numGroup.add("statictext", undefined, "数量：");
    var numValue = numGroup.add("edittext", [0, 0, 80, 30], "1");
    
    var buttonGroup = dialog.add("group");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK");

    cancelButton.onClick = function () {
        dialog.close();
    }

    okButton.onClick = function () {
        var numCopies = parseInt(numValue.text);
        var newLongjump = new UnitValue(parseInt(heightValue.text), "mm").as("pt");
        
        if (isNaN(numCopies) || isNaN(newLongjump)) {
            alert("请输入有效的数字！");
            return;
        }

        try {
            for (var i = 0; i < numCopies; i++) {
                for (var j = 0; j < selectedItems.length; j++) {
                    var newSelection = selectedItems[j].duplicate();
                    if (!newSelection) {
                        throw new Error("复制失败");
                    }
                    
                    var offset = (i + 1) * newLongjump;
                    newSelection.translate(0, revCheck.value ? offset : -offset);
                }
            }
        } catch (e) {
            alert("操作失败：" + e.message);
        } finally {
            dialog.close();
        }
    }
    
    dialog.show();
} else {
    alert("没选中东西啊！");
}

// 获取几何边界
function getGeometricBounds(item, listBounds) {
    if (item.typename !== "GroupItem" && item.typename !== "TextFrame") {
        if (!item.clipping) {
            listBounds.push(item.geometricBounds);
        }
    } else if (item.typename === "GroupItem") {
        for (var i = 0; i < item.pageItems.length; i++) {
            getGeometricBounds(item.pageItems[i], listBounds);
        }
    } else if (item.typename === "TextFrame") {
        var textPath = item.duplicate();
        textPath = textPath.createOutline();
        listBounds.push(textPath.geometricBounds);
        textPath.remove();
    }
    return listBounds;
}

// 计算初始边界
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