package netDisk.netDiskEngine;

public class UploadStatus {
	private long bytesRead; // ���ϴ����ֽ���
	private long contentLength; // �����ļ����ܳ���
	private long startTime = System.currentTimeMillis();//��ʼʱ��
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
	private int items; //�����ϴ��ڼ����ļ�  
}
