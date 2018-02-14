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

import setting.Setting;
import View.Result;

/**
 * Servlet implementation class fileUploadServlet
 */
public class FileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FileUploadServlet() {
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
		factory.setSizeThreshold(Setting.MEMORY_THRESHOLD);
		// ������ʱ�洢Ŀ¼
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));

		ServletFileUpload upload = new ServletFileUpload(factory);

		// ��������ļ��ϴ�ֵ
		upload.setFileSizeMax(Setting.MAX_FILE_SIZE);

		// �����������ֵ (�����ļ��ͱ�����)
		upload.setSizeMax(Setting.MAX_REQUEST_SIZE);

		// ���Ĵ���
		upload.setHeaderEncoding("UTF-8");

		// ������ʱ·�����洢�ϴ����ļ�
		// ���·����Ե�ǰӦ�õ�Ŀ¼
		String uploadPath = request.getServletContext().getRealPath("")
				+ File.separator + Setting.UPLOAD_DIRECTORY;

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
					}
				}
				
				rmap.put("fileName", fileNames);
				result.setMap(rmap);
			}else{
				result.setCode(400);
				result.setMessage("�ϴ��ļ�Ϊ��");
				response.getWriter().println(result);
				return;
			}
		} catch (Exception ex) {
			result.setCode(500);
			result.setMessage("�ļ��ϴ��쳣");
			ex.printStackTrace();
			return;
		}

		response.getWriter().println(result);
		System.out.println(result.toJSON());
	}

}
