package netDisk.netDiskEngine;

public class UploadStatus {
	private long bytesRead; // 已上传的字节数
	private long contentLength; // 所有文件的总长度
	private long startTime = System.currentTimeMillis();//开始时间
    public long getBytesRead() {
		return bytesRead;
	}
	public void setBytesRead(long bytesRead) {
		this.bytesRead = bytesRead;
	}
	public long getContentLength() {
		return contentLength;
	}
	public void setContentLength(long contentLength) {
		this.contentLength = contentLength;
	}
	public long getStartTime() {
		return startTime;
	}
	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}
	public int getItems() {
		return items;
	}
	public void setItems(int items) {
		this.items = items;
	}
	private int items; //正在上传第几个文件  
}
