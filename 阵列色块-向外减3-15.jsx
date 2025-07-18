var nSel = app.activeDocument.selection.length;
//var newDocPre = new DocumentPreset();
//newDocPre.units = RulerUnits.Millimeters; // set the ruler units to mm
if (nSel > 0) {

    // First, we need to get the selected object(s)
    var selectedItems = app.activeDocument.selection;

    var item = selectedItems[0];
    var Group1 = item.parent.groupItems.add();
    var sColors = app.activeDocument.spots;

    // 移除专色
    sColors.removeAll();

    /** var delSpotColor = selectedItems[a].fillColor.spot.name;
    var mySpotColor = doc.spots.getByName(delSpotColor);
    mySpotColor.remove();
     */
    // We calculate the size of each cell in the matrix
    var cellWidth = item.width;
    var cellHeight = item.height;

    var oriColorc = item.fillColor.cyan;
    var oriColorm = item.fillColor.magenta;
    var oriColory = item.fillColor.yellow;
    var oriColork = item.fillColor.black;

    var a = 15;
    var b = 15;
    var aHalf = a / 2;
    var bHalf = b / 2;


    var oriX = item.left;
    var oriY = item.top;

    for (var row = 0; row < a; row++) {
        for (var col = 0; col < b; col++) {

            var x = oriX + (col - 7) * cellWidth;
            var y = oriY + (row - 7) * cellHeight;

            // We create a new copy of the selected item
            var itemcopy = item.duplicate(Group1, ElementPlacement.PLACEBEFORE);

            // We move the copy to the current cell position
            itemcopy.position = [x, y];

            // We set the fill color of the copy to the new CMYK values
            // We create a new CMYK color object
            newCMYKColor = new CMYKColor();

            // We calculate the new CMYK values
            var nc = oriColorc;
            var nm = oriColorm;
            var ny = oriColory;
            var nk = oriColork;

            //knumber and mnumber 
            if (row < 7) {
                nc = oriColorc - (7 - row) * 3;
            } else {
                ny = oriColory - (row - 7) * 3;
            }
            if (col < 7) {
                nk = oriColork - (7 - col) * 3;
            } else {
                nm = oriColorm - (col - 7) * 3;
            }

            // We check if the CMYK values are negative and set them to 0 if they are
            nc = nc < 0 ? 0 : nc;
            nm = nm < 0 ? 0 : nm;
            ny = ny < 0 ? 0 : ny;
            nk = nk < 0 ? 0 : nk;

            nc = nc > 100 ? 100 : nc;
            nm = nm > 100 ? 100 : nm;
            ny = ny > 100 ? 100 : ny;
            nk = nk > 100 ? 100 : nk;

            newCMYKColor.cyan = nc;
            newCMYKColor.magenta = nm;
            newCMYKColor.yellow = ny;
            newCMYKColor.black = nk;

            itemcopy.filled = true;
            // We set the fill color of the copy to the new CMYK values
            itemcopy.fillColor = newCMYKColor;
            itemcopy.moveToEnd(Group1);
        }
    }
    /**   
    item.hidden = true;
    item.remove();
    
    */

    item.position = [oriX + cellWidth * 9, oriY];


} else {
    alert("未选中对象");
}
