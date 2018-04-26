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
	 * 获取带有单位的文件大小。大文件不准。建议用FileChannel
	 * 
	 * @param f
	 *            文件
	 * @return
	 * @throws IOException
	 */
	public static String getFileSize(File f) throws IOException {
		// 文件夹没大小，强行看大小会有拒绝访问异常
		if (f.isDirectory()) {
			return "0";
		}
		FileInputStream fis = new FileInputStream(f);
		int available = fis.available();
		fis.close();
		return formatSize(available);
	}

	/**
	 * 格式化文件大小输出
	 * 
	 * @param fileSize文件大小
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

	// 修改时间
	public static String getFileModifiedTime(File f) {
		long mtime = f.lastModified();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(mtime);
		String modifytimeStr = sdf.format(cal.getTime());
		return modifytimeStr;
	}

	// 文件类型
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
	 * cd 获得目标路径下的目录
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
	 * warning:use File.renameTo。May occur some exception. 
	 /* TODO:change tocommons-io FileUtils#copyFileToDirectory(File,File)
	 * 
	 * @param orgDir
	 *            原来的目录
	 * @param newDir
	 *            目标目录
	 * @param fileName
	 *            文件名
	 * @return
	 */
	public static boolean moveFile(String orgDir, String newDir, String fileName) {
		//System.out.println(orgDir + File.separator + fileName);
		//System.out.println(newDir + File.separator + fileName);

		// 目标目录不存在时，新建一个
		// File fnew2 = new File(newDir);
		// if (!fnew2.exists()) {
		// fnew2.mkdir();
		// }

		File f = new File(orgDir + File.separator + fileName);
		File fnew = new File(newDir + File.separator + fileName);
		return f.renameTo(fnew);
	}

	/**
	 * 若目录(文件夹)不存在，创建。
	 * 
	 * @param serverPath
	 *            servlet 主目录的绝对地址，末尾不能有斜杠
	 * @param newPath
	 *            开头必须有斜杠
	 */
	public static void newFolderIfNotExist(String serverPath, String newPath) {
//		System.out.println("newFolderIfNotExist:"+serverPath);
		// System.out.println(newPath);
		String splitNote = "/";
		// 斜杠是转义字符。
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
	 * // * 重命名文件/文件夹
	 * 
	 * @param dir
	 *            文件所在目录
	 * @param orgName
	 *            文件原名
	 * @param newName
	 *            文件新名
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
	 * 复制文件或者文件夹
	 * 
	 * @param src
	 *            源文件的所在目录 绝对地址
	 * @param des
	 *            目标的目录 绝对地址 一定要确保目标目录存在。可以先使用方法newFolderIfNotExist。
	 * @param des
	 *            源文件名字（文件或者文件夹） 绝对地址 一定要确保目标目录存在。可以先使用方法newFolderIfNotExist。
	 * @throws Exception
	 */
	public static boolean copyFile(String src, String des, String fileName)
			throws Exception {
		// 初始化文件复制
		//System.out.println(src + des + fileName);
		src = src + File.separator + fileName;
		File file1 = new File(src);
		//源文件不存在，返回失败
		if (!file1.exists()) {
			return false;
		}

		// 文件不是目录，直接复制就好了。
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

		// 若目标是目录，把文件里面内容放进数组
		File[] fs = file1.listFiles();

		// 在目标目录中新建同名文件夹，以此复制文件夹
		des = des + File.separator+ fileName;
		File file2 = new File(des);
		if (!file2.exists()) {
			file2.mkdirs();
		}

		boolean success = true;
		// 遍历文件夹里面的文件及文件夹
		for (File f : fs) {
			// 递归的地方
			success = copyFile(src, des, f.getName());
			if (!success) {
				break;
			}
		}
		return success;
	}

	private static void fileCopy(String src, String des) throws Exception {
		// io流固定格式
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
		byte[] bt = new byte[1024];// 缓冲区
		while ((len=fin.read(bt)) != -1) {
			fo.write(bt,0,len);
		}
		
		// 关闭流
		fin.close();
		fo.close();
	}

	/**
	 * 删除文件或者文件夹
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

			// 先删除子文件
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
	
	
	/**判断是否是图片
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
    
    /**判断是否是自身或者子目录。用于移动和复制文件的判断。
     * 
     * @param srcPath 待移动文件的初始目录
     * @param desPath 待移动文件的目标目录
     * @param fileName 待移动文件的文件名
     * @return boolean true为是。
     */
    public static boolean isSelfOrChildDir(String srcPath,String desPath,String fileName){
    	srcPath=srcPath+File.separator+fileName;
    	desPath=desPath+File.separator+fileName;
    	
    	boolean is=true;
		String splitNote = "/";
		// 斜杠是转义字符。
		if (File.separator.equals("\\")) {
			splitNote = "\\\\";
		}
    	String[]s=srcPath.split(splitNote);
    	String[]d=desPath.split(splitNote);
    	
    	//初始目录深度大于目标目录，一定不是往子目录或自身目录移动
    	if (s.length>d.length){
    		return false;
    	}
    	
    	//某个深度目录名不一样就是
    	for (int i=0;i<s.length;i++){
    		if (!s[i].equals(d[i])){
    			is=false;
    			break;
    		}
    	}
    	
		return is;
    }
}
