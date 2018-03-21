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
 * Servlet implementation class CopyFileServlet 复制到
 * http://localhost:8080/netDisk/CopyFileServlet?orgDirName=/yellow&newDirName=/%E4%B8%AD%E6%96%87%E5%90%8D%E5%AD%97%E6%96%87%E4%BB%B6%E5%A4%B9/dasdsa/1231321/1321312/3123131312321&fileName=canglaoshi.avi
 */
@WebServlet("/CopyFileServlet")
public class CopyFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CopyFileServlet() {
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
		// response.setContentType("text/html;charset=utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());

		// 校验参数
		String orgDirName = request.getParameter("orgDirName");
		if (null == orgDirName) {
			orgDirName = "";
		}
		orgDirName = new String(orgDirName.getBytes("ISO8859-1"), "UTF-8");

		String newDirName = request.getParameter("newDirName");
		if (null == newDirName) {
			newDirName = "";
		}
		newDirName = new String(newDirName.getBytes("ISO8859-1"), "UTF-8");
		
		String fileName = request.getParameter("fileName");
		if (fileName == null) {
			result.setCode(400);
			result.setMessage("缺少文件名");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		fileName = new String(fileName.getBytes("ISO8859-1"), "UTF-8");

		if ((newDirName+File.separator+fileName).indexOf(orgDirName) >= 0) {
			result.setCode(400);
			result.setMessage("不能将文件复制到自身或其子目录下");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;

		String orgPath = serverPath + userAccountMock + orgDirName;
		String newPath = serverPath + userAccountMock + newDirName;
		//源文件所在目录
		String src = orgPath.replace("/", File.separator);
		//目标目录
		String des = newPath.replace("/", File.separator);

		// 逻辑
		File fnew = new File(newPath + File.separator + fileName);
		// TODO:auto rename
		if (fnew.exists()) {
			result.setCode(400);
			result.setMessage("此目录下已存在同名文件");
			System.out.println("log:[debug]" + newPath + File.separator
					+ fileName);
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}

		File forg = new File(src + File.separator + fileName);
		if (!forg.exists()) {
			result.setCode(400);
			result.setMessage("源文件不存在");
			System.out.println("log:[debug]" + orgPath + File.separator
					+ fileName);
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		// 新目录不存在就创建
		String newDir = newDirName;
		newDir = newDir.replace("/", File.separator);
		FileOperate.newFolderIfNotExist(serverPath + userAccountMock, newDir);
		
		try {
			boolean success=FileOperate.copyFile(src, des,fileName);
			System.out.println("flag3");
			if (!success){
				result.setCode(500);
				result.setMessage("复制文件出错");
				System.out.println("log:[debug]" + src+"->"+des);
				response.getWriter().print(JSON.toJSONString(result));
				return;
			}
		} catch (Exception e) {
			result.setCode(500);
			result.setMessage("复制文件出错");
			System.out.println("log:[debug]" + src+"->"+des);
			response.getWriter().print(JSON.toJSONString(result));
		
			e.printStackTrace();
			return;
		}

		response.getWriter().print(result.toJSON());
		System.out.println(result.toJSON());
		return;
	}

	/**
	 * @see HttpServlet#doPost(HttpsServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
