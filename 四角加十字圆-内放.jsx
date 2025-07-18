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
    var firstSelection = doc.selection[0];

    //设置MARK圆点半径和直径
    var rCircle = new UnitValue(2, "mm").as("pt");
    var dCircle = rCircle * 2;

    //读取待添加MARK点的物件坐标
    var myBounds = firstSelection.geometricBounds;
    var myPosition = firstSelection.position;

    //设置十字圆直径 和 大半径
    var dRegYuan = new UnitValue(2.5, "mm").as("pt");
    var lRegXian = new UnitValue(1.5, "mm").as("pt");
    var HalfMM = new UnitValue(0.5, "mm").as("pt");

    //设置颜色
    newCMYKColor = new CMYKColor();
    newCMYKColor.black = 100;
    newCMYKColor.cyan = 0;
    newCMYKColor.magenta = 0;
    newCMYKColor.yellow = 0;


    //设置第一个十字圆坐标
    var xRegz = myBounds[0];
    var yRegs = myBounds[1] - lRegXian;
    var leftRegX = myBounds[0] + dRegYuan * 2;
    var topRegY = myBounds[1] - HalfMM;
    var xRegCrossLeft = myBounds[0] + dRegYuan + rCircle;
    var yRegCrossRight = xRegCrossLeft + lRegXian * 2;
    var xRegCrossTop = xRegCrossLeft + lRegXian;

    //先画十字圆
    ///圆
    var regYuan = doc.activeLayer.pathItems.ellipse(topRegY, leftRegX, rCircle, rCircle, false, true);
    regYuan.stroked = true;
    regYuan.filled = false;
    regYuan.strokeWidth = rCircle * 0.1;
    regYuan.strokeColor = newCMYKColor;

    //竖线
    var line = doc.activeLayer.pathItems.add();
    line.stroked = true;
    line.filled = false;
    line.strokeWidth = rCircle * 0.1;
    //line.StrokeCap.BUTTENDCAP;
    line.setEntirePath(Array(Array(xRegCrossLeft, yRegs), Array(yRegCrossRight, yRegs)));
    line.strokeColor = newCMYKColor;

    //横线
    var line1 = doc.activeLayer.pathItems.add();
    line1.stroked = true;
    line1.filled = false;
    line1.strokeWidth = rCircle * 0.1;
    //line1.StrokeCap.BUTTENDCAP;
    line1.setEntirePath(Array(Array(xRegCrossTop, myBounds[1]), Array(xRegCrossTop, myBounds[1] - lRegXian * 2)));
    line1.strokeColor = newCMYKColor;

    //新建群组
    var group1 = doc.activeLayer.groupItems.add();
    //加到群组
    regYuan.moveToEnd(group1);
    line.moveToEnd(group1);
    line1.moveToEnd(group1);

    //复制
    var group2 = group1.duplicate();
    group2.translate(myBounds[2] - myBounds[0] - (dRegYuan + rCircle + lRegXian) * 2, 0);
    var group3 = group1.duplicate();
    group3.translate(0, myBounds[3] - myBounds[1] + lRegXian * 2);
    var group4 = group2.duplicate();
    group4.translate(0, myBounds[3] - myBounds[1] + lRegXian * 2);

    //再群组 
    var group5 = doc.activeLayer.groupItems.add();
    group1.moveToEnd(group5);
    group2.moveToEnd(group5);
    group3.moveToEnd(group5);
    group4.moveToEnd(group5);


} else {
    //警告
    alert("请选中对象以做套准标记");
}
