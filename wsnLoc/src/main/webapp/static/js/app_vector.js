var map = ol3Map.map;
registDraw()

function registDraw() {
    //绘制锚节点
    ol3Map.drawable.setDrawOptMap("drawAnchor", {
        type: 'Point',
        style: ol3Style.featureStyleMap['interaction'],
    })

    ol3Map.drawable.setDrawendFuncMap('drawAnchor', function (draw, event) {
        //TODO
    })
}