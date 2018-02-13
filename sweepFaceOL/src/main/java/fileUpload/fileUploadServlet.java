package fileUpload;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import View.Result;

/**
 * Servlet implementation class fileUploadServlet
 */
public class fileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	// �ϴ��ļ��洢Ŀ¼
	private static final String UPLOAD_DIRECTORY = "upload";

	// �ϴ�����
	private static final int MEMORY_THRESHOLD = 1024 * 1024 * 3; // 3MB
	private static final int MAX_FILE_SIZE = 1024 * 1024 * 40; // 40MB
	private static final int MAX_REQUEST_SIZE = 1024 * 1024 * 50; // 50MB

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public fileUploadServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Result result = new Result(200, "�ϴ��ɹ�", new HashMap<String,Object>());
		response.setCharacterEncoding("utf-8");
		//�����ļ����󡣷�ֹ�����������json�������<pre>��ǩ
		response.setContentType("text/html");
		// ����Ƿ�Ϊ��ý���ϴ�
		if (!ServletFileUpload.isMultipartContent(request)) {
			// ���������ֹͣ
			result.setCode(500);
			result.setMessage("��������� enctype=multipart/form-data");
			response.getWriter().println(result.toJSON());
			return;
		}

		// �����ϴ�����
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// �����ڴ��ٽ�ֵ - �����󽫲�����ʱ�ļ����洢����ʱĿ¼��
		factory.setSizeThreshold(MEMORY_THRESHOLD);
		// ������ʱ�洢Ŀ¼
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));

		ServletFileUpload upload = new ServletFileUpload(factory);

		// ��������ļ��ϴ�ֵ
		upload.setFileSizeMax(MAX_FILE_SIZE);

		// �����������ֵ (�����ļ��ͱ�����)
		upload.setSizeMax(MAX_REQUEST_SIZE);

		// ���Ĵ���
		upload.setHeaderEncoding("UTF-8");

		// ������ʱ·�����洢�ϴ����ļ�
		// ���·����Ե�ǰӦ�õ�Ŀ¼
		String uploadPath = request.getServletContext().getRealPath("")
				+ File.separator + UPLOAD_DIRECTORY;

		// ���Ŀ¼�������򴴽�
		File uploadDir = new File(uploadPath);
		if (!uploadDir.exists()) {
			uploadDir.mkdir();
		}

		Map<String,Object> rmap = result.getMap();
		try {
			// ���������������ȡ�ļ�����
			List<FileItem> formItems = upload.parseRequest(request);

			if (formItems != null && formItems.size() > 0) {
				List<String> fileNames = new ArrayList<String> ();
				// ����������
				for (FileItem item : formItems) {
					// �����ڱ��е��ֶ�
					if (!item.isFormField()) {
						String fileName = new File(item.getName()).getName();
						
						String filePath = uploadPath + File.separator
								+ fileName;
						
						File storeFile = new File(filePath);
						// �ڿ���̨����ļ����ϴ�·��
						
						// �����ļ���Ӳ��
						item.write(storeFile);
						fileNames.add(fileName);
						request.setAttribute("message", "�ļ��ϴ��ɹ�!");
					}

				}
				
				rmap.put("fileName", fileNames);
				result.setMap(rmap);
			}else{
				result.setCode(400);
				result.setMessage("�ϴ��ļ�Ϊ��");
				response.getWriter().println(result.toJSON());
				return;
			}
		} catch (Exception ex) {
			result.setCode(500);
			result.setMessage("�ļ��ϴ��쳣");
			ex.printStackTrace();
			return;
		}

		response.getWriter().println(result.toJSON());
		System.out.println(result.toJSON());
	}

}
