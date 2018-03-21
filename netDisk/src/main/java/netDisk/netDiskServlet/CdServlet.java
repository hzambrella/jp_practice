package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import View.Result;
import netDisk.DTO.FileInfo;
import netDisk.netDiskEngine.FileOperate;

/**
 * Servlet implementation class cdServlet  查询某个目录下的全部文件
 */
@WebServlet("/CdServlet")
public class CdServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CdServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
		HttpServletResponse response) throws ServletException, IOException {
		
		String userAccountMock="testUser";
		
		//通用
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());
		
		//校验参数
		String targetPath = request.getParameter("dirname");
		if (targetPath==null){
			targetPath="";
		}
		targetPath =new String(targetPath.getBytes("ISO8859-1"),"UTF-8"); 
		
		//逻辑
		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;
		
		targetPath=serverPath+userAccountMock+targetPath;
		targetPath=targetPath.replace("/", File.separator);
		
		try {
			System.out.println(targetPath);
			List<FileInfo> directory = FileOperate.getFileDirectory(targetPath);
			result.getMap().put("directory", directory);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.setCode(500);
			result.setMessage("系统文件服务异常");
			response.getWriter().print(result.toJSON());
			return;
		}
		
		//结果
		response.getWriter().print(result.toJSON());
		System.out.println(result.toJSON());
		return;
	}
}
