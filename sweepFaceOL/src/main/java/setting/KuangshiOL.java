package setting;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;

import model.CmpRespSucc;
import model.DetectRespSucc;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.CharsetUtils;
import org.apache.http.util.EntityUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;

import View.Result;

//������Ϣ
public class KuangshiOL {
	// �ϴ��ļ��洢Ŀ¼
	public static final String UPLOAD_DIRECTORY = "upload";

	// �ϴ�����
	public static final int MEMORY_THRESHOLD = 1024 * 1024 * 3; // 3MB
	public static final int MAX_FILE_SIZE = 1024 * 1024 * 40; // 40MB
	public static final int MAX_REQUEST_SIZE = 1024 * 1024 * 50; // 50MB

	// face++�ӿ�����
	public static final String KuangshiFaceApiKey = "snsx7Gl8KabLSQmBModDqOQBcikwW14a";
	public static final String KuangshiFaceDetectReturnAttributes = "gender,age,emotion,beauty";

	public static final String KuangshiFaceApiSecret = "1_b_swUwPWcy1bJSSk--XglBt_V5IXrR";
	// �ӿڵ�URL
	public static final String KuangshiFaceDetectURL = "https://api-cn.faceplusplus.com/facepp/v3/detect";
	public static final String KuangshiFaceCmpURL = "https://api-cn.faceplusplus.com/facepp/v3/compare";

	// ����post����face++��detect�ӿ�
	public static DetectRespSucc kuangshiFaceDetectPostByHttpClient(File file)
			throws IOException {

		CloseableHttpClient httpClient = HttpClients.createDefault();

		try {
			HttpPost httpPost = new HttpPost(KuangshiOL.KuangshiFaceDetectURL);
			// ���ļ�ת����������FileBody
			FileBody imageFile = new FileBody(file);
			StringBody apikey = new StringBody(KuangshiFaceApiKey,
					ContentType.TEXT_PLAIN);
			StringBody apiSecret = new StringBody(KuangshiFaceApiSecret,
					ContentType.TEXT_PLAIN);
			StringBody returnAttr = new StringBody(
					KuangshiFaceDetectReturnAttributes, ContentType.TEXT_PLAIN);

			HttpEntity reqEntity = MultipartEntityBuilder
					.create()
					.setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
					.addPart("image_file", imageFile)
					// uploadFile��Ӧ��������ͬ������<File����>
					.addPart("api_key", apikey)
					.addPart("api_secret", apiSecret)
					.addPart("return_attributes", returnAttr)
					// uploadFileName��Ӧ��������ͬ������<String����>
					.setCharset(CharsetUtils.get("UTF-8")).build();

			httpPost.setEntity(reqEntity);

			// �������� �������������Ӧ
			CloseableHttpResponse response = httpClient.execute(httpPost);
			try {
				//

				// ��ȡ��Ӧ����
				HttpEntity resEntity = response.getEntity();
				if (resEntity != null) {
					// // ��ӡ��Ӧ����
					// System.out.println("Response content length: "
					// + resEntity.getContentLength());
					// ��ӡ��Ӧ����
					String respString = EntityUtils.toString(resEntity,
							Charset.forName("UTF-8"));
					EntityUtils.consume(resEntity);

					if (response.getStatusLine().getStatusCode() != 200) {
						// ��ӡ��Ӧ״̬
						System.out.println("log[warn] face++ detect error:"
								+ respString
								+ response.getStatusLine().getReasonPhrase());
						DetectRespSucc wrongResp = new DetectRespSucc();
						if (response.getStatusLine().getReasonPhrase()
								.equals("Request Entity Too Large")) {
							wrongResp.setErrorMessage("ͼƬ����,���ܳ���2MB");
							return wrongResp;
						}

						wrongResp = JSON.parseObject(respString,
								new TypeReference<DetectRespSucc>() {
								});
						System.out
								.println("log[debug]result from kuangshiOL detect:"
										+ JSON.toJSONString(wrongResp));
						return wrongResp;
					}
					DetectRespSucc detectRes = JSON.parseObject(respString,
							new TypeReference<DetectRespSucc>() {
							});
					// System.out.println("log[debug]result from kuangshiOL:"+JSON.toJSONString(detectRes));
					return detectRes;
				}
				return null;
			} finally {
				response.close();
			}
		} finally {
			httpClient.close();
		}
	}

	// ����post����face++��compare�ӿڡ�Ŀǰ����ֻ֧��2���ļ���
	public static CmpRespSucc kuangshiFaceCmpPostByHttpClient(File fileOrg,
			File fileCmp) throws IOException {

		CloseableHttpClient httpClient = HttpClients.createDefault();

		try {
			HttpPost httpPost = new HttpPost(KuangshiOL.KuangshiFaceCmpURL);
			// ���ļ�ת����������FileBody
			FileBody imageFileOrg = new FileBody(fileOrg);
			FileBody imageFileCmp = new FileBody(fileCmp);
			StringBody apikey = new StringBody(KuangshiFaceApiKey,
					ContentType.TEXT_PLAIN);
			StringBody apiSecret = new StringBody(KuangshiFaceApiSecret,
					ContentType.TEXT_PLAIN);

			HttpEntity reqEntity = MultipartEntityBuilder.create()
					.setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
					.addPart("image_file1", imageFileOrg)
					.addPart("image_file2", imageFileCmp)
					// uploadFile��Ӧ��������ͬ������<File����>
					.addPart("api_key", apikey)
					.addPart("api_secret", apiSecret)
					// uploadFileName��Ӧ��������ͬ������<String����>
					.setCharset(CharsetUtils.get("UTF-8")).build();

			httpPost.setEntity(reqEntity);

			// System.out.println("���������ҳ���ַ " + httpPost.getRequestLine());
			// �������� �������������Ӧ
			CloseableHttpResponse response = httpClient.execute(httpPost);
			try {
				//

				// ��ȡ��Ӧ����
				HttpEntity resEntity = response.getEntity();
				if (resEntity != null) {
					// // ��ӡ��Ӧ����
					// System.out.println("Response content length: "
					// + resEntity.getContentLength());
					// ��ӡ��Ӧ����
					
					//TODO bug
					//org.apache.http.ConnectionClosedException: Premature end of Content-Length delimited message body (expected: 41; received: 0
					String respString = EntityUtils.toString(resEntity,
							Charset.forName("UTF-8"));

					EntityUtils.consume(resEntity);
					if (response.getStatusLine().getStatusCode() != 200) {
						// ��ӡ��Ӧ״̬
						System.out.println("log[warn]face++ cmp:" + respString
								+ response.getStatusLine());
						CmpRespSucc wrongResp = new CmpRespSucc();
						if (response.getStatusLine().getReasonPhrase()
								.equals("Request Entity Too Large")) {
							wrongResp.setErrorMessage("ͼƬ����,���ܳ���2MB");
							return wrongResp;
						}
						wrongResp = JSON.parseObject(respString,
								new TypeReference<CmpRespSucc>() {
								});

						System.out.println("log[debug]result from face++ cmp"
								+ JSON.toJSONString(wrongResp));
						return wrongResp;
					}
					//System.out.println(respString);
					CmpRespSucc cmpRes = JSON.parseObject(respString,
							new TypeReference<CmpRespSucc>() {
							});
					// System.out.println("log[debug]result from kuangshiOL:"+JSON.toJSONString(cmpRes));
					return cmpRes;
				}
				return null;
			} finally {
				response.close();
			}
		} finally {
			httpClient.close();
		}
	}

	public static String formatErrorMessageFromKuangshi(String error) {
		if ("AUTHENTICATION_ERROR".indexOf(error) >= 0) {
			return ":������Ȩ���쳣������ϵ���ǡ�";
		} else if ("CONCURRENCY_LIMIT_EXCEEDED".equals(error)) {
			return "ϵͳ��æ�������ԡ�";
		} else if (error.equals("Request Entity Too Large")||"IMAGE_FILE_TOO_LARGE".indexOf(error)>=0) {
			return "ͼƬ�ϴ�����,,���ܳ���2MB";
		}
		return error;
	}

	// ������
	public static String kuangshiFaceDetectPost1(Result result)
			throws IOException {

		URL url = new URL(KuangshiOL.KuangshiFaceDetectURL);// ��������
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestMethod("POST"); // ��������ʽ
		connection.setRequestProperty("Accept", "application/json"); // ���ý������ݵĸ�ʽ
		connection.setRequestProperty("Content-Type",
				"post multipart/form-data"); // ���÷������ݵĸ�ʽ
		connection.connect();
		// OutputStreamWriter out = new
		// OutputStreamWriter(connection.getOutputStream(), "UTF-8"); // utf-8����
		// out.append(JSONUtil.object2JsonString(params));

		// out.flush();
		// out.close();

		int code = connection.getResponseCode();
		InputStream is = null;
		if (code == 200) {
			is = connection.getInputStream();
		} else {
			is = connection.getErrorStream();
		}

		// ��ȡ��Ӧ
		int length = (int) connection.getContentLength();// ��ȡ����
		if (length != -1) {
			byte[] data = new byte[length];
			byte[] temp = new byte[512];
			int readLen = 0;
			int destPos = 0;
			while ((readLen = is.read(temp)) > 0) {
				System.arraycopy(temp, 0, data, destPos, readLen);
				destPos += readLen;
			}
			String resp = new String(data, "UTF-8"); // utf-8����
			System.out.println(resp);
			// ����ӿڽ��
		} else {
			// result.setCode(500);
			// result.setMessage("����˽ӿ��쳣");
			// response.getWriter().println(result.toJSON());
			return "";
		}

		return "";

	}
}
