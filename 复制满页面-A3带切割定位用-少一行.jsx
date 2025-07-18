var nSel = app.activeDocument.selection.length;
var tSel =  app.activeDocument.selection[0];
//var newDocPre = new DocumentPreset();
//newDocPre.units = RulerUnits.Millimeters; // set the ruler units to mm
if (nSel > 0) {

    var widthPage = app.activeDocument.width;
    var heightPage = app.activeDocument.height;
    var rGroupRec = Math.floor(widthPage / tSel.width);
    var cGroutRec = Math.floor(heightPage / tSel.height) - 1;
    var blankInputvalue = new UnitValue (0, "mm").as("pt");
    var selectedItems = app.activeDocument.selection;
        for (var xSel = 0; xSel < selectedItems.length; xSel++) {
            var item = selectedItems[xSel];
        
            var layerName = "拼版";
            var targetLayer = null;
            
            // 检查图层是否存在
            for (var i = 0; i < app.activeDocument.layers.length; i++) {
                if (app.activeDocument.layers[i].name === layerName) {
                    targetLayer = app.activeDocument.layers[i];
                    break;
                }
            }
            
            // 如果图层不存在，则创建它
            if (targetLayer === null) {
                targetLayer = app.activeDocument.layers.add();
                targetLayer.name = layerName;
                targetLayer.zOrder(ZOrderMethod.BRINGTOFRONT);
            } else {
                targetLayer.zOrder(ZOrderMethod.BRINGTOFRONT);
            }
            targetLayer.locked.false;
            targetLayer.visible.true;
            
            var Group1 = app.activeDocument.groupItems.add();

            // We calculate the size of each cell in the matrix
            var cellWidth = item.width;
            var cellHeight = item.height;
            
            var a = rGroupRec;
            var b = cGroutRec;
                    
            var oriX = item.left;
            var oriY = item.top;
            
            for (var row = 0; row < a; row++) {
                for (var col = 0; col < b; col++) {
            
                    var x = oriX + row * (cellWidth + blankInputvalue);
                    var y = oriY - col * (cellHeight + blankInputvalue);
                    
                    // We create a new copy of the selected item
                    //var itemcopy = item.duplicate(Group1, ElementPlacement.PLACEBEFORE);
                    var itemcopy = item.duplicate();
                    // We move the copy to the current cell position
                    itemcopy.position = [x, y];
                    itemcopy.moveToEnd(Group1); 
                    /** 
                    var itemcopy = item.duplicate();
                    itemcopy.position = [x, y];
                    Group1.pageItems.add(itemcopy);
                    */
                }
            }
           
            item.remove();
        }
       
    
} else {
    alert("未选中对象");
}