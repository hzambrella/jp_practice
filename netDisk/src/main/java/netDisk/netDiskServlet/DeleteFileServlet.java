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
 * Servlet implementation class DeleteFileServlet ɾ���ļ�
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
		// ͨ��
		String userAccountMock = "testUser";
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());

		// У�����
		String targetPath = request.getParameter("dirname");
		if (targetPath == null) {
			targetPath = "";
		}
		targetPath = new String(targetPath.getBytes("ISO8859-1"), "UTF-8");
		
		String fileName = request.getParameter("fileName");
		if (fileName == null) {
			result.setCode(400);
			result.setMessage("ȱ�ٴ�ɾ���ļ���");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		fileName = new String(fileName.getBytes("ISO8859-1"), "UTF-8");

		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;

		targetPath = serverPath + userAccountMock + targetPath;
		targetPath = targetPath.replace("/", File.separator);
		
		// �߼�
		File toDelete=new File(targetPath+File.separator+fileName);
		if (!toDelete.exists()){
			result.setCode(400);
			result.setMessage("��ɾ���ļ�������");
			response.getWriter().print(JSON.toJSONString(result));
			System.out.println("log:[debug]"+targetPath+File.separator+fileName);
			return;
		}
		
		if(!FileOperate.deleteFile(toDelete)){
			result.setCode(500);
			result.setMessage("ɾ���ļ�ʧ��");
			response.getWriter().print(JSON.toJSONString(result));
			System.out.println("log:[debug]"+targetPath+File.separator+fileName);
			return;
		};

		// ���
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
