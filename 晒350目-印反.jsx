var doc = app.activeDocument;
// Select the object
var nSel = app.activeDocument.selection.length;
//判断是否有选中
if (nSel > 0) {
    //脚本内容
    //多选循环 给每个加上
    for (var a = 0; a < nSel; a++) {
        //按编号选择
        var sel = doc.selection[a];
        //新建一个文本
        var text = doc.activeLayer.textFrames.add();
        //文本
        text.contents = "晒350目/印反";
        //字号
        text.textRange.characterAttributes.size = 12;
        //上下
        text.top = sel.top + 8 / 0.3528;
        //左右
        text.left = sel.left + (sel.width - text.width) / 2;
        //设置字体
        text.textRange.characterAttributes.textFont = app.textFonts.getByName("AlibabaPuHuiTi-Regular");

    }
} else {
    //未选中警告
    alert("未选择图形");
}
