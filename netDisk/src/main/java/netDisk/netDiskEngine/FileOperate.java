package netDisk.netDiskEngine;

import java.awt.Image;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.imageio.ImageIO;

import com.alibaba.fastjson.JSON;

import netDisk.DTO.DirTreeNode;
import netDisk.DTO.FileInfo;

public class FileOperate {
	/**
	 * ��ȡ���е�λ���ļ���С�����ļ���׼��������FileChannel
	 * 
	 * @param f
	 *            �ļ�
	 * @return
	 * @throws IOException
	 */
	public static String getFileSize(File f) throws IOException {
		// �ļ���û��С��ǿ�п���С���оܾ������쳣
		if (f.isDirectory()) {
			return "0";
		}
		FileInputStream fis = new FileInputStream(f);
		int available = fis.available();
		fis.close();
		return formatSize(available);
	}

	/**
	 * ��ʽ���ļ���С���
	 * 
	 * @param fileSize�ļ���С
	 * @return
	 */
	public static String formatSize(int fileSize) {
		DecimalFormat df = new DecimalFormat("#.00");
		String size = "0";
		if (fileSize <= 0) {
			size = "0";
		} else if (fileSize < 1024) {
			size = df.format((double) fileSize) + "B";
		} else if (fileSize < 1048576) {
			size = df.format((double) fileSize / 1024) + "KB";
		} else if (fileSize < 1073741824) {
			size = df.format((double) fileSize / 1048576) + "MB";
		} else {
			size = df.format((double) fileSize / 1073741824) + "GB";
		}
		return size;
	}

	// �޸�ʱ��
	public static String getFileModifiedTime(File f) {
		long mtime = f.lastModified();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(mtime);
		String modifytimeStr = sdf.format(cal.getTime());
		return modifytimeStr;
	}

	// �ļ�����
	public static String getFileType(File f) {
		if (f.isDirectory()) {
			return "folder";
		}
		String[] split = f.getName().split("[.]");
		//System.out.println(f.getName());
		//System.out.println(JSON.toJSON(split));
		
		if (split.length < 2) {
			return "file";
		} else {
			return split[split.length - 1];
		}
	}

	/**
	 * cd ���Ŀ��·���µ�Ŀ¼
	 * 
	 * @param targetPath
	 * @return
	 * @throws IOException
	 */
	public static List<FileInfo> getFileDirectory(String targetPath)
			throws IOException {
		File target = new File(targetPath);
		if (!target.exists()) {
			return null;
		}

		if (!target.isDirectory()) {
			return null;
		}

		File[] childs = target.listFiles();
		List<FileInfo> fs = new ArrayList<FileInfo>();
		for (File f : childs) {
			FileInfo finfo = new FileInfo(f);
			fs.add(finfo);
		}
		return fs;
	}

	/**
	 * warning:use File.renameTo��May occur some exception. 
	 /* TODO:change tocommons-io FileUtils#copyFileToDirectory(File,File)
	 * 
	 * @param orgDir
	 *            ԭ����Ŀ¼
	 * @param newDir
	 *            Ŀ��Ŀ¼
	 * @param fileName
	 *            �ļ���
	 * @return
	 */
	public static boolean moveFile(String orgDir, String newDir, String fileName) {
		//System.out.println(orgDir + File.separator + fileName);
		//System.out.println(newDir + File.separator + fileName);

		// Ŀ��Ŀ¼������ʱ���½�һ��
		// File fnew2 = new File(newDir);
		// if (!fnew2.exists()) {
		// fnew2.mkdir();
		// }

		File f = new File(orgDir + File.separator + fileName);
		File fnew = new File(newDir + File.separator + fileName);
		return f.renameTo(fnew);
	}

	/**
	 * ��Ŀ¼(�ļ���)�����ڣ�������
	 * 
	 * @param serverPath
	 *            servlet ��Ŀ¼�ľ��Ե�ַ��ĩβ������б��
	 * @param newPath
	 *            ��ͷ������б��
	 */
	public static void newFolderIfNotExist(String serverPath, String newPath) {
//		System.out.println("newFolderIfNotExist:"+serverPath);
		// System.out.println(newPath);
		String splitNote = "/";
		// б����ת���ַ���
		if (File.separator.equals("\\")) {
			splitNote = "\\\\";
		}

		String[] paths = newPath.split(splitNote);
		// System.out.println(JSON.toJSONString(paths));
		String path = serverPath;
		for (int i = 0; i < paths.length; i++) {
			if (paths[i].equals("")) {
				continue;
			}

			path = path + File.separator + paths[i];
			// System.out.println(paths[i]);
			File f = new File(path);
			if (!f.exists()) {
				boolean b = f.mkdir();
				// System.out.println(b+path);
			}
		}
	}

	/**
	 * // * �������ļ�/�ļ���
	 * 
	 * @param dir
	 *            �ļ�����Ŀ¼
	 * @param orgName
	 *            �ļ�ԭ��
	 * @param newName
	 *            �ļ�����
	 * @return
	 */
	public static String renameFile(String dir, String orgName, String newName) {
		 //System.out.println(dir+File.separator+orgName);
		 //System.out.println(dir+File.separator+newName);
		File f = new File(dir + File.separator + orgName);
		File fnew = new File(dir + File.separator + newName);

		boolean success = f.renameTo(fnew);
		if (!success) {
			return null;
		}
		return fnew.getName();
	};

	/**
	 * �����ļ������ļ���
	 * 
	 * @param src
	 *            Դ�ļ�������Ŀ¼ ���Ե�ַ
	 * @param des
	 *            Ŀ���Ŀ¼ ���Ե�ַ һ��Ҫȷ��Ŀ��Ŀ¼���ڡ�������ʹ�÷���newFolderIfNotExist��
	 * @param des
	 *            Դ�ļ����֣��ļ������ļ��У� ���Ե�ַ һ��Ҫȷ��Ŀ��Ŀ¼���ڡ�������ʹ�÷���newFolderIfNotExist��
	 * @throws Exception
	 */
	public static boolean copyFile(String src, String des, String fileName)
			throws Exception {
		// ��ʼ���ļ�����
		//System.out.println(src + des + fileName);
		src = src + File.separator + fileName;
		File file1 = new File(src);
		//Դ�ļ������ڣ�����ʧ��
		if (!file1.exists()) {
			return false;
		}

		// �ļ�����Ŀ¼��ֱ�Ӹ��ƾͺ��ˡ�
		if (!file1.isDirectory()) {
			des = des + File.separator + fileName;
			File file2 = new File(des);
			boolean success = file2.createNewFile();
			if (!success) {
				return false;
			}
			fileCopy(src, des);

			return true;
		}

		// ��Ŀ����Ŀ¼�����ļ��������ݷŽ�����
		File[] fs = file1.listFiles();

		// ��Ŀ��Ŀ¼���½�ͬ���ļ��У��Դ˸����ļ���
		des = des + File.separator+ fileName;
		File file2 = new File(des);
		if (!file2.exists()) {
			file2.mkdirs();
		}

		boolean success = true;
		// �����ļ���������ļ����ļ���
		for (File f : fs) {
			// �ݹ�ĵط�
			success = copyFile(src, des, f.getName());
			if (!success) {
				break;
			}
		}
		return success;
	}

	private static void fileCopy(String src, String des) throws Exception {
		// io���̶���ʽ
		// File f = new File(des);

		FileInputStream fin = new FileInputStream(src);
		// BufferedInputStream bis = new BufferedInputStream(fin);
		// BufferedOutputStream bos = new BufferedOutputStream(
		// new FileOutputStream(des));
		FileOutputStream fo = new FileOutputStream(des);
//		if (fin.available() <= 0) {
//			fo.close();
//			fin.close();
//			return;
//		}
//		System.out.println(fin.available());
		int len=-1;
		byte[] bt = new byte[1024];// ������
		while ((len=fin.read(bt)) != -1) {
			fo.write(bt,0,len);
		}
		
		// �ر���
		fin.close();
		fo.close();
	}

	/**
	 * ɾ���ļ������ļ���
	 * 
	 * @param f
	 * @return
	 */
	public static boolean deleteFile(File f) {
		// File f=new File(dir+File.separator+fileName);
		// if (!f.exists()){
		// return false;
		// }

		if (!f.isDirectory()) {
			return f.delete();
		} else {
			File[] childs = f.listFiles();
			if (null == childs || childs.length <= 0) {
				return f.delete();
			}

			// ��ɾ�����ļ�
			boolean success = false;
			for (int i = 0; i < childs.length; i++) {
				success = deleteFile(childs[i]);
				if (!success) {
					break;
				}
			}

			if (success) {
				return f.delete();
			} else {
				return success;
			}
		}
	}

	public static DirTreeNode getDirTree(String basePath) throws IOException {
		File f = new File(basePath);

		// System.out.println(f.getName());

		DirTreeNode dirTreeBaseNode = new DirTreeNode(f, 0);

		List<DirTreeNode> childNode = tree(f, 1);

		if (childNode != null) {
			dirTreeBaseNode.AddChildNode(childNode);
		}
		return dirTreeBaseNode;
	}

	public static List<DirTreeNode> tree(File f, int level) throws IOException {
		List<DirTreeNode> dirNodeList = new ArrayList<DirTreeNode>();

		File[] childs = f.listFiles();
		for (int i = 0; i < childs.length; i++) {
			// System.out.println(preStr + childs[i].getName());
			if (childs[i].isDirectory()) {
				DirTreeNode thisNode = new DirTreeNode(childs[i], level);
				List<DirTreeNode> nextNodeList = tree(childs[i], level + 1);
				if (nextNodeList != null) {
					thisNode.AddChildNode(nextNodeList);
				}

				dirNodeList.add(thisNode);
			}
		}

		return dirNodeList;
	}
	
	
	/**�ж��Ƿ���ͼƬ
	 * 
	 * @param file
	 * @return
	 */
    public static boolean isImage(File file) {
        if (file == null||!file.exists()) {
            return false;
        }
        
        try {
        	Image img = ImageIO.read(file);
            return !(img == null || img.getWidth(null) <= 0 || img.getHeight(null) <= 0);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**�ж��Ƿ������������Ŀ¼�������ƶ��͸����ļ����жϡ�
     * 
     * @param srcPath ���ƶ��ļ��ĳ�ʼĿ¼
     * @param desPath ���ƶ��ļ���Ŀ��Ŀ¼
     * @param fileName ���ƶ��ļ����ļ���
     * @return boolean trueΪ�ǡ�
     */
    public static boolean isSelfOrChildDir(String srcPath,String desPath,String fileName){
    	srcPath=srcPath+File.separator+fileName;
    	desPath=desPath+File.separator+fileName;
    	
    	boolean is=true;
		String splitNote = "/";
		// б����ת���ַ���
		if (File.separator.equals("\\")) {
			splitNote = "\\\\";
		}
    	String[]s=srcPath.split(splitNote);
    	String[]d=desPath.split(splitNote);
    	
    	//��ʼĿ¼��ȴ���Ŀ��Ŀ¼��һ����������Ŀ¼������Ŀ¼�ƶ�
    	if (s.length>d.length){
    		return false;
    	}
    	
    	//ĳ�����Ŀ¼����һ������
    	for (int i=0;i<s.length;i++){
    		if (!s[i].equals(d[i])){
    			is=false;
    			break;
    		}
    	}
    	
		return is;
    }
}
