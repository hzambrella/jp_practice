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

import com.alibaba.fastjson.JSON;
import View.Result;

/**
 * Servlet implementation class MkdirServlet �½��ļ���
 */
@WebServlet("/MkdirServlet")
public class MkdirServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MkdirServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		if (userAccount == null) {
			request.getServletContext()
					.getRequestDispatcher("/netDisk/LoginServlet")
					.forward(request, response);
		}

		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());

		// У�����
		String folderName = request.getParameter("folderName");
		if (null == folderName) {
			result.setCode(400);
			result.setMessage("ȱ���ļ�������");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
//		folderName = new String(folderName.getBytes("ISO8859-1"), "UTF-8");

		String dirName = request.getParameter("dirname");
		if (null == dirName) {
			dirName="";
		}
//		dirName = new String(dirName.getBytes("ISO8859-1"), "UTF-8");

		String serverPath=netDiskCfg.getDiskDir()+File.separator;
		
		String targetPath = serverPath + userAccount + dirName;
		targetPath=targetPath.replace("/", File.separator);

		
		File f=new File(targetPath+File.separator+folderName);
		if (f.exists()){
			result.setCode(400);
			// TODO �ı�����
			result.setMessage("�ļ����Ѵ���");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}else{
			f.mkdir();
		}

		// ���
		response.getWriter().print(result.toJSON());
		//System.out.println(result.toJSON());
		return;
	}

}
