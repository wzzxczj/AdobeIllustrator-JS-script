/*
移除非100%黑的对象
"turn off overprint setting for non black object "
How to use:
I decide to cancel and fill overprint run, so make a dialog for each line.
OS10.4.11 Illustrator CS3: operation check
milligramme
www.milligramme.cc
*/
var doc = documents[0];
var pgItm = doc.pageItems;
//塗り
app.selection = null;
for (var i = 0; i < pgItm.length; i++){
    //テキスト系の処理
    if(pgItm[i].typename == "TextFrame"){
        var fiTxtColor = pgItm[i].textRange.fillColor;
        if(pgItm[i].textRange.overprintFill == true){
            if (fiTxtColor.black == 100 
                && fiTxtColor.cyan == 0 
                && fiTxtColor.magenta == 0 
                && fiTxtColor.yellow == 0){
                continue;
            }
            else{
                pgItm[i].selected = true;
            }
        }
    }
    else{//Any other object
        var fiColor = pgItm[i].fillColor;
        if(pgItm[i].fillOverprint == true){
            if (fiColor.black == 100 
                && fiColor.cyan == 0 
                && fiColor.magenta == 0 
                && fiColor.yellow == 0){
                continue;
            }else{
                pgItm[i].selected = true;
            }
        }
    }
}
removeOVPfill(app.selection);
//line
app.selection = null;
for (var i = 0; i < pgItm.length; i++){
    //Text processing system
    if(pgItm[i].typename == "TextFrame"){
        var stTxtColor = pgItm[i].textRange.strokeColor;
        if(pgItm[i].textRange.overprintStroke == true){
            if (stTxtColor.black == 100 
                && stTxtColor.cyan == 0 
                && stTxtColor.magenta == 0 
                && stTxtColor.yellow == 0){
                continue;
            }
            else{
                pgItm[i].selected = true;
            }
        }
    }
    else{//Other objects
        var stColor = pgItm[i].strokeColor;
        if(pgItm[i].strokeOverprint == true){
            if (stColor.black == 100 
                && stColor.cyan == 0 
                && stColor.magenta == 0 
                && stColor.yellow == 0){
                continue;
            }
            else{
                pgItm[i].selected = true;
            }
        }
    }
}
removeOVPstroke(app.selection);


//Release overprint of the selected object (paint))
function removeOVPfill(sel){
    if(sel.length == 0){
        return;
    }
    c = confirm ("删除填充叠印?", false, "Paint");
    if(c == true){
        for(var i = 0; i < sel.length; i++){
            sel[i].fillOverprint = false;
            try{
                sel[i].textRange.overprintFill = false;
                }catch(e){}
            sel[i].selected = false;
        }
    }
}

// Clear overprint the selected object (line))
function removeOVPstroke(sel){
    if(sel.length == 0){
        return;
    }
    c = confirm ("删除描边叠印?", false, "Does not");
    if(c == true){
        for(var i = 0; i < sel.length; i++){
            sel[i].strokeOverprint = false;
            try{
                sel[i].textRange.overprintStroke = false;
                }catch(e){}
            sel[i].selected = false;
        }
    }
}