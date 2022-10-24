/*
Название: MakeRectangleAI.jsx
Приложение для использования: Adobe Illustrator CS3, CS4, CS5
Версия: 1.2
Язык реализации (Среда): JavaScript (ExtendScript Toolkit 2)
Операционные системы (Платформы): PC, Macintosh (Windows, Mac OS)
Условия распространения: Бесплатно; На Ваш риск
Назначение: Создает прямоугольник по размерам указанных объектов (артборд или выделение)
Функциональные ограничения: Не работает с выделенными направляющими
Техническая поддержка: Sergey-Anosov@yandex.ru
https://sites.google.com/site/dtpscripting
===================================================
Name: MakeRectangleAI.jsx
Application to use with: Adobe Illustrator CS3, CS4, CS5
Version: 1.2
Program language (Environment): JavaScript (ExtendScript Toolkit 2)
Operating systems (Platforms): PC, Macintosh (Windows, Mac OS)
Distribution conditions: Freeware; At your own risk
Functions: Makes rectangle around chosen objects (artboard or selection)
Functional limitations: Can not process selected guides
Technical support: Sergey-Anosov@yandex.ru
https://sites.google.com/site/dtpscripting
*/
var the_title = "Make Rectangle AI-Chlo汉化";
var the_version = "1.2";
// активный документ
var AD;
// выделение 
var the_sel;
//  возможные смещения начала координат
var PAGE_DX = 0., PAGE_DY = 0.;
// видимость и блокировка слоев
var AD_layers_vis = new Array();
var AD_layers_lock = new Array();
// границы
var GBN=true, VBN=false;
// сдвиги 
var ST, SL, SB, SR;
// подсказки для сдвигов
var DIAL_LEFT, DIAL_RIGHT, DIAL_TOP, DIAL_BOTTOM;
// симетричные сдвиги
var SYM_SHIFT_CB, SYM_SHIFT = false;
// флаги событий
var ACT = false;
var INP_OK = true;
// флаги выхода
var exit_if_bad_sel = false;
var exit_if_error = false;
var exit_if_bad_input = false;
// единицы измерения всего документа
var ACTIVE_UNITS = "mm";
// объекты для построения
var OBJ_TO_MAKE
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
// границы без учета клипмасок (все вместе)
//левые границы выделения объектов
var v_sel_left = new Array();
var g_sel_left = new Array();
//правые границы выделения объектов
var v_sel_right = new Array();
var g_sel_right = new Array();
//верхние границы выделения объектов
var v_sel_top = new Array();
var g_sel_top = new Array();
// нижние границы выделения объектов
var v_sel_bottom = new Array();
var g_sel_bottom = new Array();
// для границ объектов c учетом клип. масок
//левые границы выделения объектов
var NC_v_left = new Array();
var NC_g_left = new Array();
//верхние границы выделения объектов
var NC_v_top = new Array();
var NC_g_top = new Array();
//правые границы выделения объектов
var NC_v_right = new Array();
var NC_g_right = new Array();
// нижние границы выделения объектов
var NC_v_bottom = new Array();
var NC_g_bottom = new Array();
// наличие клип. масок влияющих на выделение
var CLIP = false;
var CLIP_CB;
// делать с учетом клип. масок
var MAKE_BY_CLIP = false;
// кол-во объектов в выделении
var sel_len = 0; 
//  кол-во док-тов в иллюстраторе
var N_doc = 0; 
// основной диалог
var dlg;
//  массив объектов для отображения
var NO_CLIP_OBJECTS_AND_MASKS = new Array();
//  массив объектов для отображения с учетом клипмаски
var OBJ_NO_CLIP_TO_SHOW = new Array();
// размеры для отображения
var SEL_H=0, SEL_W=0, REC_H=0, REC_W=0;
// число десятичных знаков на выводе диалога
var AFTER_DOT = 3;
// границы (геометрические или визуальные)
var BOUNDS_TO_MAKE;
// габариты документа
var AB_H, AB_W;
// списки для заливки и обводки
var FILL_TO_MAKE, STROKE_TO_MAKE;
// выделять прямоугольник после создания
var SEL_AFT_CB;
// толщина обводки
var SW_ED, SW_UNITS;
// слой для нового прямоугольника
var LAYER_TO_MAKE = 0;
var LAYER_SEL_TOP, LAYER_SEL_BOTTOM;
var LAYER_SEL_TOP_N=0, LAYER_SEL_BOTTOM_N=0;
// открывался ли слой
var LAYER_TO_MAKE_WAS_OPENED = false;
// позиция после создания
var POS_TO_MAKE;
// окно диалога для ожидания
var WAIT_WINDOW;
//  панель для толщины
var SW_G;
//
// вызов основного модуля
main();
//
// блок подпрограмм
//
// основной модуль
function main()
{
	if( CHECK_SELECTION() )
	{
		SAVE_SETTINGS();
		DIMENSIONS();
		DIALOG();
		RESTORE_SETTINGS();
	};// if
	return;
};// end main
//
// подпрограмма создания диалога
function DIALOG() 
{
	var mp_left = 8;
	var mp_top = 7;
	var mp_right = 280;
	var mp_bottom = 90;
	dlg = new Window('dialog');
	dlg.text = the_title+" v."+the_version;
	//
	// начальные присвоения для отображения
	// выделение
	SEL_H = GV;
	SEL_W = GH;
	// прямоугольник
	REC_H = SEL_H;
	REC_W = SEL_W;
	// артборд (документ)
	AB_W = AD.width;
	AB_H = AD.height;
	// создание панели чекбоксов для выбора вариантов по направлению
	// для создания создания направляющих
	dlg.mainpanel = dlg.add('panel');
	dlg.mainpanel.bounds = [mp_left, mp_top, mp_right, mp_bottom];
	//
	function OBJ_XY(obj_type, x, y, h, w, obj_text, obj_val) 
	{
		var the_obj = dlg.mainpanel.add(obj_type);
		the_obj.bounds = [x, y, x+w, y+h];
		the_obj.text = obj_text;
		the_obj.value = obj_val;
		return the_obj;
	};// end OBJ_XY
	//
	// колонка 1
	var col_1_h = 25;
	var col_1_w = 90;
	var col_1_dy = 25;
	var col_1_x0 = mp_left+5;
	var col_1_y0 = mp_top;
	var txt = OBJ_XY('statictext', col_1_x0, col_1_y0, col_1_h, 30, '单位:', false);
	var txt = OBJ_XY('statictext', col_1_x0, col_1_y0+col_1_dy, col_1_h, col_1_w-10, '对象(s) 尺寸:', false);
	var txt = OBJ_XY('statictext', col_1_x0, col_1_y0+col_1_dy*2, col_1_h, col_1_w-10, '矩形 尺寸:', false);
	var UNITS_DROP = OBJ_XY('dropdownlist', col_1_x0+35, col_1_y0-2, 15, 52,  "", false);
	UNITS_DROP.add('item',"mm"); 
	UNITS_DROP.add('item',"cm"); 
	UNITS_DROP.add('item',"pt"); 
	UNITS_DROP.add('item',"in"); 
	UNITS_DROP.selection = GET_INIT_UNITS()[1];
	ACTIVE_UNITS = GET_INIT_UNITS()[0];
	UNITS_DROP.onChange = REFRESH_DIALOG;
	// колонка 2 (радиокнопки были :)
	var col_2_x0 = col_1_x0 + col_1_w + 3;
	var col_2_y0 = col_1_y0 + 8;
	var col_2_h = 25;
	var col_2_w = 20;
	var col_2_dy = 20;
	//колонка 3 height
	var col_3_h = col_2_h;
	var col_3_w = 80;
	var col_3_dy = 20;
	var col_3_x0 = col_2_x0+col_2_w - 5;
	var col_3_y0 = col_1_y0;
	var sel_h_g = GB - GT;
	var sel_h_v = VB - VT;
	var txt = OBJ_XY('statictext', col_3_x0, col_3_y0, col_3_h, 50, ('Height'), false);
	// выводим высоту выделения
	SEL_H_DIAL = OBJ_XY('statictext', col_3_x0, col_3_y0+col_3_dy+5, 20, 65, SHOW_IN_DIAL(SEL_H), false);
	// выводим высоту прямоугольника
	REC_H_DIAL = OBJ_XY('statictext', col_3_x0, col_3_y0+col_3_dy*2+10, 20, 65, SHOW_IN_DIAL(REC_H), false);
	// колонка 4
	var col_4_h = col_3_h;
	var col_4_w = col_3_w;
	var col_4_dy = col_3_dy;
	var col_4_x0 = col_3_x0+col_3_w - 10;
	var col_4_y0 = col_3_y0;
	var sel_w_g = 0;
	var sel_w_v = 0;
	var txt = OBJ_XY('statictext', col_4_x0, col_4_y0, col_4_h, col_4_w, ('Width'), false);
	// выводим ширину выделения
	SEL_W_DIAL = OBJ_XY('statictext', col_4_x0, col_4_y0+col_4_dy+5, 20, col_4_w, SHOW_IN_DIAL(SEL_W), false);
	// выводим ширину прямоугольника
	REC_W_DIAL = OBJ_XY('statictext', col_4_x0, col_4_y0+col_4_dy*2+10, 20, col_3_w, SHOW_IN_DIAL(REC_W), false);
	//
	// подпрограмма создания списка
	function OB_B_U_DROP(where, the_name, arr)
	{
		var g = where.add('group');
		g.orientation = 'row';
		var t = g.add('statictext');
		t.text = the_name;
		var d = g.add('dropdownlist');
		d.maximumSize.width = 70;
		for(var i=0; i<arr.length; i++) var it = d.add('item', arr[i]);
		d.selection = 0;
		d.onChange = REFRESH_DIALOG;
		return d;
	};// end OB_B_U_DROP
	//
	// запрос на выделение прямоугольника после
	var SEL_AFT_CLIP_GROUP = dlg.add('group');
	SEL_AFT_CLIP_GROUP.alignChildren = 'left';
	SEL_AFT_CLIP_GROUP.orientation = 'column';
	SEL_AFT_CB = SEL_AFT_CLIP_GROUP.add('checkbox');
	SEL_AFT_CB.text = "选择新的-绘制矩形后";
	// вывод учета клипмаски
	if(CLIP)
	{
		CLIP_CB = SEL_AFT_CLIP_GROUP.add('checkbox');
		CLIP_CB.text = "Consider clipping mask";
		CLIP_CB.onClick = REFRESH_DIALOG;
		CLIP_CB.value = true;
	};// if
	var the_line =  SEL_AFT_CLIP_GROUP.add('panel'); the_line.bounds = [mp_left, undefined, mp_right, undefined];
	// 
	// группа для выбора объектов, границ
	var OB_B_U = dlg.add('group');
	OB_B_U.orientation = 'row';
	OB_B_U.alignChildren = 'center';
	//
	// список для выбора объектов
	// если ничего не выделено
	if( sel_len == 0 ) 
	{
		OBJ_TO_MAKE = OB_B_U_DROP(OB_B_U, "对象:", ["画板"] );
	}
	// если есть выделение
	else
	{
		OBJ_TO_MAKE = OB_B_U_DROP(OB_B_U, "对象:", ["画板", "选择"] );
		OBJ_TO_MAKE.selection = 1;
	};// if-else
	//
	// список для выбора границ
	if( sel_len > 0 )
	{
		BOUNDS_TO_MAKE = OB_B_U_DROP(OB_B_U, "界限:", ["几何", "可见"]);
		GBN = true;
	};// if
	//
	// группа для выбора слоя и позиции
	var L_P_G = dlg.add('group');
	// выбор слоя для прямоугольника
	if( AD.layers.length > 1 )
	{
		var LAYERS_LIST = new Array();
		var LAYER_SEL
		if( sel_len > 0 )
		{
			LAYER_SEL_TOP = the_sel[0].layer;
			LAYER_SEL_BOTTOM = the_sel[sel_len-1].layer;
		};// if
		for( var i=0; i < AD.layers.length; i++ )
		{
			LAYERS_LIST[i] = AD.layers[i].name;
			// номер активного слоя
			if( AD.layers[i] == AL ) LAYER_SEL = i;
			if( sel_len > 0 ) 
			{
				// номер слоя самого верхнего выделенного объекта
				if( AD.layers[i] == LAYER_SEL_TOP ) LAYER_SEL_TOP_N = i;
				// номер слоя самого нижнего выделенного объекта
				if( AD.layers[i] == LAYER_SEL_BOTTOM ) LAYER_SEL_BOTTOM_N = i;
			};// if
		};// for
		LAYER_TO_MAKE = OB_B_U_DROP(L_P_G, "Layer:", LAYERS_LIST);
		LAYER_TO_MAKE.selection = LAYER_SEL;
		LAYER_TO_MAKE.onChange = LAYER_TO_MAKE_ON_CHANGE;
		//
		function LAYER_TO_MAKE_ON_CHANGE()
		{
			// если "Above selection"
			if( POS_TO_MAKE.selection.index == 2 ) 
			if( LAYER_TO_MAKE.selection.index != LAYER_SEL_TOP_N ) POS_TO_MAKE.selection = 0;
			//  если"Under selection"
			if( POS_TO_MAKE.selection.index == 3 )
			if( LAYER_TO_MAKE.selection.index != LAYER_SEL_BOTTOM_N ) POS_TO_MAKE.selection = 0;
			return;
		};// end LAYER_TO_MAKE_ON_CHANGE
	};// if
	// выбор позиции после создания
	var FM_SL = "最前面的" , BM_SL = "最后面的", ON_SL = " 在选择的图层", IN_DOC = " 在文档";
	if( AD.layers.length > 1 ) { FM_SL = FM_SL + ON_SL; BM_SL = BM_SL + ON_SL }; 
	if( AD.layers.length == 1 ) { FM_SL = FM_SL + IN_DOC; BM_SL = BM_SL + IN_DOC }; 
	if( sel_len == 0 ) POS_TO_MAKE = OB_B_U_DROP(L_P_G, "位置:", [FM_SL, BM_SL])
	else POS_TO_MAKE = OB_B_U_DROP(L_P_G, "位置:", [FM_SL, BM_SL, "上面选择", "下面的选择"]);
	POS_TO_MAKE.onChange = POS_TO_MAKE_ON_CHANGE;
	function POS_TO_MAKE_ON_CHANGE()
	{
		// если слоев больше 1
		if( AD.layers.length > 1 )
		{
			// если "Above selection"
			if( POS_TO_MAKE.selection.index == 2) LAYER_TO_MAKE.selection = LAYER_SEL_TOP_N;
			// если "Under selection"
			if( POS_TO_MAKE.selection.index == 3) LAYER_TO_MAKE.selection = LAYER_SEL_BOTTOM_N;
		};// if
		return;
	};// end POS_TO_MAKE_ON_CHANGE
	//
	var the_line = dlg.add('panel'); the_line.bounds = [mp_left, undefined, mp_right, undefined];
	// группа для выбора цвета заливки и обводки
	var F_S_G = dlg.add('group');
	F_S_G.orientation = 'row';
	F_S_G.alignChildren = 'center';
	// создаем массив свотчей
	var SWATCHES = new Array();
	for(var i=0; i < AD.swatches.length; i++) 
	{
		SWATCHES[i] = AD.swatches[i].name;
		if( SWATCHES[i] == "[None]" ) SWATCHES[i] = "None";
		if( SWATCHES[i] == "[Registration]" ) SWATCHES[i] = "Registration";
	};// for i
	//
	// список для выбора заливки
	FILL_TO_MAKE = OB_B_U_DROP(F_S_G, "填充：文档", SWATCHES);
	//
	// список для выбора обводки
	STROKE_TO_MAKE = OB_B_U_DROP(F_S_G, "描边", SWATCHES);
	STROKE_TO_MAKE.onChange = STR_ON_CHANGE;
	// группа для толщины и обводки
	var S_W_U_G = dlg.add('group');
	S_W_U_G.enabled = false;
	S_W_U_G.orientation = 'row';
	S_W_U_G.alignChildren = 'center';
	// группа для толщины
	SW_G = S_W_U_G.add('group');
	SW_G.orientation = 'row';
	SW_G.alignChildren = 'left';
	var SW_TEXT = SW_G.add('statictext');
	SW_TEXT.text = "粗细:";
	// ввод толщины обводки
	SW_ED = SW_G.add('edittext');
	SW_ED.preferredSize.width = 55;
	SW_ED.text = "N/A";
	SW_ED.onChanging = SW_ON_CHANGING;
	SW_ED.onChange = SW_ON_CHANGE;
	//
	// вкл/выкл активности толщины обводки
	// в зависимости от выбора обводки вообще
	function STR_ON_CHANGE()
	{
		// если нет обводки вообще
		if(STROKE_TO_MAKE.selection.index == 0) 
		{
			SW_ED.text = "N/A";
			DROP_ACTIVE( SW_UNITS, false );
			S_W_U_G.enabled = false;
			SW_G.enabled = false;
		}
		// если обводка какая-то 
		else 
		{
			if( !S_W_U_G.enabled ) SW_ED.text = "1";
			S_W_U_G.enabled = true;
			DROP_ACTIVE( SW_UNITS, true );
			SW_UNITS.selection = 2;
			SW_G.enabled = true;
		};// if-else
		return;
	};// end STR_ON_CHANGE
	//
	// ввод толщины обводки
	function SW_ON_CHANGING()
	{
		var t=SW_ED.text;
		GET_NUMBER_ON_INPUT( t )
		if( INP_OK == false ) 
		{
			SW_ED.active = true;
			SW_ED.text = "0";
			INP_OK == true;
		};// if
		if( t=="") SW_ED.text = "0";
		if( (T2D( t ) < 0) ||  t == "-" ) 
		{
			alert("Bad stroke weight!");
			SW_ED.text = "0";
			SW_ED.active = true;
		};// if
		return;
	};// end SW_ON_CHANGING
	//
	function SW_ON_CHANGE()
	{
		CHECK_ZERO_TEXT( SW_ED );
		var t = SW_ED.text
		var d = T2D( t );
		if(  t=="" ) 
		{
			SW_ED.text = "0";
		};// if
		return;
	};// end SW_ON_CHANGE
	//
	function CHECK_ZERO_TEXT( the_obj ) 
	{
		var txt = the_obj.text;
		var txt_0 = txt[0];
		var txt_1 = txt[1];
		if( txt_0 == ""  ||
			txt_0 == " "  ||
			txt_0 == "." ||
			txt_0 == "," ||
			( (txt_0 == "-" || txt_0 == "+") && NO_DIGIT_SYMBOL(txt_1) &&
				txt_1!="." && txt_1!="," ) || !INP_OK ) 
		{
			the_obj.text = "0";
			INP_OK = true;
		};// if
		return;
	};// end TEXT_TO_ZERO
	//
	// выбор единиц для обводки
	SW_UNITS = OB_B_U_DROP(SW_G, "单位:", ["mm", "cm", "pt", "in"]);
	DROP_ACTIVE( SW_UNITS, false );
	SW_G.enabled = false;
	// панель для ввода отступов
	var S_pan = dlg.add('panel');
	function S_XY(x, y, h, w, obj_val) 
	{
		var the_obj = S_pan.add('edittext');
		the_obj.bounds = [x, y, x+w, y+h];
		the_obj.text = obj_val;
		the_obj.onChanging = SHIFT_ON_CHANGING_LOCAL;
		the_obj.onChange = SHIFT_ON_CHANGE;
		//
		function SHIFT_ON_CHANGE()
		{
			CHECK_ZERO_TEXT( the_obj );
			if( SYM_SHIFT) 
			{ 
				var SHIFTS = [ SL, ST, SB, SR ];
				for( var i=0; i < SHIFTS.length; i++ ) 
				{
					SHIFTS[i].text = the_obj.text;
				};// for
			};// if
			return;
		};// end SHIFT_ON_CHANGE
		//
		function SHIFT_ON_CHANGING_LOCAL() 
		{
			var txt = the_obj.text
			GET_NUMBER_ON_INPUT( txt );
			if( INP_OK == false || txt =="" ) 
			{ 
				the_obj.active = true;
				the_obj.text = "0";
			};// if
			INP_OK = true;
			SHIFT_ON_CHANGING();
			return;
		};// end SHIFT_ON_CHANGING_LOCAL
		//
		return the_obj;
	};// end S_XY
	function SHIFT_ON_CHANGING() 
	{
		var SHIFTS = [ SL, ST, SB, SR ];
		// если симметричные сдвиги
		if( SYM_SHIFT) 
		{
			var ACT = false;
			for( var i=0; i < SHIFTS.length; i++ ) 
			{
				if(SHIFTS[i].active) 
				{
					ACT = true;
					var txt = SHIFTS[i].text;
					if( txt == "" ) txt = "0";
					for( var j=0; j < SHIFTS.length; j++ ) 
					{
						if( SHIFTS[i] == SHIFTS[j] ) continue;
						SHIFTS[j].text = txt;
					};// for j
				};// if
			};// for i
			// если нет активных полей ввода
			if(!ACT) 
			{
				for( var i=0; i < SHIFTS.length; i++ ) 
				{
					 SHIFTS[i].text = "0";
				};// for i
			};// if 
		};// if
		//обновляем размеры прямоугольника в диалоге
		REC_DIM_SHOW();
		return;
	};// end SHIFT_ON_CHANGING
	//
	// подпрограмма вывода размеров прямоугольника
	function REC_DIM_SHOW()
	{
		REC_H_DIAL.text = (TEXT_TO_DIGIT(SEL_H+"") + T2D(ST.text) + T2D(SB.text)).toFixed(AFTER_DOT)+"";
		REC_W_DIAL.text = (TEXT_TO_DIGIT(SEL_W+"") + T2D(SR.text) + T2D(SL.text)).toFixed(AFTER_DOT)+"";
		return;		
	};// end REC_DIM_SHOW
	//
	function S_XY_TEXT(x, y, h, w, txt) 
	{
		var the_obj = S_pan.add('statictext');
		the_obj.bounds = [x, y, x+w, y+h];
		the_obj.text = txt;
		return the_obj;
	};// end S_XY_TEXT
	//
	var dy_left_right = 20;
	var dx_left_right = 40;
	var p_m_w = 10;
	var p_m_h = 15;
	//
	function S_XY_LEFT(x, y, h, w, obj_val_left) 
	{
		S_XY_TEXT(x, y-dy_left_right, p_m_h, p_m_w, "+");
		S_XY_TEXT(x+dx_left_right, y-dy_left_right, p_m_h, p_m_w, "-");
		var the_obj = S_XY(x, y, h, w, obj_val_left);
		return the_obj;
	};// end S_XY_LEFT
	//
	function S_XY_RIGHT(x, y, h, w, obj_val_right) 
	{
		S_XY_TEXT(x, y-dy_left_right, p_m_h, p_m_w, "-");
		S_XY_TEXT(x+dx_left_right, y-dy_left_right, p_m_h, p_m_w, "+");
		var the_obj = S_XY(x, y, h, w, obj_val_right);
		return the_obj;
	};// end end S_XY_RIGHT
	//
	var dy_top_bottom = 8;
	var dx_top_bottom = 15;
	//
	function S_XY_TOP(x, y, h, w, obj_val_top) 
	{
		S_XY_TEXT(x-dx_top_bottom, y-dy_top_bottom, p_m_h, p_m_w, "+");
		S_XY_TEXT(x-dx_top_bottom, y+h-dy_top_bottom, p_m_h, p_m_w, "-");
		var the_obj = S_XY(x, y, h, w, obj_val_top);
		return the_obj;
	};// end end S_XY_TOP
	//
	function S_XY_BOTTOM(x, y, h, w, obj_val_bottom) 
	{
		S_XY_TEXT(x-dx_top_bottom, y-dy_top_bottom, p_m_h, p_m_w, "-");
		S_XY_TEXT(x-dx_top_bottom, y+h-dy_top_bottom, p_m_h, p_m_w, "+");
		var the_obj = S_XY(x, y, h, w, obj_val_bottom);
		return the_obj;
	};// end end S_XY_BOTTOM
	//
	var s_left = 8;
	var s_top = 20;
	var s_right = 280;
	var s_bottom = 165;
	S_pan .bounds = [s_left, s_top, s_right, s_bottom];
	var s_x0 = 10;//20
	var s_y0 = 10;
	var left_right_y = 60;
	var top_y = s_y0-5;
	var bottom_y = 95;
	var s_w = 50;
	var s_w_text = 90;
	var s_h = 20;
	// заголовок
	var symm_txt = S_XY_TEXT(s_x0, top_y, s_h,  s_w_text, ("位移:") );
	// left
	var left_x = s_x0+2;
	SL = S_XY_LEFT(left_x, left_right_y, s_h, s_w, "0")
	DIAL_LEFT = S_XY_TEXT(left_x, left_right_y+s_h+5, s_h,  60, ("Left ["+ ACTIVE_UNITS+"]") );
	// right
	var right_x = left_x + 195;
	SR = S_XY_RIGHT(right_x, left_right_y, s_h, s_w, "0")
	DIAL_RIGHT = S_XY_TEXT(right_x, left_right_y+s_h+5, s_h,  s_w_text, ("Right ["+ ACTIVE_UNITS+"]") );
	var top_bottom_x = left_x+100;
	// top
	DIAL_TOP = S_XY_TEXT(top_bottom_x, top_y, s_h,  s_w_text, ("Top ["+ ACTIVE_UNITS+"]") );
	ST = S_XY_TOP(top_bottom_x, top_y +s_h+5, s_h,  s_w, "0")
	// bottom
	SB = S_XY_BOTTOM(top_bottom_x, bottom_y, s_h, s_w, "0")	
	DIAL_BOTTOM = S_XY_TEXT(top_bottom_x, bottom_y+s_h+5, s_h,  s_w_text, ("Bottom ["+ ACTIVE_UNITS+"]") );
	// симметричные отступы
	SYM_SHIFT_CB = S_pan.add('checkbox');
	SYM_SHIFT_CB.text = "相等的";
	SYM_SHIFT_CB.bounds = [left_x, 103, 90, 150];
	SYM_SHIFT_CB.onClick = SYM_ON_CLICK;
	//clear shifts
	var CSH_left = top_bottom_x-25;
	var CSH_right = CSH_left + 100;
	var CSH_top = left_right_y;
	var CSH_bottom = left_right_y +22;
	var CLEAR_SIFTS = S_pan.add('button')
	CLEAR_SIFTS.bounds = [CSH_left, CSH_top, CSH_right, CSH_bottom];
	CLEAR_SIFTS.text = "复原";
	CLEAR_SIFTS.onClick = CLEAR_SIFTS_ON_CLICK;
	function CLEAR_SIFTS_ON_CLICK() 
	{
		ST.text = SB.text = SR.text = SL.text = "0";
		REC_H = SEL_H;
		REC_W = SEL_W;
		REC_DIM_SHOW();
		return;
	};// end CLEAR_SIFTS_ON_CLICK
	//
	// подпрограмма для обновления диалога
	function REFRESH_DIALOG() 
	{
		ACTIVE_UNITS = GET_ACTIVE_UNITS(UNITS_DROP.selection);
		// обновляем подсказки единиц для смещений
		DIAL_LEFT.text = "Left ["+ACTIVE_UNITS+"]";
		DIAL_RIGHT.text = "Right ["+ACTIVE_UNITS+"]";
		DIAL_TOP.text = "Top ["+ACTIVE_UNITS+"]";
		DIAL_BOTTOM.text = "Bottom ["+ACTIVE_UNITS+"]";
		if( CLIP && CLIP_CB.enabled) MAKE_BY_CLIP = CLIP_CB.value;
		// если выбран артборд
		if( OBJ_TO_MAKE.selection.index == 0) 
		{
			SEL_W = AB_W; SEL_H = AB_H;
			if( sel_len > 0 ) 
			{
				if( BOUNDS_TO_MAKE.selection.text != "N/A" ) 
				if( BOUNDS_TO_MAKE.enabled ) DROP_ACTIVE( BOUNDS_TO_MAKE, false );
				if( CLIP ) 
				{
					CLIP_CB.value = CLIP_CB.enabled = false; 
				};// if
			};// if
		};// if
		// если есть выделенные объекты и не выбран артборд
		if( sel_len > 0 && OBJ_TO_MAKE.selection.index != 0) 
		{
			if( BOUNDS_TO_MAKE.selection.text != "Geometric"  && BOUNDS_TO_MAKE.selection.text != "Visible") 
			if( !BOUNDS_TO_MAKE.enabled ) DROP_ACTIVE( BOUNDS_TO_MAKE, true );
			if(BOUNDS_TO_MAKE.selection.index == 0) GBN = true else GBN = false;
			if( CLIP && !CLIP_CB.enabled )
			{
				CLIP_CB.enabled = true; 
				CLIP_CB.value = MAKE_BY_CLIP;
			};// if
			// если геометрические границы
			if( GBN == true )
			{ 
				// если по клипмаске
				if( MAKE_BY_CLIP ) { SEL_H = GV_NC; SEL_W = GH_NC }
				// если НЕ по клипмаске
				else { SEL_H = GV; SEL_W = GH };
			}
			// если визуальные границы
			else
			{
				// если по клипмаске
				if( MAKE_BY_CLIP ) { SEL_H = VV_NC; SEL_W = VH_NC }
				// если НЕ по клипмаске
				else { SEL_H = VV; SEL_W = VH };
			};// if-else
		};// if
		//
		// обновляем размеры выделения
		SEL_H_DIAL.text = SHOW_IN_DIAL( SEL_H );
		SEL_W_DIAL.text = SHOW_IN_DIAL( SEL_W );
		// обновляем размеры прямоугольника
		REC_DIM_SHOW();
		return;
	};// end REFRESH_DIALOG
	//
	// подпрограмма деактивации / активации списка
	function DROP_ACTIVE( the_drop, act ) 
	{
		var NA;
		// деактивация
		if( !act ) 
		{
			// выход если уже деактивирован
			if( !the_drop.enabled ) return;
			try 
			{
				NA = the_drop.add('item', "N/A");
				NA.selected = true;
				the_drop.enabled = false;
			} catch ( error ) {};
		} 
		else 
		{
		// активация
			try 
			{
				// выход если уже активирован
				if( the_drop.enabled ) return;
				the_drop.remove(  the_drop.items[the_drop.items.length-1]  );
				the_drop.enabled = true;
				the_drop.selection = 0;
			} catch ( error ) {};// try-catch
		};// if-else
		return;
	};// end DROP_ACTIVE
	//
	function SYM_ON_CLICK() 
	{
		SYM_SHIFT = SYM_SHIFT_CB.value;
		SHIFT_ON_CHANGING();
		return;
	};// end SYM_ON_CLICK
	//
	// создание панели кнопок (кнопка ОК, кнопка Cancel)
	var okPanel = dlg.add('group');
	okPanel.orientation = 'row';
	okPanel.alignChildren = 'center';
	okBtn = okPanel.add('button', undefined, 'OK');// кнопка ОК
	cancelBtn = okPanel.add('button',undefined, 'Cancel');// кнопка Cancel
	//
	// все построили теперь инициализируем диалог
	REFRESH_DIALOG();
	// закрвываем окно ожидания
	WAIT( "", false );
	// собственно показываем окно диалога
	var DIALOG_BUTTON = dlg.show();
	// если выбрана первая кнопка (ОК) выполняем построение напр.
	if (DIALOG_BUTTON == 1) 
	{
		// создание прямоугольника
		MAKE_RECT();
	} 
	else 
	{
		// выход из диалога
		return;
	};// if-else
	return;
};// end DIALOG	
//
// подпрограмма сохранения настроек документа
// перед выполнением
function SAVE_SETTINGS() 
{
	try 
	{ 
		for( var i=0; i < AD.layers.length; i++ ) 
		{
			AD_layers_vis[i] = AD.layers[i].visible;
			AD_layers_lock[i] = AD.layers[i].locked;
		};// for i
	} catch ( error ) { };// catch-try
	return;
};// end SAVE_SETTINGS
//
// подпрограмма восстановления настроек документа
// после выполнения
function RESTORE_SETTINGS() 
{
	for( var i=0; i < AD.layers.length; i++ ) 
	{
		if( AD.layers[i] == LAYER_TO_MAKE && LAYER_TO_MAKE_WAS_OPENED ) continue;
		AD.layers[i].visible =AD_layers_vis[i];
		AD.layers[i].locked = AD_layers_lock[i];
	};// for
	return;
};// end RESTORE_SETTINGS
//
// подпрограмма проверки выделения
function CHECK_SELECTION() 
{
	// выводим окно ожидания
	WAIT( "加载中。请稍等...", true );
	// есть ли открытые документы
	N_doc = app.documents.length;
	if (N_doc < 1 ) 
	{
		WAIT( "", false );
		alert( "请打开文档后运行!\n欢迎加入印前数据插件脚本群：143789703");
		return false;
	};// if
	// есть ли выделенные объекты
	AD = app.activeDocument;
	AL = AD.activeLayer;
	the_sel = AD.selection;
	sel_len = the_sel.length;
	// проверка есть ли направляющие
	if( GUIDES_IN_SELECTION() ) 
	{
		WAIT( "", false );
		alert("There are some selected guides!"+"\n"+"Can not process that!");
		return false;
	};// if
	// проверка на выделение белой стрелкой
	var WHITE_ARROW = false;
	for( var i=0; i < sel_len; i++ ) 
	{
		if( SELECTED_IN_GROUP(the_sel[i]) ) 
		{
			WHITE_ARROW = true;
		};// if
	};// for
	if( WHITE_ARROW ) 
	{
		if(!confirm("Likely White arrow (Direct selection tool) was used to select the object(s). \nBlack arrow (Selection tool) in this case is preferable.\nContinue anyway?")) 
		{
			WAIT( "", false );
			return false;
		};// if
	};// if
	if( TEXT_SEL() ) 
	{
		WAIT( "", false );
		alert("Can not process the selection!");
		return false;
	};// if
	return true;
};// end CHECK_SELECTION()
//
// подпрограмма проверки не является ли выделение текстовым
function TEXT_SEL()
{
	if( the_sel.typename == "TextRange" ) return true;
	try
	{
		for(var i=0; i < sel_len; i++)
		{
			try
			{
				var g = the_sel[i].geometricBounds;
				var v = the_sel[i].visibleBounds;
			}
			catch( error )
			{
				return true;
			};// try-catch
		};// for
	}
	catch( error )
	{
		return true;
	};// try-catch
	return false;
};// end TEXT_SEL
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
		} catch( error) {}
		return false;
	};// end GUIDES_INSIDE
	for( var i=0; i < the_sel.length; i++ )
	{
		if( GUIDES_INSIDE( the_sel[i] ) ) return true;
	};// for 
	return false;
};// end GUIDES_IN_SELECTION
//
//
// подпрограмма получения активных единиц
function GET_INIT_UNITS() 
{
	var u="mm", n=0;
	AFTER_DOT = 3;
	var AD_units = app.activeDocument.rulerUnits;
	if( AD_units == RulerUnits.Millimeters ) {u="mm"; n=0};
	if( AD_units == RulerUnits.Centimeters ) {u="cm"; n=1};
	if( AD_units == RulerUnits.Points ) {u="pt"; n=2};
	if( AD_units == RulerUnits.Inches ) {u="in"; n=3}; 
	if( u == "in" ) AFTER_DOT = 4;
	return [u, n];
};// end GET_INIT_UNITS
//
// перевод значения из меню в активные единицы
function GET_ACTIVE_UNITS( N ) 
{
	u = "??";
	AFTER_DOT = 3;
	if( N == 0 ) u = "mm";
	if( N == 1 ) u = "cm";
	if( N == 2 ) u = "pt";
	if( N == 3 ) u = "in";
	if( u == "in" ) AFTER_DOT = 4;
	return u;
};// GET_ACTIVE_UNITS
//
// подпрограмма получения числа из текстового ввода
// в процессе ввода
function GET_NUMBER_ON_INPUT( the_t ) 
{
	var t = "";
	var t_i;
	var N_C = 0;
	var N_P = 0;
	var N_M = 0;
	for(var i=0; i < the_t.length; i++) 
	{
		t_i = the_t[i];
		if( t_i == "," ) t_i = ".";
		if( t_i == "." ) N_C = N_C +1;
		if( t_i == "-" ) N_M = N_M +1;
		if( t_i == "+" ) N_P = N_P +1;
		if( ( (t_i != "-" &&  t_i != "+" &&  t_i != "." ) &&  NO_DIGIT_SYMBOL( t_i ) ) 
			|| N_C>1 || ((N_M+N_P) > 1) || ( (t_i == "-" || t_i == "+") && i != 0)
		  ) 
		{
			INP_OK = false;
			alert( "Bad number input" );
			return false;
		};// if
		t = t + t_i;
	};// for
	return t;
};// end GET_NUMBER_ON_INPUT
//
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
	return t;
};// end GET_NUMBER
// 
// подпрограмма проверки является ли символ цифрой
function NO_DIGIT_SYMBOL( s ) 
{
	try
	{
		if( s!= "0" && s!= "1" && s!= "2" && s!= "3" && s!= "4" && 
			s!= "5" && s!= "6" && s!= "7" && s!= "8" && s!= "9") return true;
	} catch( error ) {};
	return false;
};// end NO_DIGIT_SYMBOL
//
// подпрограмма определения границ того что не в масках
// возвращает массив границ
// в ней еще есть подпрограмма создания массивов границ того что не в масках
function NO_CLIP_BOUNDS (the_obj) 
{
	// определяем массив объектов вне масок
	var NO_CLIP_OBJECTS = new Array();
	// получаем массив объектов вне масок
	GET_NO_CLIP_OBJECTS ( the_obj );
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
	for (var i=0; i < NO_CLIP_OBJECTS.length; i++) 
	{
		g_left[i] = NO_CLIP_OBJECTS[i].geometricBounds[0];
		v_left[i] = NO_CLIP_OBJECTS[i].visibleBounds[0];
		g_top[i] = NO_CLIP_OBJECTS[i].geometricBounds[1];
		v_top[i] = NO_CLIP_OBJECTS[i].visibleBounds[1];
		g_right[i] = NO_CLIP_OBJECTS[i].geometricBounds[2];
		v_right[i] = NO_CLIP_OBJECTS[i].visibleBounds[2];
		g_bottom[i] = NO_CLIP_OBJECTS[i].geometricBounds[3];
		v_bottom[i] = NO_CLIP_OBJECTS[i].visibleBounds[3];
	}// for
	// вычисляем результирующие границы объектов вне масок
	var v_L = MIN_IN_ARRAY ( v_left );
	var g_L = MIN_IN_ARRAY ( g_left );
	var v_T = MAX_IN_ARRAY ( v_top );
	var g_T = MAX_IN_ARRAY ( g_top );
	var v_R = MAX_IN_ARRAY ( v_right );
	var g_R = MAX_IN_ARRAY ( g_right );
	var v_B = MIN_IN_ARRAY ( v_bottom );
	var g_B = MIN_IN_ARRAY ( g_bottom );
	//
	return [g_L, g_T, g_R, g_B, v_L, v_T, v_R, v_B];
	//
	// подпрограмма занесения в массив объектов вне маски
	// (вложена в подпрограмму NO_CLIP_BOUNDS)
	function GET_NO_CLIP_OBJECTS ( the_obj ) 
	{
		// если объект клип. маска
		if (IS_CLIP (the_obj)) 
		{
			// заносим в массив только сам контур клип. маски  и сразу возвращаемся!!!!
			// в этом ВСЯ фишка!!!!
			try 
			{
				NO_CLIP_OBJECTS.push(the_obj.pathItems[0]);
			} catch ( error ) {};
			return;
		}// if
		// если группа, то просматриваем элементы группы
		if( the_obj.constructor.name == "GroupItem" ) 
		{
			try 
			{
				// определяем под-объекты в группе
				var N_sub_obj =  the_obj.pageItems.length;
				for (var i=0; i < N_sub_obj; i++) 
				{
					GET_NO_CLIP_OBJECTS ( the_obj.pageItems[i] );
				}// for
			} catch (error) {}
			// если группа, то возврат здесь, чтобы не занести саму группу в массив
			return;
		}// if
		// заносим в массив объект 
		NO_CLIP_OBJECTS.push(the_obj);
		return;
	}// end GET_NO_CLIP_OBJECTS
}// end NO_CLIP_BOUNDS
//
// подпрограмма определения макс. значения в массиве
function MAX_IN_ARRAY ( the_array) 
{
	var MAX =  the_array[0];
	for ( var i = 0; i < the_array.length; i++ ) 
	{
		if(  the_array[i] > MAX ) MAX =  the_array[i];
	};// for
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
	};// for
	return MIN;
}// end MIN_IN_ARRAY
//
// подпрограмма получения границ по выделению
function SEL_BOUNDS ( the_obj ) 
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
		return false
	};// try-catch
	return [g_L, g_T, g_R, g_B,   v_L, v_T, v_R, v_B];
}// end SEL_BOUNDS
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
	};// try-catch
	return [g_L, g_T, g_R, g_B,   v_L, v_T, v_R, v_B];
}// end OBJ_BOUNDS
//
// подпрограмма вывода окна ожидания
function WAIT(msg, act)
{
	function W_ON_CLOSE()
	{
		WAIT_WINDOW.close();
		return;
	};// end W_ON_CLOSE
	//
	if( act )
	{
		WAIT_WINDOW = new Window('palette');
		WAIT_WINDOW.text = the_title +" is working";
		var txt = WAIT_WINDOW.add('statictext');
		txt.bounds = [0, 0, 180, 20];
		 txt.alignChildren = 'center';
		txt.text = msg;
		WAIT_WINDOW.onClose = W_ON_CLOSE;
		WAIT_WINDOW.show();
	}
	else
	{
		try 
		{
			WAIT_WINDOW.close();
		} 
		catch ( error ) {};// try-catch
	};// if-else
	return;
};// end WAIT
//
// подпрограмма вычисления размеров выделения
function DIMENSIONS() 
{
	var objects = the_sel;
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
// продпрограмма определения является ли объект направляющей
function IS_GUIDE ( the_obj ) 
{
	try 
	{
		if (the_obj.guides)  
		{
			return true;
		};// if
	} catch (error) {};
	return false;
}// end  IS_GUIDE
//
// функция чтения текстового ввода в активных единицах и перевода в пункты
function TEXT_TO_POINTS ( txt ) 
{
	var d = txt.toLowerCase();
	var k = 1.;
	if( ACTIVE_UNITS == 'pt' ) k = 1.; 
	if( ACTIVE_UNITS == 'in' ) k = 72.; 
	if( ACTIVE_UNITS == 'mm' ) k = (72./25.4); 
	if( ACTIVE_UNITS == 'cm' ) k = ((72./25.4)*10.);
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
}// end TEXT_TO_POINTS
//
// функция перевода пунктов в активные единицы
// для вывода в диалоге
function SHOW_IN_DIAL ( inp ) 
{
	var k = 1.;
	if( ACTIVE_UNITS == 'pt' ) k = 1.; 
	if( ACTIVE_UNITS == 'in' ) k = 1./72.; 
	if( ACTIVE_UNITS == 'mm' ) k = 1./(72./25.4); 
	if( ACTIVE_UNITS == 'cm' ) k = 1./((72./25.4)*10.);
	d = (parseFloat( inp ) * k).toFixed(AFTER_DOT)+"";
	return d;
}// end SHOW_IN_DIAL
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
}// end TEXT_TO_DIGIT
//
// подпрограмма перевода текста просто в цифру
function T2D( txt )
{
	var d = parseFloat( txt );
	if( isNaN(d) ) d = 0.;
	return d;
};// end T2D
//
// подпрограмма создания прямоугольника
function MAKE_RECT()
{
	WAIT( "Making rectangle. Please wait...", true );
	// z-order для опорного объекта и нового прямоугольника
	var z=0, z_rect=0;
	// подпрограмма получения zOrderPosition
	// для объекта
	function GET_Z_ORDER( the_obj, rect )
	{
		var the_layer = the_obj.layer;
		var N_OBJ = the_layer.pageItems.length;
		var pg_item;
		var z_selected = false;
		var z_rect_selected = false;
		for( var i = N_OBJ-1 ; i >=0; i-- )
		{
			try
			{
				pg_item = the_layer.pageItems[i];
				// проверка для опорного объекта
				if( ! z_selected )
				if( pg_item == the_obj ) 
				{
					z= N_OBJ - i; z_selected = true;
				};// if
				// проверка для нового прямоугольника
				if( ! z_rect_selected )
				if( pg_item == rect ) 
				{
					z_rect = N_OBJ - i; z_rect_selected = true;
				};// if
			} catch ( error ) {};// catch-error
			// выход если все получено
			if( z_selected && z_rect_selected ) return;
		};// for i
		return;
	};// end GET_Z_ORDER
	//
	// подпрограмма определения
	// находится ли выделенный объект в группе
	// на выходе дает внешнюю группу если истина
	function IN_GROUP( the_obj )
	{
		var obj = the_obj;
		var p_name = "", p, g, in_g = false;
		while( p_name != "Layer" )
		{
			p=obj.parent;
			p_name = p.typename;
			if( p_name == "GroupItem" )
			{
				g = p; in_g = true;
			};// if
			obj = p;
		};// while
		return [in_g, g];
	};// end IN_GROUP
	// определяем слой для построения (если слой всего 1)
	if( AD.layers.length == 1 ) LAYER_TO_MAKE = 0
	// определяем слой для построения (если слоев больше 1)
	else LAYER_TO_MAKE = LAYER_TO_MAKE.selection.index;
	// выбранная позиция
	var PTMSI = POS_TO_MAKE.selection.index;
	// если позиция относительно выделения
	if( sel_len > 0 )
	{
		// above selection
		if(  PTMSI == 2 )
		{
			// слой верхнего объекта в выделении (если оно есть)
			LAYER_TO_MAKE = LAYER_SEL_TOP_N;
			// опорный объект (верхний в выделении)
			var sel_obj = the_sel[0];
		};// if
		// below selection
		if( PTMSI == 3 ) 
		{
			// слой нижнего объекта в выделении (если оно есть)
			LAYER_TO_MAKE = LAYER_SEL_BOTTOM_N;
			// опорный объект (нижний в выделении)
			var sel_obj = the_sel[sel_len-1];
		};// if
		if( PTMSI == 2 || PTMSI == 3 )
		{
			var in_group = new Array();
			// определяем входит ли выделенный объект в группу
			in_group = IN_GROUP( sel_obj );
			// если входит опорный объект - самая внешняя группа
			if( in_group[0] ) sel_obj = in_group[1];
		};// if
	};// if
	// собственно слой
	LAYER_TO_MAKE = AD.layers[LAYER_TO_MAKE];
	// открываем слой (если необходимо)
	if( !LAYER_TO_MAKE.visible ||  LAYER_TO_MAKE.locked)
	{
		LAYER_TO_MAKE.visible = true;
		LAYER_TO_MAKE.locked = false;
		LAYER_TO_MAKE_WAS_OPENED = true;
	};// if
	// собственно делаем новый прямоугольник
	var the_rect = LAYER_TO_MAKE.pathItems.add();
	// заливка
	FILL_TO_MAKE = FILL_TO_MAKE.selection.index;
	if( FILL_TO_MAKE == 0 )
	{
		// нет заливки
		the_rect.filled = false;
	}
	else
	{
		// есть заливка
		the_rect.filled = true;
		FILL_TO_MAKE = AD.swatches[FILL_TO_MAKE].color;
		the_rect.fillColor = FILL_TO_MAKE;
	};// if-else
	// обводка
	STROKE_TO_MAKE = STROKE_TO_MAKE.selection.index;
	if( STROKE_TO_MAKE == 0 )
	{
		// нет обводки
		the_rect.stroked = false;
	}
	else
	{
		// есть обводка
		the_rect.stroked = true;
		STROKE_TO_MAKE = AD.swatches[STROKE_TO_MAKE].color;
		the_rect.strokeColor = STROKE_TO_MAKE;
		// снимаем возможный пунктир
		the_rect.strokeDashes = new Array();
		// присваиваем толщину
		the_rect.strokeWidth = GET_STROKE_WEIGHT(SW_ED.text, SW_UNITS.selection.text);
	};// if-else
	// верхние точки
	var TL_X, TL_Y, TR_X, TR_Y
	// нижние точки
	var BL_X, BL_Y, BR_X, BR_Y
	// если выбран артборд для построения
	if( OBJ_TO_MAKE.selection.index == 0 )
	{
		MAKE_BY_CLIP = false; // потому что этого не может быть :)))
		GBN = true; // это условно
		GT = AB_H; GR = AB_W; GB = 0.; GL =0.;
		// возможное смещение начала координат
		PAGE_DX = AD.rulerOrigin[0];
		PAGE_DY = AD.rulerOrigin[1];
	}; // if
	// рассчитываем координаты нового прямоугольника
	// если учет клипмаски
	if( MAKE_BY_CLIP ) 
	{
		GL = GL_NC; GT = GT_NC; GR = GR_NC; GB = GB_NC;
		VL = VL_NC; VT = VT_NC; VR = VR_NC; VB = VB_NC;
	};// if
	// учитываем границы (визуальные или геометрические)
	if( GBN )
	// если геометрические
	{
		TL_X = GL; TL_Y = GT; 		TR_X = GR; TR_Y = GT;
		
		BL_X = GL; BL_Y = GB; 		BR_X = GR; BR_Y = GB;
	}
	else
	// если визуальные
	{
		TL_X = VL; TL_Y = VT;		 TR_X = VR; TR_Y = VT;
		
		BL_X = VL; BL_Y = VB; 	 BR_X = VR; BR_Y = VB;
	};// if-else
	// учитываем смещения
	// рассчитываем смещения
	var SHIFT_L = TEXT_TO_POINTS(SL.text) + PAGE_DX;
	var SHIFT_R = TEXT_TO_POINTS(SR.text) - PAGE_DX;
	var SHIFT_T = TEXT_TO_POINTS(ST.text) - PAGE_DY;
	var SHIFT_B = TEXT_TO_POINTS(SB.text) + PAGE_DY;
	// добавляем смещения
	// 					левый верхний																		правый верхний
	TL_X = TL_X - SHIFT_L; TL_Y = TL_Y + SHIFT_T;		TR_X = TR_X + SHIFT_R; TR_Y = TR_Y + SHIFT_T;
	// 					левый нижний																		правый нижний
	BL_X = BL_X - SHIFT_L; BL_Y = BL_Y - SHIFT_B;		BR_X = BR_X + SHIFT_R; BR_Y = BR_Y - SHIFT_B;
	//
	// собственно строим прямоугольник
	the_rect.setEntirePath
	( Array(
				//           x          y
				Array(TL_X, TL_Y), // левый верхний
				Array(TR_X, TR_Y), // правый верхний
				Array(BR_X, BR_Y), // правый нижний
				Array(BL_X, BL_Y), // левый нижний
	) );
	// делаем замкнутым
	the_rect.closed = true;
	//
	//  если задана позиция в самом верху слоя Frontmost
	// ничего не делаем - новый прямоугольник остается в самом верху слоя
	// где и был создан по умолчанию
	if( PTMSI == 0 ) {};
	//
	// если задана позиция в самом низу слоя Backmost
	// отправляем новый прямоугольник в самый низ слоя
	if( PTMSI == 1 ) the_rect.zOrder(ZOrderMethod.SENDTOBACK);
	//
	// определяем позицию нового прямоугольника и опорного объекта
	if( PTMSI == 2 || PTMSI == 3 ) GET_Z_ORDER(sel_obj, the_rect);
	//
	// если задана позиция над выделением Above selection
	if( PTMSI == 2 ) var N_Z = z_rect - z-1;
	//
	// если задана позиция под выделением Below selection
	if( PTMSI == 3 ) var N_Z = z_rect - z ;
	//
	// перемещаем новый прямоугольник вниз
	if( PTMSI == 2 || PTMSI == 3 )
		for( var i = 0; i < N_Z; i++)
			the_rect.zOrder(ZOrderMethod.SENDBACKWARD);
	// если выделить прямоугольник после создания
	if( SEL_AFT_CB.value )
	{
		// снимаем выделение (если оно было)
		DESELECT_ALL();
		// выделяем прямоугольник
		the_rect.selected = true;
	};// if
	WAIT( "", false );
	// освежаем экран
	app.redraw();
	return;
};// end MAKE_RECT
//
// подпрограмма снятия выделения
function DESELECT_ALL() 
{
	AD.selection = null;
	return;
};// end DESELECT_ALL
// 
// подпрограмма получения толщины обводки
function GET_STROKE_WEIGHT( txt, str_units )
{
	var d = txt.toLowerCase();
	var k = 1.;
	if( str_units == 'pt' ) k = 1.; 
	if( str_units == 'in' ) k = 72.; 
	if( str_units == 'mm' ) k = (72./25.4); 
	if( str_units == 'cm' ) k = ((72./25.4)*10.);
	d = parseFloat( txt ) * k;
	// если не цифра, обнуляем
	 if( isNaN(d) ) d = 0.;
	 return d;
};// end GET_STROKE_WEIGHT