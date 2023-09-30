// Select the object
var nSel = app.activeDocument.selection.length;
//判断是否有选中
if (nSel > 0) {
//脚本内容
var doc = app.activeDocument;
var sel = doc.selection[0];
//var text = doc.textFrames.add();
var text = doc.activeLayer.textFrames.add();

text.contents = "晒250目/印正";
//字号
text.textRange.characterAttributes.size = 12;
//上下
text.top = sel.top + 8/0.3528; 
//左右
text.left = sel.left + (sel.width - text.width)/2;
//设置字体
text.textRange.characterAttributes.textFont = app.textFonts.getByName("AlibabaPuHuiTi-Regular");


} else {
//未选中警告
    alert("未选择图形");
}
