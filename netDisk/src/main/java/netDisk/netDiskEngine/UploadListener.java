package netDisk.netDiskEngine;

import org.apache.commons.fileupload.ProgressListener;

public class UploadListener implements ProgressListener {
    private UploadStatus status;  
    @Override  
    public void update(long bytesRead, long contentLength, int items) {  
        // TODO Auto-generated method stub  
        status.setBytesRead(bytesRead);//已读取数据长度  
        status.setContentLength(contentLength);//文件总长度  
        status.setItems(items);//正在保存第几个文件  
    }  
    public UploadListener(UploadStatus status){  
        this.status = status;  
    }  
}
