$(function () {
    //``测试数据``
    //地图加载信息数据mock
    var loadMapOpt = mock.getLoadMapOpt()

    //``创建地图``
    //TODO:ajax
    var containerId = 'hzMapTest'
    ol3Map.init(containerId)
    var map = ol3Map.map;
    



    if (map == null) {
        alert("地图初始化异常")
    } else {
        ol3Map.loadMap(loadMapOpt)
        // app();
    }

    function app() {
        ol3Event.defaultEvent()
        registExtendDraw()
        //拓展绘制层的绘制对象（功能）
        function registExtendDraw() {
            //绘制锚节点功能
            ol3Map.drawable.setDrawOptMap("drawAnchor", {
                source: null,
                type: 'Point',
                style: ol3Style.featureStyleMap['interaction'],
            })

            ol3Map.drawable.setDrawendFuncMap('drawAnchor', function (draw, event) {
                //TODO
            })
        }
    }
})

