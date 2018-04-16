var mock = {
    getLoadMapOpt: function () {
        //坐标系测试数据
        var x_min = 0,
            x_max = 400,
            y_min = 0,
            y_max = 300;
        zoom_min = 2.2;
        zoom_max = 6.2;
        basicMapSource = 'map/data/C_chain3.json';
        basicMapType = 'geoJSON';
        scale='3.5:1' //比例尺 图上距离(mm):实际距离(m)
        return {
            x_min: x_min,
            x_max: x_max,
            y_min: y_min,
            y_max: y_max,
            zoom_min: zoom_min,
            zoom_max: zoom_max,
            basicMapSource: basicMapSource,
            basicMapType: basicMapType,
            scale:scale,
        }
    },
    getPosition:function() {
        return [200,200]
    }
}