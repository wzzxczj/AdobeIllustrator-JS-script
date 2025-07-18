// 获取当前文档
var doc = app.activeDocument;

// 全选
app.executeMenuCommand("selectall");

// 解散群组
app.executeMenuCommand("ungroup");
app.executeMenuCommand("ungroup");
app.executeMenuCommand("ungroup");
app.executeMenuCommand("ungroup");
app.executeMenuCommand("ungroup");
app.executeMenuCommand("ungroup");

// 转换为形状,用动作点菜单
app.doScript("CTLS", "通用动作");

// 取消选择
app.executeMenuCommand("deselectall");

// 遍历所有图层
for (var i = 0; i < doc.layers.length; i++) {
  var layer = doc.layers[i];

  // 设置描边颜色和粗细
  var strokeColor = layer.color;
  var strokeWidth = new UnitValue(0.2, "mm").as("pt"); // 单位为毫米

  // 遍历图层内的所有物件
  for (var j = 0; j < layer.pageItems.length; j++) {
    var item = layer.pageItems[j];

    // 如果是复合路径，则对其路径进行描边设置
    if (item.typename === "CompoundPathItem") {
      for (var k = 0; k < item.pathItems.length; k++) {
        var path = item.pathItems[k];
        path.filled = false;
        path.stroke = true;
        path.strokeColor = strokeColor;
        path.strokeWidth = strokeWidth;
      }
    } else {
      // 对非复合路径的物件进行描边设置
      item.filled = false;
      item.stroke = true;
      item.strokeColor = strokeColor;
      item.strokeWidth = strokeWidth;
    }
  }
}

