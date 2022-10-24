#target illustrator
//#targetengine main

// script.name = insertPageNumbers_v2.jsx; // works with CS4 & CS5
// script description = Inserts page numbers (or any other text) to all artboards in the active document;
// script.required = at least one open document
// script.parent = CarlosCanto // 5/25/12;
// script.elegant = false;

// script.updates = added options to insert Date, Time, Full File Name, & File Name;
// 					added a button to clear previous entered data;
//					 dialog stays open, to be able to input data in multiple locations
//					 only one layer is created on multiple runs

// Notes: The script creates a new layer (Page Numbers) then adds a text frame per Artboard that act as footer or header text.
// 		Its primary function is to insert Page Numbers, but it could be used to insert any other kind of information.



if (app.documents.length > 0) // continue if there's at leat one document open
    {
		// start building User Interface
		var win = new Window("dialog","插入日期文件名变量页码,Chlo汉化");
		var panelMargins = win.add("panel", undefined, "边缘");
		var lblMargins = panelMargins.add("statictext",undefined,"距离边缘:");
		var txtMargins = panelMargins.add("edittext",undefined, 0.25); 
		var lblUnits = panelMargins.add("statictext",undefined,"inches");

		var panelLocation = win.add("panel", undefined, "位置");
		var radTop = panelLocation.add("radiobutton",undefined,"顶");
		var radBottom = panelLocation.add("radiobutton",undefined, "底"); 

		var panelAlignment = win.add("panel", undefined, "对齐");
		var radLeft = panelAlignment.add("radiobutton",undefined,"左");
		var radCenter = panelAlignment.add("radiobutton",undefined, "中"); 
		var radRight = panelAlignment.add("radiobutton",undefined, "右"); 

		var panelFooter = win.add("panel", undefined, "插入的类型");

		var grpPages = panelFooter.add("group");
		var btnPage = grpPages.add("button",undefined,"页码");
		var btnPages = grpPages.add("button",undefined,"总页");
		var btnDate = grpPages.add("button",undefined,"日期");
		var btnTime = grpPages.add("button", undefined, "时间");
		var btnFullName = grpPages.add("button", undefined, "地址");
		var btnFile = grpPages.add("button", undefined, "文件名");

		var txtFooter = panelFooter.add("edittext"); //,undefined, "[Type text to insert here]"); 
		var btnClear = panelFooter.add("button", undefined, "取消");
		btnPage.size = btnPages.size = btnDate.size = btnTime.size = btnFullName.size = btnFile.size = btnClear.size = [31,24]; // on Mac [31, 21] = round buttons, [31,24] = square buttons

		var btnOk = win.add("button", undefined, "Ok");

		radRight.value = radBottom.value = true;

		win.alignChildren = panelFooter.alignChildren = "fill";
		btnClear.alignment = "left";
		panelMargins.spacing = 3;
		panelMargins.orientation = panelLocation.orientation = panelAlignment.orientation = "row";
		
		win.helpTip = "\u00A9 2012 Carlos Canto";
         btnOk.helpTip = "Press Esc to Close";
		btnPage.helpTip = "Adds *page* keyword, it represents a single page";
		btnPages.helpTip = "Adds *pages* keyword, it represents total number of pages";
		btnDate.helpTip = "Adds *date* keyword, it represents today's date";
		btnTime.helpTip = "Adds *time* keyword, it represents current time";
		btnFullName.helpTip = "Adds *fname* keyword, it represents Full File Name (including path)";
		btnFile.helpTip = "Adds *file* keyword, it represents File Name";
		btnClear.helpTip = "Clears input text area";
		txtFooter.helpTip = "Type \r\t'Page *page* of *pages*' \rto get \r\t'Page 1 of 3' \rfor example";


		//-----------------------------------------------------------------------------------------
		// text place holder by Jongware / Marc Autret
		var wgx = win.graphics;
		var grayPen = wgx.newPen(wgx.PenType.SOLID_COLOR,[.67,.67,.67], 1);

		txtFooter.onDraw = function(/*DrawState*/)
		{
			var gx = this.graphics;
			gx.drawOSControl();
			this.text || this.active || gx.drawString("[Type text to insert here] Press Esc to close", grayPen, 0, 0);
		};		
		
		//-----------------------------------------------------------------------------------------
						btnOk.onClick = function(){
                            if (txtFooter.text != "")
							doSomething(); // call main function
							//win.close(); // close when done
						 }
		//-----------------------------------------------------------------------------------------
		
		//-----------------------------------------------------------------------------------------
						btnClear.onClick = function(){
							txtFooter.text = ""; // call main function
							//win.close(); // close when done
						 }
		//-----------------------------------------------------------------------------------------		
		//-----------------------------------------------------------------------------------------
						btnPage.onClick = function(){
							footer("*page*");
						 }
		//-----------------------------------------------------------------------------------------
		//-----------------------------------------------------------------------------------------
						btnPages.onClick = function(){
							footer("*pages*");
						 }
		//-----------------------------------------------------------------------------------------
		//-----------------------------------------------------------------------------------------
						btnDate.onClick = function(){
							footer("*date*");
						 }
		//-----------------------------------------------------------------------------------------
		//-----------------------------------------------------------------------------------------
						btnTime.onClick = function(){
							footer("*time*");
						 }
		//-----------------------------------------------------------------------------------------
		//-----------------------------------------------------------------------------------------
						btnFullName.onClick = function(){
							footer("*fname*");
						 }
		//-----------------------------------------------------------------------------------------
		//-----------------------------------------------------------------------------------------
						btnFile.onClick = function(){
							footer("*file*");
						 }
		//-----------------------------------------------------------------------------------------
						win.center();
						win.show();
						
		//-----------------------------------------------------------------------------------------


		function footer (page) // 
			{
				txtFooter.text = txtFooter.text + page;
			}

		function doSomething()
			{
				//alert("I'm doing something");
				var idoc = app.activeDocument;
				try {
					var ilayer = idoc.layers["Page Numbers"];
				} catch(e) {
					var ilayer = idoc.layers.add();
					ilayer.name = "Page Numbers";
				}

				var pages = idoc.artboards.length; // number of artboards
				var datee = getdate ();
				var timee = gettime ();
				var fname = idoc.path == '' ? "Full Name: <unsaved document>" : idoc.fullName;
				var file = idoc.name;
				
				var footerPages = (txtFooter.text).replace("*pages*",pages);
				//$.writeln(msg);
				footerPages = footerPages.replace("*pages*",pages); // replace the "*pages*" keyword with the actual number fo pages (artboards)
				footerPages = footerPages.replace("*date*",datee);
				footerPages = footerPages.replace("*time*",timee);
				footerPages = footerPages.replace("*fname*",fname);
				footerPages = footerPages.replace("*file*",file);
				
				var margins = Number(txtMargins.text)*72; // get margins in points
				//$.writeln(margins);
				
				for (i = 0; i<idoc.artboards.length; i++) // loop thru all artboards, and add input text from UI
					{
						footerPage = footerPages.replace("*page*",i+1); // replace "*page*" keyword with the actual page Number
					
						var itext = ilayer.textFrames.add();
						itext.contents = footerPage; //"page 1 of 1";				
						var fontSize = itext.textRange.characterAttributes.size;
						
						var activeAB = idoc.artboards[i];

						var iartBounds = activeAB.artboardRect;
						
						var ableft = iartBounds[0]+margins;
						var abtop = iartBounds[1]-margins;
						var abright = iartBounds[2]-margins;
						var abbottom = iartBounds[3]+margins+fontSize;
						
						var abcenter = ableft+(abright-ableft)/2;
								

				
						if (radRight.value == true)
							{
								//var msg = "right";
								itext.left = abright;
								itext.textRange.paragraphAttributes.justification = Justification.RIGHT;
							}
						else if (radCenter.value == true)
							{
								//var msg = "center";
								itext.left = abcenter;
								itext.textRange.paragraphAttributes.justification = Justification.CENTER;
							}
						else
							{
								//var msg = "Left";
								itext.left = ableft;
								itext.textRange.paragraphAttributes.justification = Justification.LEFT;
							}

						if (radTop.value == true)
							{
								//var msg = "top";
								itext.top = abtop;
							}
						else
							{
								//var msg = "bottom";
								itext.top = abbottom;
							}
					} // end for loop thru all artboards
				app.redraw();
			} // end function doSomething();
     }
 else 
    {
        alert ("请打开一个文档");
    }

function getdate() {
	var date = new(Date);
	var m = date.getMonth()+1;
	var d = date.getDate();
	var y = date.getFullYear();
	var datemdy = m+"/"+d+"/"+y;
	return datemdy;
//alert(date);
//alert(m+"/"+d+"/"+y);	
}

function gettime() {
	var time = new(Date);
	var hours = time.getHours();
	var minutes = time.getMinutes();
	if (minutes < 10){
		minutes = "0" + minutes
	}

	if(hours > 11){
		ampm = "PM";
	} else {
		ampm = "AM";
	}	
	var curtime = hours + ":" + minutes + " " + ampm;
	return curtime;
}