#target illustrator
 
 
// script.name = timLCdupArtboards.jsx; 
// script.description = duplicates provided artboards to another open document;
// script.required = requires CS5, and both source and destination documenets (with the same layer structure) open
// script.parent = CarlosCanto // 02/07/12;  
// script.elegant = false;
 
 
// Notes: use only in documents with NO sublayers, 
 
 
 
 
var docList = doclist(); // get a list of open docs
 
 
var source = prompt ("输入源文件 (文件编号，逗号分隔)\r\r\n检测到以下文件\n" + docList, 0, "复制画板，Chlo汉化"); // get source doc name index
if (source!=null) {// quit if pressed Cancel
    var dest = prompt ("输入目标文件 (文件编号，逗号分隔)\r\r" + docList, 1, "复制画板"); // get destination doc name index
    if (dest!=null) {// quit if pressed Cancel
        var absstring = prompt ("输入需要复制的画板编号，逗号分隔", "印前数据插件脚本群:143789703", "复制画板"); // get list of artboards to copy
        if (absstring!=null) {// quit if pressed Cancel
 
 
            var artbs = absstring.split (","); // turn list into an array
            var absCount = artbs.length; // get artboards count
 
 
            var sourceDoc = app.documents[source]; // get actual docs
            var destDoc = app.documents[dest];
 
            // get layer visible/lock info & unlock and make visible all layers
            var sourceDocLayerState = unlockUnhideLayers(sourceDoc);
            var destDocLayerState = unlockUnhideLayers(destDoc);
 
            sourceDoc.activate(); // activate source otherwise it is not able to access selection
 
 
            var ABs = []; // array to hold of artboard objects to copy
            var ABsRect = []; // array to hold artboards Rectangles
            var ABsNames = []; // array to hold artboard names
            var ABsInfo = []; // array to hold [Rect, Names]
            for (i=0; i<absCount; i++) {
                ABs[i] = sourceDoc.artboards[artbs[i]-1]; // get actual artboard
                ABsRect[i] = ABs[i].artboardRect; // get Rectangle
                ABsNames[i] = ABs[i].name; // get Name
                ABsInfo[i] = [ABsRect[i], ABsNames[i]]; // get Rectangle and Name
 
                sourceDoc.selection = null; // deselect everything
                sourceDoc.artboards.setActiveArtboardIndex (artbs[i]-1); // activate each artboard
                sourceDoc.selectObjectsOnActiveArtboard(); // select all in artboard
                sel = sourceDoc.selection; // get selection
                moveObjects(sel, destDoc); // move selection
            }
 
 
            addArtboards(destDoc, ABsInfo); // recreate artboards in destination document
 
            // restore layer original state
            lockHideLayers(sourceDoc, sourceDocLayerState);
            lockHideLayers(destDoc, destDocLayerState);
        }
    }
}
 
 
 
 
function unlockUnhideLayers(doc) {
          // get visible state of each layer, and show/unlock layers
          var layerState = []; // array to hold layer visibility
          var layerCount = doc.layers.length; // layer count
 
 
          // get layer visibility, and turn all layers on
          for (i=0; i<layerCount; i++) {
                    var ilayer = doc.layers[i];
                    layerState[i] = [ilayer.visible, ilayer.locked];
                    ilayer.visible = true;
        ilayer.locked = false;
          }
    return layerState;
}
 
 
function lockHideLayers(doc, layerstate) {
          // restore layer visibility
    var layerCount = doc.layers.length; // layer count
          for (k=0; k<layerCount; k++) {
                    var ilayer = doc.layers[k];
        ilayer.visible = layerstate[k][0]; // already a Boolean value, no need to convert
        ilayer.locked = layerstate[k][1]; // already a Boolean value, no need to convert
          }
}
 
 
 
 
// create artboards in destination doc, using the info in absInfo (abRect, Name)
function addArtboards(doc, absInfo) {
    var destDoc = doc;
    var absCount = absInfo.length;
    destDoc.activate();
    for (j=0; j<absCount; j++) {
        var newAB = destDoc.artboards.add(ABsInfo[j][0]);
        newAB.name = ABsInfo[j][1];
 
    }
}
 
 
// move selected objects (sel) to destination document
function moveObjects(sel, destDoc) {
    for (k=0; k<sel.length; k++) { 
        // duplicate items to the same layer in dest document, give both documents have the same layer structure
        var newItem = sel[k].duplicate(destDoc.layers[sel[k].layer.name],ElementPlacement.PLACEATEND);
    }
}
 
 
// get a list of open documents, separated by tabs
function doclist() {
    var docs = app.documents;
        msg = "";
    for (i=0; i<docs.length; i++) {
        msg += i + ". " + docs[i].name + "\t"; // had to use tab (insted of \r) to have the list "inline". Prompt only allows 4 rows in windows
    }
    return msg;
}