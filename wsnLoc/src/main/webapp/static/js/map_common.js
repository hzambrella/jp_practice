//``测试数据``
//地图加载信息数据mock
loadMapOpt = mock.getLoadMapOpt()

//```地图相关```
var ol3Map = {
    map: null,
    init: createMap,
    rotate: rotateMap,
    getDistance: getDistance,
}

function createMap(containerId, loadMapOpt) {
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
                style: basicMapStyle['geoJSON'],
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
    return map
}

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

//``创建地图``
var containerId = 'hzMapTest'
var map = ol3Map.init(containerId, loadMapOpt)
//``flag``
var operateFlag = {
    //是否可绘制
    drawingFlag: false,
    // dataFlag: false,
    // locationFlag: false,
}

//``地图旋转``
document.getElementById("rotateLeft").onclick = function () {
    ol3Map.rotate(true)
}

document.getElementById("rotateRight").onclick = function () {
    ol3Map.rotate(false)
}

//```可绘制层```
var sourceDrawable, //ol.source.Vector()
    vectorDrawable,
    drawable,
    lastInteractionFeature;
$("#interaction").click(function (event) {
    $this = $(this)
    if (operateFlag.drawingFlag) {
        map.removeInteraction(drawable);
        sourceDrawable = null;
        vectorDrawable.setSource(sourceDrawable);
        $this.removeClass("drawing");
        $this.text("测距")
        operateFlag.drawingFlag = false
        $("#drawResult").text("");
    } else {
        if (null == sourceDrawable) {
            sourceDrawable = new ol.source.Vector();
        }

        if (null == vectorDrawable) {
            vectorDrawable = new ol.layer.Vector({
                source: sourceDrawable,
            });
            map.addLayer(vectorDrawable);
        } else {
            vectorDrawable.setSource(sourceDrawable);
        }

        drawable = new ol.interaction.Draw({
            source: sourceDrawable,
            // type: 'Polygon',
            type: 'LineString',
            style: featureStyleMap['interaction'],
            maxPoints: 2,
        })
        map.addInteraction(drawable);
        drawable.on('drawend', function (event) {
            currentFeature = event.feature; //获得当前绘制的要素
            if (lastInteractionFeature != null) {
                sourceDrawable.removeFeature(lastInteractionFeature);
            }
            lastInteractionFeature = currentFeature;
            var geo = currentFeature.getGeometry(); //获得要素的几何信息
            var coordinates = geo.getCoordinates(); //获得几何坐标
            var dis=ol3Map.getDistance(coordinates, loadMapOpt.scale)
            $("#drawResult").text(dis);
        })
        operateFlag.drawingFlag = true
        $this.text("停止")
    }
})

//``测试要素图层``
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
    style: featureStyleMap['data'],
})

sourceDataLayer.addFeature(pointFeatureToTest4);

$("#drawPointFromData").click(function (event) {
    if (!this.checked) {
        map.removeLayer(vectorDataLayer)
    } else {
        map.addLayer(vectorDataLayer)
    }
})

//``地图事件监听``
var lastSelectedFeature;
map.on('click', function (event) {
    console.log(event.coordinate)
    //探测feature
    var feature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        return feature
    })
    if (feature) {
        if (feature.get('type') == 'data') {
            if (lastSelectedFeature != null) {
                lastSelectedFeature.setStyle(featureStyleMap[lastSelectedFeature.get('type')])
            }
            feature.setStyle(featureStyleMap['selected'])
            lastSelectedFeature = feature;
        }
    }

    //探测layer 有getImageData的跨域问题
    // var layer = map.forEachLayerAtPixel(event.pixel, function (layer) {
    //     return layer
    // })

    // if (layer) {
    //     console.log("覆盖物:", layer, layer.getPosition())
    // }
})

//地图的指针移动事件
map.on('pointermove', function (e) {
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
})

//``提示工具``
$('.ol-zoom-in, .ol-zoom-out').tooltip({
    placement: 'right'
});

$('.ol-rotate-reset, .ol-attribution button[title]').tooltip({
    placement: 'left'
});

//```overlay相关```
//覆盖物图标地址
var overlayImageUrlMap = {
    'default': 'static/images/overlay/geolocation_marker.png',
    'head': 'static/images/overlay/geolocation_marker_heading.png',
}

var overlayCommon = {
    //添加一个overlay,coordinate,坐标，[x,y],name:名字,id:id
    //type:overlay类型
    //default: blank
    //head:带箭头的
    add: function (coordinate, name, id, type) {
        coordinate == null ? coordinate = [0, 0] : coordinate = coordinate;
        name == null ? name = '' : name = name;
        var el = document.createElement('div')
        el.className = 'marker'
        if (id != null) el.id = id;
        type == null ? type = 'default' : type = type;
        el.title = '标注点：' + name
        labelEl = document.getElementById('label')
        labelEl.appendChild(el)

        var imgEl = document.createElement('img')
        imgEl.addClass = "overlay"
        imgEl.src = overlayImageUrlMap[type]

        el.appendChild(imgEl)

        var nameel = document.createElement('span')
        nameel.className = 'address'
        nameel.innerText = name
        el.appendChild(nameel)

        var marker = new ol.Overlay({
            position: coordinate,
            positioning: 'center-center',
            element: el,
            stopEvent: false,
        })
        map.addOverlay(marker)
        return marker
    },
    //旋转overlay  overlay是ol.Overlay angle是度为单位的角度，如30度就是30
    rotate: function (overlay, angle) {
        $imgEl = $(overlay.getElement()).find('img')
        commonTool.rotateImg($imgEl, angle)
    }
}

// ```定位相关```
var position = mock.getPosition();
$('#location').click(function (event) {
    if (!this.checked) {
        map.getOverlays().clear()
    } else {
        var marker = overlayCommon.add(position, 'haha', null, 'head')
        overlayCommon.rotate(marker, 45)
    }
})

// doDebug()
//debug
function doDebug() {
    map.getView().on('change:resolution', function () {
        console.log(map.getView().getZoom());
    })
}