package netDisk.netDiskServlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
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
 * Servlet implementation class FeedbackServlet ����
 */
@WebServlet("/FeedbackServlet")
public class FeedbackServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FeedbackServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// ͨ��
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		response.setCharacterEncoding("utf-8");
		// response.setContentType("text/html;charset=utf-8");

		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path",
					request.getContextPath() + "/LoginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}

		// У�����
		String text = request.getParameter("text");
		if (text == null) {
			response.getWriter().print(result.toJSON());
			return;
		}

		// �߼�
		
		System.out.println("�û�" + userAccount + "�����:" + text);
		
		SimpleDateFormat time=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String TimeString = time.format(new java.util.Date());
		StringBuffer sb=new StringBuffer();
		sb.append("["+TimeString+"]");
		sb.append("�û�" + userAccount + "�����:\n" + text+"\n");
		
		
		File f = new File(netDiskCfg.getDiskDir() + File.separator + "Feedback"
				+ File.separator + "feedback.doc");
		
		if (!f.exists()){
			f.createNewFile();
		}

		FileOutputStream fout=new FileOutputStream (f);
		fout.write(sb.toString().getBytes("utf-8"));
		fout.close();
		
		// ���
		response.getWriter().print(result.toJSON());
		// System.out.println(result.toJSON());
		return;
	}

}
