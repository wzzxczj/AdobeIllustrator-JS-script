// Illustrator的js脚本：选中文字，全填充黑色，到第一个/线前的中文字填充C100 M0 Y0 K0
var selectedItems = app.activeDocument.selection;
for (var i = 0; i < selectedItems.length; i++) {
  var currentItem = selectedItems[i];

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


  //设置一下颜色 c100m0y0k0
  var newCMYKColor = new CMYKColor();
  newCMYKColor.black = 0;
  newCMYKColor.cyan = 100;
  newCMYKColor.magenta = 0;
  newCMYKColor.yellow = 0;

  if (currentItem.typename === "TextFrame") {
    var textRange = currentItem.textRange;
    var text = textRange.contents;
    //确定一下第一个/字符位置
    var endIndex = text.indexOf("/");
    var subText = text.substring(0, endIndex);
    textRange.textSelection = subText;

    /*
    if (endIndex > 1 && !isNaN(parseInt(textRange.characters[0])) && /[\u4e00-\u9fa5]/.test(textRange.characters[1])) {
      for (var j = 0; j < endIndex; j++) {
        var currentCharacter = textRange.characters[j];
        if (currentCharacter.contents.match(/[^0-9]/)) {
          currentCharacter.fillColor = newCMYKColor;
        }
      }
    }**/

    //找出文字并设置颜色 ，数字不变色
    for (var j = 0; j < endIndex; j++) {
      var currentCharacter = textRange.characters[j];
      if (currentCharacter.contents.match(/[^0-9]/)) {
        currentCharacter.fillColor = newCMYKColor;
      }
    }
  }
}