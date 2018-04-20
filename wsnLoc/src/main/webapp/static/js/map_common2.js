//ol3Map 地图对象
//ol3MapReset 重置地图对象的参数，用于新建地图等。注意深拷贝
//ol3MapDrawToolMap 绘制工具。在绘制时提供一些工具。注意与绘制层中draw的切换

//```地图相关```
var ol3Map = {
    //属性
    //默认值,恢复默认值时深拷贝它
    defaultAttr: _defaultAttr,
    //ol.canvasMap
    map: null,
    prop: {
        lastSelectedFeature: null,
    },
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
        canDebug: false,
    },
    //可绘制层管理(不包括绘制工具)
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
    init: _createMap,
    //清除地图TODO
    destory: _destoryMap,
    //旋转地图
    rotate: _rotateMap,
    //测量距离，并按照比例尺转化为真实距离
    getDistance: _getDistance,
    //开启/关闭绘制图层
    draw: _draw,
    //生成绘图工具
    createAllDrawTool: _creatAllDrawTool,
    //重置绘制工具。注意：可能会将老的draw添加到map
    resetAllDrawTool: _resetAllDrawTool,
    // event: {
    //     listenerMap: {
    //         'click': null,
    //         'pointermove': null,
    //     },
    //     bindUniqueEvent: bindUniqueEvent,
    // }
}

var _defaultAttr = {
    map: null,
    prop: {
        lastSelectedFeature: null,
    },
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
        canDebug: false,
    },
    //可绘制层管理(不包括绘制工具)
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
}
// resetDrawable: function (map) {
//     if (map == null) return;
//     ol3Map.drawable = commonTool.deepClone(ol3MapReset.drawable)

//     ol3Map.drawable.layerDrawable = new ol.layer.Vector();
//     map.addLayer(ol3Map.drawable.layerDrawable);
//     ol3Map.drawable.sourceDrawable = new ol.source.Vector();
//     ol3Map.drawable.layerDrawable.setSource(ol3Map.drawable.sourceDrawable);
//     registDefaultDraw();
//     ol3Map.createAllDrawTool();
// }

//创建和重置地图。重置时先destory原来的，再创建。
function _createMap(containerId, loadMapOpt) {
    _destoryCommon();

    $.extend(true, ol3Map.loadMapOpt, loadMapOpt);
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

    if (ol3Map.loadMapOpt.canDebug) {
        $('#doDebug').css('display', 'block')
    } else {
        $('#doDebug').css('display', 'none')
    }

    return map
}

//destory清除地图
function _destoryMap() {
    ol3Map.loadMapOpt = commonTool.deepClone(ol3Map.defaultAttr.loadMapOpt);
    ol3Map.prop = commonTool.copy(ol3Map.defaultAttr.prop)

    if (ol3Map.map == null) {
        return;
    }
    if (ol3Map.drawable.draw != null && (ol3Map.drawable.layerDrawable != null)) {
        ol3Map.draw({
            isClear: true
        })
    }
    
    ol3Map.map = null;

    //重置可绘制图层
    ol3MapReset.resetDrawable(map)
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

// 绘制层 drawOpt ol3Map.drawable.drawOpt
function _draw(drawOpt) {
    var map = ol3Map.map;
    if (map == null) return;
    //重置绘图工具
    ol3Map.resetAllDrawTool();
    for (var i in ol3MapDrawToolMap) {
        var $el = ol3MapDrawToolMap[i].$el;
        if ($el != null) $el.removeAttr('disabled');
    }

    //清除最后绘制的要素记录
    ol3Map.drawable.lastDrawedFeature = null;
    ol3Map.drawable.sourceDrawable.clear();

    //处理之前的draw
    //清空ol.interaction.Draw的drawend事件，以便重新绑定
    if (ol3Map.drawable.draw != null) {
        ol3Map.drawable.draw.un('drawend', ol3Map.drawable.drawendCb)
    }

    //清除画板
    map.removeInteraction(ol3Map.drawable.draw);

    if (drawOpt.isClear) {
        ol3Map.drawable.draw = null;
        //修改工具清除
        map.removeInteraction(ol3Map.drawable.select)
        map.removeInteraction(ol3Map.drawable.modify)
        ol3Map.drawable.select = null;
        ol3Map.drawable.modify = null;
    } else {
        drawOpt.interactionDrawOpt.source = ol3Map.drawable.sourceDrawable;

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

function _resetAllDrawTool() {
    for (var key in ol3MapDrawToolMap) {
        var f = ol3MapDrawToolMap[key].reset;
        if (f != null && typeof f == 'function') f();
    }
}

function _creatAllDrawTool() {
    for (var key in ol3MapDrawToolMap) {
        var ctf = ol3MapDrawToolMap[key].create;
        if (ctf != null && typeof ctf == 'function') ctf();

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


//```可绘制层```
//预设测距的draw。
function registDefaultDraw() {
    var map=ol3Map.map;
    if (map==null)ol3Map.init();

    ol3Map.drawable.setDrawOptMap("rangeDis", {
        source: ol3Map.drawMapLayer.source,
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
        var dis = ol3Map.getDistance(coordinates, ol3Map.loadMapOpt.scale)
        $("#drawResult").text(dis);
    })
}

// 选择所绘制的对象(功能)
$('#draw').on("change", function () {
    var map = ol3Map.map;
    if (map == null) {
        return;
    }

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

//处理要素按钮
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

//处理绘制要素的map，存放对要素的增改删等操作
var doDrawDealerMap = {
    'doDraw': function (map) {
        for (var i in ol3MapDrawToolMap) {
            var $el = ol3MapDrawToolMap[i].$el;
            if ($el != null) $el.removeAttr('disabled');
        }

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
        ol3Map.resetAllDrawTool()
        for (var i in ol3MapDrawToolMap) {
            var $el = ol3MapDrawToolMap[i].$el;
            if ($el != null) $el.attr('disabled', 'disabled');
        }

        getSelectAndModify()
        ol3Map.drawable.select.un('select', doDeleteToFeature)
    },
    'doDelete': function (map) {
        ol3Map.resetAllDrawTool()
        for (var i in ol3MapDrawToolMap) {
            var $el = ol3MapDrawToolMap[i].$el;
            if ($el != null) $el.attr('disabled', 'disabled');
        }

        ol3Map.drawable.lastDrawedFeature = null;
        getSelectAndModify()
        ol3Map.drawable.select.on('select', doDeleteToFeature)
    },
}

function doDeleteToFeature(e) {
    if (e.target.getFeatures() && e.target.getFeatures().getLength() > 0) {
        e.target.getFeatures().forEach(function (el) {
            ol3Map.drawable.sourceDrawable.removeFeature(el)
        })
    }
}

function getSelectAndModify() {
    var map = ol3Map.map;
    if (map == null) {
        return;
    }

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

//``绘制工具``
var ol3MapDrawToolMap = {
    //地图的测距工具
    // 'rangeDis': {
    //     $el: null, //触发工具的按键元素，是jquery对象
    //     create: createRanging,
    //     sourceDrawable: null, //ol.source.Vector
    //     layerDrawable: null, //ol.layer.Vector
    //     lastDrawedFeature: null, //最新一次画的要素
    //     draw: null, //ol.interaction.Draw
    //     drawendCb: function () {},
    //     reset: null,
    // },
}

var ol3MapDrawToolRegister = {
    // 添加到绘制工具的create中
    createCommon: _createDrawToolCommon,
    destoryCommon: _destoryCommon,
    //添加工具 参数是key 和 opt
    regist: _putDrawTool,
    //选项
    opt: {
        drawOpt: {
            source: null,
        },
        $el: null, //触发工具的按键元素，是jquery对象
        drawendCb: function () {},
        reset: null,
        destory: function () {},
    },
    defaultProp: {
        $el: null, //触发工具的按键元素，是jquery对象
        create: function () {},
        sourceDrawable: null, //ol.source.Vector
        layerDrawable: null, //ol.layer.Vector
        lastDrawedFeature: null, //最新一次画的要素
        draw: null, //ol.interaction.Draw
        drawendCb: function () {},
        reset: function () {},
        destory: function () {},
    },
    //生成工具
}

//通用的生成绘图工具的函数
function _createDrawToolCommon(key, opt) {
    var o = {};
    $.extend(true, o, ol3MapDrawToolRegister.opt, opt);
    ol3MapDrawToolMap[key].$el = o.$el;
    ol3MapDrawToolMap[key].reset = o.reset;

    ol3MapDrawToolMap[key].$el.on('click', function () {
        var map = ol3Map.map
        if (map == null) {
            return;
        }

        ol3MapDrawToolMap[key].lastDrawedFeature = null;
        if (ol3MapDrawToolMap[key].layerDrawable == null)
            ol3MapDrawToolMap[key].layerDrawable = new ol.layer.Vector();


        if (ol3MapDrawToolMap[key].sourceDrawable == null) {
            ol3MapDrawToolMap[key].sourceDrawable = new ol.source.Vector();
            ol3MapDrawToolMap[key].layerDrawable.setSource(ol3MapDrawToolMap[key].sourceDrawable);
        }

        if (ol3MapDrawToolMap[key].draw == null) {
            o.drawOpt.source = ol3MapDrawToolMap[key].sourceDrawable;
            ol3MapDrawToolMap[key].draw = new ol.interaction.Draw(o.drawOpt);
            ol3MapDrawToolMap[key].drawendCb = o.drawendCb;
            ol3MapDrawToolMap[key].draw.on('drawend', function (event) {
                var currentFeature = event.feature
                ol3MapDrawToolMap[key].drawendCb(event);
            })
        }

        ol3MapDrawToolMap[key].sourceDrawable.clear()
        if (this.checked) {
            //清除之前绘制的要素
            map.addLayer(ol3MapDrawToolMap[key].layerDrawable)
            if (ol3Map.drawable.draw != null) map.removeInteraction(ol3Map.drawable.draw)
            map.addInteraction(ol3MapDrawToolMap[key].draw)
        } else {
            map.removeLayer(ol3MapDrawToolMap[key].layerDrawable)
            map.removeInteraction(ol3MapDrawToolMap[key].draw)
            if (ol3Map.drawable.draw != null) map.addInteraction(ol3Map.drawable.draw)
        }
    })
}

//TODO
function _destoryCommon() {

}

function _putDrawTool(key, registFunc) {
    var prop = commonTool.deepClone(ol3MapDrawToolRegister.defaultProp);
    ol3MapDrawToolMap[key] = prop;
    ol3MapDrawToolMap[key].create = registFunc;
}

//已有工具
var ol3MapDefaultDrawTool = {
    //测距工具，在绘制的时候测距
    'rangeDis': {
        regist: registRanging,
    }
}

ol3MapDrawToolRegister.regist('rangeDis', ol3MapDefaultDrawTool['rangeDis'].regist);

function registRanging() {
    var opt = {
        $el: $("#ranging"), //触发工具的按键元素，是jquery对象
        drawendCb: function () {},
        reset: null,
        drawOpt: {},
    }

    opt.reset = function () {
        if ($("#ranging").prop('checked')) {
            //清除之前绘制的要素
            $("#ranging").trigger('click')
        }
    }

    opt.destory = function () {

    }

    $.extend(true, opt.drawOpt, {
        type: 'LineString',
        style: ol3Style.featureStyleMap['interaction'],
        maxPoints: 2,
    })

    opt.drawendCb = function (event) {
        var currentFeature = event.feature; //获得当前绘制的要素
        if (ol3MapDrawToolMap["rangeDis"].lastDrawedFeature != null) {
            ol3MapDrawToolMap["rangeDis"].sourceDrawable.removeFeature(ol3MapDrawToolMap["rangeDis"].lastDrawedFeature);
        }

        ol3MapDrawToolMap["rangeDis"].lastDrawedFeature = currentFeature;
        var geo = currentFeature.getGeometry(); //获得要素的几何信息
        var coordinates = geo.getCoordinates(); //获得几何坐标
        var dis = ol3Map.getDistance(coordinates, ol3Map.loadMapOpt.scale)
        $("#drawResult").text(dis);
    }

    ol3MapDrawToolRegister.createCommon('rangeDis', opt);
}


//``测试要素图层  显示地图的范围``
function showExtend() {
    if (ol3Map.map == null) {
        return;
    }
    var loadMapOpt = ol3Map.loadMapOpt;
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
}

//``地图事件监听``
var ol3Event = {
    defaultEvent: defaultEvent,
}

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
        var marker = ol3Style.overlayCommon.add(map, position, 'haha', null, 'head')
        ol3Style.overlayCommon.rotate(marker, 45)
    }
})

//```debug```
// doDebug()
// function doDebug() {
//     var map = ol3Map.map;
//     if (map == null) {
//         return
//     }

//     map.getView().on('change:resolution', function () {
//         console.log(map.getView().getZoom());
//     })
// }

$("#doDebug").click(function () {
    $("#debug").dialog('open')
})