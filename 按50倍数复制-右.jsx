var doc = app.activeDocument;  
var selectedItems = doc.selection;
var sell = selectedItems.length;
var firstSelection = doc.selection[0];
//判断是否选中 是否群组
if(sell > 0) {
    var totalWidth = firstSelection.width;//  65.2MM   184  PT
    //alert(totalWidth);
    if (sell > 1) {
        //大于1个要群组
        //新建群组
        var group0 = doc.activeLayer.groupItems.add();
        for (var i = 0; i < sell; i++) {
            selectedItems[i].moveToBeginning(group0); 
        }
        group0.selected = true;
        //拿到群组后的宽度
        totalWidth = group0.width;
        //alert(totalWidth);
        // 解散群组
        app.executeMenuCommand("ungroup");
        //group0.ungroup();
        // 更新选中物件
        selectedItems = doc.selection;
        firstSelection = doc.selection[0];
    }
   
    //给长度加个25
    totalWidth += new UnitValue (25, "mm").as("pt");
    //转单位为MM
    displayWidth = new UnitValue (totalWidth,"pt").as("mm");
    //alert(displayWidth);    //  90.2
    //按50的比例取整
    displayWidth = Math.ceil(displayWidth/50)*50;
    //alert(displayWidth);  // 100
    //做个窗口
    var dialog = new Window("dialog", "复制距离和数量");
    var widthGroup = dialog.add("group");
    var widthLabel = widthGroup.add("statictext", undefined, "距离：");
    var widthValue = widthGroup.add("edittext", [0,0,80,30], displayWidth);
    var numGroup = dialog.add("group");
    var numLabel = numGroup.add("statictext", undefined, "数量：");
    var numValue = numGroup.add("edittext", [0,0,80,30], "5");
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
        var newLongjump = new UnitValue (parseInt(widthValue.text),"mm").as("pt");
        for (var i = 0; i < numCopies; i++) {
            for (var j = 0; j< sell; j++){
                var newSelection = selectedItems[j].duplicate();
                newSelection.translate((i + 1) * newLongjump, 0);
            }
        }
        
        dialog.close();
    }
    dialog.show();

} else {

    alert("没选中东西啊！");
}
