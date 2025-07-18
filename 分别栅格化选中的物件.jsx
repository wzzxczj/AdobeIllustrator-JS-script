//#target illustrator

function rasterizeSelectedItems(dpi) {
    var doc = app.activeDocument;
    var selection = doc.selection;
    var numSelected = selection.length;

    if (numSelected === 0) {
        alert("没有选中的物体。");
        return;
    }

    var dpiInput = prompt("当前选中了 " + numSelected + " 个物体。\n请输入DPI数值进行栅格化：", "600");

    if (dpiInput) {
        var dpi = parseInt(dpiInput);
        if (isNaN(dpi)) {
            alert("请输入有效的DPI数值。");
            return;
        }
        var options = new RasterizeOptions();
        options.resolution = dpi;
        options.antiAliasingMethod.TYPEOPTIMIZED;
        options.transparency = true;
        options.convertSpotColors = false;

        // 创建进度条窗口
        var progressBarWindow = new Window("window", "栅格化进度");
        var progressBar = progressBarWindow.add("progressbar", undefined, 0, numSelected);
        progressBar.preferredSize.width = 300;
        progressBarWindow.show();

        for (var i = 0; i < numSelected; i++) {
            var item = selection[i];
            // 栅格化前可以设置更多选项，如颜色模型等
            doc.rasterize(item, item.visibleBounds, options);
            progressBar.value = i + 1; // 更新进度条
            progressBarWindow.update(); // 刷新窗口以显示更新
        }

        progressBarWindow.close(); // 完成后关闭进度条窗口
        alert("栅格化" + numSelected + "个完成。");
    }
}

rasterizeSelectedItems();
