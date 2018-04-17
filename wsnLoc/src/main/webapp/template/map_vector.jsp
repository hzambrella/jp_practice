<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html lang="en">

  <head>
    <title>OpenLayers example</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <!--openlayers-->
    <link rel="stylesheet" href="/wsnLoc/static/vendor/openlayers/css/ol.css" type="text/css">
    <script src="/wsnLoc/static/vendor/openlayers/js/ol.js" type="text/javascript"></script>
    <!--common-->
    <script src="/wsnLoc/static/js/common.js" type="text/javascript"></script>
    <link href="/wsnLoc/static/css/style.css" rel="stylesheet" />
    <!--jquery-->
    <script src="/wsnLoc/static/js/libs/jquery-3.2.1.min.js" type="text/javascript"></script>
    <!--bootstrap-->
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0-beta/css/bootstrap.min.css">
    <!-- popper.min.js  -->
    <script src="https://cdn.bootcss.com/popper.js/1.12.5/umd/popper.min.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>

    <!--mock-->
    <script src="/wsnLoc/static/js/mock/mock.js" type="text/javascript"></script>
  </head>

  <body>
    <h2>My Map</h2>

    <div id="hzMapTest" class="map center">
      <div id="viewOperate">
        <button class="center" id="rotateLeft">向左旋转</button>
        <button class="center" id="rotateRight">向右旋转</button>

      </div>
      <div id="mousePosition"></div>
    </div>

    <div id="label" style="display:none">
    </div>

    <div id="dataTest" class="center">
      <input type="checkbox" id="showExtendOfMap" class="center">extent数据</input>
      <input type="checkbox" id="location" class="center">获取位置</input>
      <form>
        <label>绘制 &nbsp;</label>
        <select id="draw">
        <option value="clear">清空绘制</option>
        <option value="rangeDis">测距</option>
        <option value="drawAnchor">绘制锚节点</option>
      </select>
      </form>
    </div>

    <div class="center">
      <p class="center" id="drawResult"></p>
    </div>

    <script src="/wsnLoc/static/js/map_style.js" type="text/javascript"></script>
    <script src="/wsnLoc/static/js/map_common.js" type="text/javascript"></script>
    <script src="/wsnLoc/static/js/app_vector.js" type="text/javascript"></script>
    <script type="text/javascript"></script>

  </body>

  </html>