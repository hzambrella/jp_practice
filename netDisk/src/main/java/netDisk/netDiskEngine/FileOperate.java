package netDisk.netDiskEngine;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;

import netDisk.DTO.FileInfo;

public class FileOperate {
	// cd
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
	 * warning:use File.renameTo。May occur some exception. /* TODO:change to
	 * commons-io FileUtils#copyFileToDirectory(File,File)
	 * 
	 * @param orgDir
	 * @param newDir
	 * @param fileName
	 * @return
	 */
	public static boolean moveFile(String orgDir, String newDir, String fileName) {
		System.out.println(orgDir + File.separator + fileName);
		System.out.println(newDir + File.separator + fileName);

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
	 * 若目录不存在，创建。
	 * 
	 * @param serverPath
	 *            servlet 主目录的绝对地址，末尾不能有斜杠
	 * @param newPath
	 *            开头必须有斜杠
	 */
	public static void newFolderIfNotExist(String serverPath, String newPath) {
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

	public static String renameFile(String dir, String orgName, String newName) {
		// System.out.println(dir+File.separator+orgName);
		// System.out.println(dir+File.separator+newName);
		File f = new File(dir + File.separator + orgName);
		File fnew = new File(dir + File.separator + newName);

		boolean success = f.renameTo(fnew);
		if (!success) {
			return null;
		}
		return fnew.getName();
	};

	/**
	 * 
	 * @param src
	 *            源文件的所在目录 绝对地址
	 * @param des
	 *            目标的目录 绝对地址 一定要确保目标目录存在。可以先使用方法newFolderIfNotExist。
	 * @param des
	 *            源文件名字 绝对地址 一定要确保目标目录存在。可以先使用方法newFolderIfNotExist。
	 * @throws Exception
	 */
	public static boolean copyFile(String src, String des, String fileName) throws Exception{
		// 初始化文件复制
		System.out.println(src+des+fileName);
		src = src + File.separator + fileName;
		File file1 = new File(src);
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
			System.out.println("flag2");
			return true;
		}

		// 若目标是目录，把文件里面内容放进数组
		File[] fs = file1.listFiles();

		// 在目标目录新建同名文件夹来复制文件夹
		des = des + fileName;
		File file2 = new File(des + fileName);
		if (!file2.exists()) {
			file2.mkdirs();
		}
		
		boolean success=true;
		// 遍历文件及文件夹
		for (File f : fs) {
			// 递归的地方
			success=copyFile(src, des, f.getName());
			if (!success){
				break;
			}
		}
		return success;
	}

	private static void fileCopy(String src, String des) throws Exception {
		// io流固定格式
		File f = new File(des);

		FileInputStream fin = new FileInputStream(src);
//		BufferedInputStream bis = new BufferedInputStream(fin);
//		BufferedOutputStream bos = new BufferedOutputStream(
//				new FileOutputStream(des));
		FileOutputStream fo=new FileOutputStream(des);
		if (fin.available()<=0){
			return;
		}
		System.out.println(fin.available());
		byte[] bt = new byte[fin.available()];// 缓冲区
		while(fin.read(bt)!=-1){
		};
		fo.write(bt);
		// 关闭流
		fin.close();
		fo.close();
	}

}
