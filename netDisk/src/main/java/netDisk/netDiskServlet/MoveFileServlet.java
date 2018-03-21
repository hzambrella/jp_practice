package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskEngine.FileOperate;
import View.Result;

import com.alibaba.fastjson.JSON;

/**
 * Servlet implementation class moveFileServlet 移动到
 * http://localhost:8080/netDisk/MoveFileServlet?orgDirName=/yellow&newDirName=/中文名字文件夹&fileName=canglaoshi.avi
 * http://localhost:8080/netDisk/MoveFileServlet?newDirName=/中文名字文件夹&fileName=yellow

 */
@WebServlet("/MoveFileServlet")
public class MoveFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MoveFileServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String userAccountMock = "testUser";

		// 通用
		response.setCharacterEncoding("utf-8");
//		response.setContentType("text/html;charset=utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());

		// 校验参数
		String orgDirName =request.getParameter("orgDirName");
		if (null == orgDirName) {
			orgDirName="";
		}
		orgDirName =new String(orgDirName.getBytes("ISO8859-1"),"UTF-8"); 


		String newDirName =request.getParameter("newDirName");
		if (null == newDirName) {
			newDirName="";
		}
		newDirName=new String(newDirName.getBytes("ISO8859-1"),"UTF-8");
		
		String fileName = request.getParameter("fileName");
		if (fileName == null) {
			result.setCode(400);
			result.setMessage("缺少文件名");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		fileName=new String(fileName.getBytes("ISO8859-1"),"UTF-8");
		
		if ((newDirName+File.separator+fileName).indexOf(orgDirName)>=0){
			result.setCode(400);
			result.setMessage("不能将文件移动到自身或其子目录下");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;

		String orgPath = serverPath + userAccountMock + orgDirName;
		String newPath = serverPath + userAccountMock + newDirName;
		orgPath=orgPath.replace("/", File.separator);
		newPath=newPath.replace("/", File.separator);

		// 逻辑
		File fnew = new File(newPath + File.separator + fileName);
		//TODO:auto rename
		if (fnew.exists()) {
			result.setCode(400);
			result.setMessage("此目录下已存在同名文件");
			System.out.println("log:[debug]"+newPath + File.separator + fileName);
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		//新目录不存在就创建
		String newDir=newDirName;	
		newDir=newDir.replace("/",File.separator);
		FileOperate.newFolderIfNotExist(serverPath+userAccountMock, newDir);
			
		File forg = new File(orgPath + File.separator + fileName);
		if (!forg.exists()){
			result.setCode(400);
			result.setMessage("源文件不存在");
			System.out.println("log:[debug]"+orgPath + File.separator + fileName);
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		boolean success = FileOperate.moveFile(orgPath, newPath, fileName);
		if (!success) {
			result.setCode(500);
			result.setMessage("移动文件失败");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		// 结果
		response.getWriter().print(result.toJSON());
		System.out.println(result.toJSON());
		return;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
