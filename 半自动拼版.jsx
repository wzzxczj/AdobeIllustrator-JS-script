﻿var selectedItems = app.activeDocument.selection;
var nSel = app.activeDocument.selection.length;
if (nSel < 1) {
    alert("未选中对象");
    //return; // 停止执行代码
    }else{

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
    var rInput = rGroup.add("edittext", undefined, rGroupRec);
        rGroup.add("statictext", undefined, "间隔:");
    var rblankInput = rGroup.add("edittext", undefined, 0);
        rInput.characters = 4;
        rblankInput.characters = 4;
    var cGroup = dialog.add("group");
        cGroup.add("statictext", undefined, "竖拼:");
    var cInput = cGroup.add("edittext", undefined, cGroupRec);
        cGroup.add("statictext", undefined, "间隔:");
    var cblankInput = cGroup.add("edittext", undefined, 0);
        cInput.characters = 4;
        cblankInput.characters = 4;

    var textGroup = dialog.add("group");
        textGroup.add("statictext", undefined, "选中了" + nSel + "个物件");

    var buttonGroup = dialog.add("group");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK");

        cancelButton.onClick = function() {
        dialog.close();
            }

        okButton.onClick = function() {
            // First, we need to get the selected object(s)
            for (var xSel = 0; xSel < selectedItems.length; xSel++) {
                var item = selectedItems[xSel];
                var cellWidth = item.width;
                var cellHeight = item.height;

                var oriX = item.left;
                var oriY = item.top;

                var rblankInputvalue = new UnitValue (parseInt(rblankInput.text), "mm").as("pt");
                var cblankInputvalue = new UnitValue (parseInt(cblankInput.text), "mm").as("pt");
                var a = parseInt(rInput.text);
                var b = parseInt(cInput.text);

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
                 
                for (var row = 0; row < a; row++) {
                    for (var col = 0; col < b; col++) {
                
                        var x = oriX + (row * (cellWidth + rblankInputvalue));
                        var y = oriY - (col * (cellHeight + cblankInputvalue));
                        
                        // We create a new copy of the selected item
                        var itemcopy = item.duplicate();
                        // We move the copy to the current cell position
                        itemcopy.position = [x, y];
                        itemcopy.moveToEnd(Group1); 

                    }
                }
            
                item.remove();
            }
            dialog.close();
        }


    dialog.show();

    }