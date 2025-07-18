//#target illustrator
//#targetengine "main"

/////////////////////////////////////////////////////////////////
//4角画圆点
//>=--------------------------------------
//在当前选中的物件四角点放置4个大圆点
//>=--------------------------------------
//
// JS code (c) copyright: WZZXCZJ
//
//////////////////////////////////////////////////////////////////
var nSel = app.activeDocument.selection.length;

if (nSel > 0) {
    var confirmMessage = "你确定要给选中的" + nSel + "个物件加上定位点吗？";
    var confirmed = confirm(confirmMessage);

    if (confirmed) {
        var doc = app.activeDocument;
        app.defaultStroked = false;
        app.defaultFilled = true;
        var selected = doc.selection;
        for (var xSel = 0; xSel < selected.length; xSel++) {

            var firstSelection = doc.selection[xSel];
            var rCircle = new UnitValue(1, "mm").as("pt");
            var lInside = new UnitValue(30, "mm").as("pt");
            var minLength = new UnitValue(130, "mm").as("pt");
            var dCircle = rCircle * 2;

            var myBounds = firstSelection.geometricBounds;
            var myPosition = firstSelection.position;

            var xL0 = myBounds[0] - dCircle;
            var xL1 = myBounds[0] - dCircle + lInside;
            var xL2 = myBounds[2] - lInside;
            var xL3 = myBounds[2];
            var yT0 = myBounds[1] + dCircle;
            var yT1 = myBounds[1] + dCircle - lInside;
            var yT2 = myBounds[3] + lInside;
            var yT3 = myBounds[3];

            if (myBounds[2] - myBounds[0] < minLength) {
                xL1 = xL2 = (myBounds[2] + myBounds[0]) / 2 - rCircle;
            }
            if (myBounds[1] - myBounds[3] < minLength) {
                yT1 = yT2 = (myBounds[3] + myBounds[1]) / 2 + rCircle;
            }

            var eYuan0 = doc.activeLayer.pathItems.ellipse(yT0, xL1, dCircle, dCircle, false, true);
            var eYuan1 = doc.activeLayer.pathItems.ellipse(yT0, xL2, dCircle, dCircle, false, true);
            var eYuan2 = doc.activeLayer.pathItems.ellipse(yT1, xL3, dCircle, dCircle, false, true);
            var eYuan3 = doc.activeLayer.pathItems.ellipse(yT2, xL3, dCircle, dCircle, false, true);
            var eYuan4 = doc.activeLayer.pathItems.ellipse(yT3, xL2, dCircle, dCircle, false, true);
            var eYuan5 = doc.activeLayer.pathItems.ellipse(yT3, xL1, dCircle, dCircle, false, true);
            var eYuan6 = doc.activeLayer.pathItems.ellipse(yT2, xL0, dCircle, dCircle, false, true);
            var eYuan7 = doc.activeLayer.pathItems.ellipse(yT1, xL0, dCircle, dCircle, false, true);

            newCMYKColor = new CMYKColor();
            newCMYKColor.black = 0;
            newCMYKColor.cyan = 100;
            newCMYKColor.magenta = 0;
            newCMYKColor.yellow = 0;
            // Use the color object in the path item
            eYuan0.filled = true;
            eYuan0.fillColor = newCMYKColor;
            eYuan0.stroked = false;

            eYuan1.filled = true;
            eYuan1.fillColor = newCMYKColor;
            eYuan1.stroked = false;

            eYuan2.filled = true;
            eYuan2.fillColor = newCMYKColor;
            eYuan2.stroked = false;

            eYuan3.filled = true;
            eYuan3.fillColor = newCMYKColor;
            eYuan3.stroked = false;

            eYuan4.filled = true;
            eYuan4.fillColor = newCMYKColor;
            eYuan4.stroked = false;

            eYuan5.filled = true;
            eYuan5.fillColor = newCMYKColor;
            eYuan5.stroked = false;

            eYuan6.filled = true;
            eYuan6.fillColor = newCMYKColor;
            eYuan6.stroked = false;

            eYuan7.filled = true;
            eYuan7.fillColor = newCMYKColor;
            eYuan7.stroked = false;

            //新建群组
            var group = doc.activeLayer.groupItems.add();
            //加点到群组
            eYuan0.moveToEnd(group);
            eYuan1.moveToEnd(group);
            eYuan2.moveToEnd(group);
            eYuan3.moveToEnd(group);
            eYuan4.moveToEnd(group);
            eYuan5.moveToEnd(group);
            eYuan6.moveToEnd(group);
            eYuan7.moveToEnd(group);

            if (myBounds[2] - myBounds[0] < minLength) {
                eYuan1.remove();
                eYuan5.remove();
            }
            if (myBounds[1] - myBounds[3] < minLength) {
                eYuan3.remove();
                eYuan7.remove();
            }

        }

    } else {
        // 用户取消操作，停止脚本
        //return;
    }
} else {
    alert("请选中对象做圆点");
}