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
//var newDocPre = new DocumentPreset();
//newDocPre.units = RulerUnits.Millimeters; // set the ruler units to mm
if (nSel > 0) {
var doc = app.activeDocument;
app.defaultStroked = true;
app.defaultFilled = true;
var selected = doc.selection;
var firstSelection= doc.selection[0];
var rCircle = new UnitValue (2, "mm").as("pt");
var dCircle = rCircle * 2;

var myBounds = firstSelection.geometricBounds;
var myPosition = firstSelection.position;

var xZZ = myBounds[0] - rCircle;
var yZZ = myBounds[1] + rCircle ;

var xZw = myBounds[2] - rCircle;
var yZh = myBounds[3] + rCircle ;
 
var eYuan = doc.activeLayer.pathItems.ellipse(yZZ, xZZ, dCircle, dCircle, false, true );
var eYuan1 = doc.activeLayer.pathItems.ellipse(yZZ, xZw, dCircle, dCircle, false, true );
var eYuan2 = doc.activeLayer.pathItems.ellipse(yZh, xZZ, dCircle, dCircle, false, true );
var eYuan3 = doc.activeLayer.pathItems.ellipse(yZh, xZw, dCircle, dCircle, false, true );

newCMYKColor = new CMYKColor();
newCMYKColor.black = 100;
newCMYKColor.cyan = 0;
newCMYKColor.magenta = 0;
newCMYKColor.yellow = 0;
// Use the color object in the path item
eYuan.filled = true;
eYuan.fillColor = newCMYKColor;
eYuan.stroked = false; 

eYuan1.filled = true;
eYuan1.fillColor = newCMYKColor;
eYuan1.stroked = false; 

eYuan2.filled = true;
eYuan2.fillColor = newCMYKColor;
eYuan2.stroked = false; 

eYuan3.filled = true;
eYuan3.fillColor = newCMYKColor;
eYuan3.stroked = false; 

//新建群组
var group = activeDocument.groupItems.add();
//加点到群组
eYuan.moveToEnd(group); 
eYuan1.moveToEnd(group); 
eYuan2.moveToEnd(group); 
eYuan3.moveToEnd(group); 

} else {
    alert("请选中对象做圆点MARK标记");
}
