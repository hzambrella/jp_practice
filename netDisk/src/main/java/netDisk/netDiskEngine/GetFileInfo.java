package netDisk.netDiskEngine;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class GetFileInfo {
	//获取带有单位的文件大小。大文件不准。建议用FileChannel
	public static String getFileSize(File f) throws IOException{
		//文件夹没大小，强行看大小会有拒绝访问异常
		if (f.isDirectory()){
			return "0";
		}
		FileInputStream fis=new FileInputStream(f);
		int available=fis.available();
		fis.close();
		return formatSize(available);
	}
	
	private static String formatSize(int fileS) {
		DecimalFormat df = new DecimalFormat("#.00");
		String size = "0";
		if (fileS <= 0) {
			size = "0";
		} else if (fileS < 1024) {
			size = df.format((double) fileS) + "BT";
		} else if (fileS < 1048576) {
			size = df.format((double) fileS / 1024) + "KB";
		} else if (fileS < 1073741824) {
			size = df.format((double) fileS / 1048576) + "MB";
		} else {
			size = df.format((double) fileS / 1073741824) + "GB";
		}
		return size;
	}
	
	//修改时间
	public static String getFileModifiedTime(File f){
		long mtime=f.lastModified();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(mtime);
		String modifytimeStr =sdf.format(cal.getTime());
		return modifytimeStr;
	}
	
	//文件类型
	public static String getFileType(File f){
		if (f.isDirectory()){
			return "folder";
		}
		String[] split=f.getName().split(".");
		
		if (split.length<2){
			return "file";
		}else{
			return split[split.length-1];
		}
	}
}
