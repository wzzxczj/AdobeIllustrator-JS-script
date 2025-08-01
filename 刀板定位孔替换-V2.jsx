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
    var dCircleBo = new UnitValue(4.2, "mm").as("pt");
    var dCircleHo = new UnitValue(3.2, "mm").as("pt");

    // Prompt for user input
    var dialog = new Window("dialog", "设置选项");
    dialog.orientation = "column";

    var delOriCheckbox = dialog.add("checkbox", undefined, "删除原图");
    delOriCheckbox.value = true; // 默认选中
    var newLayerCheckbox = dialog.add("checkbox", undefined, "在新图层上创建");
    newLayerCheckbox.value = false; // 默认不选中
    var replaceinGroupCheckbox = dialog.add("checkbox", undefined, "替换群组内物件");
    replaceinGroupCheckbox.value = true;// 默认不选中
    var banhouCheckbox = dialog.add("checkbox", undefined, "薄板4.2孔，取消勾选为厚板3.2孔");
    banhouCheckbox.value = true;// 默认不选中

    delOriCheckbox.alignment = "left";
    newLayerCheckbox.alignment = "left";
    replaceinGroupCheckbox.alignment = "left";
    banhouCheckbox.alignment = "left";

    var buttonGroup = dialog.add("group");
    buttonGroup.orientation = "row";
    var okButton = buttonGroup.add("button", undefined, "确定");
    var cancelButton = buttonGroup.add("button", undefined, "取消");


    okButton.onClick = function () {

        var delOri = delOriCheckbox.value;
        var newLayer = newLayerCheckbox.value;
        var replaceinGroup = replaceinGroupCheckbox.value;
        var banhou = banhouCheckbox.value;

        var dCircle;
        if (banhou) {//薄板圆直径4.2，厚板直径3.2
            dCircle = dCircleBo;
        } else {
            dCircle = dCircleHo;
        }

        //图层功能
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

            doc.layers.getByName("newpathitem").active;
            // 确保图层是当前活动图层
            doc.layers.getByName("newpathitem").visible = true;
            doc.layers.getByName("newpathitem").locked = false;
            doc.activeLayer = doc.layers.getByName("newpathitem");
        }
        //新建群组
        var group = doc.activeLayer.groupItems.add();
        //替换功能
        for (var i = nSel - 1; i >= 0; i--) {
            var selItem = selected[i];
            //替换群组内功能需要加在这里，进入另一个循环
            if (replaceinGroup && selItem.typename === "GroupItem") {

                for (var j = selItem.pathItems.length - 1; j >= 0; j--) {
                    var selgroupItem = selItem.pathItems[j];
                    var cirWidth = selgroupItem.width;
                    var cirHeigth = selgroupItem.height;
                    var xCircle = selgroupItem.position[0] + cirWidth / 2 - dCircle / 2;
                    var yCircle = selgroupItem.position[1] - cirHeigth / 2 + dCircle / 2;
                    var newEllipse = drawEllipse(yCircle, xCircle, dCircle, dCircle)
                    newEllipse.moveToEnd(group);

                    if (delOri) {
                        selgroupItem.remove();
                    }
                }

            } else {
                var cirWidth = selItem.width;
                var cirHeigth = selItem.height;
                var xCircle = selItem.position[0] + cirWidth / 2 - dCircle / 2;
                var yCircle = selItem.position[1] - cirHeigth / 2 + dCircle / 2;
                var newEllipse = drawEllipse(yCircle, xCircle, dCircle, dCircle);
                /** 
                var newEllipse = doc.activeLayer.pathItems.ellipse(yCircle, xCircle, dCircle, dCircle, false, true);
                newEllipse.filled = false;
                newEllipse.stroked = true;
                newEllipse.strokeColor = newCMYKColor;
                newEllipse.strokeWidth = mm2 / 10;
                newEllipse.strokeCap = selItem.strokeCap;
                */

                //var group = doc.activeLayer.groupItems.add();
                newEllipse.moveToEnd(group);

                if (delOri) {
                    if (!replaceinGroup || selItem.typename !== "GroupItem") {
                        selItem.remove();
                    }
                }
            }
        }
        dialog.close();
    }
    dialog.show();


    cancelButton.onClick = function () {
        dialog.close();
    }

} else {
    alert("请选中要改掉的挂孔点");
}



// 这里是取最大值函数
function drawEllipse(yCircle, xCircle, dCircle, dCircle) {
    var mm2 = new UnitValue(2, "mm").as("pt");
    var newCMYKColor = new CMYKColor();
    newCMYKColor.black = 0;
    newCMYKColor.cyan = 0;
    newCMYKColor.magenta = 100;
    newCMYKColor.yellow = 100;

    var newEllipse = doc.activeLayer.pathItems.ellipse(yCircle, xCircle, dCircle, dCircle, false, true);
    newEllipse.filled = false;
    newEllipse.stroked = true;
    newEllipse.strokeColor = newCMYKColor;
    newEllipse.strokeWidth = mm2 / 10;
    //newEllipse.strokeCap = selItem.strokeCap;

    return newEllipse;
}