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
	 * warning:use File.renameTo��May occur some exception. /* TODO:change to
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
	 * ��Ŀ¼�����ڣ�������
	 * 
	 * @param serverPath
	 *            servlet ��Ŀ¼�ľ��Ե�ַ��ĩβ������б��
	 * @param newPath
	 *            ��ͷ������б��
	 */
	public static void newFolderIfNotExist(String serverPath, String newPath) {
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
	 *            Դ�ļ�������Ŀ¼ ���Ե�ַ
	 * @param des
	 *            Ŀ���Ŀ¼ ���Ե�ַ һ��Ҫȷ��Ŀ��Ŀ¼���ڡ�������ʹ�÷���newFolderIfNotExist��
	 * @param des
	 *            Դ�ļ����� ���Ե�ַ һ��Ҫȷ��Ŀ��Ŀ¼���ڡ�������ʹ�÷���newFolderIfNotExist��
	 * @throws Exception
	 */
	public static boolean copyFile(String src, String des, String fileName) throws Exception{
		// ��ʼ���ļ�����
		System.out.println(src+des+fileName);
		src = src + File.separator + fileName;
		File file1 = new File(src);
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
			System.out.println("flag2");
			return true;
		}

		// ��Ŀ����Ŀ¼�����ļ��������ݷŽ�����
		File[] fs = file1.listFiles();

		// ��Ŀ��Ŀ¼�½�ͬ���ļ����������ļ���
		des = des + fileName;
		File file2 = new File(des + fileName);
		if (!file2.exists()) {
			file2.mkdirs();
		}
		
		boolean success=true;
		// �����ļ����ļ���
		for (File f : fs) {
			// �ݹ�ĵط�
			success=copyFile(src, des, f.getName());
			if (!success){
				break;
			}
		}
		return success;
	}

	private static void fileCopy(String src, String des) throws Exception {
		// io���̶���ʽ
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
		byte[] bt = new byte[fin.available()];// ������
		while(fin.read(bt)!=-1){
		};
		fo.write(bt);
		// �ر���
		fin.close();
		fo.close();
	}

}
