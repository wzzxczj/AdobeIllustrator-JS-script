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

//设置MARK圆点半径和直径
var rCircle = new UnitValue (2, "mm").as("pt");
var dCircle = rCircle * 2;

//读取待添加MARK点的物件坐标
var myBounds = firstSelection.geometricBounds;
var myPosition = firstSelection.position;

//设置MARK点坐标
var xMARKz = myBounds[0] - rCircle;
var yMARKs = myBounds[1] + rCircle ;
var xMARKy = myBounds[2] - rCircle;
var yMARKx = myBounds[3] + rCircle ;

 //画4个MARK点
var eYuan = doc.activeLayer.pathItems.ellipse(yMARKs, xMARKz, dCircle, dCircle, false, true );
var eYuan1 = doc.activeLayer.pathItems.ellipse(yMARKs, xMARKy, dCircle, dCircle, false, true );
var eYuan2 = doc.activeLayer.pathItems.ellipse(yMARKx, xMARKz, dCircle, dCircle, false, true );
var eYuan3 = doc.activeLayer.pathItems.ellipse(yMARKx, xMARKy, dCircle, dCircle, false, true );

//设置MARK点为单色填充无描边
newCMYKColor = new CMYKColor();
newCMYKColor.black = 100;
newCMYKColor.cyan = 0;
newCMYKColor.magenta = 0;
newCMYKColor.yellow = 0;
// 1
eYuan.filled = true;
eYuan.fillColor = newCMYKColor;
eYuan.stroked = false; 
//2
eYuan1.filled = true;
eYuan1.fillColor = newCMYKColor;
eYuan1.stroked = false; 
//3
eYuan2.filled = true;
eYuan2.fillColor = newCMYKColor;
eYuan2.stroked = false; 
//4
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
 
//设置十字圆直径 和 大半径
var dRegYuan = new UnitValue (2.5, "mm").as("pt"); 
var lRegXian = new UnitValue (1.5, "mm").as("pt"); 
var HalfMM = new UnitValue (0.5, "mm").as("pt"); 

//设置第一个十字圆坐标
var xRegz = myBounds[0] ; 
var yRegs = myBounds[1] - lRegXian; 
var leftRegX = myBounds[0]+ dRegYuan*2; 
var topRegY = myBounds[1] - HalfMM; 
var xRegCrossLeft = myBounds[0] + dRegYuan+rCircle; 
var yRegCrossRight = xRegCrossLeft +  lRegXian*2; 
var xRegCrossTop  = xRegCrossLeft + lRegXian; 

//先画十字圆
var regYuan = doc.activeLayer.pathItems.ellipse(topRegY, leftRegX, rCircle, rCircle, false, true);
var line = doc.pathItems.add();
line.stroked = true;
//line.StrokeCap.BUTTENDCAP;
line.setEntirePath( Array( Array( xRegCrossLeft , yRegs), Array(yRegCrossRight, yRegs) ) );
var line1 = doc.pathItems.add();
line1.stroked = true;
//line1.StrokeCap.BUTTENDCAP;
line1.setEntirePath( Array( Array( xRegCrossTop , myBounds[1] ), Array(xRegCrossTop, myBounds[1]- lRegXian*2 ) ) );

//新建群组
var group1 = activeDocument.groupItems.add();
//加到群组
regYuan.moveToEnd(group1); 
line.moveToEnd(group1); 
line1.moveToEnd(group1); 

//复制
var group2 = group1.translate(myBounds[2]-myBounds[0]-(dRegYuan+rCircle+ lRegXian)*2,0); 
var group3 = group1.translate(0,myBounds[3]-myBounds[1]+lRegXian*2); 
var group4 = group2.translate(0,myBounds[3]-myBounds[1]+lRegXian*2); 
 //再群组 
var group5 = activeDocument.groupItems.add();
group1.moveToEnd(group5); 
group2.moveToEnd(group5); 
group3.moveToEnd(group5); 
group4.moveToEnd(group5); 

} else {
    alert("请选中对象做圆点MARK标记");
}
