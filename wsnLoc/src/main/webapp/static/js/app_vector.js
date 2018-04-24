$(function () {
    //``测试数据``
    //地图加载信息数据mock
    var loadMapOpt = mock.getLoadMapOpt()

    //``创建地图``
    //TODO:ajax
    var containerId = 'hzMapTest',
        isDebug = true;
    ol3Map.init(containerId, isDebug)
    var map = ol3Map.map;

    if (map == null) {
        alert("地图初始化异常")
    } else {
        ol3Map.loadMap(loadMapOpt)
        app();
    }

    function app() {
        //所有锚节点
        dataLayerVals.add('anchor', ol3Style.featureStyleMap['anchor'], anchor.refreshData)
        dataLayerVals.refreshData('anchor')
        $('#showAnchor').click(function (event) {
            var map = ol3Map.getMap();
            var layer = dataLayerVals.getLayer('anchor');
            if (layer == null) {
                return;
            }

            anchor.lastSelectedFeature = null;

            if (!this.checked) {
                map.removeLayer(layer)
                map.un('click', anchor.clickEvent)
            } else {
                map.addLayer(layer)
                map.on('click', anchor.clickEvent)
            }
        })
    }
})

var anchor = {
    lastSelectedFeature: null,
    refreshData: _anchorDataRefresh,
    clickEvent: _anchorMapClickEvent,
}

//刷新锚节点数据
function _anchorDataRefresh() {
    var anchors = mock.getAllAnchor();
    var nodeFeatures = [];
    for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i]

        if (!anchor.isConfirm && !ol3Map.baseMapLayer.loadMapOpt.canDebug) {
            //remove it
            continue;
        } else {
            var coordinate = ol3Map.transform.L2C([anchor.x, anchor.y]);
            var nodeFeature = new ol.Feature({
                geometry: new ol.geom.Point(coordinate),
                type: 'anchor',
                typeName: '锚节点',
                id: anchor.id,
                deprecated: anchor.deprecated,
                fault: anchor.fault,
                power: anchor.power,
                isNormal: anchor.isNormal,
                isConfirm: anchor.isConfirm,
            });

            var color = sensorStyle.getColor(anchor.deprecated, anchor.fault, anchor.power);
            var style = sensorStyle.getAnchorStyle(color, anchor.isNormal, anchor.isConfirm)
            nodeFeature.setStyle(style)
            nodeFeatures.push(nodeFeature)
        }
    }
    var source = dataLayerVals.getSource('anchor')
    source.clear();
    source.addFeatures(nodeFeatures);
}

function _anchorMapClickEvent(event) {
    var map = ol3Map.map;
    if (map == null) return;
    // alert(ol3Map.transform.C2L(event.coordinate))
    //探测feature
    var feature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        return feature
    })
    if (feature) {
        if (feature.get('type') == 'anchor' && feature.get('isConfirm')) {
            if (anchor.lastSelectedFeature != null) {
                var l = anchor.lastSelectedFeature;
                var color = sensorStyle.getColor(l.get('deprecated'), l.get('fault'), l.get('power'));
                var style = sensorStyle.getAnchorStyle(color, l.get('isNormal'), l.get('isConfirm'))
                l.setStyle(style)
            }
            feature.setStyle(ol3Style.featureStyleMap['selected'])
            anchor.lastSelectedFeature = feature;

            var l = ol3Map.transform.C2L(event.coordinate);
            var state = feature.get('fault') ? '故障' : '正常';
            var lFrom = feature.get('isNormal') ? '算法获取' : '人工标定';
            var _HTML = "<span >ID:</span><code id='anchorId'>" + feature.get('id') + "</code>" +
                "<button class='copy_anchor_id' title='复制ID' data='" + feature.get('id') + "'><i class='fa fa-copy'></i></button></br>" +
                "<span >锚节点位置:</span><code id='anchorCoordinate'>" + l + "</code>" +
                "<button class='copy_anchor_coordinate' title='复制坐标' data='" + JSON.stringify(l) + "'><i class='fa fa-copy'></i></button></br>" +
                '<span>状态:</span><code>' + state + '</code></br>' +
                '<span>电量:</span><code>' + feature.get('power') * 100 + '%' + '</code></br>' +
                '<span>类型:</span><code>' + feature.get('typeName') + '</code></br>' +
                '<span>坐标获取方式:</span><code>' + lFrom + '</code></br>'

            commonPopup.setCloseCB(function () {
                var l = anchor.lastSelectedFeature;
                if (l != null) {
                    var color = sensorStyle.getColor(l.get('deprecated'), l.get('fault'), l.get('power'));
                    var style = sensorStyle.getAnchorStyle(color, l.get('isNormal'), true)
                    l.setStyle(style)
                }
            });
            commonPopup.show(event.coordinate, _HTML)
        }
    }
}


commonPopup.container.onclick = function (event) {
    $target = $(event.target)
    if ($target.attr('id') == 'popup-closer') {
        return;
    }

    if ($target[0].tagName == 'I') {
        $target = $target.parent();
    }

    if ($target.hasClass('copy_anchor_coordinate')) {
        $('#testClip').attr('data-clipboard-text', $target.attr('data'))
        $('#testClip').trigger('click')
    }

    if ($target.hasClass('copy_anchor_id')) {
        $('#testClip').attr('data-clipboard-text', $target.attr('data'))
        $('#testClip').trigger('click')
    }


    // if ($target.attr('id')){

    // }
}