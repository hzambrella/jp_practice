package netDisk.netDiskEngine;

import org.apache.commons.fileupload.ProgressListener;

public class UploadListener implements ProgressListener {
    private UploadStatus status;  
    @Override  
    public void update(long bytesRead, long contentLength, int items) {  
        // TODO Auto-generated method stub  
        status.setBytesRead(bytesRead);//�Ѷ�ȡ���ݳ���  
        status.setContentLength(contentLength);//�ļ��ܳ���  
        status.setItems(items);//���ڱ���ڼ����ļ�  
    }  
    public UploadListener(UploadStatus status){  
        this.status = status;  
    }  
}
