package netDisk.netDiskServlet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import View.Result;
import netDisk.netDiskCfg.netDiskCfg;
import netDisk.netDiskEngine.UploadListener;
import netDisk.netDiskEngine.UploadStatus;

/**
 * Servlet implementation class UploadServlet �ļ��ϴ�
 */
@WebServlet("/UploadServlet")
public class UploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UploadServlet() {
		super();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// ͨ��
		response.setCharacterEncoding("utf-8");
		// response.setContentType("text/html;charset=utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path", request.getContextPath()+"/LoginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}


		String serverPath = netDiskCfg.getDiskDir();
		String targetPath = serverPath + File.separator + userAccount;

		// ����
		UploadStatus status = new UploadStatus();
		UploadListener listener = new UploadListener(status);
		request.getSession().setAttribute("uploadStatus", status);

		// ������������
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// �����ļ�����Ŀ¼
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
		// �����ڴ��ٽ�ֵ - �����󽫲�����ʱ�ļ����洢����ʱĿ¼��
		factory.setSizeThreshold(netDiskCfg.getMemoryThreshold()); // //�����ļ�����Ŀ¼

		// ����������
		ServletFileUpload upload = new ServletFileUpload(factory);
		// ��������ļ��ϴ�ֵ
		upload.setFileSizeMax(netDiskCfg.getMaxFileSize());
		// �����������ֵ (�����ļ��ͱ�����)
		upload.setSizeMax(netDiskCfg.getMaxRequestSize());
		upload.setHeaderEncoding("UTF-8");
		// ע���ϴ����̼�����
		upload.setProgressListener(listener);

		// ����request�õ���װFileItem��list
		try {
			List<FileItem> list = upload.parseRequest(request);
			String fileDir = "";

			// �ȴ��������
			for (FileItem item : list) {
				if (item.isFormField()) {
					if (item.getFieldName().equals("dirName")) {
						fileDir = item.getString().replace("/", File.separator);
					}
				}
			}
			//������������
			fileDir=new String(fileDir.getBytes("ISO8859-1"),"utf-8");
			// TODO :MD5 ��������
			// �ٴ����ڱ��е����ݣ������ϴ����ļ�
			for (FileItem item : list) {
				if (!item.isFormField()) {
					String fileName = item.getName();
					// ��ü����������Ϊ�п���ֻ�ϴ�һ���ļ�����������Ļ��������ļ�����
					// �յģ���дʱ�ͻ���Ϊ����һ��Ŀ¼������
					if (fileName == null || "".equals(fileName)) {
						continue;
					}

					File saved = new File(targetPath + File.separator + fileDir
							+ File.separator + fileName);

	
					InputStream ins = item.getInputStream();
					OutputStream ous = new FileOutputStream(saved);

					byte[] tmp = new byte[1024];
					int len = -1;
					while ((len = ins.read(tmp)) != -1) {
						ous.write(tmp, 0, len); // д�ļ�
					}
					ous.close();
					ins.close();
				}
			}
			// ���쳣���ˣ������Ż��ӡ׼ȷ����
		} catch (FileUploadException e) {
			e.printStackTrace();
			String errorMess = "�ϴ���������" + e.getMessage();
			result.setCode(500);
			result.setMessage(errorMess);
			response.getWriter().print(result.toJSON());
			return;
		}

		UploadStatus statusReset = (UploadStatus) request.getSession(true)
				.getAttribute("uploadStatus");

		if (null != statusReset) {
			statusReset.setItems(0);
		}

		response.getWriter().print(result.toJSON());
		return;
	}

	// �ϴ�����
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// ͨ��
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());
		response.setCharacterEncoding("utf-8");
		response.setHeader("Cache-Control", "no-store"); // ��ֹ���������
		response.setHeader("Pragrma", "no-cache"); // ��ֹ���������
		response.setDateHeader("Expires", 0); // ��ֹ���������

		UploadStatus status = (UploadStatus) request.getSession(true)
				.getAttribute("uploadStatus");// ��session�ж�ȡ�ϴ���Ϣ

		if (status == null) {
			response.getWriter().print(result.toJSON());
			return;
		}

		long startTime = status.getStartTime(); // �ϴ���ʼʱ��
		long currentTime = System.currentTimeMillis(); // ����ʱ��
		long time = (currentTime - startTime) / 1000 + 1;// �Ѿ������ʱ�� ��λ��s

		double velocity = status.getBytesRead() / time; // �����ٶȣ�byte/s

		double totalTime = status.getContentLength() / velocity; // ������ʱ��
		@SuppressWarnings("unused")
		double timeLeft = totalTime - time; // ����ʣ��ʱ��
		int percent = (int) (100 * (double) status.getBytesRead() / (double) status
				.getContentLength()); // �ٷֱ�
		@SuppressWarnings("unused")
		double length = status.getBytesRead() / 1024 / 1024; // �������
		@SuppressWarnings("unused")
		double totalLength = status.getContentLength() / 1024 / 1024; // �ܳ��� M
		int item = status.getItems();// ���ڴ���ڼ���

		Map<String, Object> map = result.getMap();
		map.put("percent", percent);// �ٷֱ�
		map.put("item", item);// ���ڴ���ڼ���


		response.getWriter().println(result.toJSON()); // ����������������
		return;
	}

}
