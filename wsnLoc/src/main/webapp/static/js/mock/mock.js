var mock = {
    getLoadMapOpt: function () {
        //坐标系测试数据
        var x_min = 0,
            x_max = 400,
            y_min = 0,
            y_max = 300;
        zoom_min = 2.2;
        zoom_max = 6.2;
        basicMapSource = 'map/data/C_chain4.json';
        basicMapType = 'geoJSON';
        scale = '3.5:1' //比例尺 图上距离(mm):实际距离(m) 3.5:1000
        return {
            needDefaultEventListener: true,
            x_min: x_min,
            x_max: x_max,
            y_min: y_min,
            y_max: y_max,
            zoom_min: zoom_min,
            zoom_max: zoom_max,
            basicMapSource: basicMapSource,
            basicMapType: basicMapType,
            scale: scale,
            canDebug: true,
        }
    },
    getPosition: function () {
        return [59.99933265989545, 68.9153470372672]
    },
    getAllAnchor: function () {
        return mockAnchorData;
    },
    getMove: function () {
        var timestamp = (new Date()).valueOf();
        var array = mockOrgData;
        var md = {
            data: [],
        };

        var defaultCoor = {
            "coords": {
                "speed": 1.7330950498580933,
                "accuracy": 5,
                "altitudeAccuracy": 8,
                "altitude": 238,
                "x": 5.868668798362713,
                "heading": 0,
                "y": 45.64444874417562
            },
            "timestamp": 1394788264972
        }
        var lastHeading = 0;
        for (var key in array) {
            var heading = lastHeading;
            key=parseInt(key)
            if (key != array.length - 1) {
                if (array[key + 1][0] == array[key][0]) {
                    if (array[key + 1][1] >= array[key][1]) {
                        heading = 90
                    } else {
                        heading = -90
                    }
                } else {
                    // k是斜率的倒数，这样地图旋转的角度才正确。
                    var k = (array[key + 1][0] - array[key][0])/(array[key + 1][1] - array[key][1]) 
                    // console.log(array[key + 1][1] - array[key][1],array[key + 1][0] - array[key][0],k)
                    heading = Math.atan(k) * 180 / Math.PI
                }
            }
            
            console.log(heading);
            var nowObj = {
                "coords": {
                    "x": array[key][0],
                    "y": array[key][1],
                    "heading": heading,
                },
                "timestamp": timestamp,
            }
            var newObj = {};
            $.extend(true, newObj, defaultCoor, nowObj);
            md.data.push(newObj);
            timestamp = timestamp + 500
            lastHeading = heading;
        }
        return md;
    }
}

var mockData = {

}