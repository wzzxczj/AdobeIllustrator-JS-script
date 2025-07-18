//测试是否读取到色值
var doc = app.activeDocument;
var selectedItems = doc.selection;
//生成文字
//var text = doc.textFrames.add();
var textGroup = app.activeDocument.groupItems.add();
var sColors = app.activeDocument.swatches;
var s = sColors.length;

for (var i = 2; i < s; i++) {
    // 获取专色名字
    var itemColorName = sColors[i].name;
    // 在文本框前绘制矩形
    var rect = doc.pathItems.rectangle(-i * 12 - 1, 0, 32, 10); // 矩形位置和尺寸

    // 尝试从色板中获取颜色
    var swatch = doc.swatches.getByName(itemColorName);
    if (swatch) {
        rect.fillColor = swatch.color; // 设置矩形颜色为色板中的颜色
    } else {
        alert("未找到色板: " + itemColorName);
        rect.fillColor = doc.swatches["[None]"].color; // 设置为无色
    }

    rect.stroked = false; // 不绘制边框

    var textColorname = doc.textFrames.add();
    // 写入文字内容
    textColorname.contents = itemColorName;
    // 字号
    textColorname.textRange.characterAttributes.size = 12;
    // 上下
    textColorname.top = -i * 12;
    // 左右
    textColorname.left = 35;
    // 设置字体
    textColorname.textRange.characterAttributes.textFont = app.textFonts.getByName("AlibabaPuHuiTi-Regular");
    // 群组
    textColorname.moveToEnd(textGroup);
}
