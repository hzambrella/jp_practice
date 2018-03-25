package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskCfg.netDiskCfg;
import netDisk.netDiskEngine.FileOperate;
import View.Result;

import com.alibaba.fastjson.JSON;

/**
 * Servlet implementation class DeleteFileServlet ɾ���ļ�
 * http://localhost:8080/netDisk
 * /DeleteFileServlet?dirname=/yellow&fileName=canglaoshi.avi
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
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// ͨ��
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
		String targetPath = request.getParameter("dirname");
		if (targetPath == null) {
			targetPath = "";
		}
	

		String[] fileNames = request.getParameterValues("fileNames[]");
		if (fileNames == null || fileNames.length == 0) {
			result.setCode(400);
			result.setMessage("ȱ�ٴ�ɾ���ļ���");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}


		String serverPath=netDiskCfg.getDiskDir()+File.separator;

		targetPath = serverPath + userAccount + targetPath;
		targetPath = targetPath.replace("/", File.separator);
		
		Map<String,String> failIds=new HashMap<String,String>();
		for (int i=0;i<fileNames.length;i++) {
			String fileName=fileNames[i];
			// �߼�
			File toDelete = new File(targetPath + File.separator + fileName);
			if (!toDelete.exists()) {
				failIds.put(String.valueOf(i),"��ɾ���ļ�������");
				continue;
			}

			if (!FileOperate.deleteFile(toDelete)) {
				failIds.put(String.valueOf(i),"ɾ���ļ�ʧ��");
			}
		}
		
		result.getMap().put("failIds", failIds);
		// ���
		response.getWriter().print(result.toJSON());
		System.out.println(result.toJSON());
		return;
	}

}
