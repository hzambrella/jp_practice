package model;

import java.util.List;
import java.util.Map;

//api见https://console.faceplusplus.com.cn/documents/4887586
public class CmpRespSucc {
	private String requestId;
	/*比对结果置信度，范围 [0,100]，小数点后3位有效数字，数字越大表示两个人脸越可能是同一个人。
	注：如果传入图片但图片中未检测到人脸，则无法进行比对，本字段不返回。*/
	private float confidence;
	private String imageId1;
	private String imageId2;
	//map包括key值:1e-3 1e-4 1e-5。具体含义见face++ api
	private Map<String,Float> thresholds;
	private int timeUsed;
	private String errorMessage;
	public String getRequestId() {
		return requestId;
	}
	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}
	public float getConfidence() {
		return confidence;
	}
	public void setConfidence(float confidence) {
		this.confidence = confidence;
	}
	public String getImageId1() {
		return imageId1;
	}
	public void setImageId1(String imageId1) {
		this.imageId1 = imageId1;
	}
	public String getImageId2() {
		return imageId2;
	}
	public void setImageId2(String imageId2) {
		this.imageId2 = imageId2;
	}
	public Map<String,Float>  getThresholds() {
		return thresholds;
	}
	public void setThresholds(Map<String,Float>  thresholds) {
		this.thresholds = thresholds;
	}
	public int getTimeUsed() {
		return timeUsed;
	}
	public void setTimeUsed(int timeUsed) {
		this.timeUsed = timeUsed;
	}
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}
