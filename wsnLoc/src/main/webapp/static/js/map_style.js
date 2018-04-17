//basicMap的样式

var ol3Style={
    basicMapStyle:null,
    featureStyleMap:null,
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
    //数据层的layer
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
    //可绘制层的drawable
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
    //选中效果
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
    })
}