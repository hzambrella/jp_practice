<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
     <style type="text/css">
        .Header {background: url(<%=path %>/img/banner.jpg) #d10e00 repeat-x left top; height: 120px;width: 966px;}
        .HeaderTop {margin: 0px auto;}
     </style>
     
     <script type='text/javascript' src='<%=path %>/dwr/interface/loginService.js'></script>
     <script type='text/javascript' src='<%=path %>/dwr/engine.js'></script>
     <script type='text/javascript' src='<%=path %>/dwr/util.js'></script>
     
     <script type="text/javascript">
        function admin()
        {
            var url="<%=path %>/login.jsp";
            window.open(url);
        }
        
        function userLogout()
        {
            document.getElementById("indicator1").style.display="block";
            loginService.userLogout(callback1);
        }
        
        
        function callback1(data)
		{
		    document.getElementById("indicator1").style.display="none";
		    if(data=="no")
		    {
		        alert("系统错误，请联系管理员");
		    }
		    if(data!="no")
		    {
		        alert("安全退出系统");
		        var url="<%=path %>/qiantai/default.jsp"
		        window.location.href=url;
		    }
		}
		
		function auser()
        {
            var targetWinUrl="<%=path %>/auser/index.jsp";
			var targetWinName="newWin";
			var features="width="+screen.width+" ,height="+screen.height+" ,toolbar=yes, top=0, left=0, menubar=yes, scrollbars=yes, resizable=yes,location=no, status=yes";
			var new_win=window.open(targetWinUrl,targetWinName,features);
        }
     </script>
  </head>
  
  <body>
        <div class="Header HeaderTop">
			<font style="font-size: 40px;color: white;font-weight: bolder;display: block;text-align: center;margin-top: 40px;">基于JSP的网络硬盘系统sdfasf</font>
		</div>
		<div class="topmenu cbody1">
			<ul>
				<li class="thisclass"><A href="<%=path %>/qiantai/default.jsp" style="font-size: 17px;font-family: 楷体">文件共享</A></li>
				<li class="thisclass"><A href="<%=path %>/gonggaoAll.action" style="font-size: 17px;font-family: 楷体">系统公告</A></li>
				<li class="thisclass"><A href="<%=path %>/qiantai/user/userReg.jsp" style="font-size: 17px;font-family: 楷体">在线注册</A></li>
				
				<s:if test="#session.userType !=1">
			    <li class="thisclass"><A href="<%=path %>/qiantai/user/userLogin.jsp" style="font-size: 17px;font-family: 楷体">用户登录</A></li>
			    </s:if>
				
				<s:if test="#session.userType ==1">
			    <li class="thisclass"><A href="#" style="font-size: 17px;font-family: 楷体">欢迎您：<s:property value="#session.user.userRealname"/>(<s:property value="#session.user.userName"/>)</A></li>
			    <li class="thisclass"><A href="#" onclick="auser()" style="font-size: 17px;font-family: 楷体">控制面板</A></li>
			    <li class="thisclass"><A href="#" onclick="userLogout()" style="font-size: 17px;font-family: 楷体">退出系统<img id="indicator1" src="<%=path %>/img/loading.gif" style="display:none"/></A></li>
			    </s:if>
				
				<li class="thisclass"><A href="<%=path %>/liuyanAll.action" style="font-size: 17px;font-family: 楷体">系统留言板</A></li>
				<li class="thisclass"><A href="#" onclick="admin()" style="font-size: 17px;font-family: 楷体">后台管理</A></li>
			</ul>
		</div>
  </body>
</html>
