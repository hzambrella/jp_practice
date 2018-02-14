package model;

public class Face {
	private FaceRectangle faceRectangle;
	private String faceToken;
	private Attributes attributes;
	public FaceRectangle getFaceRectangle() {
		return faceRectangle;
	}
	public void setFaceRectangle(FaceRectangle faceRectangle) {
		this.faceRectangle = faceRectangle;
	}
	public String getFaceToken() {
		return faceToken;
	}
	public void setFaceToken(String faceToken) {
		this.faceToken = faceToken;
	}
	public Attributes getAttributes() {
		return attributes;
	}
	public void setAttributes(Attributes attributes) {
		this.attributes = attributes;
	}
}
