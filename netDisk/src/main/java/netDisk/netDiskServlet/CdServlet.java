package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import View.Result;
import netDisk.DTO.FileInfo;
import netDisk.netDiskCfg.netDiskCfg;
import netDisk.netDiskEngine.FileOperate;
import netDisk.netDiskEngine.StringOperate;

/**
 * Servlet implementation class cdServlet ��ѯĳ��Ŀ¼�µ�ȫ���ļ�
 */
@WebServlet("/CdServlet")
public class CdServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CdServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// ͨ��
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());

		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");

		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path", request.getContextPath()+"/loginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}

		// У�����
		String targetPath = request.getParameter("dirname");
		if (targetPath == null) {
			targetPath = "";
		}
		//System.out.println("������" + targetPath);
		targetPath =new String(targetPath.getBytes("ISO8859-1"),"UTF-8");
		int dataDeep = StringOperate.getSubStringNumFromString(targetPath);
		// �߼�
		String serverPath = netDiskCfg.getDiskDir();

		targetPath = serverPath + File.separator + userAccount + targetPath;
		targetPath = targetPath.replace("/", File.separator);

		try {
			//System.out.println(targetPath);
			List<FileInfo> directory = FileOperate.getFileDirectory(targetPath);
			result.getMap().put("directory", directory);
			result.getMap().put("dataDeep", dataDeep);
		} catch (IOException e) {
			e.printStackTrace();
			result.setCode(500);
			result.setMessage("ϵͳ�ļ������쳣");
			response.getWriter().print(result.toJSON());
			return;
		}

		// ���
		response.getWriter().print(result.toJSON());
		//System.out.println(result.toJSON());
		return;
	}

}
