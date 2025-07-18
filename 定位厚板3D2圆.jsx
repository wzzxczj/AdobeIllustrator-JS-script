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
    var dCircle = new UnitValue(3.2, "mm").as("pt");

    var newCMYKColor = new CMYKColor();
    newCMYKColor.black = 0;
    newCMYKColor.cyan = 0;
    newCMYKColor.magenta = 100;
    newCMYKColor.yellow = 100;

    // Prompt for user input
    var delOri = confirm("是否删除原图？");
    var newLayer = confirm("是否在新图层上创建？");

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
    alert("请选中对象以生成标准椭圆");
}
