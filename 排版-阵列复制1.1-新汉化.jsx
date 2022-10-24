/*
Название: StepAndCopyAI.jsx
Приложение для использования: Adobe Illustrator CS3, CS4, CS5
Версия: 1.1
Язык реализации (Среда): JavaScript (ExtendScript Toolkit 2)
Операционные системы (Платформы): PC, Macintosh (Windows, Mac OS)
Условия распространения: Бесплатно; На Ваш риск
Назначение: Перемещение и копирование выделенных объектов
Функциональные ограничения: Не работает с направляющими
Техническая поддержка: Sergey-Anosov@yandex.ru
https://sites.google.com/site/dtpscripting
===================================================
Name: StepAndCopyAI.jsx
Application to use with: Adobe Illustrator CS3, CS4, CS5
Version: 1.1
Program language (Environment): JavaScript (ExtendScript Toolkit 2)
Operating systems (Platforms): PC, Macintosh (Windows, Mac OS)
Distribution conditions: Freeware; At your own risk
Destination: Moves and duplicates selected objects
Functional limitations: Can not process selected guides
Technical support: Sergey-Anosov@yandex.ru
https://sites.google.com/site/dtpscripting
*/
var SCRIPT_TITLE = "Step and Copy AI-Chlo汉化 ";
var SCRIPT_VERSION = "v.1.1";
// активный документ
var AD;
// выделение
var the_sel = new Array();
// длина выделения
var sel_len;
// менялись ли единицы и координаты
var RULERS_WERE_CHANGED = false;
// диалог
var dialog_main, dialog_main_bounds;
var DIALOG_OLD = false;
// размеры без учета клипмаски
// геометр.
var GT, GL, GB, GR, GCH, GCV;
// визуальные
var VT, VL, VB, VR, VCH, VCV;
// габариты
var GH, GV, VH, VV;
// размеры с учетом клипмаски
// геометр.
var GT_NC, GL_NC, GB_NC, GR_NC, GCH_NC, GCV_NC;
// визуальные
var VT_NC, VL_NC, VB_NC, VR_NC, VCH_NC, VCV_NC;
// габариты
var GH_NC, GV_NC, VH_NC, VV_NC;
// направления в диалоге
var T_VALUE = false, B_VALUE = false, L_VALUE = false, R_VALUE = false;
var TL_VALUE = false, TR_VALUE = false, BL_VALUE = false, BR_VALUE = false, CC_VALUE = true;
// габариты для расчета
var H;// width
var V;// height
var V_NUM, H_NUM;
// границы
var GEO_BOUNDS, GEO_BOUNDS_VALUE = true;
var VIZ_BOUNDS, VIZ_BOUNDS_VALUE = false;
// относительный центр
var REL_C, REL_C_VALUE = true;
// единицы измерения
var H_UNITS_TEXT = "??";
var V_UNITS_TEXT = "??";
var ACTIVE_UNITS = "mm";
var ACTIVE_UNITS_VALUE = 0;
var UNITS_DROP;
var UNITS_DROP_SELECTION = 0;
// делать копию
var COPY_BUTTON, COPY_BUTTON_VALUE = false;
// смещения
var H_STEP = 0.;
var V_STEP = 0.;
var P_S = "+0";
var M_S = "-0";
var V_STEP_TEXT = P_S;
var H_STEP_TEXT = P_S;
// шаги
var N_STEP = 1;
var N_STEP_DONE = 0;
var STEPS;
// учитывать клипмаску
var BOUNDS_BY_CLIP;
var BOUNDS_BY_CLIP_VALUE = false;
var CLIP = false;
// команды выхода
var exit_if_guide = false;
var exit_if_error = false;
var exit_if_bad_input = false;
// массив объектов для перемещения
var OBJ_TO_MOVE = new Array();
//  массив объектов для отображения
var NO_CLIP_OBJECTS_AND_MASKS = new Array();
//  массив объектов для отображения с учетом клипмаски
var OBJ_NO_CLIP_TO_SHOW = new Array();
// число десятичных знаков на выводе диалога
var AFTER_DOT = 3;
// нет документов
var NO_DOCS = false;
// версия Иллюстратора
var APP_VERSION;
//
// вызываем основной модуль
main();
// востсстанавливаем выделение
if( !NO_DOCS ) MAKE_SELECTION( OBJ_TO_MOVE );
// все :)))
//
// основной модуль
function main() 
{
	if( CHECK_SELECTION() ) 
	{
		DIMENSIONS();
		if( exit_if_error ) 
		{
			alert("Can not do this!\nLikely the selection is inproper...");
			return;
		};// if
		DIALOG();
		if( exit_if_error ) 
		{
			alert("Can not do this!");
			return;
		};// if
		if( exit_if_bad_input ) 
		{
			alert("Bad number input!");
			return;
		};// if
	};// if
	return;
};// end main
//
// подпрограмма оценки выделния и документа
function CHECK_SELECTION() 
{
	// есть ли открытые документы
	N_doc = app.documents.length;
	if (N_doc < 1 ) 
	{
		alert( "There are no open documents!");
		NO_DOCS = true;
		return false;
	};// if
	// есть ли выделенные объекты
	AD = app.activeDocument;
	AL = AD.activeLayer;
	the_sel = AD.selection;
	N_sel = the_sel.length;
	if( N_sel == 0 ) 
	{
		alert("没有选择对象!");
		return false;
	};// if
	OBJ_TO_MOVE = the_sel;
	if( GUIDES_IN_SELECTION() ) 
	{
		alert("There are some selected guides!\nCan not process that!");
		return false;
	};// if
	var WHITE_ARROW = false;
	for( var i=0; i < N_sel; i++ ) 
	{
		if( SELECTED_IN_GROUP(the_sel[i]) ) 
		{
			WHITE_ARROW = true;
		};// if
	};// for
	if( WHITE_ARROW ) 
	{
		if(!confirm("Likely White arrow (Direct selection tool) was used to select object(s). Black arrow (Selection tool) in this case is preferable.\nContinue anyway?")) return false;
	};// if
	APP_VERSION = parseInt(app.version);
	if( APP_VERSION > 13 ) BOUNDS_BY_CLIP_VALUE = true;
	ACTIVE_UNITS = "mm"; ACTIVE_UNITS_VALUE = 0;
	var AD_units = app.activeDocument.rulerUnits;
	if( AD_units == RulerUnits.Millimeters ) { ACTIVE_UNITS = "mm"; ACTIVE_UNITS_VALUE = 0 };
	if( AD_units == RulerUnits.Centimeters ) { ACTIVE_UNITS = "cm"; ACTIVE_UNITS_VALUE = 1 };
	if( AD_units == RulerUnits.Points ) { ACTIVE_UNITS = "pt"; ACTIVE_UNITS_VALUE = 2 };
	if( AD_units == RulerUnits.Inches ) { ACTIVE_UNITS = "in"; ACTIVE_UNITS_VALUE = 3; AFTER_DOT = 4 };
	if( AD_units == RulerUnits.Pixels ) { ACTIVE_UNITS = "px"; ACTIVE_UNITS_VALUE = 4 };
	return true;
};// end CHECK_SELECTION()
//
// перевод значения из меню в активные единицы
function GET_ACTIVE_UNITS( N ) 
{
	if( N == 0 ) return "mm";
	if( N == 1 ) return "cm";
	if( N == 2 ) return "pt";
	if( N == 3 ) return "in";
	if( N == 4 ) return "px";
	return "??";
};// GET_ACTIVE_UNITS
//
// получение номера акт. единиц
function GET_UNITS_SELECTION ( u ) 
{
	if( u == "mm" ) return 0;
	if( u == "cm" ) return 1;
	if( u == "pt" ) return 2;
	if( u == "in" ) return 3;
	if( u == "px" ) return 4;
};// GET_UNITS_SELECTION
//
// подпрограмама поиска направляющих в выделении
function GUIDES_IN_SELECTION() 
{
	function GUIDES_INSIDE( the_obj ) 
	{
		if( IS_GUIDE( the_obj ) ) return true;
		try 
		{
			for( var i =0; i < the_obj.pageItems.length; i++ ) 
			{
				if( GUIDES_INSIDE( the_obj.pageItems[i] ) ) return true;
			};// for
		} catch( error) {};
		return false;
	};// end GUIDES_INSIDE
	for( var i=0; i < the_sel.length; i++ )
	{
		if( GUIDES_INSIDE( the_sel[i] ) ) return true;
	};// for
	return false;
};// end GUIDES_IN_SELECTION
//
// подпрограмма создания и вывода диалога
function DIALOG()
{
	dialog_main = new Window('dialog');
	if( DIALOG_OLD) 
	{
		dialog_main.location = dialog_main_bounds;
		try
		{
			ACTIVE_UNITS_VALUE = GET_UNITS_SELECTION ( ACTIVE_UNITS );
			ACTIVE_UNITS = GET_ACTIVE_UNITS( ACTIVE_UNITS_VALUE );
			if( ACTIVE_UNITS_VALUE == 3 ) AFTER_DOT = 4 else AFTER_DOT = 3;
		} catch( error ) {};
	};// if
	dialog_main.text = SCRIPT_TITLE + SCRIPT_VERSION;
	dialog_main.orientation = 'column';
	// верхняя группа
	var top_group = dialog_main.add('group');
	top_group.alignChildren = 'top';
	top_group.orientation = 'row';
	// группа для выбора направлений (слева)
	var dir_group = top_group.add('group');
	dir_group.orientation = 'column';
	dir_group.alignChildren = 'left';
	var dir_pan =  dir_group.add('panel');
	dir_pan.bounds = [0, 0, 100, 100];
	var dir_dx = 30;
	var dir_dy = 30;
	var dir_x0 = 8;
	var dir_y0 = 3;
	// подпрограмма создания кнопок для выбора направлений
	function RB_xy(x, y) 
	{
		var the_rb = dir_pan.add('radiobutton');
		var d = 30
		the_rb.bounds = [x, y, x+d, y+d];
		the_rb.onClick = BOUNDS_ON_CLICK;
		return the_rb;
	};// end RB_xy
	// верх-лево, верх, верх-право
	var TL = RB_xy(dir_x0, dir_y0); TL.value = TL_VALUE;
	var T = RB_xy(dir_x0+dir_dx, dir_y0); T.value = T_VALUE;
	var TR = RB_xy(dir_x0+dir_dx*2, dir_y0); TR.value = TR_VALUE;
	// лево, центр, право
	dir_y0 = dir_y0 +dir_dy;
	var L = RB_xy(dir_x0, dir_y0); L.value = L_VALUE;
	var C = RB_xy(dir_x0+dir_dx, dir_y0); C.value = CC_VALUE;
	var R = RB_xy(dir_x0+dir_dx*2, dir_y0); R.value = R_VALUE;
	// низ-лево, низ, низ-право
	dir_y0 = dir_y0 +dir_dy;
	var BL = RB_xy(dir_x0, dir_y0); BL.value = BL_VALUE;
	var B = RB_xy(dir_x0+dir_dx, dir_y0); B.value = B_VALUE;
	var BR = RB_xy(dir_x0+dir_dx*2, dir_y0); BR.value = BR_VALUE;
	// относительный центр
	REL_C =  dir_group.add('checkbox');
	REL_C.text = '相对中心';
	REL_C.value = REL_C_VALUE;
	REL_C.onClick = BOUNDS_ON_CLICK;
	// применить к копии
	COPY_BUTTON = dir_group.add('checkbox');
	COPY_BUTTON.text = '适用于复制';
	COPY_BUTTON.value = COPY_BUTTON_VALUE;
	//
	// группа опций (панель справа)
	var OPT_GROUP =  top_group.add('panel');
	OPT_GROUP.orientation = 'column';
	OPT_GROUP.alignChildren = 'center';
	//
	// самая верхняя группа (все кроме ОК-Cancel)
	var TOP_GROUP = OPT_GROUP.add('group');
	TOP_GROUP.orientation = 'row';
	TOP_GROUP.alignChildren = 'top';
	//
	// колонка 1 (самая левая): выбор границ, координаты
	var OPT_COLUMN_1 = TOP_GROUP.add('group');
	OPT_COLUMN_1.orientation = 'column';
	OPT_COLUMN_1.alignChildren = 'left';
	// геометр. или виз. границы
	var BOUNDS_GROUP =OPT_COLUMN_1.add('group');
	BOUNDS_GROUP.orientation = 'column';
	BOUNDS_GROUP.alignChildren = 'left';
	GEO_BOUNDS = BOUNDS_GROUP.add('radiobutton');
	GEO_BOUNDS.text = "几何边界";
	GEO_BOUNDS.value = GEO_BOUNDS_VALUE;
	GEO_BOUNDS.onClick = BOUNDS_ON_CLICK;
	VIZ_BOUNDS = BOUNDS_GROUP.add('radiobutton');
	VIZ_BOUNDS.text = "可见范围";
	VIZ_BOUNDS.value = VIZ_BOUNDS_VALUE;
	VIZ_BOUNDS.onClick = BOUNDS_ON_CLICK;
	// выбор учета клипмаски
	BOUNDS_BY_CLIP = OPT_COLUMN_1.add('checkbox');
	BOUNDS_BY_CLIP.text = "Consider clipping mask";
	BOUNDS_BY_CLIP.value = BOUNDS_BY_CLIP_VALUE;
	BOUNDS_BY_CLIP.onClick =  DIR_ON_CHANGE;
	BOUNDS_BY_CLIP.visible = CLIP;
	// группа вывода координат
	// подпрограмма вывода текстового блока в диалоге
	function TEXT(obj, text_type, the_text, len) 
	{
		var T = obj.add(text_type);
		T.text = the_text;
		T.size = [len, 18];
		return T;
	};// end TEXT
	var COORD_GROUP = OPT_COLUMN_1.add('group');
	COORD_GROUP.orientation = 'row';
	// выводим координаты
	var COORD_GROUP_1 =COORD_GROUP.add('group');
	COORD_GROUP_1.orientation = 'column';
	COORD_GROUP_1.alignChildren = 'left';
	H_NUM = TEXT(COORD_GROUP_1, 'statictext', " ", 140);
	V_NUM = TEXT(COORD_GROUP_1, 'statictext', " ", 140);
	// колонка 1 построена
	//
	// колонка 2 (самая правая): выбор количества шагов, смещения
	var OPT_COLUMN_2 = TOP_GROUP.add('group');
	OPT_COLUMN_2.orientation = 'column';
	OPT_COLUMN_2.alignChildren = 'right';
	// группа шагов
	var STEPS_GROUP = OPT_COLUMN_2.add('group');
	STEPS_GROUP.orientation = 'column';
	STEPS_GROUP.alignChildren = 'left';
	// ввод количества шагов
	var STEP_INPUT = STEPS_GROUP.add('group');
	STEP_INPUT.orientation = 'row';
	var STEPS_TEXT = TEXT(STEP_INPUT, 'statictext',"步骤:", 40);
	STEPS = TEXT(STEP_INPUT, 'edittext', N_STEP.toString(), 30);
	// вывод уже сделанных шагов
	var STEP_DONE = STEPS_GROUP.add('group');
	STEP_DONE.orientation = 'row';
	var N_S_DONE = TEXT(STEP_DONE, 'statictext', ("完成:    "+N_STEP_DONE.toString()), 70);
	// выбор единиц измерения
	var UNITS_GROUP = STEPS_GROUP.add('group');
	UNITS_GROUP.orientation = 'row';
	var UNITS_TEXT = TEXT(UNITS_GROUP, 'statictext',"单位:", 40);
	UNITS_DROP = UNITS_GROUP.add('dropdownlist');
	UNITS_DROP.add('item', "mm");//0
	UNITS_DROP.add('item', "cm");//1
	UNITS_DROP.add('item', "pt");//2
	UNITS_DROP.add('item', "in");//3
	UNITS_DROP.add('item', "px");//4
	UNITS_DROP.selection = ACTIVE_UNITS_VALUE;
	UNITS_DROP.onChange = BOUNDS_ON_CLICK;
	// группа смещений по вертикали и горизонтали
	var COORD_GROUP_2 = OPT_COLUMN_2.add('group');
	COORD_GROUP_2.orientation = 'column';
	COORD_GROUP_2.alignChildren = 'left';
	// ввод смещений
	var H_GROUP = COORD_GROUP_2.add('group');
	// X (H)
	H_GROUP.orientation = 'row';
	H_GROUP.alignChildren = 'top';
	var dX_TEXT = TEXT(H_GROUP, 'statictext', "dX:", 20);
	H_STEP = TEXT(H_GROUP, 'edittext', H_STEP_TEXT, 60);
	// Y (V)
	var V_GROUP = COORD_GROUP_2.add('group');
	V_GROUP.orientation = 'row';
	V_GROUP.alignChildren = 'top';
	var dY_TEXT = TEXT(V_GROUP, 'statictext', "dY:", 20);
	V_STEP = TEXT(V_GROUP, 'edittext', V_STEP_TEXT, 60);
	// обновляем значения в окошках
	BOUNDS_ON_CLICK();
	// кнопки ОК или выход
	var OK_group = OPT_GROUP.add('group');
	OK_group.orientation = 'row';
	var okBtn = OK_group.add('button', undefined, 'OK');// кнопка ОК
	var cancelBtn = OK_group.add('button', undefined, 'Cancel');// кнопка Cancel
	//
	// подпрограмма перемещения объектов
	function MOVE() 
	{
		DIALOG_OLD = true;
		COPY_BUTTON_VALUE = COPY_BUTTON.value;
		DUPLICATE = COPY_BUTTON_VALUE;
		REL_C_VALUE = REL_C.value;
		GEO_BOUNDS_VALUE = GEO_BOUNDS.value;
		VIZ_BOUNDS_VALUE = VIZ_BOUNDS.value;
		N_STEP = parseInt( GET_NUMBER(STEPS.text) );
		if( exit_if_bad_input ) return;
		if( N_STEP < 1) 
		{
			alert("Warning:\nBad number of steps! The "+'"'+"1"+'"'+" is assigned!");
			N_STEP = 1;
		};// if
		for( var st = 1; st <= N_STEP; st++ ) 
		{
			var D;
			// рассчитываем перемещения
			H_STEP_TEXT = H_STEP.text;
			V_STEP_TEXT = V_STEP.text;
			var D_H_X = TEXT_TO_POINTS(H_STEP_TEXT);
			if( exit_if_bad_input ) return;
			var D_V_Y = TEXT_TO_POINTS(V_STEP_TEXT);
			if( exit_if_bad_input ) return;
			// если относительный центр
			if( REL_C_VALUE ) 
			{
				D_H_X = H + D_H_X;
				D_V_Y = V + D_V_Y;
			};// if
			// промежуточный массив для перемещаемых объектов
			var the_obj = new Array();
			the_obj = OBJ_TO_MOVE;
			OBJ_TO_MOVE = OBJ_TO_MOVE.slice(0,0);
			DESELECT_ALL();
			for( var i=0; i < the_obj.length; i++ ) 
			{
				var NO_DUP = false;
				if( DUPLICATE ) {// если копирование
					// если выделена только клипмаска
					if( MASK_ONLY_SELECTED( the_obj[i] ) ) 
					{
						D = the_obj[i].parent.duplicate();
						try 
						{
							for( var r = D.pageItems.length-1; r >=1; r-- )
							{
								D.pageItems[r].remove();
							};// for	
						} catch ( error ) {};
					};// if
					// если выделено в клипмаске
					if( SELECTED_IN_CLIP( the_obj[i] ) ) 
					{
						var IND;
						var the_par = the_obj[i].parent;
						for( var k=0; k < the_par.pageItems.length; k++) 
						{
							if( the_par.pageItems[k] == the_obj[i] ) 
							{
								IND = k;
								break;
							};// if
						};// for
						D = the_obj[i].parent.duplicate();
						var D2 = D.pageItems[IND];
						try 
						{
							for( var r=D.pageItems.length-1; r >=0; r--) 
							{
								if( D.pageItems[r] == D2 ) continue;
								D.pageItems[r].remove();
							};// for
						} catch ( error ) { };
						D = D2;
					};// if
					if( !MASK_ONLY_SELECTED( the_obj[i] ) && ! SELECTED_IN_CLIP( the_obj[i] ))
					{
						D = the_obj[i].duplicate();
					};// if
				} 
				else 
				{
					// если просто перемещение
					D = the_obj[i];
				};// if-else
				try 
				{
					if( ( D_H_X != 0. ) || ( D_V_Y != 0. ) ) 
					{
						var moveMatrix = new Matrix();
						moveMatrix = app.getTranslationMatrix( D_H_X, D_V_Y );
						D.transform( moveMatrix );
						app.redraw();
					};// if
				} 
				catch (error) 
				{
					exit_if_error = true;
					return;
				};// try-catch
				OBJ_TO_MOVE.push( D );
			};// for i
			DIMENSIONS();
			if(  BOUNDS_BY_CLIP.value ) MAKE_SELECTION( OBJ_NO_CLIP_TO_SHOW );
			if(  !BOUNDS_BY_CLIP.value ) MAKE_SELECTION( OBJ_TO_MOVE );
			N_STEP_DONE = N_STEP_DONE + 1;
		};// for st
		BOUNDS_ON_CLICK();
		DIALOG();
		return;
	};// end MOVE
	//
	// подпрограмма измения параметров вывода в диалоге
	// при изменении введенных опций
	function DIR_ON_CHANGE () 
	{
		if( TL.value ) {H_STEP_TEXT = M_S; V_STEP_TEXT = P_S }
		if( T.value ) {H_STEP_TEXT = P_S; V_STEP_TEXT = P_S }
		if( TR.value ) {H_STEP_TEXT = P_S; V_STEP_TEXT = P_S }
		//
		if( L.value ) {H_STEP_TEXT = M_S; V_STEP_TEXT = M_S }
		if( C.value ) {H_STEP_TEXT = P_S; V_STEP_TEXT = P_S }
		if( R.value ) {H_STEP_TEXT = P_S; V_STEP_TEXT = P_S }
		//
		if( BL.value ) {H_STEP_TEXT = M_S; V_STEP_TEXT = M_S }
		if( B.value ) {H_STEP_TEXT = P_S; V_STEP_TEXT = M_S }
		if( BR.value ) {H_STEP_TEXT = P_S; V_STEP_TEXT = M_S }
		//
		H_STEP.text = H_STEP_TEXT;
		V_STEP.text = V_STEP_TEXT;
		//
		T_VALUE = T.value, B_VALUE = B.value, L_VALUE =L.value, R_VALUE = R.value;
		TL_VALUE = TL.value, TR_VALUE = TR.value, BL_VALUE = BL.value, BR_VALUE = BR.value;
		CC_VALUE = C.value;
		if( BOUNDS_BY_CLIP.value != BOUNDS_BY_CLIP_VALUE ) 
		{
			if(  BOUNDS_BY_CLIP.value ) MAKE_SELECTION( OBJ_NO_CLIP_TO_SHOW );
			if(  !BOUNDS_BY_CLIP.value ) MAKE_SELECTION( OBJ_TO_MOVE );
			BOUNDS_ON_CLICK();
		};
		BOUNDS_BY_CLIP_VALUE = BOUNDS_BY_CLIP.value;
		return;
	};// end DIR_ON_CHANGE;
	//
	// подпрограмма реакции на нажатие кнопок опций в диалоге
	function BOUNDS_ON_CLICK() 
	{
		var ABS_T, ABS_L, ABS_B, ABS_R, ABS_CV, ABS_CH;
		try 
		{
			if( UNITS_DROP.selection != ACTIVE_UNITS_VALUE ) 
			{
				ACTIVE_UNITS_VALUE  = UNITS_DROP.selection;
				ACTIVE_UNITS = GET_ACTIVE_UNITS( ACTIVE_UNITS_VALUE );
				if( ACTIVE_UNITS_VALUE == 3 ) AFTER_DOT = 4 else AFTER_DOT = 3;
			};// if
		} 
		catch (error) 
		{
			ACTIVE_UNITS_VALUE = GET_UNITS_SELECTION ( ACTIVE_UNITS );
			ACTIVE_UNITS = GET_ACTIVE_UNITS( ACTIVE_UNITS_VALUE );
			UNITS_DROP.selection = ACTIVE_UNITS_VALUE;
			if( ACTIVE_UNITS_VALUE == 3 ) AFTER_DOT = 4 else AFTER_DOT = 3;
		};// if-else
		if( BOUNDS_BY_CLIP.value ) 
		{
			var ABS_GL = GL_NC, ABS_GT = GT_NC, ABS_GR = GR_NC, ABS_GB = GB_NC, ABS_GCH = GCH_NC, ABS_GCV = GCV_NC;
			var ABS_VL = VL_NC, ABS_VT = VT_NC, ABS_VR = VR_NC, ABS_VB = VB_NC, ABS_VCH = VCH_NC, ABS_VCV = VCV_NC;
			var ABS_GH = GH_NC, ABS_GV = GV_NC;
			var ABS_VH = VH_NC, ABS_VV = VV_NC;
		} 
		else 
		{
			var ABS_GL = GL, ABS_GT = GT, ABS_GR = GR, ABS_GB = GB, ABS_GCH = GCH, ABS_GCV = GCV;
			var ABS_VL = VL, ABS_VT = VT, ABS_VR = VR, ABS_VB = VB, ABS_VCH = VCH, ABS_VCV = VCV;
			var ABS_GH = GH, ABS_GV = GV;
			var ABS_VH = VH, ABS_VV = VV;
		};// if-else
		//
		if( TL.value != TL_VALUE || T.value != T_VALUE || TR.value != TR_VALUE ||
			 L.value != L_VALUE || C.value != CC_VALUE || R.value != R_VALUE ||
			 BL.value != BL_VALUE || B.value != B_VALUE || BR.value != BR_VALUE) DIR_ON_CHANGE ();
		// если нет относительных границ
		if( !REL_C.value ) 
		{
			if( GEO_BOUNDS.value ) 
			{ 
				ABS_L = ABS_GL; ABS_B = ABS_GB; ABS_R = ABS_GR; ABS_T = ABS_GT; 
				ABS_CH = ABS_GCH; ABS_CV = ABS_GCV; 
			} 
			else 
			{
				ABS_L = ABS_VL; ABS_B = ABS_VB; ABS_R = ABS_VR; ABS_T = ABS_VT; 
				ABS_CH = ABS_VCH; ABS_CV = ABS_VCV;
			};
			if( TL.value || L.value || BL.value ) H = ABS_L;
			if( T.value || C.value || B.value )  H = ABS_CH;
			if( TR.value || R.value || BR.value ) H = ABS_R;
			//
			if( TL.value || T.value || TR.value ) V = ABS_T;
			if( L.value || C.value || R.value ) V = ABS_CV;
			if( BL.value || B.value || BR.value ) V = ABS_B;
		};// if
		if( REL_C.value ) 
		{
			// если есть относительные границы
			if( GEO_BOUNDS.value ) 
			{
				H = ABS_GH;
				V = ABS_GV;
			};// if
			if( VIZ_BOUNDS.value ) 
			{
				H = ABS_VH;
				V = ABS_VV;
			};// if
			if( TL.value || L.value || BL.value ) { H = -1*H };
			if( BL.value || B.value || BR.value ) { V = -1*V };
			if( R.value || C.value || L.value ) V = 0.;
			if( T.value || C.value || B.value ) H = 0.;
		};// if
		H_STEP.text = H_STEP_TEXT;
		V_STEP.text = V_STEP_TEXT;
		var H_SHOW = TEXT_TO_DIGIT(H.toString()).toFixed(AFTER_DOT);
		var V_SHOW = TEXT_TO_DIGIT(V.toString()).toFixed(AFTER_DOT);
		H_NUM.text = "H (X): "+ H_SHOW + " "+ACTIVE_UNITS;
		V_NUM.text = "V (Y): "+V_SHOW+ " "+ACTIVE_UNITS;
		return;
	};// if
	//
	var DIALOG_BUTTON = dialog_main.show();
	dialog_main_bounds = dialog_main.location;
	if( DIALOG_BUTTON == 1 ) MOVE();
	if( exit_if_error ) return;
	if( exit_if_bad_input ) return;
}; // end DIALOG
//
// подпрограмма вычисления размеров выделения
function DIMENSIONS( ) 
{
	var objects = OBJ_TO_MOVE;
	var N_objects = objects.length;
	var objects_bounds = new Array();
	var no_clip_bounds = new Array(); 
	// начальное присвоение для поиска макс. и мин. значений
	objects_bounds = OBJ_BOUNDS ( objects[0] );
	if( exit_if_error ) return;
	// весь объект
	// геометр.
	var OBJ_GL = objects_bounds[0];
	var OBJ_GT = objects_bounds[1];
	var OBJ_GR = objects_bounds[2];
	var OBJ_GB = objects_bounds[3];
	// визуальные
	var OBJ_VL = objects_bounds[4];
	var OBJ_VT = objects_bounds[5];
	var OBJ_VR = objects_bounds[6];
	var OBJ_VB = objects_bounds[7];
	// не в масках
	// геометр.
	no_clip_bounds = NO_CLIP_BOUNDS ( objects[0] );
	var OBJ_NC_GL = no_clip_bounds[0];
	var OBJ_NC_GT = no_clip_bounds[1];
	var OBJ_NC_GR = no_clip_bounds[2];
	var OBJ_NC_GB = no_clip_bounds[3];
	// визуальные
	var OBJ_NC_VL = no_clip_bounds[4];
	var OBJ_NC_VT = no_clip_bounds[5];
	var OBJ_NC_VR = no_clip_bounds[6];
	var OBJ_NC_VB = no_clip_bounds[7];
	// цикл по объектам 
	for(var i=0; i < N_objects; i++) 
	{
		var the_obj = objects[i];
		// весь объект
		objects_bounds = OBJ_BOUNDS ( the_obj );
		// геометрические
		var GL_i = objects_bounds[0];
		var GT_i =  objects_bounds[1];
		var GR_i =  objects_bounds[2];
		var GB_i =  objects_bounds[3];
		// визуальные
		var VL_i = objects_bounds[4];
		var VT_i =  objects_bounds[5];
		var VR_i =  objects_bounds[6];
		var VB_i =  objects_bounds[7];
		// определяем макс. и мин. всего объекта
		// геометрические
		if( GL_i < OBJ_GL ) OBJ_GL = GL_i;
		if( GT_i > OBJ_GT ) OBJ_GT = GT_i;
		if( GR_i > OBJ_GR ) OBJ_GR = GR_i;
		if( GB_i < OBJ_GB ) OBJ_GB = GB_i;
		// визуальные
		if( VL_i < OBJ_VL ) OBJ_VL = VL_i;
		if( VT_i > OBJ_VT ) OBJ_VT = VT_i;
		if( VR_i > OBJ_VR ) OBJ_VR = VR_i;
		if( VB_i < OBJ_VB ) OBJ_VB = VB_i;
		// с учетом клип маски
		no_clip_bounds = NO_CLIP_BOUNDS ( the_obj );
		// геом. границы
		var GL_NC_i = no_clip_bounds[0];
		var GT_NC_i = no_clip_bounds[1];
		var GR_NC_i = no_clip_bounds[2];
		var GB_NC_i = no_clip_bounds[3];
		// визуальные границы
		var VL_NC_i = no_clip_bounds[4];
		var VT_NC_i = no_clip_bounds[5];
		var VR_NC_i = no_clip_bounds[6];
		var VB_NC_i = no_clip_bounds[7];
		// определяем макс. и мин. с учетом клип маски
		// геометрические
		if( GL_NC_i < OBJ_NC_GL ) OBJ_NC_GL = GL_NC_i;
		if( GT_NC_i > OBJ_NC_GT ) OBJ_NC_GT = GT_NC_i;
		if( GR_NC_i > OBJ_NC_GR ) OBJ_NC_GR = GR_NC_i;
		if( GB_NC_i < OBJ_NC_GB ) OBJ_NC_GB = GB_NC_i;
		// визуальные
		if( VL_NC_i < OBJ_NC_VL ) OBJ_NC_VL = VL_NC_i;
		if( VT_NC_i > OBJ_NC_VT ) OBJ_NC_VT = VT_NC_i;
		if( VR_NC_i > OBJ_NC_VR ) OBJ_NC_VR = VR_NC_i;
		if( VB_NC_i < OBJ_NC_VB ) OBJ_NC_VB = VB_NC_i;
		//
	};// for i
	// присвоение результатов в глобальные переменные
	GL = OBJ_GL; GT = OBJ_GT; GR = OBJ_GR; GB = OBJ_GB; 
	VL = OBJ_VL; VT = OBJ_VT; VR = OBJ_VR; VB = OBJ_VB; 
	GL_NC = OBJ_NC_GL; GT_NC = OBJ_NC_GT; GR_NC = OBJ_NC_GR; GB_NC = OBJ_NC_GB; 
	VL_NC = OBJ_NC_VL; VT_NC = OBJ_NC_VT; VR_NC = OBJ_NC_VR; VB_NC = OBJ_NC_VB; 
	// проверяем требуется ли учет клипмаски
	CLIP = false;
	if( (GL != GL_NC) || (GT != GT_NC) || (GR != GR_NC) || (GT != GT_NC) ||
		(VL != VL_NC)  || (VT != VT_NC) ||  (VR != VR_NC) || (VB != VB_NC) ) 
	{
		CLIP = true;
	};// if
	// габариты
	// все выделение
	// геометрические
	GH = GR - GL;
	GV = GT - GB;
	GCH = GL + (GR - GL)/2.;
	GCV = GB + (GT - GB)/2.;
	// визуальные
	VH = VR - VL;
	VV = VT - VB;
	VCH = VL + (VR - VL)/2.;
	VCV = VB + (VT - VB)/2.;
	// с учетом масок
	GH_NC = GR_NC - GL_NC;
	GV_NC = GT_NC - GB_NC;
	GCH_NC = GL_NC + (GR_NC - GL_NC)/2.;
	GCV_NC = GB_NC + (GT_NC - GB_NC)/2.;
	// визуальные
	VH_NC = VR_NC - VL_NC;
	VV_NC = VT_NC - VB_NC;
	VCH_NC = VL_NC + (VR_NC - VL_NC)/2.;
	VCV_NC = VB_NC + (VT_NC - VB_NC)/2.;
	//  массив объектов для отображения с учетом клипмаски
	OBJ_NO_CLIP_TO_SHOW = NO_CLIP_OBJECTS_AND_MASKS;
	// очищаем массив с учетом клипмасок
	NO_CLIP_OBJECTS_AND_MASKS = NO_CLIP_OBJECTS_AND_MASKS.slice(0,0);
	return ;
};// end DIMENSIONS
//
// подпрограмма снятия выделения
function DESELECT_ALL() 
{
	app.activeDocument.selection = null;
	app.redraw();
	return;
};// end DESELECT_ALL
//
// подпрограмма создания выделения
function MAKE_SELECTION( objects ) 
{
	DESELECT_ALL();
	app.activeDocument.selection = objects;
	app.redraw();
	return;
};// end MAKE_SELECTION
//
// функция перевода пунктов в активные единицы
function TEXT_TO_DIGIT ( txt ) 
{
	var d = txt.toLowerCase();
	var k = 1.;
	if( ACTIVE_UNITS == 'pt' ) k = 1.; 
	if( ACTIVE_UNITS == 'in' ) k = 1./72.; 
	if( ACTIVE_UNITS == 'mm' ) k = 1./(72./25.4); 
	if( ACTIVE_UNITS == 'cm' ) k = 1./((72./25.4)*10.);
	if( ACTIVE_UNITS == 'px' ) k = 1.;
	d = parseFloat( txt ) * k;
	// если не цифра, обнуляем
	 if( isNaN(d) ) 
	 {
		 d = 0.;
		 exit_if_bad_input = true;
		 return;
	}
	// возвращаем значение в пунктах для расчета
	return d;
}// end TEXT_TO_DIGIT
//
// функция чтения текстового ввода в активных единицах и перевода в пункты
//
function TEXT_TO_POINTS ( txt ) 
{
	var d = txt.toLowerCase();
	var k = 1.;
	if( ACTIVE_UNITS == 'pt' ) k = 1.; 
	if( ACTIVE_UNITS == 'in' ) k = 72.; 
	if( ACTIVE_UNITS == 'mm' ) k = (72./25.4); 
	if( ACTIVE_UNITS == 'cm' ) k = ((72./25.4)*10.);
	if( ACTIVE_UNITS == 'px' ) k = 1.;
	d = parseFloat( txt ) * k;
	// если не цифра, обнуляем
	 if( isNaN(d) ) 
	 {
		 d = 0.;
		 exit_if_bad_input = true;
		 return;
	};// if
	// возвращаем значение в пунктах для расчета
	return d;
};// end TEXT_TO_POINTS
// подпрограмма определения границ того что не в масках
// возвращает массив границ
// в ней еще есть подпрограмма создания массивов границ того что не в масках
function NO_CLIP_BOUNDS (the_obj) 
{
	// определяем массив объектов вне масок
	// получаем массив объектов вне масок
	GET_NO_CLIP_OBJECTS_AND_MASKS ( the_obj );
	// определяем массивы границ объектов вне масок
	var v_left =  new Array();
	var g_left = new Array();
	var v_top =  new Array();
	var g_top = new Array();
	var v_right =  new Array();
	var g_right = new Array();
	var v_bottom =  new Array();
	var g_bottom = new Array();
	// заполняем массивы границ объектов вне масок
	for (var i=0; i < NO_CLIP_OBJECTS_AND_MASKS.length; i++) 
	{
		g_left[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[0];
		v_left[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[0];
		g_top[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[1];
		v_top[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[1];
		g_right[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[2];
		v_right[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[2];
		g_bottom[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[3];
		v_bottom[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[3];
	};// for
	// вычисляем результирующие границы объектов вне масок
	var v_L = MIN_IN_ARRAY ( v_left );
	var g_L = MIN_IN_ARRAY ( g_left );
	var v_T = MAX_IN_ARRAY ( v_top );
	var g_T = MAX_IN_ARRAY ( g_top );
	var v_R = MAX_IN_ARRAY ( v_right );
	var g_R = MAX_IN_ARRAY ( g_right );
	var v_B = MIN_IN_ARRAY ( v_bottom );
	var g_B = MIN_IN_ARRAY ( g_bottom );
	return [g_L, g_T, g_R, g_B, v_L, v_T, v_R, v_B];
	//
	// подпрограмма занесения в массив объектов вне маски
	// (вложена в подпрограмму NO_CLIP_BOUNDS)
	function GET_NO_CLIP_OBJECTS_AND_MASKS ( the_obj ) 
	{
		// если объект клип. маска
		if (IS_CLIP (the_obj)) 
		{
			// заносим в массив только сам контур клип. маски  и сразу возвращаемся!!!!
			// в этом ВСЯ фишка!!!!
			NO_CLIP_OBJECTS_AND_MASKS.push(the_obj.pathItems[0]);
			return;
		}// if
		// если группа, то просматриваем элементы группы
		if( the_obj.constructor.name == "GroupItem" ) 
		{
			try 
			{
				// определяем под-объекты в группе
				var N_sub_obj =  the_obj.pageItems.length;
				for (var i=0; i < N_sub_obj; i++) {
					GET_NO_CLIP_OBJECTS_AND_MASKS ( the_obj.pageItems[i] );
				}// for
			} catch (error) {}
			// если группа, то возврат здесь, чтобы не занести саму группу в массив
			return;
		}// if
		// заносим в массив объект 
		NO_CLIP_OBJECTS_AND_MASKS.push(the_obj);
		return;
	}// end GET_NO_CLIP_OBJECTS_AND_MASKS
}// end NO_CLIP_BOUNDS
//
// подпрограмма определения макс. значения в массиве
function MAX_IN_ARRAY ( the_array) 
{
	var MAX =  the_array[0];
	for ( var i = 0; i < the_array.length; i++ ) 
	{
		if(  the_array[i] > MAX ) MAX =  the_array[i];
	}
	return MAX;
}// end  MAX_IN_ARRAY
//
// подпрограмма определения мин. значения в массиве
function MIN_IN_ARRAY ( the_array) 
{
	var MIN =  the_array[0];
	for ( var i = 0; i < the_array.length; i++ ) 
	{
		if(  the_array[i] < MIN ) MIN =  the_array[i];
	}
	return MIN;
}// end MIN_IN_ARRAY
//
// подпрограмма получения границ по выделению
function OBJ_BOUNDS ( the_obj ) 
{
	try 
	{
		var g_L =  the_obj.geometricBounds[0];
		var v_L =  the_obj.visibleBounds[0];
		var g_T =  the_obj.geometricBounds[1];
		var v_T =  the_obj.visibleBounds[1];
		var g_R =  the_obj.geometricBounds[2];
		var v_R =  the_obj.visibleBounds[2];
		var g_B =  the_obj.geometricBounds[3];
		var v_B =  the_obj.visibleBounds[3];
	} 
	catch ( error ) 
	{
		exit_if_error = true;
		return;
	};
	return [g_L, g_T, g_R, g_B,   v_L, v_T, v_R, v_B];
}// end OBJ_BOUNDS
//
// подпрограмма определения является ли объект клип. группой
function IS_CLIP ( the_obj ) 
{
	try 
	{
		if (the_obj.constructor.name == "GroupItem" ) 
		{
			if( the_obj.clipped ) 
			{
				return true;
			};// if
		};// if
	} catch (error) {};
	return false;
}// end  IS_CLIP
//
// подпрограмма получения числа из текстового ввода
function GET_NUMBER( the_text ) 
{
	var t = "";
	var t_i;
	for(var i=0; i < the_text.length; i++) 
	{
		t_i = the_text[i];
		if( t_i == "," ) t_i = ".";
		t = t + t_i;
	};// for
	t = parseFloat( t );
	if( isNaN(parseFloat(t) ) ) 
	{
		exit_if_bad_input = true;
		return;
	};// if
	return t;
};// end GET_NUMBER
//
// продпрограмма определения является ли объект направляющей
function IS_GUIDE ( the_obj ) 
{
	try {
		if (the_obj.guides)  
		{
			exit_if_guide = true;
			return true;
		};// if
	} catch (error) {};
	return false;
};// end  IS_GUIDE
//
// подпрограмма определения выделен ли объект в клипгруппе
function SELECTED_IN_CLIP( the_obj ) 
{
	try 
	{
		var the_parent = the_obj.parent;
		if( IS_CLIP ( the_parent ) && the_obj != the_parent.pathItems[0] ) 
		{
			return true;
		};// for
	} catch( error ) {};
	return false;
};// end SELECTED_IN_CLIP
//
// подпрограмма определения выделена ли сама по себе клипмаска
function MASK_ONLY_SELECTED( the_obj ) 
{
	try 
	{
		var the_parent = the_obj.parent;
		if( IS_CLIP ( the_parent ) && the_obj == the_parent.pathItems[0] ) 
		{
			for( var i=0; i < the_parent.pageItems.length; i++ ) 
			{
				if( the_parent.pageItems[i].selected ) return false;
			};// for
			return true;
		};// if
	} catch( error ) {};
	return false;
};// end MASK_ONLY_SELECTED
//
// подпрограмма проверки выделен ли объект
// в группе белой стрелкой
function SELECTED_IN_GROUP( the_obj ) 
{
	try 
	{
		var the_parent = the_obj.parent;
		if( the_parent.constructor.name == "GroupItem" ) return true;
	} catch ( error ) { };
	return false;
};// end SELECTED_IN_GROUP