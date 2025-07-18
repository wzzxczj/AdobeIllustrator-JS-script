var doc = app.activeDocument;
var sel = doc.selection;

if (sel.length == 0) {
    alert("请先选择一个物件");
} else {
    var refItem = sel[0];
    var refWidth = refItem.width;
    var refHeight = refItem.height;
    
    var matchingItems = [];
    for (var i = 0; i < doc.pageItems.length; i++) {
        var item = doc.pageItems[i];
        if (Math.abs(item.width - refWidth) < 0.01 && Math.abs(item.height - refHeight) < 0.01) {
            matchingItems.push(item);
        }
    }
    
    doc.selection = null;
    for (var j = 0; j < matchingItems.length; j++) {
        matchingItems[j].selected = true;
    }
    
    alert("已选择 " + matchingItems.length + " 个匹配大小的物件");
}
