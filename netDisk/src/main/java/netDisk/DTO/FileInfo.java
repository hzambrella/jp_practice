package netDisk.DTO;

import java.io.File;
import java.io.IOException;
import netDisk.netDiskEngine.FileOperate;

public class FileInfo{
	private String name;
	private String size;
	private String type;
	private String modifiedTime;
	
	public FileInfo(String name,String size,String type,String modifiedTime){
		this.setModifiedTime(modifiedTime);
		this.setName(name);
		this.setSize(size);
		this.setType(type);
	}
	
	public FileInfo(File f) throws IOException{
		String name=f.getName();
	
		this.setModifiedTime(FileOperate.getFileModifiedTime(f));
		this.setName(name);
		this.setSize(FileOperate.getFileSize(f));
		this.setType(FileOperate.getFileType(f));
	}
	
	
	public String getModifiedTime() {
		return modifiedTime;
	}
	public void setModifiedTime(String modifiedTime) {
		this.modifiedTime = modifiedTime;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}