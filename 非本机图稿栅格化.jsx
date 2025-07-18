/**把 非本机图稿 栅格化 */
var doc = app.activeDocument;
var dpi = prompt("请输入分辨率",600)
for(var i=0;i<doc.nonNativeItems.length;i++){
var shape = doc.nonNativeItems[i];
var rasterOpts = new RasterizeOptions;
rasterOpts.antiAliasingMethod = AntiAliasingMethod.ARTOPTIMIZED;
rasterOpts.transparency = true;
rasterOpts.resolution = dpi
doc.rasterize(shape, shape.geometricBounds,rasterOpts);
}
/** CPC jialan75 */
/** 2021.05.08 */