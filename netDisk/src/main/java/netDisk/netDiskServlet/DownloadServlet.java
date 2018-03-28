package netDisk.netDiskServlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskCfg.netDiskCfg;
import View.Result;

/**
 * Servlet implementation class DownloadServlet
 */
@WebServlet("/DownloadServlet")
public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DownloadServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setCharacterEncoding("utf-8");

		String userAccount = (String) req.getSession(true).getAttribute(
				"userAccount");

		if (userAccount == null) {
			resp.sendRedirect(req.getContextPath() + "/" + "LoginServlet");
			return;
		}

		String dirName = req.getParameter("dirName");
		if (dirName == null) {
			dirName = "";
		}
		dirName = dirName.replace("/", File.separator);
		dirName = new String(dirName.getBytes("ISO8859-1"), "utf-8");

		String fileName = req.getParameter("fileName");
		String serverPath = netDiskCfg.getDiskDir();
		fileName = new String(fileName.getBytes("ISO8859-1"), "utf-8");

		String filePath = serverPath + File.separator + userAccount + dirName
				+ File.separator + fileName;
		File file = new File(filePath);

		// TODO:提示页面
		if (!file.exists()) {
			System.out.println("log[warn]" + filePath + "不存在");
			resp.sendRedirect(req.getContextPath());
			return;
		}

		if (file.isDirectory()) {
			System.out.println("log[warn]" + filePath + "是目录");
			resp.sendRedirect(req.getContextPath());
			return;
		}

		System.out
				.println("log[debug]" + "用户" + userAccount + "下载了" + filePath);
		resp.setContentType("application/octet-stream");
		//下载后，文件名字中文部分不见了。这个解决方案网上说ie11不行
		resp.setHeader("Content-Disposition", "attachment;filename="
				+ new String(fileName.getBytes("utf-8"), "ISO8859-1"));
		resp.setContentLength((int) file.length());

		FileInputStream fis = null;
		try {
			fis = new FileInputStream(file);
			byte[] buffer = new byte[128];
			int count = 0;
			while ((count = fis.read(buffer)) > 0) {
				resp.getOutputStream().write(buffer, 0, count);
			}
			fis.close();
		} catch (Exception e) {
			resp.getOutputStream().flush();
			resp.getOutputStream().close();
			e.printStackTrace();
		} finally {
			resp.getOutputStream().flush();
			resp.getOutputStream().close();

		}
	}

}
