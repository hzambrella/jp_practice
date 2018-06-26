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
	         function check()
             {
                   if( document.form1.userName.value=="")
	               {
	                   alert("请输入账号");
	                   return false;
		           }
	               if( document.form1.userPw.value=="")
	               {
	                   alert("请输入密码");
	                   return false;
	               }
	               document.form1.submit();
             }
	    </script>
	</head>

	<body>
		<jsp:include flush="true" page="/qiantai/inc/incTop.jsp"></jsp:include>
		<div class="page_row" >
			<div class="page_main_msg left">
			     <div class="left_row">
		              <div class="list pic_news" style="width: 950px;">
				          <div class="list_bar">会员注册</div>
				          <div class="list_content" style="height: 445px;">
                              <div class="c1-body">
                                  <form action="<%=path %>/userReg.action" name="form1" method="post">
	                                  <div class="c1-bline" style="padding:7px 0px;">
	                                       <div class="f-left" style="margin-left: 5px;">
	                                                  账号：<input style="width: 200px;" name="userName" type="text" />
	                                       </div>
	                                       <div class="f-right"></div>
	                                       <div class="clear"></div>
	                                  </div>
	                                  <div class="c1-bline" style="padding:7px 0px;">
	                                       <div class="f-left" style="margin-left: 5px;">
	                                                  密码：<input type="text" name="userPw" style="width: 200px;"/>
	                                       </div>
	                                       <div class="f-right"></div>
	                                       <div class="clear"></div>
	                                  </div>
	                                  <div class="c1-bline" style="padding:7px 0px;">
	                                       <div class="f-left" style="margin-left: 5px;">
	                                                  姓名：<input type="text" name="userRealname" style="width: 200px;"/>
	                                       </div>
	                                       <div class="f-right"></div>
	                                       <div class="clear"></div>
	                                  </div>
	                                  <div class="c1-bline" style="padding:7px 0px;">
	                                       <div class="f-left" style="margin-left: 5px;">
	                                                  住址：<input type="text" name="userAddress" style="width: 200px;"/>
	                                       </div>
	                                       <div class="f-right"></div>
	                                       <div class="clear"></div>
	                                  </div>
	                                  <div class="c1-bline" style="padding:7px 0px;">
	                                       <div class="f-left" style="margin-left: 5px;">
	                                                  性别：
	                                            <input type="radio" name="userSex" value="男" checked="checked"/>男
											    &nbsp;&nbsp;
											    <input type="radio" name="userSex" value="女"/>女
	                                       </div>
	                                       <div class="f-right"></div>
	                                       <div class="clear"></div>
	                                  </div>
	                                  <div class="c1-bline" style="padding:7px 0px;">
	                                       <div class="f-left" style="margin-left: 5px;">
	                                                  电话：<input type="text" name="userTel" style="width: 200px;"/>
	                                       </div>
	                                       <div class="f-right"></div>
	                                       <div class="clear"></div>
	                                  </div>
	                                  <div class="c1-bline" style="padding:7px 0px;">
	                                       <div class="f-left" style="margin-left: 5px;">
	                                                  邮箱：<input style="width: 200px;" name="userEmail" type="text"/>
	                                            &nbsp;&nbsp;
	                                            <input type="button" value="注册" onclick="check()" style="width: 100px;height: 24px;"/>
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
