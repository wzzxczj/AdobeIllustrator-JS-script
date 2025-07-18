// Illustrator的JS脚本：按图层名：CIR图层所有物件为C100M0Y0K0，GLU：C100M0Y100K0，OUT：C0M100Y100K0，REG：C0M0Y0K100，UP：C100M100Y0K0，DOWN：C0M100Y0K0，不分大小写
var layers = app.activeDocument.layers;
var lineWidth = 1;

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

for (var i = 0; i < layers.length; i++) {
  var layer = layers[i];
  var layerName = layer.name.toUpperCase();
  layer.locked = false;
  layer.visible = true;

  if (layerName === "CIR") {
    var items = layer.pageItems;
    for (var j = 0; j < items.length; j++) {
      items[j].filled = false;
      items[j].stroke = true; // 修改这一行的位置
      var strokeColor = new CMYKColor();
      strokeColor.cyan = 100;
      strokeColor.magenta = 0;
      strokeColor.yellow = 0;
      strokeColor.black = 0;
      items[j].strokeColor = strokeColor;
      items[j].strokeWidth = lineWidth;
    }
  } else if (layerName === "GLU") {
    var items = layer.pageItems;
    for (var j = 0; j < items.length; j++) {
      items[j].filled = false;
      items[j].stroke = true; // 修改这一行的位置
      var strokeColor = new CMYKColor();
      strokeColor.cyan = 100;
      strokeColor.magenta = 0;
      strokeColor.yellow = 100;
      strokeColor.black = 0;
      items[j].strokeColor = strokeColor;
      items[j].strokeWidth = lineWidth;
    }
  } else if (layerName === "OUT") {
    var items = layer.pageItems;
    for (var j = 0; j < items.length; j++) {
      items[j].filled = false;
      items[j].stroke = true; // 修改这一行的位置
      var strokeColor = new CMYKColor();
      strokeColor.cyan = 0;
      strokeColor.magenta = 100;
      strokeColor.yellow = 100;
      strokeColor.black = 0;
      items[j].strokeColor = strokeColor;
      items[j].strokeWidth = lineWidth;
    }
  } else if (layerName === "REG") {
    var items = layer.pageItems;
    for (var j = 0; j < items.length; j++) {
      items[j].filled = false;
      items[j].stroke = true; // 修改这一行的位置
      var strokeColor = new CMYKColor();
      strokeColor.cyan = 0;
      strokeColor.magenta = 0;
      strokeColor.yellow = 0;
      strokeColor.black = 100;
      items[j].strokeColor = strokeColor;
      items[j].strokeWidth = lineWidth;
    }
  } else if (layerName === "UP") {
    var items = layer.pageItems;
    for (var j = 0; j < items.length; j++) {
      items[j].filled = false;
      items[j].stroke = true; // 修改这一行的位置
      var strokeColor = new CMYKColor();
      strokeColor.cyan = 100;
      strokeColor.magenta = 100;
      strokeColor.yellow = 0;
      strokeColor.black = 0;
      items[j].strokeColor = strokeColor;
      items[j].strokeWidth = lineWidth;
    }
  } else if (layerName === "DOWN") {
    var items = layer.pageItems;
    for (var j = 0; j < items.length; j++) {
      items[j].filled = false;
      items[j].stroke = true; // 修改这一行的位置
      var strokeColor = new CMYKColor();
      strokeColor.cyan = 0;
      strokeColor.magenta = 100;
      strokeColor.yellow = 0;
      strokeColor.black = 0;
      items[j].strokeColor = strokeColor;
      items[j].strokeWidth = lineWidth;
    }
  }
}