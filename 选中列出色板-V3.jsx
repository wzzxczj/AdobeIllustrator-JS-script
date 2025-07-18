//测试是否读取到色值
var doc = app.activeDocument;
var selectedItems = doc.selection;
var lenthSelect = selectedItems.length;
var sColors = app.activeDocument.swatches;//读取色板
var s = sColors.length;

for (var i = 0; i < lenthSelect; i++) {
    var textTop = selectedItems[i].top;
    var textLeft = selectedItems[i].left;

    var itemColorName;
    var fillColor = selectedItems[i].fillColor;

    if (fillColor.typename = "SpotColor") {
        itemColorName = fillColor.spot.name;
    } else if (fillColor.typename === "NoColor") {
        itemColorName = "无填充"; // 设置默认值
    } else if (fillColor.typename === "GradientColor" || fillColor.typename === "PatternColor") {
        itemColorName = "渐变或图案"; // 或者设置为其他默认值
    } else {
        itemColorName = fillColor.name; // 获取颜色名称
    }

    if (!itemColorName) {
        alert("填充颜色名称无效或未定义");
        continue; // 跳过当前循环
    }

    var textGroup = app.activeDocument.activeLayer.groupItems.add();//创建群组

    var textColorname = doc.textFrames.add();//生成文字
    textColorname.contents = itemColorName;    // 写入文字内容
    textColorname.textRange.characterAttributes.size = 12;    // 字号
    textColorname.textRange.characterAttributes.textFont = app.textFonts.getByName("AlibabaPuHuiTi-Regular");    // 设置字体
    textColorname.top = textTop;    // 上下
    textColorname.left = textLeft + 35;    // 左右
    textColorname.moveToEnd(textGroup);    // 群组
}
