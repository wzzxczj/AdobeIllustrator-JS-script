
//#target illustrator
//#targetengine "main"

/////////////////////////////////////////////////////////////////
//选中物件上下加十字圆
//>=--------------------------------------
//在当前选中的物件上下角点放置4个十字圆，圆直径2mm 十字线长3mm
//>=--------------------------------------
//
// JS code (c) copyright: WZZXCZJ
//
//////////////////////////////////////////////////////////////////
//var newDocPre = new DocumentPreset();
//newDocPre.units = RulerUnits.Millimeters; // set the ruler units to mm
var doc = app.activeDocument;  
var selected = doc.selection;
var nSel = app.activeDocument.selection.length;
var firstSelection= doc.selection[0];

//弹窗输入出血
var mChuxue = parseFloat(prompt("请输入出血大小，单位为mm", "1.5"));
var mChuxueValue = new UnitValue (mChuxue,"mm").as("pt");

//判断是否选中 是否群组
if(nSel > 0) {
    if (nSel > 1) {
    //大于1个要群组
    //新建群组
    var group0 = activeDocument.activeLayer.groupItems.add();
    for (var i = 0; i < nSel; i++) {
        selected[i].moveToBeginning(group0); 
    }
group0.selected = true;
firstSelection = doc.selection[0];
    }
//设置MARK圆点半径和直径
var rCircle = new UnitValue (2, "mm").as("pt");
var dCircle = rCircle * 2;

//设置十字圆直径 和 大半径
var dRegYuan = new UnitValue (2.5, "mm").as("pt"); 
var lRegXian = new UnitValue (1.5, "mm").as("pt"); 
var HalfMM = new UnitValue (0.5, "mm").as("pt"); 

//读取待添加MARK点的物件坐标
//var myBounds = selected.geometricBounds;
//var myPosition = selected.position;
var myBounds = firstSelection.geometricBounds;
var myPosition = firstSelection.position;

//设置一个十字圆坐标
var xRegz = myBounds[0] ; //左边贴选中物件左边，给十字线用
var yRegs = myBounds[1] + lRegXian; //顶部到选中物件顶部加1.5mm，给十字线用
var leftRegX = myBounds[0]+ HalfMM; //左边到选中物件加0.5mm，给圆用
var topRegY = myBounds[1] + dRegYuan; //顶部到选中物件加2.5mm，给圆用
var xRegCrossLeft = myBounds[0]; //左边到选中物件左边，给十字线横线用
var yRegCrossRight = xRegCrossLeft +  lRegXian*2; //右边到选中物件左边加3mm，给十字线横线用
var xRegCrossTop  = xRegCrossLeft + lRegXian; //左边到选中物件左边加1.5mm，给十字线竖线用

//设置颜色为C0M0Y0K100
newCMYKColor = new CMYKColor();
newCMYKColor.black = 100;
newCMYKColor.cyan = 0;
newCMYKColor.magenta = 0;
newCMYKColor.yellow = 0;

     pg1();

} else {

    alert("请选中对象做套准十字圆");
}


function pg1(){
    //先画十字圆
    ///圆
    var regYuan = doc.activeLayer.pathItems.ellipse(topRegY, leftRegX, rCircle, rCircle, false, true);
    regYuan.stroked = true;
    regYuan.strokcolor = newCMYKColor;
    regYuan.filled = false;
    regYuan.strokeWidth = rCircle*0.1;

    //横线
    var line = doc.pathItems.add();
    line.stroked = true;
    line.strokcolor = newCMYKColor;
    line.filled = false;
    line.strokeWidth = rCircle*0.1;
    line.setEntirePath( Array( Array( xRegCrossLeft , yRegs), Array(yRegCrossRight, yRegs) ) );

    //竖线
    var line1 = doc.pathItems.add();
    line1.stroked = true;
    line1.strokcolor = newCMYKColor;
    line1.filled = false;
    line1.strokeWidth = rCircle*0.1;
    line1.setEntirePath( Array( Array( xRegCrossTop , myBounds[1] + lRegXian * 2 ), Array(xRegCrossTop, myBounds[1] ) ) );

    //新建群组
    var group1 = activeDocument.activeLayer.groupItems.add();
    //加到群组
    regYuan.moveToEnd(group1); 
    line.moveToEnd(group1); 
    line1.moveToEnd(group1); 

    //复制
    var group2 = group1.duplicate();
    group2.translate(myBounds[2] - myBounds[0] - lRegXian * 2, 0); //从第一个十字圆向右移，距离为选中物件宽再减3mm
    var group3 = group1.duplicate(); 
    group3.translate(0, myBounds[3] - myBounds[1] - lRegXian * 2);  //从第一个十字圆向下移，距离为选中物件宽再加3mm
    var group4 = group2.duplicate(); 
    group4.translate(0, myBounds[3] - myBounds[1] - lRegXian * 2);  //从第二个十字圆向下移，距离为选中物件宽再加3mm

    //按前面输入的大小移动
    group1.translate(0, mChuxueValue);
    group2.translate(0, mChuxueValue);
    group3.translate(0, -mChuxueValue);
    group4.translate(0, -mChuxueValue);
    //再群组 
    var group5 = activeDocument.activeLayer.groupItems.add();
    group1.moveToEnd(group5); 
    group2.moveToEnd(group5); 
    group3.moveToEnd(group5); 
    group4.moveToEnd(group5); 

}