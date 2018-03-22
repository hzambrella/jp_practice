package netDisk.DTO;

import java.io.File;
import java.io.IOException;
import java.util.List;

import netDisk.netDiskEngine.FileOperate;

public class DirTreeNode {
		public String name;
		public String size;
		public String modifiedTime;
		public int level;
		public List<DirTreeNode> childDirNode;

		public DirTreeNode(String name, int level) {
			this.level = level;
			this.name = name;
		};

		public DirTreeNode(String name, int size, String modifiedTime, int level) {
			this.name = name;
			this.size = FileOperate.formatSize(size);
			this.modifiedTime = modifiedTime;
			this.level = level;
		};

		public DirTreeNode(File f,int level) throws IOException {
			this.name = f.getName();
			
			// �ļ��д�С0
			this.size="0";
			// ��ȡ�ļ��޸�ʱ��
			this.modifiedTime=FileOperate.getFileModifiedTime(f);
			this.level=level;

		}

		public void AddChildNode(List<DirTreeNode> childNode) {
			this.childDirNode = childNode;
		}

		public String toString() {
			return this.name + this.level + this.childDirNode.toString();
		}

		
}

