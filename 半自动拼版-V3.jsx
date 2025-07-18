//////////////////////////////////////////////////////////////
//半自动拼版
//主要功能为按输入的数量拼版，默认按画板大小计算，间距为零
//V3增加偶数物件旋转功能
//尺寸不包括描边，下一版增加描边尺寸
//////////////////////////////////////////////////////////////
var selectedItems = app.activeDocument.selection;
var nSel = app.activeDocument.selection.length;
var maxWidth = 0;
var maxHeight = 0;
var listBounds = [];

if (nSel < 1) {
    alert("未选中对象");
    //return; // 停止执行代码
} else {

    var widthPage = app.activeDocument.width;
    var heightPage = app.activeDocument.height;
    var rGroupRec = Math.floor(widthPage / selectedItems[0].width);
    var cGroupRec = Math.floor(heightPage / selectedItems[0].height);
    if (rGroupRec < 1) {
        rGroupRec = 1;
    }
    if (cGroupRec < 1) {
        cGroupRec = 1;
    }

    var dialog = new Window("dialog", "半自动拼版");
    dialog.alignChildren = "left";

    var rGroup = dialog.add("group");
    rGroup.add("statictext", undefined, "横拼:");
    var rInput = rGroup.add("edittext", [0, 0, 80, 30], rGroupRec);
    rGroup.add("statictext", undefined, "间隔:");
    var rblankInput = rGroup.add("edittext", [0, 0, 80, 30], 0);
    var rowGetRoa = rGroup.add('checkbox', undefined, '偶数物件旋转180');
    var rowRevCopy = rGroup.add('checkbox', undefined, '反向');

    var cGroup = dialog.add("group");
    cGroup.add("statictext", undefined, "竖拼:");
    var cInput = cGroup.add("edittext", [0, 0, 80, 30], cGroupRec);
    cGroup.add("statictext", undefined, "间隔:");
    var cblankInput = cGroup.add("edittext", [0, 0, 80, 30], 0);
    var colGetRoa = cGroup.add('checkbox', undefined, '偶数物件旋转180');
    var colRevCopy = cGroup.add('checkbox', undefined, '反向');

    var groupCheckbox = dialog.add('group');
    groupCheckbox.orientation = 'row';
    var toGroupCheckbox = groupCheckbox.add('checkbox', undefined, '群组');

    var textGroup = dialog.add("group");
    textGroup.add("statictext", undefined, "选中了" + nSel + "个物件");

    var buttonGroup = dialog.add("group");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK");

    cancelButton.onClick = function () {
        dialog.close();
    }

    okButton.onClick = function () {
        // First, we need to get the selected object(s)
        var colRevCopyValue = colRevCopy.value;
        var rowRevCopyValue = rowRevCopy.value;
        var groupChek = toGroupCheckbox.value;
        var rowGetRoaValue = rowGetRoa.value;
        var colGetRoaValue = colGetRoa.value;
        var rblankInputvalue = new UnitValue(parseFloat(rblankInput.text), "mm").as("pt");
        var cblankInputvalue = new UnitValue(parseFloat(cblankInput.text), "mm").as("pt");
        var a = parseInt(rInput.text);
        var b = parseInt(cInput.text);

        if (selectedItems.length === 1 && selectedItems[0].pageItems.length === 1) {
            //var Group0 = app.activeDocument.activeLayer.groupItems.add();//启用活动的图层来群组
            //selectedItems.move(Group0, ElementPlacement.PLACEATEND);
            var item = selectedItems[0];
            var cellWidth = item.width;
            var cellHeight = item.height;
            var oriX = item.geometricBounds[0];
            var oriY = item.geometricBounds[1];
            var x = 0;
            var y = 0;

            //alert("数组有：" + "/" + cellWidth + "/" + cellHeight + "/" + oriX + "/" + oriY);

            placeItem(cellWidth, cellHeight, oriX, oriY, x, y, rblankInputvalue, cblankInputvalue, a, b, groupChek, item, colRevCopyValue, rowRevCopyValue, rowGetRoaValue, colGetRoaValue);
        } else {
            for (var xSel = 0; xSel < selectedItems.length; xSel++) {
                var item = selectedItems[xSel];
                //alert("有：" + item.typename + item.clipped + item.pageItems.length);
                listBounds = [];
                listBounds = getGeometricBounds(item, listBounds);
                //alert("数组有：" + listBounds.length);
                var bounds = calInitialBounds(listBounds);
                var cellWidth = bounds[1];
                var cellHeight = bounds[0];

                var oriX = item.geometricBounds[0];
                var oriY = item.geometricBounds[1];
                var x = 0;
                var y = 0;

                placeItem(cellWidth, cellHeight, oriX, oriY, x, y, rblankInputvalue, cblankInputvalue, a, b, groupChek, item, colRevCopyValue, rowRevCopyValue, rowGetRoaValue, colGetRoaValue);
            }
        }
        dialog.close();

    }
    dialog.show();
}

// 这里是取最大值函数
function calInitialBounds(listBounds) {
    //数组为空时退出
    if (listBounds.length !== 0) {
        //找出最大范围
        var initialBounds = listBounds[0];
        for (var i = 1; i < listBounds.length; i++) {
            initialBounds = [
                Math.min(initialBounds[0], listBounds[i][0]),
                Math.max(initialBounds[1], listBounds[i][1]),
                Math.max(initialBounds[2], listBounds[i][2]),
                Math.min(initialBounds[3], listBounds[i][3])
            ];
        }
        maxWidth = initialBounds[2] - initialBounds[0];
        maxHeight = initialBounds[1] - initialBounds[3];
        return [maxHeight, maxWidth];
    }
}

//这里是列出范围函数，排除被剪切蒙版的物件
function getGeometricBounds(itemGroup, listBounds) {
    //当选中物件仅一个时，直出数据
    //alert("有：" + itemGroup.typename + itemGroup.clipped + itemGroup.pageItems.length);
    if (itemGroup.pageItems.length === 1) {
        listBounds.push(itemGroup.pathItems[0].geometricBounds);
    } else if (itemGroup.typename === "GroupItem" && itemGroup.clipped) {
        //if (itemGroup.clipped) {
        listBounds.push(itemGroup.pathItems[0].geometricBounds);
    } else {
        for (var a = 0; a < itemGroup.pageItems.length; a++) {
            var item = itemGroup.pageItems[a];
            if (item.typename !== "GroupItem") {
                // 如果子元素不是群组，直接处理其范围值
                //if (!item.clipped) {
                if (item.typename === "TextFrame") {
                    var textPath = item.duplicate();
                    textPath = textPath.createOutline();
                    listBounds.push(textPath.geometricBounds);
                    textPath.remove();
                } else {
                    listBounds.push(item.geometricBounds);
                }
                //}
            } else {
                // 如果子元素是群组，继续处理
                if (item.clipped) {
                    // 如果是剪切组，只列出第一个物件的范围值
                    listBounds.push(item.pathItems[0].geometricBounds);
                } else {
                    // 如果是多物件群组，继续递归遍历
                    getGeometricBounds(item, listBounds);
                }
            }
        }
    }
    //alert("查了" + a + "个物件")
    return listBounds;
}

//拼版函数
function placeItem(cellWidth, cellHeight, oriX, oriY, x, y, rblankInputvalue, cblankInputvalue, a, b, groupChek, item, colRevCopyValue, rowRevCopyValue, rowGetRoaValue, colGetRoaValue) {

    if (groupChek) {
        var Group1 = app.activeDocument.activeLayer.groupItems.add();//启用活动的图层来群组
    }
    //拼版
    for (var row = 0; row < a; row++) {
        for (var col = 0; col < b; col++) {
            // We create a new copy of the selected item
            var itemcopy = item.duplicate();
            //设置X，Y值
            if (colRevCopyValue) {//当勾上反向时，y值为向上加
                y = oriY + (col * (cellHeight + cblankInputvalue));
            } else {//当未勾上时，y值为向下减
                y = oriY - (col * (cellHeight + cblankInputvalue));
            }
            if (rowRevCopyValue) {//当勾上反向时，X值为向左减
                x = oriX - (row * (cellWidth + rblankInputvalue));
            } else {//当未勾上反向时，X值为向右加
                x = oriX + (row * (cellWidth + rblankInputvalue));
            }
            // We move the copy to the current cell position
            itemcopy.position = [x, y];
            //当群组复选框勾上时启动群组功能
            if (groupChek) {
                itemcopy.moveToEnd(Group1);
            }
            //当旋转功能启用时,偶数列物件旋转180度
            if (rowGetRoaValue && row % 2 !== 0) {
                itemcopy.rotate(180);
            }
            //当旋转功能启用时,偶数行物件旋转180度
            if (colGetRoaValue && col % 2 !== 0) {
                itemcopy.rotate(180);
            }
        }
    }
    item.remove();
}
