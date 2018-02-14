package sweepFaceOL;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.DetectRespSucc;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import setting.Setting;
import View.Result;

/**
 * Servlet implementation class sweepServlet
 */
public class SweepServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * Default constructor.
	 */
	public SweepServlet() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());
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

		try {
			// ���������������ȡ�ļ�����
			List<FileItem> formItems = upload.parseRequest(request);

			if (formItems != null && formItems.size() > 0) {
				// ����������
				FileItem item = formItems.get(0);
				File imgFile = new File(item.getName());
				item.write(imgFile);			
				// ����face++�ӿ�
				try {
					DetectRespSucc re=Setting.kuangshiFaceDetectPostByHttpClient(imgFile);

					if (null==re){
						result.setCode(500);
						result.setMessage("����ӿ��쳣");
						response.getWriter().println(result.toJSON());
						System.out.println("log:����ӿ��쳣 re is null");
						return;
					}
					
					if (null!=re.getErrorMessage()){
						result.setCode(500);
						result.setMessage("����ӿ��쳣"+re.getErrorMessage());
						response.getWriter().println(result.toJSON());
						System.out.println("log:����ӿ��쳣 have error message");
						return;
					}
					result.getMap().put("result", re);
				} catch (Exception ex) {
					result.setCode(500);
					result.setMessage("����ӿ��쳣");
					response.getWriter().println(result.toJSON());
					ex.printStackTrace();
					return;
				}
			} else {
				result.setCode(400);
				result.setMessage("�ϴ��ļ�Ϊ��");
				response.getWriter().println(result.toJSON());
				System.out.println("log:�ϴ��ļ�Ϊ��");
				return;
			}
		} catch (Exception ex) {
			result.setCode(500);
			result.setMessage("�ļ��ϴ��쳣");
			response.getWriter().println(result.toJSON());
			ex.printStackTrace();
			return;
		}
		
		//�ɹ���
		response.getWriter().println(result.toJSON());

	}

	

}
