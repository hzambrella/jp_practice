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
 * Servlet implementation class DeleteFileServlet 删除文件
 * http://localhost:8080/netDisk/DeleteFileServlet?dirname=/yellow&fileName=canglaoshi.avi
 * http://localhost:8080/netDisk/DeleteFileServlet?fileName=yellow
 */
@WebServlet("/DeleteFileServlet")
public class DeleteFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DeleteFileServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 通用
		String userAccountMock = "testUser";
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());

		// 校验参数
		String targetPath = request.getParameter("dirname");
		if (targetPath == null) {
			targetPath = "";
		}
		targetPath = new String(targetPath.getBytes("ISO8859-1"), "UTF-8");
		
		String fileName = request.getParameter("fileName");
		if (fileName == null) {
			result.setCode(400);
			result.setMessage("缺少待删除文件名");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		fileName = new String(fileName.getBytes("ISO8859-1"), "UTF-8");

		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;

		targetPath = serverPath + userAccountMock + targetPath;
		targetPath = targetPath.replace("/", File.separator);
		
		// 逻辑
		File toDelete=new File(targetPath+File.separator+fileName);
		if (!toDelete.exists()){
			result.setCode(400);
			result.setMessage("待删除文件不存在");
			response.getWriter().print(JSON.toJSONString(result));
			System.out.println("log:[debug]"+targetPath+File.separator+fileName);
			return;
		}
		
		if(!FileOperate.deleteFile(toDelete)){
			result.setCode(500);
			result.setMessage("删除文件失败");
			response.getWriter().print(JSON.toJSONString(result));
			System.out.println("log:[debug]"+targetPath+File.separator+fileName);
			return;
		};

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
