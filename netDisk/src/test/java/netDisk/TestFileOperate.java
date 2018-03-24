package netDisk;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;

import netDisk.netDiskEngine.FileOperate;

import org.junit.After;
import org.junit.Test;

import com.alibaba.fastjson.JSON;

public class TestFileOperate {

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void test() {
		try {
			String testDir="E:/test";
			String b=JSON.toJSONString(FileOperate.getFileDirectory(testDir));
			System.out.println(b);
			b=JSON.toJSONString(FileOperate.renameFile(testDir, "1231", "1231"));
			System.out.println(b);
			
			String orgDir=testDir+File.separator+"12311";
			String newDir=testDir+File.separator+"新建文件夹 (2)1";
			String fileName="新建文本文档.txt";
			b=JSON.toJSONString(FileOperate.moveFile(orgDir, newDir, fileName));
			System.out.println(b);
			
			System.out.println(JSON.toJSONString(FileOperate.getDirTree(testDir)));
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
