package netDisk.netDiskCfg;

public class netDiskCfg {
	private static String diskDir=null;
	 // �����ڴ��ٽ�ֵ - �����󽫲�����ʱ�ļ����洢����ʱĿ¼��
	private static final int MEMORY_THRESHOLD   = 1024 * 1024 * 3;  // 3MB 
	 // ��������ļ��ϴ�ֵ
    private static final int MAX_FILE_SIZE      = 1024 * 1024 * 500 ; // 500MB  
    // �����������ֵ (�����ļ��ͱ�����)
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
