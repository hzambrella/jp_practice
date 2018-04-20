var ol3Map = {
    map: null,
    baseMapLayer: {
        loadMapOpt: {},
        layers: [],
    },
    drawMapLayer: {
        keyNow: 'clear',
        lastDrawedFeature: null,
        layer: null,
        source: null,
    },
    drawToolLayer: {
        keyNow: 'doDraw',
        lastDrawedFeature: null,
        layer: null,
        source: null,
        draw: null,
    },
    interaction: {
        draw: null,
        modify: null,
        select: null,
    },

    //初始化
    init: _initMap,
    //重置attr
    resetAttr: function () {
        ol3Map.attr = commonTool.deepClone(ol3DefaultAttr);
    },
    //加载地图
    loadMap: _loadMap,

    //旋转地图
    rotate: _rotateMap,
    // //测量距离，并按照比例尺转化为真实距离
    getDistance: _getDistance,

    // //改变draw
    // changeDraw: _changeDraw,
}


//属性的默认值
var ol3DefaultAttr = {
    loadMapOpt: {
        needDefaultEventListener: true,
        x_min: 0,
        x_max: 0,
        y_min: 0,
        y_max: 0,
        zoom_min: 0,
        zoom_max: 0,
        basicMapSource: '',
        basicMapType: '',
        scale: '0:0',
        canDebug: false,
    },
}

var drawVals = {
    defaultVal: {
        opt: {
            source: ol3Map.drawMapLayer.source,
            type: 'Point',
            style: ol3Style.featureStyleMap['interaction'],
        },
        drawend: function () {},
        start: function () {},
        stop: function () {},
    },
    drawValsCollection: {
        'clear': {
            opt: {},
            drawend: function () {},
            start: function () {
                drawToolVals.get(ol3Map.drawToolLayer.keyNow).stop();
                $("#drawOperate").addClass('hide');
                ol3Map.drawMapLayer.keyNow = 'clear';
                drawVals.superStop();
            },
            stop: function () {},
        }
    },
    get: function (key) {
        return drawVals.drawValsCollection[key];
    },
    set: function (key, val) {
        drawVals.drawValsCollection[key] = val;
    },
    remove: function (key) {
        drawVals.drawValsCollection[key] = null;
    },
    defaultDrawRegist: _defaultDrawRegist,
    superStart: function (key) {
        drawToolVals.get(ol3Map.drawToolLayer.keyNow).stop();
        ol3Map.drawToolLayer.keyNow = 'doDraw';
        $("#drawOperate").removeClass('hide');
        var val = drawVals.get(key)
        var draw = new ol.interaction.Draw(val.opt);
        ol3Map.map.addInteraction(draw);
        draw.on('drawend', val.drawend)
        ol3Map.interaction.draw = draw;
        ol3Map.drawMapLayer.keyNow = key;
    },
    superStop: function (key) {
        ol3Map.drawMapLayer.source.clear();
        if (ol3Map.interaction.draw != null) ol3Map.map.removeInteraction(ol3Map.interaction.draw);
        ol3Map.interaction.draw = null;
        ol3Map.drawMapLayer.lastDrawedFeature = null;
    },
}

var drawToolVals = {
    defaultVal: {
        opt: {},
        drawend: function () {},
        start: function () {},
        stop: function () {},
    },
    drawValsCollection: {
        'doDraw': {
            opt: {},
            drawend: function () {},
            start: function () {},
            stop: function () {},
        }
    },

    get: function (key) {
        return drawToolVals.drawValsCollection[key];
    },
    set: function (key, val) {
        drawToolVals.drawValsCollection[key] = val;
    },
    remove: function (key) {
        drawToolVals.drawValsCollection[key] = null;
    },
    defaultDrawToolRegist: _defaultDrawToolRegist,
    superStart: function (key) {
        ol3Map.drawToolLayer.keyNow = key;

    },
    superStop: function (key) {
        ol3Map.drawToolLayer.keyNow = 'doDraw'
        ol3Map.drawToolLayer.lastDrawedFeature = null;
        $("#doDraw").prop('checked', true);
    },
}


function _initMap(containerId, ) {
    var map = new ol.CanvasMap({
        target: containerId,
    });
    ol3Map.map = map;
    ol3Map.drawMapLayer.layer = new ol.layer.Vector();
    map.addLayer(ol3Map.drawMapLayer.layer);
    ol3Map.drawMapLayer.source = new ol.source.Vector();
    ol3Map.drawMapLayer.layer.setSource(ol3Map.drawMapLayer.source);

    ol3Map.drawToolLayer.layer = new ol.layer.Vector();
    map.addLayer(ol3Map.drawToolLayer.layer);
    ol3Map.drawToolLayer.source = new ol.source.Vector();
    ol3Map.drawToolLayer.layer.setSource(ol3Map.drawToolLayer.source);

    // var opt = drawVals.get('test');
    // opt.source = ol3Map.drawMapLayer.source;
    // var drawTest = new ol.interaction.Draw(opt)
    // map.addInteraction(drawTest);

    ol3Map.interaction.select = new ol.interaction.Select({
        style: ol3Style.featureStyleMap['selected'],
    })

    ol3Map.interaction.modify = new ol.interaction.Modify({
        features: ol3Map.interaction.select.getFeatures(),
    })
    ol3Map.interaction.select.setActive(false)
    ol3Map.interaction.modify.setActive(false)
    map.addInteraction(ol3Map.interaction.select)
    map.addInteraction(ol3Map.interaction.modify)
    drawVals.defaultDrawRegist();
    drawToolVals.defaultDrawToolRegist();
    return map;
}

function _loadMap(loadMapOpt) {
    var map = ol3Map.map
    if (map == null) map = ol3Map.init();

    //清空底图层
    for (var i = 0; i < ol3Map.baseMapLayer.layers.length; i++) {
        map.removeLayer(ol3Map.baseMapLayer.layers[i]);
    }
    ol3Map.baseMapLayer.layers = [];

    $.extend(true, ol3Map.baseMapLayer.loadMapOpt, ol3DefaultAttr.loadMapOpt, loadMapOpt);
    var mapGeoJSONData = loadMapOpt.basicMapSource;
    var extentBaseMap = [loadMapOpt.x_min, loadMapOpt.y_min, loadMapOpt.x_max, loadMapOpt.y_max];

    var projectionBaseMap = new ol.proj.Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extentBaseMap,
    });

    var layerBase = new ol.layer.Vector({
        renderMode: 'image',
        source: new ol.source.Vector({
            url: mapGeoJSONData,
            projection: projectionBaseMap,
            format: new ol.format.GeoJSON()
        }),
        style: ol3Style.basicMapStyle['geoJSON'],
    })
    map.addLayer(layerBase)

    ol3Map.baseMapLayer.layers.push(layerBase)
    var view = new ol.View({
        projection: projectionBaseMap,
        center: ol.extent.getCenter(extentBaseMap),
        zoom: (loadMapOpt.zoom_min + loadMapOpt.zoom_max) / 3,
        maxZoom: loadMapOpt.zoom_max,
        minZoom: loadMapOpt.zoom_min,
        extent: [loadMapOpt.x_min, loadMapOpt.y_min, loadMapOpt.x_max, loadMapOpt.y_max],
    })
    map.setView(view)

    return map;
}

//旋转地图 isToLeft是否向左  radians在原有旋转角度下继续旋转的弧度，正数。
function _rotateMap(isToLeft, radians) {
    if (ol3Map.map == null) {
        return;
    }

    radians == null ? radians = Math.PI / 6 : radians = radians;
    radians = Math.abs(radians);

    var view = ol3Map.map.getView();
    isToLeft ? view.setRotation(view.getRotation() - radians) : view.setRotation(view.getRotation() + radians);
}

//``地图旋转``
document.getElementById("rotateLeft").onclick = function () {
    ol3Map.rotate(true)
}

document.getElementById("rotateRight").onclick = function () {
    ol3Map.rotate(false)
}

//计算距离 coordinates[[x0,y0],[x1,y1]]  scale 是字符串类型：“mm:m”
//返回-1说明计算失败。可能是比例尺有问题,坐标数组长度有问题等
//返回m为单位的距离
function _getDistance(coordinates, scale) {
    var scaleSp = scale.split(':')
    if (scaleSp.length != 2) {
        return -1
    }

    if (coordinates.length != 2 || coordinates[0].length != 2 || coordinates[1].length != 2) {
        return -1
    }

    var picDis = parseFloat(scaleSp[0])
    var actDis = parseFloat(scaleSp[1])
    var disCacu = Math.sqrt(Math.pow(coordinates[0][0] - coordinates[1][0], 2) + Math.pow(coordinates[0][1] - coordinates[1][1], 2))
    if (picDis == 0) return -1;
    return disCacu * actDis / picDis;
}

//默认的draw注册。
function _defaultDrawRegist() {
    //clear
    //测距
    var rangeDrawOpt = {
        opt: {
            source: ol3Map.drawMapLayer.source,
            type: 'LineString',
            style: ol3Style.featureStyleMap['interaction'],
            maxPoints: 2,
        },
        drawend: function (event) {
            var currentFeature = event.feature; //获得当前绘制的要素

            if (ol3Map.drawMapLayer.lastDrawedFeature != null) {
                ol3Map.drawMapLayer.source.removeFeature(ol3Map.drawMapLayer.lastDrawedFeature);
            }

            ol3Map.drawMapLayer.lastDrawedFeature = currentFeature;
            var geo = currentFeature.getGeometry(); //获得要素的几何信息
            var coordinates = geo.getCoordinates(); //获得几何坐标
            var dis = ol3Map.getDistance(coordinates, ol3Map.baseMapLayer.loadMapOpt.scale)
            $("#drawResult").text(dis);
        },
        start: function () {
            drawVals.superStart('rangeDis');
        },
        stop: function () {
            drawVals.superStop('rangeDis');
        },
    }
    drawVals.set('rangeDis', rangeDrawOpt);

    //绘制锚节点
    var anchorDrawOpt = {
        opt: {
            source: ol3Map.drawMapLayer.source,
            type: 'Point',
            style: ol3Style.featureStyleMap['interaction'],
        },
        drawend: function (event) {

        },
        start: function () {
            drawVals.superStart('drawAnchor');
        },
        stop: function () {
            drawVals.superStop('drawAnchor');
        },
    }
    drawVals.set('drawAnchor', anchorDrawOpt);
}

function _defaultDrawToolRegist() {
    //画图时测距
    var doRangeOpt = {
        source: ol3Map.drawToolLayer.source,
        type: 'LineString',
        style: ol3Style.featureStyleMap['interaction'],
        maxPoints: 2,
    };
    var doRangeDrawend = function (event) {
        var currentFeature = event.feature; //获得当前绘制的要素

        if (ol3Map.drawToolLayer.lastDrawedFeature != null) {
            ol3Map.drawToolLayer.source.removeFeature(ol3Map.drawToolLayer.lastDrawedFeature);
        }

        ol3Map.drawToolLayer.lastDrawedFeature = currentFeature;
        var geo = currentFeature.getGeometry(); //获得要素的几何信息
        var coordinates = geo.getCoordinates(); //获得几何坐标
        var dis = ol3Map.getDistance(coordinates, ol3Map.baseMapLayer.loadMapOpt.scale)
        $("#drawResult").text(dis);
    }

    var doRangeVal = {
        opt: doRangeOpt,
        drawend: doRangeDrawend,
        start: function () {
            $('#ranging').prop('checked', true);
            var draw = new ol.interaction.Draw(doRangeOpt);
            if (ol3Map.interaction.draw != null) {
                ol3Map.map.removeInteraction(ol3Map.interaction.draw)
            }
            ol3Map.map.addInteraction(draw);
            draw.on('drawend', doRangeDrawend)
            ol3Map.drawToolLayer.draw = draw;
            drawToolVals.superStart('doRange');
        },
        stop: function () {
            ol3Map.map.removeInteraction(ol3Map.drawToolLayer.draw)
            if (ol3Map.interaction.draw != null) ol3Map.map.addInteraction(ol3Map.interaction.draw);
            $('#doRange').prop('checked', false)
            drawToolVals.superStop('doRange');
            ol3Map.drawToolLayer.source.clear();
        },
    }
    drawToolVals.set('doRange', doRangeVal);


    //修改
    var modifyOpt = {
        opt: {},
        start: function () {
            ol3Map.interaction.select.setActive(true);
            ol3Map.interaction.modify.setActive(true);
            if (ol3Map.interaction.draw != null) {
                ol3Map.map.removeInteraction(ol3Map.interaction.draw)
            }
            drawToolVals.superStart('doModify');
            $("#doModify").prop('checked', true);
        },
        stop: function () {
            ol3Map.interaction.select.setActive(false);
            ol3Map.interaction.modify.setActive(false);
            if (ol3Map.interaction.draw != null) {
                ol3Map.map.addInteraction(ol3Map.interaction.draw)
            }
            drawToolVals.superStop();
        },
    }
    drawToolVals.set('doModify', modifyOpt);

    //删除
    var deleteOpt = {
        opt: {},
        start: function () {
            ol3Map.interaction.select.setActive(true);
            ol3Map.interaction.modify.setActive(true);
            ol3Map.interaction.select.on('select', doDeleteToFeature)
            drawToolVals.superStart('doRange');
            if (ol3Map.interaction.draw != null) {
                ol3Map.map.removeInteraction(ol3Map.interaction.draw)
            }
            drawToolVals.superStart('doDelete');
            $("#doDelete").prop('checked', true);
        },
        stop: function () {
            ol3Map.interaction.select.setActive(false);
            ol3Map.interaction.modify.setActive(false);
            ol3Map.interaction.select.un('select', doDeleteToFeature)
            if (ol3Map.interaction.draw != null) {
                ol3Map.map.addInteraction(ol3Map.interaction.draw)
            }
            drawToolVals.superStop();
        },
    }
    drawToolVals.set('doDelete', deleteOpt);

    function doDeleteToFeature(e) {
        if (e.target.getFeatures() && e.target.getFeatures().getLength() > 0) {
            e.target.getFeatures().forEach(function (el) {
                ol3Map.drawMapLayer.source.removeFeature(el)
            })
        }
    }
}




// 选择所绘制的对象(功能)
$('#draw').on("change", function () {
    var map = ol3Map.map;
    if (map == null) {
        map = map.init;
    }

    drawVals.get(ol3Map.drawMapLayer.keyNow).stop();
    drawVals.get(this.value).start();
})

$('#drawOperate').on('click', function (e) {
    var map = ol3Map.map;
    if (map == null) {
        map = map.init;
    }

    $target = $(e.target)
    if ($target.prop("tagName") != "INPUT") {
        return
    }

    console.log($target.attr('value'))

    drawToolVals.get(ol3Map.drawToolLayer.keyNow).stop();
    if ($target.attr('value') != 'doDraw') {
        drawToolVals.get($target.attr('value')).start();
    }
})

$("#doRange").on('change', function () {
    var checked = $('#doRange').prop('checked');
    if (checked && ol3Map.drawToolLayer.keyNow != 'doRange') {
        drawToolVals.get(ol3Map.drawToolLayer.keyNow).stop();
        drawToolVals.get('doRange').start();
    }

    if (!checked && ol3Map.drawToolLayer.keyNow == 'doRange') {
        drawToolVals.get('doRange').stop();
        ol3Map.drawToolLayer.keyNow = 'doDraw';
    }
})


//``测试要素图层  显示地图的范围``
//TODO:


//``提示工具``
$('.ol-zoom-in, .ol-zoom-out').tooltip({
    placement: 'right'
});

$('.ol-rotate-reset, .ol-attribution button[title]').tooltip({
    placement: 'left'
});

// ```定位相关```
$('#location').click(function (event) {
    //TODO: ajax
    var position = mock.getPosition();
    var map = ol3Map.map;
    if (map == null) {
        return;
    }

    if (!this.checked) {
        map.getOverlays().clear()
    } else {
        var marker = ol3Style.overlayCommon.add(map, position, 'haha', null, 'head')
        ol3Style.overlayCommon.rotate(marker, 45)
    }
})

//```地图范围```



$("#doDebug").click(function () {
    $("#debug").dialog('open')
})