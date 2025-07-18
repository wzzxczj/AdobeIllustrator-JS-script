var SCRIPT_TITLE = "阵列复制";
var SCRIPT_VERSION = "阵列复制";
var the_sel = new Array();
var RULERS_WERE_CHANGED = false;
var DIALOG_OLD = false;
var T_VALUE = false;
var B_VALUE = false;
var L_VALUE = false;
var R_VALUE = false;
var TL_VALUE = false;
var TR_VALUE = false;
var BL_VALUE = false;
var BR_VALUE = false;
var CC_VALUE = true;
var GEO_BOUNDS_VALUE = true;
var VIZ_BOUNDS_VALUE = false;
var REL_C_VALUE = true;
var H_UNITS_TEXT = "??";
var V_UNITS_TEXT = "??";
var ACTIVE_UNITS = "mm";
var ACTIVE_UNITS_VALUE = 0;
var UNITS_DROP_SELECTION = 0;
var COPY_BUTTON_VALUE = false;
var H_STEP = 0;
var V_STEP = 0;
var P_S = "+0";
var M_S = "-0";
var V_STEP_TEXT = P_S;
var H_STEP_TEXT = P_S;
var N_STEP = 1;
var N_STEP_DONE = 0;
var BOUNDS_BY_CLIP_VALUE = false;
var CLIP = false;
var exit_if_guide = false;
var exit_if_error = false;
var exit_if_bad_input = false;
var OBJ_TO_MOVE = new Array();
var NO_CLIP_OBJECTS_AND_MASKS = new Array();
var OBJ_NO_CLIP_TO_SHOW = new Array();
var AFTER_DOT = 3;
var NO_DOCS = false;
main();
if (!NO_DOCS) {
    MAKE_SELECTION(OBJ_TO_MOVE)
}

function main() {
    if (CHECK_SELECTION()) {
        DIMENSIONS();
        if (exit_if_error) {
            alert("不能这样做!\n有可能的选择是不正确的...");
            return;
        }
        DIALOG();
        if (exit_if_error) {
            alert("不能这样做!");
            return;
        }
        if (exit_if_bad_input) {
            alert("错误的数字输入!");
            return;
        }
    }
    return;
}

function CHECK_SELECTION() {
    N_doc = app.documents.length;
    if (N_doc < 1) {
        alert("文档没有打开!");
        NO_DOCS = true;
        return false;
    }
    AD = app.activeDocument;
    AL = AD.activeLayer;
    the_sel = AD.selection;
    N_sel = the_sel.length;
    if (N_sel == 0) {
        alert("没有选择对象!");
        return false;
    }
    OBJ_TO_MOVE = the_sel;
    if (GUIDES_IN_SELECTION()) {
        alert("有一些选定的参考线!\n无法处理!");
        return false;
    }
    var WHITE_ARROW = false;
    for (var i = 0; i < N_sel; i += 1) {
        if (SELECTED_IN_GROUP(the_sel[i])) {
            WHITE_ARROW = true;
        }
    }
    if (WHITE_ARROW) {
        if (!confirm("白色箭头（直接选择工具）用于选择对象。 在这种情况下优选黑色箭头（选择工具）.\n仍然继续?")) {
            return false;
        }
    }
    APP_VERSION = parseInt(app.version);
    if (APP_VERSION > 13) {
        BOUNDS_BY_CLIP_VALUE = true
    }
    ACTIVE_UNITS = "mm";
    ACTIVE_UNITS_VALUE = 0;
    var AD_units = app.activeDocument.rulerUnits;
    if (AD_units == RulerUnits.Millimeters) {
        ACTIVE_UNITS = "mm";
        ACTIVE_UNITS_VALUE = 0;
    }
    if (AD_units == RulerUnits.Centimeters) {
        ACTIVE_UNITS = "cm";
        ACTIVE_UNITS_VALUE = 1;
    }
    if (AD_units == RulerUnits.Points) {
        ACTIVE_UNITS = "pt";
        ACTIVE_UNITS_VALUE = 2;
    }
    if (AD_units == RulerUnits.Inches) {
        ACTIVE_UNITS = "in";
        ACTIVE_UNITS_VALUE = 3;
        AFTER_DOT = 4;
    }
    if (AD_units == RulerUnits.Pixels) {
        ACTIVE_UNITS = "px";
        ACTIVE_UNITS_VALUE = 4;
    }
    return true;
}

function GET_ACTIVE_UNITS(N) {
    if (N == 0) {
        return "mm";
    }
    if (N == 1) {
        return "cm";
    }
    if (N == 2) {
        return "pt";
    }
    if (N == 3) {
        return "in";
    }
    if (N == 4) {
        return "px";
    }
    return "??";
}

function GET_UNITS_SELECTION(u) {
    if (u == "mm") {
        return 0;
    }
    if (u == "cm") {
        return 1;
    }
    if (u == "pt") {
        return 2;
    }
    if (u == "in") {
        return 3;
    }
    if (u == "px") {
        return 4;
    }
}

function GUIDES_IN_SELECTION() {
    function GUIDES_INSIDE(the_obj) {
        if (IS_GUIDE(the_obj)) {
            return true;
        }
        try {
            for (var i = 0; i < the_obj.pageItems.length; i += 1) {
                if (GUIDES_INSIDE(the_obj.pageItems[i])) {
                    return true;
                }
            }
        } catch (error) {

        }
        return false;
    }
    for (var i = 0; i < the_sel.length; i += 1) {
        if (GUIDES_INSIDE(the_sel[i])) {
            return true;
        }
    }
    return false;
}

function DIALOG() {
    dialog_main = new Window("dialog");
    if (DIALOG_OLD) {
        dialog_main.location = dialog_main_bounds;
        try {
            ACTIVE_UNITS_VALUE = GET_UNITS_SELECTION(ACTIVE_UNITS);
            ACTIVE_UNITS = GET_ACTIVE_UNITS(ACTIVE_UNITS_VALUE);
            if (ACTIVE_UNITS_VALUE == 3) {
                AFTER_DOT = 4
            } else {
                AFTER_DOT = 3
            }
        } catch (error) {

        }
    }
    dialog_main.text = SCRIPT_TITLE + SCRIPT_VERSION;
    dialog_main.orientation = "column";
    var top_group = dialog_main.add("group");
    top_group.alignChildren = "top";
    top_group.orientation = "row";
    var dir_group = top_group.add("group");
    dir_group.orientation = "column";
    dir_group.alignChildren = "left";
    var dir_pan = dir_group.add("panel");
    dir_pan.bounds = [0, 0, 100, 100];
    var dir_dx = 30;
    var dir_dy = 30;
    var dir_x0 = 8;
    var dir_y0 = 3;

    function RB_xy(x, y) {
        var the_rb = dir_pan.add("radiobutton");
        var d = 30;
        the_rb.bounds = [x, y, x + d, y + d];
        the_rb.onClick = BOUNDS_ON_CLICK;
        return the_rb;
    }
    var TL = RB_xy(dir_x0, dir_y0);
    TL.value = TL_VALUE;
    var T = RB_xy(dir_x0 + dir_dx, dir_y0);
    T.value = T_VALUE;
    var TR = RB_xy(dir_x0 + (dir_dx * 2), dir_y0);
    TR.value = TR_VALUE;
    dir_y0 = dir_y0 + dir_dy;
    var L = RB_xy(dir_x0, dir_y0);
    L.value = L_VALUE;
    var C = RB_xy(dir_x0 + dir_dx, dir_y0);
    C.value = CC_VALUE;
    var R = RB_xy(dir_x0 + (dir_dx * 2), dir_y0);
    R.value = R_VALUE;
    dir_y0 = dir_y0 + dir_dy;
    var BL = RB_xy(dir_x0, dir_y0);
    BL.value = BL_VALUE;
    var B = RB_xy(dir_x0 + dir_dx, dir_y0);
    B.value = B_VALUE;
    var BR = RB_xy(dir_x0 + (dir_dx * 2), dir_y0);
    BR.value = BR_VALUE;
    REL_C = dir_group.add("checkbox");
    REL_C.text = "相对中心";
    REL_C.value = REL_C_VALUE;
    REL_C.onClick = BOUNDS_ON_CLICK;
    COPY_BUTTON = dir_group.add("checkbox");
    COPY_BUTTON.text = "复制对象";
    COPY_BUTTON.value = COPY_BUTTON_VALUE;
    var OPT_GROUP = top_group.add("panel");
    OPT_GROUP.orientation = "column";
    OPT_GROUP.alignChildren = "center";
    var TOP_GROUP = OPT_GROUP.add("group");
    TOP_GROUP.orientation = "row";
    TOP_GROUP.alignChildren = "top";
    var OPT_COLUMN_1 = TOP_GROUP.add("group");
    OPT_COLUMN_1.orientation = "column";
    OPT_COLUMN_1.alignChildren = "left";
    var BOUNDS_GROUP = OPT_COLUMN_1.add("group");
    BOUNDS_GROUP.orientation = "column";
    BOUNDS_GROUP.alignChildren = "left";
    GEO_BOUNDS = BOUNDS_GROUP.add("radiobutton");
    GEO_BOUNDS.text = "几何边缘";
    GEO_BOUNDS.value = GEO_BOUNDS_VALUE;
    GEO_BOUNDS.onClick = BOUNDS_ON_CLICK;
    VIZ_BOUNDS = BOUNDS_GROUP.add("radiobutton");
    VIZ_BOUNDS.text = "轮廓边缘";
    VIZ_BOUNDS.value = VIZ_BOUNDS_VALUE;
    VIZ_BOUNDS.onClick = BOUNDS_ON_CLICK;
    BOUNDS_BY_CLIP = OPT_COLUMN_1.add("checkbox");
    BOUNDS_BY_CLIP.text = "考虑剪贴蒙版";
    BOUNDS_BY_CLIP.value = BOUNDS_BY_CLIP_VALUE;
    BOUNDS_BY_CLIP.onClick = DIR_ON_CHANGE;
    BOUNDS_BY_CLIP.visible = CLIP;

    function TEXT(obj, text_type, the_text, len) {
        var T = obj.add(text_type);
        T.text = the_text;
        T.size = [len, 16];
        return T;
    }
    var COORD_GROUP = OPT_COLUMN_1.add("group");
    COORD_GROUP.orientation = "row";
    var COORD_GROUP_1 = COORD_GROUP.add("group");
    COORD_GROUP_1.orientation = "column";
    COORD_GROUP_1.alignChildren = "left";
    H_NUM = TEXT(COORD_GROUP_1, "statictext", " ", 90);
    V_NUM = TEXT(COORD_GROUP_1, "statictext", " ", 90);
    var OPT_COLUMN_2 = TOP_GROUP.add("group");
    OPT_COLUMN_2.orientation = "column";
    OPT_COLUMN_2.alignChildren = "right";
    var STEPS_GROUP = OPT_COLUMN_2.add("group");
    STEPS_GROUP.orientation = "column";
    STEPS_GROUP.alignChildren = "left";
    var STEP_INPUT = STEPS_GROUP.add("group");
    STEP_INPUT.orientation = "row";
    var STEPS_TEXT = TEXT(STEP_INPUT, "statictext", "步骤:", 40);
    STEPS = TEXT(STEP_INPUT, "edittext", N_STEP.toString(), 30);
    var STEP_DONE = STEPS_GROUP.add("group");
    STEP_DONE.orientation = "row";
    var N_S_DONE = TEXT(STEP_DONE, "statictext", "完成:    " + N_STEP_DONE.toString(), 70);
    var UNITS_GROUP = STEPS_GROUP.add("group");
    UNITS_GROUP.orientation = "row";
    var UNITS_TEXT = TEXT(UNITS_GROUP, "statictext", "单位:", 40);
    UNITS_DROP = UNITS_GROUP.add("dropdownlist");
    UNITS_DROP.add("item", "mm");
    UNITS_DROP.add("item", "cm");
    UNITS_DROP.add("item", "pt");
    UNITS_DROP.add("item", "in");
    UNITS_DROP.add("item", "px");
    UNITS_DROP.selection = ACTIVE_UNITS_VALUE;
    UNITS_DROP.onChange = BOUNDS_ON_CLICK;
    var COORD_GROUP_2 = OPT_COLUMN_2.add("group");
    COORD_GROUP_2.orientation = "column";
    COORD_GROUP_2.alignChildren = "left";
    var H_GROUP = COORD_GROUP_2.add("group");
    H_GROUP.orientation = "row";
    H_GROUP.alignChildren = "top";
    var dX_TEXT = TEXT(H_GROUP, "statictext", "dX:", 20);
    H_STEP = TEXT(H_GROUP, "edittext", H_STEP_TEXT, 60);
    var V_GROUP = COORD_GROUP_2.add("group");
    V_GROUP.orientation = "row";
    V_GROUP.alignChildren = "top";
    var dY_TEXT = TEXT(V_GROUP, "statictext", "dY:", 20);
    V_STEP = TEXT(V_GROUP, "edittext", V_STEP_TEXT, 60);
    BOUNDS_ON_CLICK();
    var OK_group = OPT_GROUP.add("group");
    OK_group.orientation = "row";
    var okBtn = OK_group.add("button", undefined, "确认", {
        name: "OK"
    });
    var cancelBtn = OK_group.add("button", undefined, "取消", {
        name: "Cancel"
    });

    function MOVE() {
        DIALOG_OLD = true;
        COPY_BUTTON_VALUE = COPY_BUTTON.value;
        DUPLICATE = COPY_BUTTON_VALUE;
        REL_C_VALUE = REL_C.value;
        GEO_BOUNDS_VALUE = GEO_BOUNDS.value;
        VIZ_BOUNDS_VALUE = VIZ_BOUNDS.value;
        N_STEP = parseInt(GET_NUMBER(STEPS.text));
        if (exit_if_bad_input) {
            return;
        }
        if (N_STEP < 1) {
            alert("警告:\n错误的步骤! 该 \"1\" 指定!");
            N_STEP = 1;
        }
        for (var st = 1; st <= N_STEP; st += 1) {
            H_STEP_TEXT = H_STEP.text;
            V_STEP_TEXT = V_STEP.text;
            var D_H_X = TEXT_TO_POINTS(H_STEP_TEXT);
            if (exit_if_bad_input) {
                return;
            }
            var D_V_Y = TEXT_TO_POINTS(V_STEP_TEXT);
            if (exit_if_bad_input) {
                return;
            }
            if (REL_C_VALUE) {
                D_H_X = H + D_H_X;
                D_V_Y = V + D_V_Y;
            }
            var the_obj = new Array();
            the_obj = OBJ_TO_MOVE;
            OBJ_TO_MOVE = OBJ_TO_MOVE.slice(0, 0);
            DESELECT_ALL();
            for (var i = 0; i < the_obj.length; i += 1) {
                var NO_DUP = false;
                if (DUPLICATE) {
                    if (MASK_ONLY_SELECTED(the_obj[i])) {
                        D = the_obj[i].parent.duplicate();
                        try {
                            for (var r = D.pageItems.length - 1; r >= 1; r--) {
                                D.pageItems[r].remove();
                            }
                        } catch (error) {

                        }
                    }
                    if (SELECTED_IN_CLIP(the_obj[i])) {
                        var the_par = the_obj[i].parent;
                        for (var k = 0; k < the_par.pageItems.length; k += 1) {
                            if (the_par.pageItems[k] == the_obj[i]) {
                                IND = k;
                                break;
                            }
                        }
                        D = the_obj[i].parent.duplicate();
                        var D2 = D.pageItems[IND];
                        try {
                            for (var r = D.pageItems.length - 1; r >= 0; r--) {
                                if (D.pageItems[r] == D2) {
                                    continue;
                                }
                                D.pageItems[r].remove();
                            }
                        } catch (error) {

                        }
                        D = D2;
                    }
                    if (!MASK_ONLY_SELECTED(the_obj[i]) && !SELECTED_IN_CLIP(the_obj[i])) {
                        D = the_obj[i].duplicate();
                    }
                } else {
                    D = the_obj[i];
                }
                try {
                    if (D_H_X != 0 || D_V_Y != 0) {
                        var moveMatrix = new Matrix();
                        moveMatrix = app.getTranslationMatrix(D_H_X, D_V_Y);
                        D.transform(moveMatrix);
                        app.redraw();
                    }
                } catch (error) {
                    exit_if_error = true;
                    return;
                }
                OBJ_TO_MOVE.push(D);
            }
            DIMENSIONS();
            if (BOUNDS_BY_CLIP.value) {
                MAKE_SELECTION(OBJ_NO_CLIP_TO_SHOW)
            }
            if (!BOUNDS_BY_CLIP.value) {
                MAKE_SELECTION(OBJ_TO_MOVE)
            }
            N_STEP_DONE = N_STEP_DONE + 1;
        }
        BOUNDS_ON_CLICK();
        DIALOG();
        return;
    }

    function DIR_ON_CHANGE() {
        if (TL.value) {
            H_STEP_TEXT = M_S;
            V_STEP_TEXT = P_S;
        }
        if (T.value) {
            H_STEP_TEXT = P_S;
            V_STEP_TEXT = P_S;
        }
        if (TR.value) {
            H_STEP_TEXT = P_S;
            V_STEP_TEXT = P_S;
        }
        if (L.value) {
            H_STEP_TEXT = M_S;
            V_STEP_TEXT = M_S;
        }
        if (C.value) {
            H_STEP_TEXT = P_S;
            V_STEP_TEXT = P_S;
        }
        if (R.value) {
            H_STEP_TEXT = P_S;
            V_STEP_TEXT = P_S;
        }
        if (BL.value) {
            H_STEP_TEXT = M_S;
            V_STEP_TEXT = M_S;
        }
        if (B.value) {
            H_STEP_TEXT = P_S;
            V_STEP_TEXT = M_S;
        }
        if (BR.value) {
            H_STEP_TEXT = P_S;
            V_STEP_TEXT = M_S;
        }
        H_STEP.text = H_STEP_TEXT;
        V_STEP.text = V_STEP_TEXT;
        T_VALUE = T.value;
        B_VALUE = B.value;
        L_VALUE = L.value;
        R_VALUE = R.value;
        TL_VALUE = TL.value;
        TR_VALUE = TR.value;
        BL_VALUE = BL.value;
        BR_VALUE = BR.value;
        CC_VALUE = C.value;
        if (BOUNDS_BY_CLIP.value != BOUNDS_BY_CLIP_VALUE) {
            if (BOUNDS_BY_CLIP.value) {
                MAKE_SELECTION(OBJ_NO_CLIP_TO_SHOW)
            }
            if (!BOUNDS_BY_CLIP.value) {
                MAKE_SELECTION(OBJ_TO_MOVE)
            }
            BOUNDS_ON_CLICK();
        }
        BOUNDS_BY_CLIP_VALUE = BOUNDS_BY_CLIP.value;
        return;
    }

    function BOUNDS_ON_CLICK() {
        try {
            if (UNITS_DROP.selection != ACTIVE_UNITS_VALUE) {
                ACTIVE_UNITS_VALUE = UNITS_DROP.selection;
                ACTIVE_UNITS = GET_ACTIVE_UNITS(ACTIVE_UNITS_VALUE);
                if (ACTIVE_UNITS_VALUE == 3) {
                    AFTER_DOT = 4
                } else {
                    AFTER_DOT = 3
                }
            }
        } catch (error) {
            ACTIVE_UNITS_VALUE = GET_UNITS_SELECTION(ACTIVE_UNITS);
            ACTIVE_UNITS = GET_ACTIVE_UNITS(ACTIVE_UNITS_VALUE);
            UNITS_DROP.selection = ACTIVE_UNITS_VALUE;
            if (ACTIVE_UNITS_VALUE == 3) {
                AFTER_DOT = 4
            } else {
                AFTER_DOT = 3
            }
        }
        if (BOUNDS_BY_CLIP.value) {
            var ABS_GL = GL_NC;
            var ABS_GT = GT_NC;
            var ABS_GR = GR_NC;
            var ABS_GB = GB_NC;
            var ABS_GCH = GCH_NC;
            var ABS_GCV = GCV_NC;
            var ABS_VL = VL_NC;
            var ABS_VT = VT_NC;
            var ABS_VR = VR_NC;
            var ABS_VB = VB_NC;
            var ABS_VCH = VCH_NC;
            var ABS_VCV = VCV_NC;
            var ABS_GH = GH_NC;
            var ABS_GV = GV_NC;
            var ABS_VH = VH_NC;
            var ABS_VV = VV_NC;
        } else {
            var ABS_GL = GL;
            var ABS_GT = GT;
            var ABS_GR = GR;
            var ABS_GB = GB;
            var ABS_GCH = GCH;
            var ABS_GCV = GCV;
            var ABS_VL = VL;
            var ABS_VT = VT;
            var ABS_VR = VR;
            var ABS_VB = VB;
            var ABS_VCH = VCH;
            var ABS_VCV = VCV;
            var ABS_GH = GH;
            var ABS_GV = GV;
            var ABS_VH = VH;
            var ABS_VV = VV;
        }
        if (TL.value != TL_VALUE || T.value != T_VALUE || TR.value != TR_VALUE || L.value != L_VALUE || C.value != CC_VALUE || R.value != R_VALUE || BL.value != BL_VALUE || B.value != B_VALUE || BR.value != BR_VALUE) {
            DIR_ON_CHANGE()
        }
        if (!REL_C.value) {
            if (GEO_BOUNDS.value) {
                ABS_L = ABS_GL;
                ABS_B = ABS_GB;
                ABS_R = ABS_GR;
                ABS_T = ABS_GT;
                ABS_CH = ABS_GCH;
                ABS_CV = ABS_GCV;
            } else {
                ABS_L = ABS_VL;
                ABS_B = ABS_VB;
                ABS_R = ABS_VR;
                ABS_T = ABS_VT;
                ABS_CH = ABS_VCH;
                ABS_CV = ABS_VCV;
            }
            if (TL.value || L.value || BL.value) {
                H = ABS_L
            }
            if (T.value || C.value || B.value) {
                H = ABS_CH
            }
            if (TR.value || R.value || BR.value) {
                H = ABS_R
            }
            if (TL.value || T.value || TR.value) {
                V = ABS_T
            }
            if (L.value || C.value || R.value) {
                V = ABS_CV
            }
            if (BL.value || B.value || BR.value) {
                V = ABS_B
            }
        }
        if (REL_C.value) {
            if (GEO_BOUNDS.value) {
                H = ABS_GH;
                V = ABS_GV;
            }
            if (VIZ_BOUNDS.value) {
                H = ABS_VH;
                V = ABS_VV;
            }
            if (TL.value || L.value || BL.value) {
                H = -1 * H;
            }
            if (BL.value || B.value || BR.value) {
                V = -1 * V;
            }
            if (R.value || C.value || L.value) {
                V = 0
            }
            if (T.value || C.value || B.value) {
                H = 0
            }
        }
        H_STEP.text = H_STEP_TEXT;
        V_STEP.text = V_STEP_TEXT;
        var H_SHOW = TEXT_TO_DIGIT(H.toString()).toFixed(AFTER_DOT);
        var V_SHOW = TEXT_TO_DIGIT(V.toString()).toFixed(AFTER_DOT);
        H_NUM.text = "H (X): " + H_SHOW + " " + ACTIVE_UNITS;
        V_NUM.text = "V (Y): " + V_SHOW + " " + ACTIVE_UNITS;
        return;
    }
    var DIALOG_BUTTON = dialog_main.show();
    dialog_main_bounds = dialog_main.location;
    if (DIALOG_BUTTON == 1) {
        MOVE()
    }
    if (exit_if_error) {
        return;
    }
    if (exit_if_bad_input) {
        return;
    }
}

function DIMENSIONS() {
    var objects = OBJ_TO_MOVE;
    var N_objects = objects.length;
    var objects_bounds = new Array();
    var no_clip_bounds = new Array();
    objects_bounds = OBJ_BOUNDS(objects[0]);
    if (exit_if_error) {
        return;
    }
    var OBJ_GL = objects_bounds[0];
    var OBJ_GT = objects_bounds[1];
    var OBJ_GR = objects_bounds[2];
    var OBJ_GB = objects_bounds[3];
    var OBJ_VL = objects_bounds[4];
    var OBJ_VT = objects_bounds[5];
    var OBJ_VR = objects_bounds[6];
    var OBJ_VB = objects_bounds[7];
    no_clip_bounds = NO_CLIP_BOUNDS(objects[0]);
    var OBJ_NC_GL = no_clip_bounds[0];
    var OBJ_NC_GT = no_clip_bounds[1];
    var OBJ_NC_GR = no_clip_bounds[2];
    var OBJ_NC_GB = no_clip_bounds[3];
    var OBJ_NC_VL = no_clip_bounds[4];
    var OBJ_NC_VT = no_clip_bounds[5];
    var OBJ_NC_VR = no_clip_bounds[6];
    var OBJ_NC_VB = no_clip_bounds[7];
    for (var i = 0; i < N_objects; i += 1) {
        var the_obj = objects[i];
        objects_bounds = OBJ_BOUNDS(the_obj);
        var GL_i = objects_bounds[0];
        var GT_i = objects_bounds[1];
        var GR_i = objects_bounds[2];
        var GB_i = objects_bounds[3];
        var VL_i = objects_bounds[4];
        var VT_i = objects_bounds[5];
        var VR_i = objects_bounds[6];
        var VB_i = objects_bounds[7];
        if (GL_i < OBJ_GL) {
            OBJ_GL = GL_i
        }
        if (GT_i > OBJ_GT) {
            OBJ_GT = GT_i
        }
        if (GR_i > OBJ_GR) {
            OBJ_GR = GR_i
        }
        if (GB_i < OBJ_GB) {
            OBJ_GB = GB_i
        }
        if (VL_i < OBJ_VL) {
            OBJ_VL = VL_i
        }
        if (VT_i > OBJ_VT) {
            OBJ_VT = VT_i
        }
        if (VR_i > OBJ_VR) {
            OBJ_VR = VR_i
        }
        if (VB_i < OBJ_VB) {
            OBJ_VB = VB_i
        }
        no_clip_bounds = NO_CLIP_BOUNDS(the_obj);
        var GL_NC_i = no_clip_bounds[0];
        var GT_NC_i = no_clip_bounds[1];
        var GR_NC_i = no_clip_bounds[2];
        var GB_NC_i = no_clip_bounds[3];
        var VL_NC_i = no_clip_bounds[4];
        var VT_NC_i = no_clip_bounds[5];
        var VR_NC_i = no_clip_bounds[6];
        var VB_NC_i = no_clip_bounds[7];
        if (GL_NC_i < OBJ_NC_GL) {
            OBJ_NC_GL = GL_NC_i
        }
        if (GT_NC_i > OBJ_NC_GT) {
            OBJ_NC_GT = GT_NC_i
        }
        if (GR_NC_i > OBJ_NC_GR) {
            OBJ_NC_GR = GR_NC_i
        }
        if (GB_NC_i < OBJ_NC_GB) {
            OBJ_NC_GB = GB_NC_i
        }
        if (VL_NC_i < OBJ_NC_VL) {
            OBJ_NC_VL = VL_NC_i
        }
        if (VT_NC_i > OBJ_NC_VT) {
            OBJ_NC_VT = VT_NC_i
        }
        if (VR_NC_i > OBJ_NC_VR) {
            OBJ_NC_VR = VR_NC_i
        }
        if (VB_NC_i < OBJ_NC_VB) {
            OBJ_NC_VB = VB_NC_i
        }
    }
    GL = OBJ_GL;
    GT = OBJ_GT;
    GR = OBJ_GR;
    GB = OBJ_GB;
    VL = OBJ_VL;
    VT = OBJ_VT;
    VR = OBJ_VR;
    VB = OBJ_VB;
    GL_NC = OBJ_NC_GL;
    GT_NC = OBJ_NC_GT;
    GR_NC = OBJ_NC_GR;
    GB_NC = OBJ_NC_GB;
    VL_NC = OBJ_NC_VL;
    VT_NC = OBJ_NC_VT;
    VR_NC = OBJ_NC_VR;
    VB_NC = OBJ_NC_VB;
    CLIP = false;
    if (GL != GL_NC || GT != GT_NC || GR != GR_NC || GT != GT_NC || VL != VL_NC || VT != VT_NC || VR != VR_NC || VB != VB_NC) {
        CLIP = true;
    }
    GH = GR - GL;
    GV = GT - GB;
    GCH = GL + ((GR - GL) / 2);
    GCV = GB + ((GT - GB) / 2);
    VH = VR - VL;
    VV = VT - VB;
    VCH = VL + ((VR - VL) / 2);
    VCV = VB + ((VT - VB) / 2);
    GH_NC = GR_NC - GL_NC;
    GV_NC = GT_NC - GB_NC;
    GCH_NC = GL_NC + ((GR_NC - GL_NC) / 2);
    GCV_NC = GB_NC + ((GT_NC - GB_NC) / 2);
    VH_NC = VR_NC - VL_NC;
    VV_NC = VT_NC - VB_NC;
    VCH_NC = VL_NC + ((VR_NC - VL_NC) / 2);
    VCV_NC = VB_NC + ((VT_NC - VB_NC) / 2);
    OBJ_NO_CLIP_TO_SHOW = NO_CLIP_OBJECTS_AND_MASKS;
    NO_CLIP_OBJECTS_AND_MASKS = NO_CLIP_OBJECTS_AND_MASKS.slice(0, 0);
    return;
}

function DESELECT_ALL() {
    app.activeDocument.selection = null;
    app.redraw();
    return;
}

function MAKE_SELECTION(objects) {
    DESELECT_ALL();
    app.activeDocument.selection = objects;
    app.redraw();
    return;
}

function TEXT_TO_DIGIT(txt) {
    var d = txt.toLowerCase();
    var k = 1;
    if (ACTIVE_UNITS == "pt") {
        k = 1
    }
    if (ACTIVE_UNITS == "in") {
        k = 0.0138888888888889
    }
    if (ACTIVE_UNITS == "mm") {
        k = 0.352777777777778
    }
    if (ACTIVE_UNITS == "cm") {
        k = 0.0352777777777778
    }
    if (ACTIVE_UNITS == "px") {
        k = 1
    }
    d = parseFloat(txt) * k;
    if (isNaN(d)) {
        d = 0;
        exit_if_bad_input = true;
        return;
    }
    return d;
}

function TEXT_TO_POINTS(txt) {
    var d = txt.toLowerCase();
    var k = 1;
    if (ACTIVE_UNITS == "pt") {
        k = 1
    }
    if (ACTIVE_UNITS == "in") {
        k = 72
    }
    if (ACTIVE_UNITS == "mm") {
        k = 2.83464566929134
    }
    if (ACTIVE_UNITS == "cm") {
        k = 28.3464566929134
    }
    if (ACTIVE_UNITS == "px") {
        k = 1
    }
    d = parseFloat(txt) * k;
    if (isNaN(d)) {
        d = 0;
        exit_if_bad_input = true;
        return;
    }
    return d;
}

function NO_CLIP_BOUNDS(the_obj) {
    GET_NO_CLIP_OBJECTS_AND_MASKS(the_obj);
    var v_left = new Array();
    var g_left = new Array();
    var v_top = new Array();
    var g_top = new Array();
    var v_right = new Array();
    var g_right = new Array();
    var v_bottom = new Array();
    var g_bottom = new Array();
    for (var i = 0; i < NO_CLIP_OBJECTS_AND_MASKS.length; i += 1) {
        g_left[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[0];
        v_left[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[0];
        g_top[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[1];
        v_top[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[1];
        g_right[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[2];
        v_right[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[2];
        g_bottom[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[3];
        v_bottom[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[3];
    }
    var v_L = MIN_IN_ARRAY(v_left);
    var g_L = MIN_IN_ARRAY(g_left);
    var v_T = MAX_IN_ARRAY(v_top);
    var g_T = MAX_IN_ARRAY(g_top);
    var v_R = MAX_IN_ARRAY(v_right);
    var g_R = MAX_IN_ARRAY(g_right);
    var v_B = MIN_IN_ARRAY(v_bottom);
    var g_B = MIN_IN_ARRAY(g_bottom);
    return [g_L, g_T, g_R, g_B, v_L, v_T, v_R, v_B];

    function GET_NO_CLIP_OBJECTS_AND_MASKS(the_obj) {
        if (IS_CLIP(the_obj)) {
            NO_CLIP_OBJECTS_AND_MASKS.push(the_obj.pathItems[0]);
            return;
        }
        if (the_obj.constructor.name == "GroupItem") {
            try {
                var N_sub_obj = the_obj.pageItems.length;
                for (var i = 0; i < N_sub_obj; i += 1) {
                    GET_NO_CLIP_OBJECTS_AND_MASKS(the_obj.pageItems[i]);
                }
            } catch (error) {

            }
            return;
        }
        NO_CLIP_OBJECTS_AND_MASKS.push(the_obj);
        return;
    }
}

function MAX_IN_ARRAY(the_array) {
    var MAX = the_array[0];
    for (var i = 0; i < the_array.length; i += 1) {
        if (the_array[i] > MAX) {
            MAX = the_array[i]
        }
    }
    return MAX;
}

function MIN_IN_ARRAY(the_array) {
    var MIN = the_array[0];
    for (var i = 0; i < the_array.length; i += 1) {
        if (the_array[i] < MIN) {
            MIN = the_array[i]
        }
    }
    return MIN;
}

function OBJ_BOUNDS(the_obj) {
    try {
        var g_L = the_obj.geometricBounds[0];
        var v_L = the_obj.visibleBounds[0];
        var g_T = the_obj.geometricBounds[1];
        var v_T = the_obj.visibleBounds[1];
        var g_R = the_obj.geometricBounds[2];
        var v_R = the_obj.visibleBounds[2];
        var g_B = the_obj.geometricBounds[3];
        var v_B = the_obj.visibleBounds[3];
    } catch (error) {
        exit_if_error = true;
        return;
    }
    return [g_L, g_T, g_R, g_B, v_L, v_T, v_R, v_B];
}

function IS_CLIP(the_obj) {
    try {
        if (the_obj.constructor.name == "GroupItem") {
            if (the_obj.clipped) {
                return true;
            }
        }
    } catch (error) {

    }
    return false;
}

function GET_NUMBER(the_text) {
    var t = "";
    for (var i = 0; i < the_text.length; i += 1) {
        t_i = the_text[i];
        if (t_i == ",") {
            t_i = "."
        }
        t = t + t_i;
    }
    t = parseFloat(t);
    if (isNaN(parseFloat(t))) {
        exit_if_bad_input = true;
        return;
    }
    return t;
}

function IS_GUIDE(the_obj) {
    try {
        if (the_obj.guides) {
            exit_if_guide = true;
            return true;
        }
    } catch (error) {

    }
    return false;
}

function SELECTED_IN_CLIP(the_obj) {
    try {
        var the_parent = the_obj.parent;
        if (IS_CLIP(the_parent) && the_obj != the_parent.pathItems[0]) {
            return true;
        }
    } catch (error) {

    }
    return false;
}

function MASK_ONLY_SELECTED(the_obj) {
    try {
        var the_parent = the_obj.parent;
        if (IS_CLIP(the_parent) && the_obj == the_parent.pathItems[0]) {
            for (var i = 0; i < the_parent.pageItems.length; i += 1) {
                if (the_parent.pageItems[i].selected) {
                    return false;
                }
            }
            return true;
        }
    } catch (error) {

    }
    return false;
}

function SELECTED_IN_GROUP(the_obj) {
    try {
        var the_parent = the_obj.parent;
        if (the_parent.constructor.name == "GroupItem") {
            return true;
        }
    } catch (error) {

    }
    return false;
}