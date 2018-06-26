<%@ page language="java" pageEncoding="UTF-8"%>
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

		<link rel="stylesheet" type="text/css" href="<%=path %>/css/base.css" />
		
        <script language="javascript">
           function catelogDel(catelogId)
           {
               if(confirm('您确定删除吗?同时将会删除该文件下的所有文件'))
               {
                   window.location.href="<%=path %>/catelogDel.action?catelogId="+catelogId;
               }
           }
           function catelogPre(catelogId)
           {
                   window.location.href="<%=path %>/catelogPre.action?catelogId="+catelogId;
           }
           
           function catelogAdd()
           {
                 var url="<%=path %>/auser/catelog/catelogAdd.jsp";
				 window.location.href=url;
           }
           
           function wenjianMine(catelogId)
           {
                 var url="<%=path %>/wenjianMine.action?catelogId="+catelogId;
				 window.location.href=url;
           }
           
       </script>
	</head>

	<body leftmargin="2" topmargin="2" background='<%=path %>/img/allbg.gif'>
			<!-- 修改  -->
			<p>已用空间:  <s:property value="#request.usedSize"/>/1G</p>
			
			<table width="98%" border="0" cellpadding="2" cellspacing="1" bgcolor="#D1DDAA" align="center" style="margin-top:8px">
				<tr bgcolor="#E7E7E7">
					<td height="14" colspan="4" background="<%=path %>/img/tbg.gif">&nbsp;&nbsp;</td>
				</tr>
				<tr align="center" bgcolor="#FAFAF1" height="22">
					<td width="5%">序号</td>
					<td width="40%">文件夹名称</td>
					<td width="10%">操作</td>
		        </tr>	
				<s:iterator value="#request.cateLogList" id="catelog" status="sta">
				<tr align='center' bgcolor="#FFFFFF" onMouseMove="javascript:this.bgColor='red';" onMouseOut="javascript:this.bgColor='#FFFFFF';" height="22">
					<td bgcolor="#FFFFFF" align="center">
						<s:property value="#sta.index+1"/>
					</td>
					<td bgcolor="#FFFFFF" align="center">
						<s:property value="#catelog.catelogName"/>
					</td>
					<td bgcolor="#FFFFFF" align="center">
						<input type="button" value="删除" onclick="catelogDel(<s:property value="#catelog.catelogId"/>)"/>
						<input type="button" value="重命名" onclick="catelogPre(<s:property value="#catelog.catelogId"/>)"/>
						<input type="button" value="文件管理" onclick="wenjianMine(<s:property value="#catelog.catelogId"/>)"/>
					</td>
				</tr>
				</s:iterator>
			</table>

			<table width='98%'  border='0'style="margin-top:8px;margin-left: 8px;">
			  <tr>
			    <td>
			      <input type="button" value="新建文件夹" style="width: 80px;" onclick="catelogAdd()" />
			    </td>
			  </tr>
		    </table>
	</body>
</html>
