package model;

import java.util.List;
import java.util.Map;

//api��https://console.faceplusplus.com.cn/documents/4887586
public class CmpRespSucc {
	private String requestId;
	/*�ȶԽ�����Ŷȣ���Χ [0,100]��С�����3λ��Ч���֣�����Խ���ʾ��������Խ������ͬһ���ˡ�
	ע���������ͼƬ��ͼƬ��δ��⵽���������޷����бȶԣ����ֶβ����ء�*/
	private float confidence;
	private String imageId1;
	private String imageId2;
	//map����keyֵ:1e-3 1e-4 1e-5�����庬���face++ api
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
