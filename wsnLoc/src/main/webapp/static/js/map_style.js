//basicMap的样式
var ol3Style = {
    basicMapStyle: null,
    featureStyleMap: null,
};

ol3Style.basicMapStyle = {
    'geoJSON': new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 0.6
        }),

    }),
}

//``Feature样式style生成``
ol3Style.featureStyleMap = {
    //一般的数据层的layer
    'data': new ol.style.Style({
        //填充样式
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        //边界样式
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 3
        }),
        //点要素样式
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'blue'
            })
        })
    }),
    //一般的可绘制层的drawable
    'interaction': new ol.style.Style({
        //填充样式
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        //边界样式
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        //点要素样式
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    }),
    //一般的选中效果
    'selected': new ol.style.Style({
        //填充样式
        fill: new ol.style.Fill({
            color: 'orange'
        }),
        //边界样式
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
        }),
        //点要素样式
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'yellow'
            })
        })
    }),
    'anchor': new ol.style.Style({
        //填充样式
        fill: new ol.style.Fill({
            color: 'orange'
        }),
        //边界样式
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
        }),
        //点要素样式
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'green'
            })
        })
    }),
}


// WSN传感器样式
var sensorStyle = {
    getColor: _getSensorColor,
    getNoneStyle: _getNoneStyle,
    getAnchorStyle: _getAnchorStyle,
}

function _getSensorColor(deprecated, fault, power) {
    if (deprecated) {
        return 'grey'
    }

    if (fault) {
        return 'red'
    }

    if (power < 0.3) {
        return 'orange'
    }

    if (power < 0.6) {
        return '#CCCC00'
    }

    return 'green'
}

function _getNoneStyle(color) {
    color == null ? color = 'green' : color = color;
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color: color,
            })
        })
    })
}

function _getAnchorStyle(color, normal, confirm) {
    var opt = {};
    //  opt.radius = 5.5;

    if (normal) {
        color = '#99CC33'
    }

    opt.radius = 6.5;
    if (confirm) {
        opt.fill = new ol.style.Fill({
            color: color,
        })
    } else {
        opt.stroke = new ol.style.Stroke({
            color: color,
            width: 1,
        })
    }

    if (normal) {
        //正方形
        opt.points = 4;
        opt.angle = Math.PI / 4;
        // opt.angle=Math.PI;
        return new ol.style.Style({
            image: new ol.style.RegularShape(opt)
        })
    } else {
        //三角形
        opt.radius = 10.8;
        opt.points = 3;
        opt.angle = 0;
        return new ol.style.Style({
            image: new ol.style.RegularShape(opt)
        })

    }
}