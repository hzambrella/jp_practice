$(function () {

    var device_array = [];
    var cached_result = false;
    var cached_adjacency = new Array();
    var cached_route = new Array();
    var device_marker_array = new Array();

    $(".operate-container").on("click", function (event) {
        var $target = $(event.target);

        if ($target.is("button#my_position")) {
            my_position()
        } else if ($target.is("button#get_device")) {
            get_device()
        } else if ($target.is("button#get_route")) {
            get_route()
        } else if ($target.is("button#clear_layout")) {
            clear_layout()
        }else if($target.is("button#product_info")) {
            product_info()
        }
    })

    //这里是自动移动回武科大青山校区。原本应该是自己的位置。
    function my_position() {
        deleteCachedData()
        map.panTo($start_end_point);
        map.setZoom($default_zoom);
        $start_end_marker = addStartEndMarker();
    }

    function get_device() {
        map.clearOverlays();
        $start_end_marker = addStartEndMarker();
        $("button").disabledButton();
        //前端mock的数据
        //TODO：有兴趣的话，将这里改为ajax获取后端持久化的数据。
        deleteCachedData()
        device_array.splice(0)
        device_marker_array.splice(0)

        device_array.push({
            lat: $default_cen_lat,
            lng: $default_cen_lng,
            point: $start_end_point,
            title: "起点/终点",
            desc: "起点/终点",
        })

        var deviceDatas = getDeviceData();
        for (i = 0; i < deviceDatas.length; i++) {
            var deviceData = deviceDatas[i]
            var point = new BMap.Point(deviceData.lng, deviceData.lat)
            marker = addMarker(point, deviceData.title, deviceData.desc)
            deviceData.point = point
            device_array.push(deviceData)
            device_marker_array.push(marker)
        }

        map.setZoom(11.1);
        $.toast("获取设备信息成功")
        $("button").enableButton();
    }

    function get_route() {
        $("button").disabledButton();
        if ($start_end_marker == null || $start_end_marker == undefined) {
            $.toast("请先点击“移动到当前位置”确定起/终点")
            $("button").enableButton();
            return
        }


        if (device_array.length == 0) {
            $.toast("请先点击获取设备信息")
            $("button").enableButton();
            return
        }
        //服务端算法升级了，不再限制
        /*
        if (device_array.length-1 > 6) {
            $.toast("抱歉，目前服务端算法只支持最多6个设备点的规划。")
            $("button").enableButton();
            return
        }
        */
        // console.log(device_array)

        //计算邻接矩阵，由驾驶车辆的路程所组成，单位米。
        var adjacency = new Array(); //声明一维数组        

        //对route缓存
        var route_cached = new Array();

        if (cached_result) {
            adjacency = cached_adjacency;
            route_cached = cached_route;
            getBestRoute()
            return
        } else {
            for (var x = 0; x < device_array.length; x++) {
                adjacency[x] = new Array(); //声明二维数组
                for (var y = 0; y < device_array.length; y++) {
                    adjacency[x][y] = 0; //数组初始化为0
                }
            }

            for (var x = 0; x < device_array.length; x++) {
                route_cached[x] = new Array(); //声明二维数组
                for (var y = 0; y < device_array.length; y++) {
                    route_cached[x][y] = null; //数组初始化为0
                }
            }
        }

        var cacu = getAdjacency(device_array.length, device_array.length);
        var searchComplete = function (results) {
            if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                console.log("计算路线失败")
                return;
            }

            var route = results.getPlan(0).getRoute(0);
            var distance = route.getDistance(false);
            // console.log(distance); //获取距离
            cacu(distance, route)
        }

        var transit = new BMap.DrivingRoute(map, {
            renderOptions: {
                // map: map,
            },
            onSearchComplete: searchComplete,
        })
        //策略：最短距离
        transit.setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);

        transit.search(device_array[0].point, device_array[1].point);
        // transit.search(device_array[1].point, device_array[1].point);
        // transit.search(device_array[2].point, device_array[1].point);
        // transit.search(device_array[3].point, device_array[1].point);
        // transit.search(device_array[4].point, device_array[1].point);

        // 计算邻接矩阵，由驾驶车辆的路程所组成，单位米。
        //TODO:速度有点慢，transit.search本身是异步的，但是为了填写邻接矩阵改成闭包了,想法改进。
        function getAdjacency(length) {
            var x = 0,
                y = 0,
                length = length;
            var mess_cacu_distance = "计算距离中:"

            return function (distance, route) {
                adjacency[x][y] = distance
                route_cached[x][y] = route
                // console.log(x, y)
                // console.log(adjacency)
                y++;

                if (y >= length) {
                    x++;
                    y = 0;
                    if (x >= length) {
                        for (i = 0; i < length; i++) {
                            adjacency[i][i] = 0;
                        }

                        $("#message").html("");

                        getBestRoute()
                        return
                    }
                }

                transit.search(device_array[x].point, device_array[y].point);
                progress=(100 * (x * length + y)) / (length * length)
                $("#message").html("计算距离中..(已完成:" + progress.toFixed(2)  + "%)");
            }
        }

        // 
        function getBestRoute() {
            $("#message").html("获取最佳路线中,请稍后...");

            console.log(adjacency, route_cached)

            // ajax
            $.ajax({
                type: "POST",
                url: "/insperctionOL/GetRouteServlet",
                dataType: "json",
                data: {
                    adjacency:JSON.stringify(adjacency)
                },
                success: function (data) {
                    $.toastForJavaAjaxRes(data, function () {  
                    	var array=JSON.parse(data.map.cityflow)
                        console.log(array,data.map.min_distance)
                        cb(array,data.map.min_distance)
                    })
                },

                error: function (result) {
                    $.toastForAjaxErr(data)
                }
            });
            //  array=[0,1,2,3,4,5,6,7,8,9];
         
            return

            function cb(array,min_distance) {
                //array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
                routeLine(array,min_distance)
                $("button").enableButton();
            }

        }
        //画线
        function routeLine(array,min_distance) {
            var allOverlay = map.getOverlays();
            if (array.length - 1 != device_array.length) {
                $.toast("路径规划服务出错")
                $("#message").html("error");
                console.log(array)
                return
            }

            for (i = 0; i < array.length - 1; i++) {
                var index_start = array[i]
                var index_end = array[i + 1]

                route = route_cached[index_start][index_end];

                if (!cached_result) {
                    map.addOverlay(new BMap.Polyline(route.getPath(), {
                        strokeColor: "#FF0033",
                        strokeOpacity: 0.45,
                        strokeWeight: 6,
                        enableMassClear: true
                    }));
                }

                if (index_end != 0) {
                    var overlay = device_marker_array[index_end - 1]
                    var label = new BMap.Label(i + 1, {
                        offset: new BMap.Size(20, -10)
                    });
                    overlay.setLabel(label);
                }

            }

            cachedData()
            $("#message").html("完成,总距离:"+min_distance+"m");


            $.toast("路径规划完成")
        }

        //缓存数据
        function cachedData() {
            cached_adjacency = adjacency;
            cached_route = route_cached;
            cached_result = true;
        }
    }

    //清除缓存
    function deleteCachedData() {

        cached_result = false;
        cached_adjacency = new Array();
        cached_route = new Array();
    }

    function clear_layout() {
        $start_end_marker = null;
        deleteCachedData()
        map.clearOverlays();
        device_array.splice(0)
        $.toast("清除完毕")
    }

    function product_info(){
        $("#message").html("基于百度地图的多点电力设备巡检路径规划<br/>(待改进以提高速度。1.计算距离在js。2.规划算法在服务端)")
    }
});