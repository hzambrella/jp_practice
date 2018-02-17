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

//配置信息
public class Setting {
	// 上传文件存储目录
	public static final String UPLOAD_DIRECTORY = "upload";

	// 上传配置
	public static final int MEMORY_THRESHOLD = 1024 * 1024 * 3; // 3MB
	public static final int MAX_FILE_SIZE = 1024 * 1024 * 40; // 40MB
	public static final int MAX_REQUEST_SIZE = 1024 * 1024 * 50; // 50MB

	// face++接口配置
	public static final String KuangshiFaceApiKey = "snsx7Gl8KabLSQmBModDqOQBcikwW14a";
	public static final String KuangshiFaceDetectReturnAttributes="gender,age,emotion,beauty";
	
	public static final String KuangshiFaceApiSecret = "1_b_swUwPWcy1bJSSk--XglBt_V5IXrR";
	// 接口的URL
	public static final String KuangshiFaceDetectURL = "https://api-cn.faceplusplus.com/facepp/v3/detect";
	public static final String KuangshiFaceCmpURL="https://api-cn.faceplusplus.com/facepp/v3/compare";


	// 发送post请求到face++的detect接口
	public static DetectRespSucc kuangshiFaceDetectPostByHttpClient(File file)
			throws IOException {

		CloseableHttpClient httpClient = HttpClients.createDefault();
		
		try {
			HttpPost httpPost = new HttpPost(Setting.KuangshiFaceDetectURL);
			// 把文件转换成流对象FileBody
			FileBody imageFile = new FileBody(file);
			StringBody apikey = new StringBody(KuangshiFaceApiKey, ContentType.TEXT_PLAIN);
			StringBody apiSecret = new StringBody(KuangshiFaceApiSecret, ContentType.TEXT_PLAIN);
			StringBody returnAttr = new StringBody(KuangshiFaceDetectReturnAttributes, ContentType.TEXT_PLAIN);
			
			
			HttpEntity reqEntity = MultipartEntityBuilder.create()
					.setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
					.addPart("image_file", imageFile) // uploadFile对应服务端类的同名属性<File类型>
					.addPart("api_key", apikey)
					.addPart("api_secret", apiSecret)
					.addPart("return_attributes", returnAttr)
					// uploadFileName对应服务端类的同名属性<String类型>
					.setCharset(CharsetUtils.get("UTF-8")).build();

			httpPost.setEntity(reqEntity);

//			System.out.println("发起请求的页面地址 " + httpPost.getRequestLine());
			// 发起请求 并返回请求的响应
			CloseableHttpResponse response = httpClient.execute(httpPost);
			try {
//				

				// 获取响应对象
				HttpEntity resEntity = response.getEntity();
				if (resEntity != null) {
//					// 打印响应长度
//					System.out.println("Response content length: "
//							+ resEntity.getContentLength());
					// 打印响应内容
					String respString=EntityUtils.toString(resEntity,
						Charset.forName("UTF-8"));
					System.out.println(respString);
					EntityUtils.consume(resEntity);
					if (response.getStatusLine().getStatusCode()!=200){
						// 打印响应状态
						System.out.println(response.getStatusLine());
						DetectRespSucc wrongResp=new DetectRespSucc();
						if (response.getStatusLine().getReasonPhrase().equals("Request Entity Too Large")){
							wrongResp.setErrorMessage("上传图片过大");
						}else{
							wrongResp.setErrorMessage(response.getStatusLine().getReasonPhrase());
						}
						
				
						return wrongResp;
					}
					DetectRespSucc detectRes=JSON.parseObject(respString,new TypeReference<DetectRespSucc>() {});
					System.out.println(JSON.toJSONString(detectRes));
					return detectRes;	
				}
				return null;
			} finally {
				response.close();
			}
		} finally {
			httpClient.close();
			//删掉硬盘文件
			file.delete();
		}
	}
	
	// 发送post请求到face++的compare接口。目前暂且只支持2个文件。
		public static CmpRespSucc kuangshiFaceCmpPostByHttpClient(File fileOrg,File fileCmp)
				throws IOException {

			CloseableHttpClient httpClient = HttpClients.createDefault();
			
			try {
				HttpPost httpPost = new HttpPost(Setting.KuangshiFaceCmpURL);
				// 把文件转换成流对象FileBody
				FileBody imageFileOrg = new FileBody(fileOrg);
				FileBody imageFileCmp = new FileBody(fileCmp);
				StringBody apikey = new StringBody(KuangshiFaceApiKey, ContentType.TEXT_PLAIN);
				StringBody apiSecret = new StringBody(KuangshiFaceApiSecret, ContentType.TEXT_PLAIN);		
				
				HttpEntity reqEntity = MultipartEntityBuilder.create()
						.setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
						.addPart("image_file1", imageFileOrg)
						.addPart("image_file2", imageFileCmp) // uploadFile对应服务端类的同名属性<File类型>
						.addPart("api_key", apikey)
						.addPart("api_secret", apiSecret)
						// uploadFileName对应服务端类的同名属性<String类型>
						.setCharset(CharsetUtils.get("UTF-8")).build();

				httpPost.setEntity(reqEntity);

//				System.out.println("发起请求的页面地址 " + httpPost.getRequestLine());
				// 发起请求 并返回请求的响应
				CloseableHttpResponse response = httpClient.execute(httpPost);
				try {
//					

					// 获取响应对象
					HttpEntity resEntity = response.getEntity();
					if (resEntity != null) {
//						// 打印响应长度
//						System.out.println("Response content length: "
//								+ resEntity.getContentLength());
						// 打印响应内容
						String respString=EntityUtils.toString(resEntity,
							Charset.forName("UTF-8"));
						System.out.println(respString);
						EntityUtils.consume(resEntity);
						if (response.getStatusLine().getStatusCode()!=200){
							// 打印响应状态
							System.out.println(response.getStatusLine());
							CmpRespSucc wrongResp=new CmpRespSucc();
							if (response.getStatusLine().getReasonPhrase().equals("Request Entity Too Large")){
								wrongResp.setErrorMessage("上传图片过大");
							}else{
								wrongResp.setErrorMessage(response.getStatusLine().getReasonPhrase());
							}
							
					
							return wrongResp;
						}
						CmpRespSucc cmpRes=JSON.parseObject(respString,new TypeReference<CmpRespSucc>() {});
						System.out.println(JSON.toJSONString(cmpRes));
						return cmpRes;	
					}
					return null;
				} finally {
					response.close();
				}
			} finally {
				httpClient.close();
				//删掉硬盘文件
				fileOrg.delete();
				fileCmp.delete();
			}
		}
	
	// 不能用
	public static String kuangshiFaceDetectPost1(Result result) throws IOException {

		URL url = new URL(Setting.KuangshiFaceDetectURL);// 创建连接
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestMethod("POST"); // 设置请求方式
		connection.setRequestProperty("Accept", "application/json"); // 设置接收数据的格式
		connection.setRequestProperty("Content-Type",
				"post multipart/form-data"); // 设置发送数据的格式
		connection.connect();
		// OutputStreamWriter out = new
		// OutputStreamWriter(connection.getOutputStream(), "UTF-8"); // utf-8编码
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

		// 读取响应
		int length = (int) connection.getContentLength();// 获取长度
		if (length != -1) {
			byte[] data = new byte[length];
			byte[] temp = new byte[512];
			int readLen = 0;
			int destPos = 0;
			while ((readLen = is.read(temp)) > 0) {
				System.arraycopy(temp, 0, data, destPos, readLen);
				destPos += readLen;
			}
			String resp = new String(data, "UTF-8"); // utf-8编码
			System.out.println(resp);
			// 处理接口结果
		} else {
			// result.setCode(500);
			// result.setMessage("服务端接口异常");
			// response.getWriter().println(result.toJSON());
			return "";
		}

		return "";

	}
}
