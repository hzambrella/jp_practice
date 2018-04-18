//``创建地图``
//TODO:ajax
var containerId = 'hzMapTest'
ol3Map.init(containerId, loadMapOpt)
var map = ol3Map.map;
registExtendDraw()
defaultEvent()
//拓展绘制层的绘制对象（功能）
function registExtendDraw() {
    //绘制锚节点功能
    ol3Map.drawable.setDrawOptMap("drawAnchor", {
        type: 'Point',
        style: ol3Style.featureStyleMap['interaction'],
    })

    ol3Map.drawable.setDrawendFuncMap('drawAnchor', function (draw, event) {
        //TODO
    })
}