var doc = app.activeDocument;  
var selectedItems = doc.selection;
var sell = selectedItems.length;
var firstSelection = doc.selection[0];
//判断是否选中 是否群组
if(sell > 0) {
    var totalheight = firstSelection.height;
   
    if (sell > 1) {
        //大于1个要群组
        //新建群组
        
        //AA
        /*
        var group0 = doc.activeLayer.groupItems.add();
        //把每个物件加到群组里
        for (var i = 0; i < sell; i++) {
            selectedItems[i].moveToBeginning(group0); 
        }
        //选中群组后的
        group0.selected = true;
        //拿到群组后的宽度
        totalheight = group0.height;
        // 解散群组
        app.executeMenuCommand("ungroup");
        **/
        //AA/

        //BB
        //改用Illustrator里的群组菜单，方便回退原图层
        
        app.executeMenuCommand("group");
        selectedItems = doc.selection;
        firstSelection = doc.selection[0];
        totalheight = firstSelection.height;
        //app.executeMenuCommand("undo");
        app.undo();
        //BB/
        // 更新选中物件
        selectedItems = doc.selection;
        firstSelection = doc.selection[0];
    }
   
    //给长度加个10
    totalheight += new UnitValue (10, "mm").as("pt");
    //转单位为MM
    displayheight = new UnitValue (totalheight,"pt").as("mm");
    //按50的比例取整
    displayheight = Math.ceil(displayheight/50)*50;
    //做个窗口
    var dialog = new Window("dialog", "复制距离和数量");
    var heightGroup = dialog.add("group");
    var heightLabel = heightGroup.add("statictext", undefined, "距离：");
    var heightValue = heightGroup.add("edittext", [0,0,80,30], displayheight);
    var numGroup = dialog.add("group");
    var numLabel = numGroup.add("statictext", undefined, "数量：");
    var numValue = numGroup.add("edittext", [0,0,80,30], "1");
    var tipGroup = dialog.add("group");
    var tipText1 = tipGroup.add("statictext",undefined,"禁止用撤消来删除复制出来的物件，会导致AI崩溃。");
    var buttonGroup = dialog.add("group");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK");

    //取消
    cancelButton.onClick = function() {
        dialog.close();
    }
    //确认后运行
    okButton.onClick = function() {
        var numCopies = parseInt(numValue.text);
        var newLongjump = new UnitValue (parseInt(heightValue.text),"mm").as("pt");
        for (var i = 0; i < numCopies; i++) {
            for (var j = 0; j< sell; j++){
                var newSelection = selectedItems[j].duplicate();
                newSelection.translate(0, -(i + 1) * newLongjump);
            }
        }
        
        dialog.close();
    }
    dialog.show();

} else {

    alert("没选中东西啊！");
}
