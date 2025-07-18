// Illustrator的js脚本：选中文字，全填充黑色，
var selectedItems = app.activeDocument.selection;
for (var i = 0; i < selectedItems.length; i++) {
  var currentItem = selectedItems[i];
  if (currentItem.typename === "TextFrame") {
    //先填充全部为黑色
    var newBlackColor = new CMYKColor();
    newBlackColor.black = 100;
    newBlackColor.cyan = 0;
    newBlackColor.magenta = 0;
    newBlackColor.yellow = 0;
    currentItem.textRange.characterAttributes.fillColor = newBlackColor;

    //设置文字大小为8pt
    var fontSize = 8;
    currentItem.textRange.characterAttributes.size = fontSize;
    currentItem.textRange.characterAttributes.textFont = app.textFonts.getByName("AlibabaPuHuiTi-Regular");

  } else {
    //alert("这个不是文字哦")
  }
}