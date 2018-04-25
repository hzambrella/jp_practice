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
        var anchorLenght = dataLayerVals.refreshData('anchor')

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
                $("#printResult").text("");
            } else {
                map.addLayer(layer)
                map.on('click', anchor.clickEvent)
                $("#printResult").text(anchorLenght);
            }
        })

        var geolocation = map.geolocation;
        var view = map.getView();
        var marker = overlayVals.get('localization');
        //存储轨迹的地理信息
        var positions = new ol.geom.LineString([],
            /** @type {ol.geom.GeometryLayout} */
            ('XYZM'));
        //xyzm  z是角度， m是时间
        var previousM = 0;
        //采样时间
        var deltaMean = 500; // the geolocation sampling period mean in ms
        map.addOverlay(marker)

        $("#simulateLocate").on('click', function () {
            //TODO:ajax

            var coordinates = commonTool.deepClone(mock.getMove().data);
            var first = coordinates.shift();
            simulatePositionChange(first);
            var prevDate = first.timestamp;

            function geolocate() {
                var position = coordinates.shift();
                if (!position) {

                    // map.un('postcompose', postcompose);
                    return;
                }
                var newDate = position.timestamp;
                simulatePositionChange(position);
                window.setTimeout(function () {
                    prevDate = newDate;
                    geolocate();
                }, (newDate - prevDate) / 0.5);
            }

            geolocate();
            // map.on('postcompose', postcompose);
            // map.render();

            // function postcompose(){
            //     updateView()
            // }

        })

        function simulatePositionChange(position) {
            var coords = position.coords;
            geolocation.set('accuracy', coords.accuracy);
            geolocation.set('heading', commonTool.degToRad(coords.heading));
            var c = ol3Map.transform.L2C([coords.x, coords.y]);
            geolocation.set('position', c);
            geolocation.set('speed', coords.speed);
            geolocation.changed();
        }

        // Listen to position changes
        geolocation.on('change', function () {
            var position = geolocation.getPosition();
            var accuracy = geolocation.getAccuracy();
            var heading = geolocation.getHeading() || 0;
            var speed = geolocation.getSpeed() || 0;
            var m = Date.now();

            addPosition(position, heading, m, speed);

            var coords = positions.getCoordinates();
            var len = coords.length;
            if (len >= 2) {
                deltaMean = (coords[len - 1][3] - coords[0][3]) / (len - 1);
            }
        });

        function addPosition(position, heading, m, speed) {
            var x = position[0];
            var y = position[1];
      
            var fCoords = positions.getCoordinates();
            var previous = fCoords[fCoords.length - 1];
            var prevHeading = previous && previous[2];
            if (prevHeading) {
                var headingDiff = heading - commonTool.mod(prevHeading);

                // force the rotation change to be less than 180°让旋转角度小于180    
                if (Math.abs(headingDiff) > Math.PI) {
                    var sign = (headingDiff >= 0) ? 1 : -1;
                    headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
                }
                heading = prevHeading + headingDiff;
            }
            positions.appendCoordinate([x, y, heading, m]);

            // only keep the 20 last coordinates 只存20个
            positions.setCoordinates(positions.getCoordinates().slice(-20));

            // FIXME use speed instead
            // if (heading && speed) {
            //     markerEl.src = 'data/geolocation_marker_heading.png';
            // } else {
            //     markerEl.src = 'data/geolocation_marker.png';
            // }
            // use sampling period to get a smooth transition

            updateView()

            function updateView() {
                var m = Date.now() - deltaMean * 1.5;
                m = Math.max(m, previousM);
                previousM = m;
                // interpolate position along positions LineString
                var c = positions.getCoordinateAtM(m, true);
                // console.log("uopdateView:", c);
                if (c) {
                    view.setCenter(getCenterWithHeading(c, -c[2], view.getResolution()));
                    view.setRotation(-c[2]);
                    marker.setPosition([c[0], c[1]]);
                }

                function getCenterWithHeading(position, rotation, resolution) {
                    var size = map.getSize();
                    var height = size[1];

                    return [
                        position[0] - Math.sin(rotation) * height * resolution * 1 / 4,
                        position[1] + Math.cos(rotation) * height * resolution * 1 / 4
                    ];
                }
            }

        } //addPosition



    } //app()


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
    return anchors.length;
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