var commonTool = {
    util: {
        //浅拷贝
        copy: function (obj) {
            var newobj = {};
            for (var attr in obj) {
                newobj[attr] = obj[attr];
            }
            return newobj;
        },
        //深拷贝
        deepClone: function (obj) {
            if (obj == null) {
                return null;
            }
            var newObj = obj.constructor === Array ? [] : {};;
            $.extend(true, newObj, obj);
            return newObj;
        },
    },
    image: {
        //图片旋转一定角度。angle是角度 如30度就是30.若为空，就清除掉旋转。
        rotateImg: function ($imgel, angle) {
            var degree;
            angle == null ? degree = '' : degree = "rotate(" + angle + "deg" + ")";
            $imgel.css("transform", degree);
            $imgel.css("-ms-transform", degree);
            $imgel.css("-webkit-transform", degree);
        },
        //将图片转化为base64 src是图片的url 参考https://www.cnblogs.com/mr-wuxiansheng/p/6931077.html 
        //不能用
        toBase64: function (src) {
            var img = new Image();
            img.src = src;
            var canvasEl = document.createElement("canvas");
            // canvasEl.display = 'none';
            canvasEl.width = img.width;
            canvasEl.height = img.height;
            var ctx = canvasEl.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            var dataURL = canvasEl.toDataURL("image/" + ext);
            console.log(dataURL)
            return dataURL;
        },
    },
    math: {
        round: function (data, precise) {
            precise = Math.round(precise)
            if (precise <= 0) {
                return data;
            }
            return Math.round(data * Math.pow(10, precise)) / Math.pow(10, precise)
        },
        // convert radians to degrees
        radToDeg: function (rad) {
            return rad * 360 / (Math.PI * 2);
        },
        // convert degrees to radians
        degToRad: function (deg) {
            return deg * Math.PI * 2 / 360;
        },
        // modulo for negative values
        mod: function (n) {
            return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        },
        distance: function (coordinates) {
            return Math.sqrt(Math.pow(coordinates[0][0] - coordinates[1][0], 2) + Math.pow(coordinates[0][1] - coordinates[1][1], 2))
        },
        //限制角度[-180,180]
        confineDegree: function (degree) {
            if (degree > 180) {
                confineDegree(degree - 360);
            }
            if (degree < -180) {
                confineDegree(degree + 360);
            }
            return degree
        },
        //限制弧度[-PI,PI]
        confineRadians: function (radians) {
            if (radians > Math.PI) {
                confineDegree(degree - 2 * Math.PI);
            }
            if (radians < -Math.PI) {
                confineDegree(degree + 2 * Math.PI);
            }
            return radians
        },
    },
    date: {
        //13位时间戳转时间字符串
        timestampToTime: function (timestamp) {
            var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            Y = date.getFullYear() + '-';
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() + ':';
            m = date.getMinutes() + ':';
            s = date.getSeconds();
            return Y + M + D + h + m + s;
        },
    },
}

//有问题
var deepCloneObj = function (obj) {
    var newobj = obj.constructor === Array ? [] : {};

    if (typeof obj !== 'object') {
        return obj;
    }
    // else if (window.JSON) {
    //     str = JSON.stringify(obj), //系列化对象
    //         newobj = JSON.parse(str); //还原
    // } 
    else {
        for (var i in obj) {
            console.log(obj, obj[i])
            newobj[i] = typeof obj[i] === 'object' ?
                deepCloneObj(obj[i]) : obj[i];
        }
    }
    // console.log(newobj)
    return newobj;
};