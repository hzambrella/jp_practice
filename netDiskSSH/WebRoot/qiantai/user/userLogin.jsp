<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String path = request.getContextPath();
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="pragma" content="no-cache" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="0" />
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3" />
		<meta http-equiv="description" content="This is my page" />
		
		<link href="<%=path %>/css/layout.css" type="text/css" rel="stylesheet" />
		
		<script type='text/javascript' src='<%=path %>/dwr/interface/loginService.js'></script>
	    <script type='text/javascript' src='<%=path %>/dwr/engine.js'></script>
	    <script type='text/javascript' src='<%=path %>/dwr/util.js'></script>
		
	    <script type="text/javascript">
	        function login()
	        {
	           if(document.userLogin.userName.value=="")
	           {
	               alert("请输入账号");
	               return;
	           }
	           if(document.userLogin.userPw.value=="")
	           {
	               alert("请输入密码");
	               return;
	           }
	           document.getElementById("indicator").style.display="block";
	           loginService.login(document.userLogin.userName.value,document.userLogin.userPw.value,1,callback);
	        }
	        
	        function callback(data)
			{
			    document.getElementById("indicator").style.display="none";
			    if(data=="no")
			    {
			        alert("用户名或密码错误");
			    }
			    if(data!="no")
			    {
			        alert("通过验证,系统登录成功");
			        var url="<%=path %>/qiantai/default.jsp"
			        window.location.href=url;
			    }
			}
	    </script>
	</head>

	<body>
		<jsp:include flush="true" page="/qiantai/inc/incTop.jsp"></jsp:include>
		<div class="page_row" >
			<div class="page_main_msg left">
			     <div class="left_row">
		              <div class="list pic_news" style="width: 950px;">
				          <div class="list_bar">学生登录</div>
				          <div class="list_content" style="height: 445px;">
                              <div class="c1-body">
                                  <form name="userLogin" method="post" action="">
                                  <div class="c1-bline" style="padding:7px 0px;">
                                       <div class="f-left" style="margin-left: 5px;">
                                                   账号：<input style="width: 200px;" name="userName" type="text" />
                                       </div>
                                       <div class="f-right"></div>
                                       <div class="clear"></div>
                                  </div>
                                  <div class="c1-bline" style="padding:7px 0px;">
                                       <div class="f-left" style="margin-left: 5px;">
                                                   密码：<input style="width: 200px;" name="userPw" type="text" />
                                            &nbsp;&nbsp;
                                            <input type="button" value="登  录" onclick="login()" style="width: 100px;height: 24px;"/>
                                            <img id="indicator" src="<%=path %>/img/loading.gif" style="display:none"/>
                                       </div>
                                       <div class="f-right"></div>
                                       <div class="clear"></div>
                                  </div>
                                  </form>
						      </div>
						  </div>
					  </div>	
				      <div style="clear:both;"></div>
			     </div>
			</div>
		</div>
		
		<div class="foot">
		   <jsp:include flush="true" page="/qiantai/inc/incFoot.jsp"></jsp:include>
	    </div>
	</body>
</html>
