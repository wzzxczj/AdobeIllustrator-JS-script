//////////////////////////////////////////////////////////////
//半自动拼版
//V4.0新增间隔调整 排版更改
//V3增加偶数物件旋转功能
//主要功能为按输入的数量拼版，默认按画板大小计算，间距为零
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
    var item = selectedItems[0];
    listBounds = [];
    listBounds = getGeometricBounds(item, listBounds);

    var bounds = calInitialBounds(listBounds);
    var cellWidth = bounds[1];
    var cellHeight = bounds[0];

    var xxa = new UnitValue(parseFloat(cellWidth), "pt").as("mm");
    var xxb = new UnitValue(parseFloat(cellWidth), "pt").as("mm");
    //alert("数组有：" + "/" + xxa + "/" + xxb );

    var widthPage = app.activeDocument.width;
    var heightPage = app.activeDocument.height;
    var rGroupRec = Math.floor(widthPage / cellWidth);
    var cGroupRec = Math.floor(heightPage / cellHeight);

    if (rGroupRec < 1) {
        rGroupRec = 1;
    }
    if (cGroupRec < 1) {
        cGroupRec = 1;
    }

    var dialog = new Window("dialog", "半自动拼版V4.03");
    dialog.alignChildren = "left";

    var rGroup = dialog.add("group");
    rGroup.add("statictext", undefined, "每");
    var rBlankSet = rGroup.add("edittext", [0, 0, 50, 30], 1);
    rGroup.add("statictext", undefined, "个间隔:");
    var rblankInput = rGroup.add("edittext", [0, 0, 50, 30], 0);
    rGroup.add("statictext", undefined, "横拼:");
    var rInput = rGroup.add("edittext", [0, 0, 80, 30], rGroupRec);
    var rowGetRoa = rGroup.add('checkbox', undefined, '偶数物件旋转180');
    var rowRevCopy = rGroup.add('checkbox', undefined, '反向');

    var cGroup = dialog.add("group");
    cGroup.add("statictext", undefined, "每");
    var cBlankSet = cGroup.add("edittext", [0, 0, 50, 30], 1);
    cGroup.add("statictext", undefined, "个间隔:");
    var cblankInput = cGroup.add("edittext", [0, 0, 50, 30], 0);
    cGroup.add("statictext", undefined, "竖拼:");
    var cInput = cGroup.add("edittext", [0, 0, 80, 30], cGroupRec);
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

        var rBlankSetValue = parseInt(rBlankSet.text);
        var cBlankSetValue = parseInt(cBlankSet.text);
        var rblankInputvalue = new UnitValue(parseFloat(rblankInput.text), "mm").as("pt");
        var cblankInputvalue = new UnitValue(parseFloat(cblankInput.text), "mm").as("pt");
        var a = parseInt(rInput.text);
        var b = parseInt(cInput.text);
        rBlankSetValue = rBlankSetValue < 1 ? 1 : rBlankSetValue
        cBlankSetValue = cBlankSetValue < 1 ? 1 : cBlankSetValue

        //alert("选中物件数量: " + selectedItems.length); // 检查选中物件数量
        //alert("选中物件类型: " + selectedItems[0].typename); // 检查选中物件类型
        //alert("是否为剪切蒙版: " + selectedItems[0].clipped); // 检查是否为剪切蒙版

        // Check if selectedItems has only one element and that element has only one pageItem
        if (selectedItems.length === 1 && selectedItems[0].typename !== "GroupItem") {

            //alert("进入判断1");

            var item = selectedItems[0];
            var cellWidth = item.width;
            var cellHeight = item.height;
            var oriX = item.geometricBounds[0];
            var oriY = item.geometricBounds[1];
            var x = 0;
            var y = 0;
            placeItem(cellWidth, cellHeight, oriX, oriY, x, y, rblankInputvalue, cblankInputvalue, a, b, groupChek, item, colRevCopyValue, rowRevCopyValue, rowGetRoaValue, colGetRoaValue, rBlankSetValue, cBlankSetValue);

        } else {

            //alert("进入判断2");

            for (var xSel = 0; xSel < selectedItems.length; xSel++) {
                var item = selectedItems[xSel];
                listBounds = [];
                listBounds = getGeometricBounds(item, listBounds);
                var bounds = calInitialBounds(listBounds);
                var cellWidth = bounds[1];
                var cellHeight = bounds[0];
                var oriX = item.geometricBounds[0];
                var oriY = item.geometricBounds[1];
                var x = 0;
                var y = 0;
                placeItem(cellWidth, cellHeight, oriX, oriY, x, y, rblankInputvalue, cblankInputvalue, a, b, groupChek, item, colRevCopyValue, rowRevCopyValue, rowGetRoaValue, colGetRoaValue, rBlankSetValue, cBlankSetValue);
            }
        }
        dialog.close();

    }

    // 添加事件监听器
    rblankInput.onChange = function () {
        updateInputs();
    };

    cblankInput.onChange = function () {
        updateInputs();
    };

    function updateInputs() {
        var widthPage = app.activeDocument.width;
        var heightPage = app.activeDocument.height;

        var rblankInputvalue = new UnitValue(parseFloat(rblankInput.text), "mm").as("pt");
        var cblankInputvalue = new UnitValue(parseFloat(cblankInput.text), "mm").as("pt");

        // 重新计算 rGroupRec 和 cGroupRec
        var rGroupRec = Math.floor((widthPage + rblankInputvalue) / (selectedItems[0].width + rblankInputvalue));
        var cGroupRec = Math.floor((heightPage + cblankInputvalue) / (selectedItems[0].height + cblankInputvalue));

        // 更新 rInput 和 cInput 的值
        rInput.text = rGroupRec < 1 ? 1 : rGroupRec;
        cInput.text = cGroupRec < 1 ? 1 : cGroupRec;


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
    if (itemGroup.typename !== "GroupItem" && itemGroup.typename !== "TextFrame") {
        if (!itemGroup.clipping) { // 过滤掉被剪切蒙板的物件
            listBounds.push(itemGroup.geometricBounds);
        }
    } else if (itemGroup.typename === "GroupItem" && itemGroup.clipped) {
        listBounds.push(itemGroup.pathItems[0].geometricBounds);
    } else {
        for (var a = 0; a < itemGroup.pageItems.length; a++) {
            var item = itemGroup.pageItems[a];
            if (item.typename !== "GroupItem") {
                if (!item.clipping) { // 过滤掉被剪切蒙板的物件
                    if (item.typename === "TextFrame") {
                        var textPath = item.duplicate();
                        textPath = textPath.createOutline();
                        listBounds.push(textPath.geometricBounds);
                        textPath.remove();
                    } else {
                        listBounds.push(item.geometricBounds);
                    }
                }
            } else {
                if (item.clipped && item.pageItems.length === 1) {
                    if (!item.pageItems[0].clipping) { // 过滤掉被剪切蒙板的物件
                        listBounds.push(item.pageItems[0].geometricBounds);
                    }
                } else {
                    getGeometricBounds(item, listBounds);
                }
            }
        }
    }
    return listBounds;
}

//拼版函数
function placeItem(cellWidth, cellHeight, oriX, oriY, x, y, rblankInputvalue, cblankInputvalue, a, b, groupChek, item, colRevCopyValue, rowRevCopyValue, rowGetRoaValue, colGetRoaValue, rBlankSetValue, cBlankSetValue) {

    // 判断是否是群组
    var isGroup = item.typename === "GroupItem";
    
    if (groupChek) {
        var Group1 = app.activeDocument.activeLayer.groupItems.add();
    }
    
    //拼版
    for (var row = 0; row < a; row++) {
        for (var col = 0; col < b; col++) {
            // 复制时保持群组结构
            var itemcopy = item.duplicate();

            // 计算当前行和列应该使用多少个间隔
            var rBlankCount = Math.floor(row / rBlankSetValue);
            var cBlankCount = Math.floor(col / cBlankSetValue);

            //设置X，Y值
            if (colRevCopyValue) {//当勾上反向时，y为向上加
                y = oriY + (col * cellHeight + cBlankCount * cblankInputvalue);
            } else {//当未勾上时，y值为向下减
                y = oriY - (col * cellHeight + cBlankCount * cblankInputvalue);
            }
            if (rowRevCopyValue) {//当勾上反向时，X值为向左减
                x = oriX - (row * cellWidth + rBlankCount * rblankInputvalue);
            } else {//当未勾上反向时，X值为向右加
                x = oriX + (row * cellWidth + rBlankCount * rblankInputvalue);
            }
            // We move the copy to the current cell position
            itemcopy.position = [x, y];
            
            //当群组复选框勾上时启动群组功能
            if (groupChek) {
                if (isGroup) {
                    // 如果是群组，将整个群组移动到新群组
                    itemcopy.moveToEnd(Group1);
                } else {
                    // 如果是单个物件，直接移动
                    itemcopy.moveToEnd(Group1);
                }
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
    
    // 移除原始物件时保持群组结构
    if (isGroup) {
        // 如果是群组，移除整个群组
        item.remove();
    } else {
        // 如果是单个物件，直接移除
        item.remove();
    }
}
