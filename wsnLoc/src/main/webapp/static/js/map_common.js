//地图管理器
var ol3Map = {
    map: null,
    //底图
    baseMapLayer: {
        loadMapOpt: {},
        layers: [],
    },
    //绘制层
    drawMapLayer: {
        keyNow: 'clear',
        lastDrawedFeature: null,
        layer: null,
        source: null,
    },
    //绘图工具
    drawToolLayer: {
        keyNow: 'doDraw',
        lastDrawedFeature: null,
        layer: null,
        source: null,
        draw: null,
    },
    //绘制管理
    interaction: {
        draw: null,
        modify: null,
        select: null,
    },
    //坐标转换  
    //建筑坐标construct 工程师图纸的坐标 
    //逻辑坐标logic  用于算法的坐标
    //大地坐标geodetic(TODO) 
    //建筑坐标和逻辑坐标互转时，原点一致 A/X=scale
    transform: {
        C2L: function (C) {
            var precise=ol3Map.transform.getPercise()
            var scaleSp = ol3Map.transform.checkScale()
            var picDis = parseFloat(scaleSp[0])
            var actDis = parseFloat(scaleSp[1])
            var L = [0, 0];
            L[0] = commonTool.round(C[0] * actDis / picDis,precise);
            L[1] =  commonTool.round(C[1] * actDis / picDis,precise);
            return L;
        },
        L2C: function (L) {
             var precise=ol3Map.transform.getPercise()
            var scaleSp = ol3Map.transform.checkScale()
            var picDis = parseFloat(scaleSp[0])
            var actDis = parseFloat(scaleSp[1])
            var C = [0, 0];
            C[0] = commonTool.round( L[0] * picDis / actDis,precise);
            C[1] =  commonTool.round(L[1] * picDis / actDis,precise);
          
            return C;
        },
        checkScale: function () {
            if (ol3Map.baseMapLayer.loadMapOpt == null && ol3Map.baseMapLayer.loadMapOpt.scale == null) {
                return [-1, -1];
            }
            var scale = ol3Map.baseMapLayer.loadMapOpt.scale;
            var scaleSp = scale.split(':')
            if (scaleSp.length != 2) {
                return -1
            }
            return scaleSp;
        },
        getPercise:function() {
            if (ol3Map.baseMapLayer.loadMapOpt  && ol3Map.baseMapLayer.loadMapOpt.precise) {
                return 3;
            }
            return ol3Map.baseMapLayer.loadMapOpt.precise;
        }
    },

    //初始化  容器id 和是否调试
    init: _initMap,
    //重置attr
    resetAttr: function () {
        ol3Map.attr = commonTool.deepClone(ol3DefaultAttr);
    },
    //获得map 若map不存在，调用init并返回
    getMap: function () {
        var map = ol3Map.map;
        if (map == null) {
            map = ol3Map.init();
        }
        return map;
    },
    //加载地图  loadMapOpt
    loadMap: _loadMap,

    //旋转地图  isToLeft是否向左  radians在原有旋转角度下继续旋转的弧度，正数。
    rotate: _rotateMap,
    // //测量距离，并按照比例尺转化为真实距离 [[x0,y0],[x1,y1]]和比例尺
    getDistance: _getDistance,

    // //改变draw
    // changeDraw: _changeDraw,
}


//属性的默认值
var ol3DefaultAttr = {
    loadMapOpt: {
        precise: 3, //坐标精度，小数点后面几位
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
        center: [0, 0],
    },
}

//绘制层管理器
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
    //默认的绘制注册。在map的init中
    defaultDrawRegist: _defaultDrawRegist,
    superStart: function (key) {
        //停掉绘制工具
        drawToolVals.get(ol3Map.drawToolLayer.keyNow).stop();
        ol3Map.drawToolLayer.keyNow = 'doDraw';
        //显示绘制工具
        $("#drawTool").removeClass('hide');
        //添加draw
        var val = drawVals.get(key)
        var draw = new ol.interaction.Draw(val.opt);
        ol3Map.map.addInteraction(draw);
        draw.on('drawend', val.drawend)
        //设置
        ol3Map.interaction.draw = draw;
        ol3Map.drawMapLayer.keyNow = key;
    },
    superStop: function (key) {
        console.log(1)
        drawToolVals.get(ol3Map.drawToolLayer.keyNow).stop();
        $("#drawTool").addClass('hide');
        ol3Map.drawMapLayer.source.clear();
        if (ol3Map.interaction.draw != null) ol3Map.map.removeInteraction(ol3Map.interaction.draw);
        ol3Map.interaction.draw = null;
        ol3Map.drawMapLayer.lastDrawedFeature = null;
    },
}

//绘制工具管理器
var drawToolVals = {
    defaultVal: {
        opt: {},
        drawend: function () {},
        start: function () {},
        stop: function () {},
    },
    drawValsCollection: {
        //'doDraw'表示没有使用任何绘制工具
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
    //默认的绘制工具注册。在map 的init中
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

//地图事件管理器
var ol3MapEvent = {
    eventCollection: {},
    get: function (key) {
        return ol3MapEvent.eventCollection[key];
    },
    //增加事件处理函数。若事件存在，则覆盖。
    add: function (key, f) {
        if (ol3Map.map == null) {
            ol3Map.init();
        }
        map = ol3Map.map;
        var orgf = ol3MapEvent.get(key);
        if (orgf != null) {
            map.un(key, orgf)
        }
        ol3MapEvent.eventCollection[key] = f;
        map.on(key, f);
    },
    //移除一个事件
    remove: function (key) {
        if (ol3Map.map == null) {
            ol3Map.init();
        }
        map = ol3Map.map;
        var orgf = ol3MapEvent.get(key);
        if (orgf != null) {
            map.un(key, orgf)
        }
        ol3MapEvent.eventCollection[key] = null;
    },
    //注册默认的事件。用于地图创建。
    defaultEvent: function () {
        if (ol3Map.map == null) {
            ol3Map.init();
        }
        map = ol3Map.map;
        ol3MapEvent.add('click', _defaultClickEvent);
    },
}


//数据层管理器
var dataLayerVals = {
    defaultOpt: {
        source: null,
        layer: null,
        refreshData: function () {},
        refreshWhenLoad: false,
    },
    dataLayerCollection: {},
    //方法

    get: function () {
        return dataLayerVals.dataLayerCollection[key];
    },
    //获得source 不存在返回null
    getSource: function (key) {
        if (dataLayerVals.dataLayerCollection[key] == null) {
            return null;
        }

        return dataLayerVals.dataLayerCollection[key].source;
    },

    //获得layer 不存在返回null
    getLayer: function (key) {
        if (dataLayerVals.dataLayerCollection[key] == null) {
            return null;
        }

        return dataLayerVals.dataLayerCollection[key].layer;
    },

    //将一个数据层注册。如果存在，将原来的移除。这里没有将layer add到map中
    add: function (key, style, refreshData, refreshWhenLoad) {
        refreshData == null ? refreshData = function () {} : refreshData = refreshData;
        refreshWhenLoad == null ? refreshWhenLoad = false : refreshWhenLoad = refreshWhenLoad;
        var map = ol3Map.getMap();
        if (dataLayerVals.dataLayerCollection[key] != null) {
            map.removeLayer(dataLayerVals.dataLayerCollection[key].layer);
        }

        var dataLayer = new ol.layer.Vector();
        // map.addLayer(dataLayer)
        var dataSource = new ol.source.Vector();
        dataLayer.setStyle(style)
        dataLayer.setSource(dataSource);
        dataLayerVals.dataLayerCollection[key] = $.extend(true, {}, dataLayerVals.defaultOpt, {
            source: dataSource,
            layer: dataLayer,
            refreshData: refreshData,
            refreshWhenLoad: refreshWhenLoad,
        })
    },
    remove: function (key) {
        if (dataLayerVals.dataLayerCollection[key] != null) {
            map.removeLayer(dataLayerVals.dataLayerCollection[key].layer);
        }
        dataLayerVals.dataLayerCollection[key] = null;
    },
    setStyle: function (key, style) {
        if (!dataLayerVals.initIfNotExsit(key, style)) {
            dataLayerVals.dataLayerCollection[key].layer.setStyle(style);
        }
    },
    initIfNotExsit: function (key, style) {
        style == null ? style = ol3Style.featureStyleMap['data'] : style = style;
        var map = ol3Map.getMap();
        if (dataLayerVals.dataLayerCollection[key] == null) {
            var dataLayer = new ol.layer.Vector();
            map.addLayer(dataLayer)
            var dataSource = new ol.source.Vector();
            dataSource.setStyle(style)
            dataLayer.setSource(dataSource);
            dataLayerVals.dataLayerCollection[key] = {
                source: dataSource,
                layer: dataLayer,
            }
            return true
        } else {
            return false
        }
    },
    refreshData: function (key) {
        dataLayerVals.dataLayerCollection[key].refreshData();
    },
    refreshAll: function () {
        for (var daKey in dataLayerVals.dataLayerCollection) {
            if (dataLayerVals.dataLayerCollection[daKey].refreshWhenLoad) {
                dataLayerVals.dataLayerCollection[daKey].refreshData();
            }
        }
    },
    defaultDataLayerVals: _defaultDataLayerRegist,
}

//```地图```
function _initMap(containerId, isDebug) {
    isDebug == null ? isDebug = false : isDebug = isDebug;
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

    if (isDebug) {
        ol3MapEvent.defaultEvent();
    }

    dataLayerVals.defaultDataLayerVals();
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
    ol3Map.baseMapLayer.loadMapOpt.center = ol.extent.getCenter(extentBaseMap);
    var view = new ol.View({
        projection: projectionBaseMap,
        center: ol3Map.baseMapLayer.loadMapOpt.center,
        zoom: (loadMapOpt.zoom_min + loadMapOpt.zoom_max) / 3,
        maxZoom: loadMapOpt.zoom_max,
        minZoom: loadMapOpt.zoom_min,
        extent: [loadMapOpt.x_min, loadMapOpt.y_min, loadMapOpt.x_max, loadMapOpt.y_max],
    })
    map.setView(view)

    //数据层
    dataLayerVals.refreshAll()

    //debug
    if (loadMapOpt.canDebug) {
        $("#doDebug").show()
    } else {
        $("#doDebug").hide()
    }

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


//```地图绘制```
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

// 选择所绘制的对象(功能)
$('#draw').on("change", function () {
    var map = ol3Map.map;
    if (map == null) {
        map = map.init;
    }

    drawVals.get(ol3Map.drawMapLayer.keyNow).stop();
    drawVals.get(this.value).start();
})

//```绘制工具```
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

$('#drawTool').on('click', function (e) {
    var map = ol3Map.map;
    if (map == null) {
        map = map.init;
    }

    $target = $(e.target)
    if ($target.prop("tagName") != "INPUT") {
        return
    }

    // console.log($target.attr('value'))

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

//```事件相关```
function _defaultClickEvent(event) {
    var map = ol3Map.map;
    if (map == null) return;
    console.log(ol3Map.transform.C2L(event.coordinate))
    // 探测feature
    // var feature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
    //     return feature
    // })
    // if (feature) {
    //     if (feature.get('type') == 'data') {
    //         if (ol3Map.lastSelectedFeature != null) {
    //             ol3Map.lastSelectedFeature.setStyle(ol3Style.featureStyleMap[ol3Map.lastSelectedFeature.get('type')])
    //         }
    //         feature.setStyle(ol3Style.featureStyleMap['selected'])
    //         ol3Map.lastSelectedFeature = feature;
    //     }
    // }

    // 探测layer 有getImageData的跨域问题
    // var layer = map.forEachLayerAtPixel(event.pixel, function (layer) {
    //     return layer
    // })

    // if (layer) {
    //     console.log("覆盖物:", layer, layer.getPosition())
    // }
}

//```默认的数据层```
//显示地图范围和中心点。在init中执行
function _defaultDataLayerRegist() {
    dataLayerVals.add('extent', ol3Style.featureStyleMap['data'], _extentDataRefresh, true);
}

function _extentDataRefresh() {
    var loadMapOpt = ol3Map.baseMapLayer.loadMapOpt;
    var extentData = {
        pminmin: [loadMapOpt.x_min, loadMapOpt.y_min],
        pmaxmin: [loadMapOpt.x_max, loadMapOpt.y_min],
        pminmax: [loadMapOpt.x_min, loadMapOpt.y_max],
        pmaxmax: [loadMapOpt.x_max, loadMapOpt.y_max],
        center: [loadMapOpt.center[0], loadMapOpt.center[1]],
        // locMockInit: [loadMapOpt.x_min, loadMapOpt.y_min],
    }

    var pointFeatureToMinMin = new ol.Feature({
        geometry: new ol.geom.Point(extentData.pminmin),
        type: 'extent',
    });
    var pointFeatureToMaxMin = new ol.Feature({
        geometry: new ol.geom.Point(extentData.pmaxmin),
        type: 'extent',
    });
    var pointFeatureToMinMax = new ol.Feature({
        geometry: new ol.geom.Point(extentData.pminmax),
        type: 'extent',
    });
    var pointFeatureToMaxMax = new ol.Feature({
        geometry: new ol.geom.Point(extentData.pmaxmax),
        type: 'extent',
    });
    var lineTop = new ol.Feature({
        geometry: new ol.geom.LineString([extentData.pmaxmax, extentData.pminmax]),
        type: 'extent',
    })
    var lineLeft = new ol.Feature({
        geometry: new ol.geom.LineString([extentData.pminmax, extentData.pminmin]),
        type: 'extent',
    })
    var lineRight = new ol.Feature({
        geometry: new ol.geom.LineString([extentData.pmaxmax, extentData.pmaxmin]),
        type: 'extent',
    })
    var lineBottom = new ol.Feature({
        geometry: new ol.geom.LineString([extentData.pminmin, extentData.pmaxmin]),
        type: 'extent',
    })

    var pointFeatureToCenter = new ol.Feature({
        geometry: new ol.geom.Point(extentData.center),
        type: 'extent',
    });
    var points = [];
    points.push(pointFeatureToMinMin);
    points.push(pointFeatureToMaxMin);
    points.push(pointFeatureToMinMax);
    points.push(pointFeatureToMaxMax);
    points.push(pointFeatureToCenter);
    points.push(lineTop);
    points.push(lineLeft);
    points.push(lineRight);
    points.push(lineBottom);
    var source = dataLayerVals.getSource('extent');
    source.clear();
    source.addFeatures(points);
}

$("#showExtendOfMap").click(function (event) {
    var map = ol3Map.getMap();
    var layer = dataLayerVals.getLayer('extent');
    if (layer == null) {
        return;
    }
    if (!this.checked) {
        map.removeLayer(layer)
    } else {
        map.addLayer(layer)
    }
})

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
    var position = ol3Map.transform.L2C(mock.getPosition());
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

//```popup```
var commonPopup = {
    container: document.getElementById('popup'),
    content: document.getElementById('popup-content'),
    closer: document.getElementById('popup-closer'),
    closeCB:function(){},
    setCloseCB:function(cb){
        commonPopup.closeCB=cb;
    },
    show: function (position, _HTML) {
        popupOverlay.setPosition(position)
        commonPopup.content.innerHTML = _HTML;
        var map = ol3Map.getMap();
        map.addOverlay(popupOverlay);
    },
}

var popupOverlay = new ol.Overlay({
    element: commonPopup.container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
})

commonPopup.closer.onclick = function () {
    popupOverlay.setPosition(undefined);
    commonPopup.closer.blur();
    var map = ol3Map.getMap();
    map.removeOverlay(popupOverlay);
    commonPopup.closeCB();
    return false;
};