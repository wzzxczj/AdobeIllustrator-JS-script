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
    var firstSelection= doc.selection[0];
    var mm2 = new UnitValue (2, "mm").as("pt");
    var myBounds = firstSelection.geometricBounds;
    var myPosition = firstSelection.position;
    
    newCMYKColor = new CMYKColor();
    newCMYKColor.black = 100;
    newCMYKColor.cyan = 0;
    newCMYKColor.magenta = 0;
    newCMYKColor.yellow = 0;
    
    // Prompt for user input
    var delOri = confirm("是否删除原图？");
    var newLayer = confirm("是否在新图层上创建？");
    
    if(newLayer){
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

    var i = 0;
    for (i= 0 ; i < nSel; i++){
        var selItem = selected[i];
        var cirWidth = selItem.width;
        var cirHeigth = selItem.height;
        var xCircle = selItem.position[0];
        var yCircle = selItem.position[1];
        var newEllipse = doc.activeLayer.pathItems.ellipse(yCircle, xCircle, cirWidth, cirHeigth,false, true);
        newEllipse.filled = true;
        newEllipse.fillColor = selItem.fillColor;
        newEllipse.stroked = true;
        newEllipse.strokeColor = selItem.strokeColor;
        newEllipse.strokeWidth = selItem.strokeWidth;
        newEllipse.strokeCap = selItem.strokeCap;

        if(delOri){
            selItem.remove();
        } 
    }

} else {
    alert("请选中对象以生成标准椭圆");
}
