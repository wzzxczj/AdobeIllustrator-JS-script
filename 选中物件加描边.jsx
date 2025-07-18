// repeat a few lines above the insertion point
var doc = app.activeDocument;
var sel = doc.selection;
var shuzhi = 1;
doc.rulerUnits = UnitValue("pt");
var sMiaoBian = new UnitValue(shuzhi, "mm").as("pt");


for (var i = 0; i < sel.length; i++) {
  var item = sel[i];
  if (item.typename == "PathItem") {
    var strokeColor = item.strokeColor;
    if (strokeColor.typename == "SpotColor") {
      if (strokeColor.spot.name == "C=100 M=0 Y=0 K=0") {
        if (item.strokeWidth >= sMiaoBian) {
          item.strokeWidth -= sMiaoBian;
        } else {
          item.strokeWidth = sMiaoBian - item.strokeWidth;
          var newcmykColor = new CMYKColor();
          newcmykColor.cyan = 0;
          newcmykColor.magenta = 0;
          newcmykColor.yellow = 0;
          newcmykColor.black = 100;
          item.strokeColor = newcmykColor;
        }
      }
    } else if (strokeColor.typename == "CMYKColor") {
      if (strokeColor.cyan == 0 && strokeColor.magenta == 0 && strokeColor.yellow == 0 && strokeColor.black == 100) {
        item.strokeWidth += sMiaoBian;
      }
    }
  }
}

doc.rulerUnits = UnitValue("mm");
