//``测试数据``
//地图加载信息数据mock
loadMapOpt = mock.getLoadMapOpt()

//```地图相关```
var ol3Map = {
    //属性
    //ol.canvasMap
    map: null,
    prop: null,
    //初始化地图参数
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
    },
    //可绘制层相关
    drawable: {
        sourceDrawable: null, //ol.source.Vector
        layerDrawable: null, //ol.layer.Vector
        lastDrawedFeature: null, //最新一次画的要素
        draw: null, //ol.interaction.Draw
        select: null, //ol.interaction.Select
        modify: null, //ol.interaction.Modify
        drawendCb: null,
        //传给draw方法的参数
        drawOpt: {
            isClear: false,
            interactionDrawOpt: {}, //ol.interaction.Draw.options
            drawendCb: function () {},
            // name:'',//当前绘制的是什么(绘制的功能叫什么)，关系到drawend callback的调用
        },
        //drawend事件的回调函数的map
        drawendFuncMap: {
            null: function () {
                return
            }
        },
        setDrawendFuncMap: function (key, fun) {
            ol3Map.drawable.drawendFuncMap[key] = fun;
        },
        //ol.interaction.Draw的opt的map
        drawOptMap: {
            null: {
                type: 'Polygon',
                style: ol3Style.featureStyleMap['interaction'],
            }
        },
        setDrawOptMap: function (key, fun) {
            ol3Map.drawable.drawOptMap[key] = fun;
        },
    },
    //``flag``
    operateFlag: {},

    //方法
    //初始化地图
    init: createMap,
    //旋转地图
    rotate: rotateMap,
    //测量距离，并按照比例尺转化为真实距离
    getDistance: getDistance,
    //开启/关闭绘制图层
    draw: draw,

    // event: {
    //     listenerMap: {
    //         'click': null,
    //         'pointermove': null,
    //     },
    //     bindUniqueEvent: bindUniqueEvent,
    // }
}

var defaultProp = {
    //上一个选择的要素
    lastSelectedFeature: null,
}

//创建地图
function createMap(containerId, loadMapOpt) {
    ol3Map.prop = commonTool.copy(defaultProp)
    ol3Map.layerDrawable = null;
    var mapGeoJSONData = loadMapOpt.basicMapSource;
    var extentBaseMap = [loadMapOpt.x_min, loadMapOpt.y_min, loadMapOpt.x_max, loadMapOpt.y_max];

    var projectionBaseMap = new ol.proj.Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extentBaseMap,
    });
    var map = new ol.CanvasMap({
        layers: [
            new ol.layer.Vector({
                renderMode: 'image',
                source: new ol.source.Vector({
                    url: mapGeoJSONData,
                    projection: projectionBaseMap,
                    format: new ol.format.GeoJSON()
                }),
                style: ol3Style.basicMapStyle['geoJSON'],
            })
        ],
        target: containerId,
        view: new ol.View({
            projection: projectionBaseMap,
            center: ol.extent.getCenter(extentBaseMap),
            zoom: (loadMapOpt.zoom_min + loadMapOpt.zoom_max) / 3,
            maxZoom: loadMapOpt.zoom_max,
            minZoom: loadMapOpt.zoom_min,
            extent: [loadMapOpt.x_min, loadMapOpt.y_min, loadMapOpt.x_max, loadMapOpt.y_max],
        })
    });
    ol3Map.map = map;
    if (loadMapOpt.needDefaultEventListener) {
        defaultEvent();
    }

    //增加一个可绘制图层
    ol3Map.drawable.layerDrawable = new ol.layer.Vector();
    map.addLayer(ol3Map.drawable.layerDrawable);
    return map
}

//旋转地图
function rotateMap(isToLeft) {
    if (ol3Map.map == null) {
        return;
    }
    var view = ol3Map.map.getView();
    isToLeft ? view.setRotation(view.getRotation() - Math.PI / 6) : view.setRotation(view.getRotation() + Math.PI / 6);
}

//计算距离 coordinates[[x0,y0],[x1,y1]]  scale 是字符串类型：“mm:m”
//返回-1说明计算失败。可能是比例尺有问题,坐标数组长度有问题等
//返回m为单位的距离
function getDistance(coordinates, scale) {
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

// 绘制层 drawOpt ol3Map.drawable.drawOpt
function draw(drawOpt) {
    var map = ol3Map.map;
    if (map == null) return;

    if (drawOpt.isClear) {
        //清除最后绘制的要素记录
        ol3Map.drawable.lastDrawedFeature = null;
        //清除画板
        map.removeInteraction(ol3Map.drawable.draw);
        ol3Map.drawable.draw = null;
        ol3Map.drawable.sourceDrawable = null;
        ol3Map.drawable.layerDrawable.setSource(ol3Map.drawable.sourceDrawable);
        //修改工具清除
        map.removeInteraction(ol3Map.drawable.select)
        map.removeInteraction(ol3Map.drawable.modify)
        ol3Map.drawable.select = null;
        ol3Map.drawable.modify = null;
    } else {
        //清空上个功能绘制的最新要素
        ol3Map.drawable.lastDrawedFeature = null;
        // else if (drawOpt.isModify) {
        ol3Map.drawable.sourceDrawable = new ol.source.Vector();
        // if (null == ol3Map.drawable.layerDrawable) {
        //     ol3Map.drawable.layerDrawable = new ol.layer.Vector({
        //         source: ol3Map.drawable.sourceDrawable,
        //     });
        //     map.addLayer(ol3Map.drawable.layerDrawable);
        // } else {
        //     //清空原来的source
        //     ol3Map.drawable.layerDrawable.setSource(null)
        //     ol3Map.drawable.layerDrawable.setSource(ol3Map.drawable.sourceDrawable);
        // }
        ol3Map.drawable.layerDrawable.setSource(null)
        ol3Map.drawable.layerDrawable.setSource(ol3Map.drawable.sourceDrawable);
        drawOpt.interactionDrawOpt.source = ol3Map.drawable.sourceDrawable;

        //处理之前的draw
        //清空ol.interaction.Draw的drawend事件，以便重新绑定
        if (ol3Map.drawable.draw != null) {
            ol3Map.drawable.draw.un('drawend', ol3Map.drawable.drawendCb)
        }
        map.removeInteraction(ol3Map.drawable.draw);

        //创建新的draw
        ol3Map.drawable.draw = new ol.interaction.Draw(
            drawOpt.interactionDrawOpt
        )
        //重新设置drawend事件
        ol3Map.drawable.drawendCb = drawOpt.drawendCb;

        if (ol3Map.drawable.drawendCb != null) {
            ol3Map.drawable.draw.on('drawend', function (event) {
                ol3Map.drawable.drawendCb(ol3Map.drawable.draw, event)
            })
        }
        map.addInteraction(ol3Map.drawable.draw);
    }
}

// function bindUniqueEvent(type, listener) {
//     var map = ol3Map.map
//     if (map == null) return;
//     var orgListener = ol3Map.event.listenerMap[type]
//     if (orgListener != null) {
//         map.un(type, orgListener)
//     }
//     listenerMap[type] = listener
//     map.on(type, listener)
// }

//``地图旋转``
document.getElementById("rotateLeft").onclick = function () {
    ol3Map.rotate(true)
}

document.getElementById("rotateRight").onclick = function () {
    ol3Map.rotate(false)
}

//```可绘制层```
registDefaultDraw()
//预设测距的draw。
function registDefaultDraw() {
    ol3Map.drawable.setDrawOptMap("rangeDis", {
        type: 'LineString',
        style: ol3Style.featureStyleMap['interaction'],
        maxPoints: 2,
    })

    ol3Map.drawable.setDrawendFuncMap('rangeDis', function (draw, event) {
        currentFeature = event.feature; //获得当前绘制的要素

        if (ol3Map.drawable.draw != null && ol3Map.drawable.sourceDrawable != null && ol3Map.drawable.lastDrawedFeature != null) {
            ol3Map.drawable.sourceDrawable.removeFeature(ol3Map.drawable.lastDrawedFeature);
        }
        ol3Map.drawable.lastDrawedFeature = currentFeature;
        var geo = currentFeature.getGeometry(); //获得要素的几何信息
        var coordinates = geo.getCoordinates(); //获得几何坐标
        var dis = ol3Map.getDistance(coordinates, loadMapOpt.scale)
        $("#drawResult").text(dis);
    })
}

// 选择所绘制的对象(功能)
$('#draw').on("change", function () {
    var drawOpt = commonTool.copy(ol3Map.drawable.drawOpt);
    drawOpt.isClear = (this.value == 'clear');

    //若切换前是修改状态
    $('#doDraw').prop('checked', true)
    if (ol3Map.drawable.select != null || ol3Map.drawable.modify != null) {
        if (ol3Map.drawable.select.getActive() || ol3Map.drawable.modify.getActive()) {
            if (ol3Map.drawable.select != null) ol3Map.drawable.select.setActive(false);
            if (ol3Map.drawable.modify != null) ol3Map.drawable.modify.setActive(false);
            if (ol3Map.drawable.draw != null) map.addInteraction(ol3Map.drawable.draw);
        }
    }

    if (!drawOpt.isClear) {
        $('#drawOperate').removeClass('hide')

        drawOpt.interactionDrawOpt = ol3Map.drawable.drawOptMap[this.value];
        drawOpt.drawendCb = ol3Map.drawable.drawendFuncMap[this.value];
    } else {
        $('#drawOperate').addClass('hide')
    }

    ol3Map.draw(drawOpt);
})

var doDrawDealerMap = {
    'doDraw': function (map) {
        if (ol3Map.drawable.select != null) {
            ol3Map.drawable.select.setActive(false)
            ol3Map.drawable.select.un('select', doDeleteToFeature)
        }
        if (ol3Map.drawable.modify != null) ol3Map.drawable.modify.setActive(false)
        if (ol3Map.drawable.layerDrawable != null &&
            ol3Map.drawable.sourceDrawable != null &&
            ol3Map.drawable.draw != null) {
            map.addInteraction(ol3Map.drawable.draw);
        }
    },
    'doModify': function (map) {
        getSelectAndModify()
        ol3Map.drawable.select.un('select', doDeleteToFeature)
    },
    'doDelete': function (map) {
        ol3Map.drawable.lastDrawedFeature = null;
        getSelectAndModify()
        ol3Map.drawable.select.on('select', doDeleteToFeature)
    },
}

function doDeleteToFeature(e) {
    if (e.target.getFeatures() != null && e.target.getFeatures().getLength() > 0) {
        e.target.getFeatures().forEach(function (el) {
            console.log(el)
            ol3Map.drawable.sourceDrawable.removeFeature(el)
        })
    }
    
}

function getSelectAndModify() {
    map.removeInteraction(ol3Map.drawable.draw);
    if (ol3Map.drawable.select == null) {
        ol3Map.drawable.select = new ol.interaction.Select({
            style: ol3Style.featureStyleMap['selected'],
        })
        map.addInteraction(ol3Map.drawable.select)
    }

    if (ol3Map.drawable.modify == null) {
        ol3Map.drawable.modify = new ol.interaction.Modify({
            features: ol3Map.drawable.select.getFeatures(),
        })
        map.addInteraction(ol3Map.drawable.modify)
    }
    ol3Map.drawable.select.setActive(true)
    ol3Map.drawable.modify.setActive(true)
}


$('#drawOperate').on('click', function (e) {
    var map = ol3Map.map;
    if (map == null) return;
    $target = $(e.target)
    if ($target.prop("tagName") != "INPUT") {
        return
    }
    var dealer = doDrawDealerMap[$target.attr('value')]
    if (dealer != null) dealer(map);
})

//``测试要素图层  显示地图的范围``
var testData = {
    p1: [loadMapOpt.x_min, loadMapOpt.y_min],
    p2: [loadMapOpt.x_max, loadMapOpt.y_min],
    p3: [loadMapOpt.x_min, loadMapOpt.y_max],
    p4: [loadMapOpt.x_max, loadMapOpt.y_max],
    locMockInit: [loadMapOpt.x_min, loadMapOpt.y_min],
}

var pointFeatureToTest1 = new ol.Feature({
    geometry: new ol.geom.Point(testData.p1),
    type: 'data',
});
var pointFeatureToTest2 = new ol.Feature({
    geometry: new ol.geom.Point(testData.p2),
    type: 'data',
});
var pointFeatureToTest3 = new ol.Feature({
    geometry: new ol.geom.Point(testData.p3),
    type: 'data',
});
var pointFeatureToTest4 = new ol.Feature({
    geometry: new ol.geom.Point(testData.p4),
    type: 'data',
});
var lineFeatureToTest = new ol.Feature({
    type: 'data',
    geometry: new ol.geom.LineString([
        testData.p1,
        testData.p2,
        testData.p3,
        testData.p4,
    ]),
});

var sourceDataLayer = new ol.source.Vector({
    features: [pointFeatureToTest1, pointFeatureToTest2, pointFeatureToTest3, lineFeatureToTest],
});

var vectorDataLayer = new ol.layer.Vector({
    source: sourceDataLayer,
    style: ol3Style.featureStyleMap['data'],
})

sourceDataLayer.addFeature(pointFeatureToTest4);

$("#showExtendOfMap").click(function (event) {
    var map = ol3Map.map
    if (map == null) {
        return;
    }

    if (!this.checked) {
        map.removeLayer(vectorDataLayer)
    } else {
        map.addLayer(vectorDataLayer)
    }
})

//``地图事件监听``
function defaultEvent() {
    var map = ol3Map.map;
    if (map == null) return;

    map.on('click', defaultol3ClickListener)
    map.on('pointermove', defaultol3pointermoveListener)
}

function defaultol3ClickListener(event) {
    var map = ol3Map.map;
    if (map == null) return;
    // console.log(event.coordinate)
    // 探测feature
    var feature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        return feature
    })
    if (feature) {
        if (feature.get('type') == 'data') {
            if (ol3Map.lastSelectedFeature != null) {
                ol3Map.lastSelectedFeature.setStyle(ol3Style.featureStyleMap[ol3Map.lastSelectedFeature.get('type')])
            }
            feature.setStyle(ol3Style.featureStyleMap['selected'])
            ol3Map.lastSelectedFeature = feature;
        }
    }

    // 探测layer 有getImageData的跨域问题
    // var layer = map.forEachLayerAtPixel(event.pixel, function (layer) {
    //     return layer
    // })

    // if (layer) {
    //     console.log("覆盖物:", layer, layer.getPosition())
    // }
}

//地图的指针移动事件
function defaultol3pointermoveListener(e) {
    var map = ol3Map.map;
    if (map == null) return;
    var pixel = map.getEventPixel(e.originalEvent)
    var isFeature = map.hasFeatureAtPixel(pixel)
    var cursorStyle = {
        'data': 'pointer',
    }
    var cursor = '';

    if (isFeature) {
        var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            return feature
        })

        var c = cursorStyle[feature.get('type')]
        if (c) {
            cursor = c;
        }
    }

    map.getTargetElement().style.cursor = cursor;
}

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
        var marker = ol3Style.overlayCommon.add(position, 'haha', null, 'head')
        ol3Style.overlayCommon.rotate(marker, 45)
    }
})

// doDebug()
//debug
function doDebug() {
    var map = ol3Map.map;
    if (map == null) {
        return
    }

    map.getView().on('change:resolution', function () {
        console.log(map.getView().getZoom());
    })
}