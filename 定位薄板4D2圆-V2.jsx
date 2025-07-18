//#target illustrator
//#targetengine "main"

/////////////////////////////////////////////////////////////////
//标准椭圆
//>=--------------------------------------
//按选中的尺寸画标准椭圆
//>=--------------------------------------
//
// JS code (c) copyright: WZZXCZJ
//
//////////////////////////////////////////////////////////////////
var nSel = app.activeDocument.selection.length;
//var newDocPre = new DocumentPreset();
//newDocPre.units = RulerUnits.Millimeters; // set the ruler units to mm
if (nSel > 0) {
    var doc = app.activeDocument;
    app.defaultStroked = true;
    app.defaultFilled = true;
    var selected = doc.selection;
    var firstSelection = doc.selection[0];
    var mm2 = new UnitValue(2, "mm").as("pt");
    var myBounds = firstSelection.geometricBounds;
    var myPosition = firstSelection.position;
    var dCircle = new UnitValue(4.2, "mm").as("pt");

    var newCMYKColor = new CMYKColor();
    newCMYKColor.black = 0;
    newCMYKColor.cyan = 0;
    newCMYKColor.magenta = 100;
    newCMYKColor.yellow = 100;

    // Prompt for user input
    var dialog = new Window("dialog", "设置选项");
    dialog.orientation = "column";

    var delOriCheckbox = dialog.add("checkbox", undefined, "删除原图");
    delOriCheckbox.value = true; // 默认选中
    var newLayerCheckbox = dialog.add("checkbox", undefined, "在新图层上创建");
    newLayerCheckbox.value = false; // 默认不选中

    var buttonGroup = dialog.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.add("button", undefined, "确定");
    buttonGroup.add("button", undefined, "取消");

    dialog.show();
    
    if (dialog.show() == 1) {
        var delOri = delOriCheckbox.value;
        var newLayer = newLayerCheckbox.value;
    } else {
        return; // 用户取消操作
    }

    if (newLayer) {
        var layerName = "newpathitem";
        var layerCount = doc.layers.length;
        var couterLayer = 0;
        for (var ii = layerCount - 1; ii >= 0; ii--) {
            var targetLayer = doc.layers[ii];
            var targetlayerName = new String(targetLayer.name);
            if (targetlayerName == layerName) {
                couterLayer++;
            }
        }

        if (couterLayer == 0) {
            var layernewGen = doc.layers.add();
            layernewGen.name = layerName;
        }
        //layernewGen.active;
        doc.layers.getByName("newpathitem").active;
    }
    //新建群组
    var group = doc.activeLayer.groupItems.add();

    /**
     * if (checkGroup) {
        firstSelection.ungroup();
        nSel = app.activeDocument.selection.length;
    }
**/

    //var i = 0;
    for (var i = nSel - 1; i >= 0; i--) {
        var selItem = selected[i];
        var cirWidth = selItem.width;
        var cirHeigth = selItem.height;
        var xCircle = selItem.position[0] + cirWidth / 2 - dCircle / 2;
        var yCircle = selItem.position[1] - cirHeigth / 2 + dCircle / 2;
        var newEllipse = doc.activeLayer.pathItems.ellipse(yCircle, xCircle, dCircle, dCircle, false, true);
        newEllipse.filled = false;
        newEllipse.stroked = true;
        newEllipse.strokeColor = newCMYKColor;
        newEllipse.strokeWidth = mm2 / 10;
        newEllipse.strokeCap = selItem.strokeCap;

        if (delOri) {
            selItem.remove();
        }

        newEllipse.moveToEnd(group);

    }

} else {
    alert("请选中要改掉的挂孔点");
}