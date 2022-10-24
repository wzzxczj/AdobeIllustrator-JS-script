#target illustrator  
var nSel = app.selection.length;  
if (nSel > 0) {  
    doWindow();  
} else {  
    alert("选择对象以创建参考线标记");  
}  

function doWindow()  
{  
      
    // Create the window  
       var win = new Window("dialog", "创建参考线,Chlo汉化。印前数据插件脚本群143789703", [150, 150, 666,550]); // bounds = [left, top, right, bottom]  
  // Add a panel  
    win.edgesPanel = win.add("panel", [25, 20, 290, 100], "方位");  
     win.one4allPanel = win.add("panel", [25, 120, 290, 180], "类别");  
    win.visgeoPanel = win.add("panel", [25, 200, 290, 260], "边界");   
    win.offsetPanel = win.add("panel", [25, 280, 290, 355], "位移");  


    win.edgesPanel.chkTop = win.edgesPanel.add("checkbox", [16, 10, 80, 30], "上");  
    win.edgesPanel.chkBottom = win.edgesPanel.add("checkbox", [62, 10, 180, 30], "下");  
    win.edgesPanel.chkLeft = win.edgesPanel.add("checkbox", [149, 10, 220, 30], "左");  
    win.edgesPanel.chkRight = win.edgesPanel.add("checkbox", [206, 10, 280, 30], "右");  
    win.edgesPanel.chkCntrHor = win.edgesPanel.add("checkbox", [16, 40, 120, 60], "纵向中心");  
    win.edgesPanel.chkCntrVert = win.edgesPanel.add("checkbox", [149, 40, 300, 60], "横向中心");  
    win.edgesPanel.chkTop.value = true;  
    win.edgesPanel.chkBottom.value = true;  
    win.edgesPanel.chkLeft.value = true;  
    win.edgesPanel.chkRight.value = true;  
    win.edgesPanel.chkCntrHor.value = true;  
    win.edgesPanel.chkCntrVert.value = true;  

    // Add radio buttons  
    win.one4allPanel.each = win.one4allPanel.add("radiobutton", [16, 10, 150, 34], "逐个对象");  
    win.one4allPanel.all = win.one4allPanel.add("radiobutton", [149, 10, 280, 34], "视为整体");  
    // Select the first radio button  
    win.one4allPanel.each.value = true;  
      
    // Add radio buttons  
    win.visgeoPanel.vis = win.visgeoPanel.add("radiobutton", [16, 10, 150, 34], "视觉边界");  
    win.visgeoPanel.geo = win.visgeoPanel.add("radiobutton", [149, 10, 280, 34], "轮廓边界");  
    // Select the first radio button  
    win.visgeoPanel.geo.value = true;  
      
    // Add offset fields  
    win.offsetPanel.vOffLbl = win.offsetPanel.add("statictext", [16, 10, 100, 30], " 纵向");  
    win.offsetPanel.vOff = win.offsetPanel.add("edittext", [68,8,118,28], "0");  
    win.offsetPanel.vOffLbl = win.offsetPanel.add("statictext", [125, 10, 147, 30], "mm ");  
      
    win.offsetPanel.hOffLbl = win.offsetPanel.add("statictext", [16, 40, 100, 60], " 横向");  
    win.offsetPanel.hOff = win.offsetPanel.add("edittext", [68,38,118,58], "0");  
    win.offsetPanel.hOffLbl = win.offsetPanel.add("statictext", [125, 40,147 ,60], "mm ");  
    win.cancelBtn = win.add("button", [120,370, 198, 390], "取消");  
    win.quitBtn = win.add("button", [213,370,291,390], "确定");  
    win.defaultElement = win.quitBtn;  
    win.cancelElement = win.cancelBtn;  
    // Event listener for the quit button  
    win.quitBtn.onClick = function() {   
        var bVB = win.visgeoPanel.vis.value;  
        var bEach = win.one4allPanel.each.value;  
        var xOff = win.offsetPanel.hOff.text.replace(",", ".");  
        var yOff = win.offsetPanel.vOff.text.replace(",", ".");  
        if (yOff.search("pt") > 0) {  
            yOff = yOff.replace("pt", "");  
            yOff = yOff  * 1;  
        } else {  
            yOff = yOff  * 72 / 25.4;  
        }  
        if (xOff.search("pt") > 0) {  
            xOff = xOff.replace("pt", "");  
            xOff = xOff  * 1;  
        } else {  
            xOff = xOff  *  72 / 25.4;  
        }  

        var bTop = win.edgesPanel.chkTop.value;  
        var bLeft = win.edgesPanel.chkLeft.value;  
        var bRight = win.edgesPanel.chkRight.value;  
        var bBottom = win.edgesPanel.chkBottom.value;  
        var bVC = win.edgesPanel.chkCntrVert.value;  
        var bHC = win.edgesPanel.chkCntrHor.value;  

        win.close();   
          
        doGuides(bTop, bLeft, bBottom, bRight, bVC, bHC, bVB, bEach, xOff, yOff);  
    }  
    win.center();  //让面板居中屏幕  
    win.show();  
}  

function doGuides(bTop, bLeft, bBottom, bRight, bVC, bHC, bVB, bEach, xOff, yOff) {  
    if (bEach == true) {  
        for (var n = 0; n < nSel; n++) {  
            if (bVB) {  
                var myBounds = app.selection[n].visibleBounds;  
                drawGuides(bTop, bLeft, bBottom, bRight, bVC, bHC, myBounds, xOff, yOff);  
            } else {  
                var myBounds = app.selection[n].geometricBounds;  
                drawGuides(bTop, bLeft, bBottom, bRight, bVC, bHC, myBounds, xOff, yOff);  
            }  
        }  
    } else {  
        if (bVB) {  
            var myBounds = app.selection[0].visibleBounds;  
            for (var n = 1; n < nSel; n++) {  
                var tVB = app.selection[n].visibleBounds;  
                if (tVB[0] < myBounds[0]) {myBounds[0] = tVB[0];}  
                if (tVB[1] > myBounds[1]) {myBounds[1] = tVB[1];}  
                if (tVB[2] > myBounds[2]) {myBounds[2] = tVB[2];}  
                if (tVB[3] < myBounds[3]) {myBounds[3] = tVB[3];}  
            }  
        } else {  
            var myBounds = app.selection[0].geometricBounds;  
            for (var n = 1; n < nSel; n++) {  
                var tVB = app.selection[n].geometricBounds;  
                if (tVB[0] < myBounds[0]) {myBounds[0] = tVB[0];}  
                if (tVB[1] > myBounds[1]) {myBounds[1] = tVB[1];}  
                if (tVB[2] > myBounds[2]) {myBounds[2] = tVB[2];}  
                if (tVB[3] < myBounds[3]) {myBounds[3] = tVB[3];}  
            }  
        }  
        drawGuides(bTop, bLeft, bBottom, bRight, bVC, bHC, myBounds, xOff, yOff);  
    }  
}  

function drawGuides(bTop, bLeft, bBottom, bRight, bVC, bHC, myBounds, xOff, yOff) {  
    if (bTop) {  
        drawGuide(false, myBounds[1]+yOff);  
    }  
    if (bLeft) {  
        drawGuide(true, myBounds[0]-xOff);  
    }  
    if (bBottom) {  
        drawGuide(false, myBounds[3]-yOff);  
    }  
    if (bRight) {  
        drawGuide(true, myBounds[2]+xOff);  
    }  
    if (bVC) {  
        var half = (myBounds[1]-myBounds[3])/2;  
        drawGuide(false, half+myBounds[3]);  
    }  
    if (bHC) {  
        drawGuide(true, ((myBounds[2]-myBounds[0])/2) + myBounds[0]);  
    }  
}  

function drawGuide(bVert, pos) {  
    var aDoc = app.activeDocument;  
    var aPath = aDoc.pathItems.add();  
    aPoint = aPath.pathPoints.add();  
    with (aPoint) {  
        if (bVert) {  
            anchor = leftDirection = rightDirection = [pos,-5000];  
        } else {  
            anchor = leftDirection = rightDirection = [-5000,pos];  
        }  
        pointTyoe = PointType.CORNER;  
    }  
    aPoint = aPath.pathPoints.add();  
    with (aPoint) {  
        if (bVert) {  
            anchor = leftDirection = rightDirection = [pos,5000];  
        } else {  
            anchor = leftDirection = rightDirection = [5000,pos];  
        }  
        pointTyoe = PointType.CORNER;  
    }  
    aPath.guides = true;  

} 