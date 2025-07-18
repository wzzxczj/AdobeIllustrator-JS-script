//#target illustrator
//#targetengine "main"

/////////////////////////////////////////////////////////////////
//角线短边做马克点
//>=--------------------------------------
//在选中的物件角线短边外放置2个小圆马克点
//>=--------------------------------------
//
// JS code (c) copyright: WZZXCZJ
//
//////////////////////////////////////////////////////////////////
var nSel = app.activeDocument.selection.length;

if (nSel > 0) {
    var confirmMessage = "你确定要给选中的" + nSel + "个物件加上马克点吗？";
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
            var movLength = new UnitValue(75, "mm").as("pt");
            var dCircle = rCircle * 2;

            var myBounds = firstSelection.geometricBounds;
            var myPosition = firstSelection.position;
            var xWidth = firstSelection.width;
            var xHeith = firstSelection.height;

            var xL0 = myBounds[0] - dCircle;
            var yT0 = myBounds[1] + dCircle;
            var eYuan0 = doc.activeLayer.pathItems.ellipse(yT0, xL0, dCircle, dCircle, false, true);
            var eYuan1 = eYuan0.duplicate(eYuan0.parent, ElementPlacement.PLACEATBEGINNING);

            if (xWidth < xHeith) {
                eYuan1.translate(movLength, -xHeith - dCircle);
                eYuan0.translate(movLength, 0);
            } else {
                eYuan1.translate(xWidth + dCircle, -movLength);
                eYuan0.translate(0, -movLength);

            }



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

            //新建群组
            var group = doc.activeLayer.groupItems.add();
            //加点到群组
            eYuan0.moveToEnd(group);
            eYuan1.moveToEnd(group);

        }
    } else {
        // 用户取消操作，停止脚本
        //return;
    }
} else {
    alert("请选中对象做马克点");
}