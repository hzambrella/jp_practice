package netDisk.netDiskCfg;

public class netDiskCfg {
	private static String diskDir=null;
	 // 设置内存临界值 - 超过后将产生临时文件并存储于临时目录中
	private static final int MEMORY_THRESHOLD   = 1024 * 1024 * 3;  // 3MB 
	 // 设置最大文件上传值
    private static final int MAX_FILE_SIZE      = 1024 * 1024 * 500 ; // 500MB  
    // 设置最大请求值 (包含文件和表单数据)
    private static final int MAX_REQUEST_SIZE   = 1024 * 1024 *500; // 500MB

	public static String getDiskDir() {
		return diskDir;
	}

	public static void setDiskDir(String dir) {
		diskDir = dir;
	}

	public static int getMemoryThreshold() {
		return MEMORY_THRESHOLD;
	}

	public static int getMaxFileSize() {
		return MAX_FILE_SIZE;
	}

	public static int getMaxRequestSize() {
		return MAX_REQUEST_SIZE;
	}

}
