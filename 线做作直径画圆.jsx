// 获取选中的物件
var selectedItems = app.activeDocument.selection;

// 确保有选中的物件
if (selectedItems.length > 0) {
    var item = selectedItems[0];
    // 获取物件的边界框
    var bounds = item.geometricBounds;
    
    // 计算直径（取边界框对角线长度）
    var diameter = Math.sqrt(Math.pow(bounds[2] - bounds[0], 2) + Math.pow(bounds[1] - bounds[3], 2));

    // 计算圆心坐标
    var centerX = (bounds[0] + bounds[2]) / 2;
    var centerY = (bounds[1] + bounds[3]) / 2;
   
    // 创建圆形
    var circle = app.activeDocument.pathItems.ellipse(
        centerY + diameter / 2, // top
        centerX - diameter / 2, // left
        diameter, // width
        diameter, // height
        false, // reversed
        true // inscribed
    );

    // 设置圆形的样式（这里设置为无填充，青色描边）
    circle.filled = false;
    circle.stroked = true;
    circle.strokeColor = new CMYKColor();
    circle.strokeColor.cyan = 100;
    circle.strokeWidth = 1; // 设置描边宽度为1点

    // 将圆形移到选中物件的后面
    //circle.move(item, ElementPlacement.PLACEBEHIND);
}
