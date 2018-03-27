package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskCfg.netDiskCfg;
import netDisk.netDiskEngine.FileOperate;

import com.alibaba.fastjson.JSON;

import View.Result;

/**
 * Servlet implementation class RenameFileServlet 重命名
 * http://localhost:8080/netDisk/RenameFileServlet?newName=yellow&orgName=new2
 */
@WebServlet("/RenameFileServlet")
public class RenameFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RenameFileServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		//通用
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path", request.getContextPath()+"/LoginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}
		

		
		//校验参数
		String orgName = request.getParameter("orgName");
		if (null==orgName){
			result.setCode(400);
			result.setMessage("缺少待修改文件名");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		String newName= request.getParameter("newName");
		if (null==newName){
			result.setCode(400);
			result.setMessage("缺少新名字");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}

		String targetPath = request.getParameter("dirname");
		if (targetPath == null) {
			targetPath = "";
		}

		String serverPath=netDiskCfg.getDiskDir()+File.separator;

		targetPath = serverPath + userAccount + targetPath;
		targetPath=targetPath.replace("/", File.separator);
		
		//逻辑
		File f=new File(targetPath+File.separator+newName);
		if (f.exists()){
			result.setCode(400);
			result.setMessage("此目录下已存在同名文件");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		String realNewName=FileOperate.renameFile(targetPath,orgName,newName);
		if (null==realNewName){
			result.setCode(500);
			result.setMessage("重命名失败");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		//结果
		response.getWriter().print(result.toJSON());
		//System.out.println(result.toJSON());
		return;
	}

}
