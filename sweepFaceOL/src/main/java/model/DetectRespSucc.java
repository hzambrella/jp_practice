package model;

import java.util.List;
import java.util.Map;

public class DetectRespSucc {
	private List<Map<String,Object>> faces;
	private String requestId;
	private String imageId;
	private String timeUsed;
	private String errorMessage;
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public List<Map<String,Object>>  getFaces() {
		return faces;
	}
	public void setFaces(List<Map<String,Object>>  faces) {
		this.faces = faces;
	}
	public String getRequestId() {
		return requestId;
	}
	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}
	public String getImageId() {
		return imageId;
	}
	public void setImageId(String imageId) {
		this.imageId = imageId;
	}
	public String getTimeUsed() {
		return timeUsed;
	}
	public void setTimeUsed(String timeUsed) {
		this.timeUsed = timeUsed;
	}
	
}
