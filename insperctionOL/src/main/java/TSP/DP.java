package TSP;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// 参考http://blog.csdn.net/ganglia/article/details/7074776
//这个程序的store是这样的。如矩阵是4*4。定义第一行第一列为00。
//store的key是个位数时,如1，就是3-->1。十位数，如12 就是 2---1>   3--->2
//3012    0-->3  1-->0  2-->1  3-->2  =====>  0--->3---->2--->1--->0
//1230   =====》0-->1--->2--->3-->0
//从左边数第n位的数字m代表第n个city去第m个city。
//证据在方法thePrint的第三行。map()

//这个程序当矩阵维度大了会慢，慢在城市流计算上，是已穷举的方式。O(n^n)
//极限是7个城市。超过后计算巨慢。
public class DP {
	private double[][] dArray; // 距离矩阵
	private int length; // 距离矩阵的长度
	private int lengthOfLength; // 距离矩阵长度字符串的长度
	private String allzero = ""; // 0组成的字符串 最大值是length个(length -
									// 1)连接起来的字符串，同样最小值是length个0连接起来
	private String biggest = "";
	private List<String> list = new ArrayList<String>(); // 城市流列表
	private Map<String, Double> store; // 存储中间数据
	private String notExist = "不存在";
	private String firnalRoad = notExist; // 最终的路径，即距离矩阵的列号取值
	private String firnalCityFlow = ""; // 最终形成的城市流
	private String min = notExist; // 最终求得的最小值
	private String allFlowTime = notExist; // 求解所有城市流的时间
	private String guihuaTime = notExist; // 动态规划的时间

	/** Creates a new instance of TwentyTwo */
	public DP(double[][] dArray) {
		if (this.check(dArray)) {
			this.dArray = dArray;
			this.length = dArray.length;
			this.lengthOfLength = (length - 1 + "").length();
			for (int zeroLength = 0; zeroLength < (length * lengthOfLength);) {
				allzero += 0;
				zeroLength = allzero.length();
			}
			for (int i = this.length; i > 0; i--) {
				this.biggest += this.toLengthOfLength(i - 1);
			}
			long start = System.currentTimeMillis();
			this.allFlow();
			long end = System.currentTimeMillis();
			this.allFlowTime = end - start + "毫秒";
			start = System.currentTimeMillis();
			this.initstoreMap();
			this.guihua(this.length - 2);
			end = System.currentTimeMillis();
			this.guihuaTime = end - start + "毫秒";
		}
	}

	public String getFirnalRoad() {
		return this.firnalRoad;
	}

	public String getFirnalCityFlow() {
		if ("".equals(this.firnalCityFlow)) {
			return this.notExist;
		}
		return this.firnalCityFlow;
	}

	public String getMin() {
		return this.min;
	}

	public String getAllFlowTime() {
		return this.allFlowTime;
	}

	public String getGuihuaTime() {
		return this.guihuaTime;
	}

	// 输入距离矩阵的有效性判读

	private boolean check(double[][] dArray) {
		if (dArray.length < 3) {
			System.out.println("错误信息：距离矩阵长度过小");
			return false;
		}
		for (int i = 0; i < dArray.length; i++) { // 每个double[]的长度都进行判断
			if (dArray.length != dArray[i].length) {
				System.out.println("错误信息：距离数组长度不合法");
				return false;
			}
		}
		for (int i = 0; i < dArray.length; i++) {
			if (!oneZero(dArray[i], i)) {
				System.out.println("错误信息：距离数组顺序或元素值设置不合法");
				return false;
			}
		}
		return true;
	}

	// 对于一个doulbe类型的数组，只有第i个元素为0的判断

	private boolean oneZero(double[] dArray, int i) {
		int numOfZero = 0;
		for (double d : dArray) {
			if (d == 0.0) {
				numOfZero++;
			}
		}
		if (numOfZero == 1 && (dArray[i] == 0)) {
			return true;
		} else {
			return false;
		}
	}

	// 判断一个城市流是否合法

	private boolean oneFlow(String str) {
		// 将一个字符串更改为一个字符链表
		List<String> listString = new ArrayList<String>();
		for (int i = 0; i < (this.length * this.lengthOfLength);) {
			listString.add(str.substring(i, i + this.lengthOfLength));
			i += this.lengthOfLength;
		}
		// 如果有相同的元素，则false
		for (int i = 0; i < (this.length - 1); i++) {
			for (int j = i + 1; j < this.length; j++) {
				if (listString.get(i * this.lengthOfLength).equals(
						listString.get(j * this.lengthOfLength))) {
					return false;
				}
			}
		}
		// 如果有距离矩阵全0对角线上的元素，则false
		for (int i = 0; i < listString.size(); i++) {
			if (Integer.parseInt(listString.get(i)) == i) {
				return false;
			}
		}
		// 排除没有遍历所有城市的情况（从0点出发到达0点）
		Map<Integer, Integer> map = new HashMap<Integer, Integer>();
		for (int i = 0; i < this.length;) {
			map.put(i,
					Integer.parseInt(str.substring(i, i + this.lengthOfLength)));
			i += this.lengthOfLength;
		}
		int allcity = 0;
		for (int i = 0;;) {
			i = map.get(i);
			allcity++;
			if (i == 0) {
				break;
			}
		}
		if (allcity < this.length) {
			return false;
		}
		return true;
	}

	// 初始化存储map

	private void initstoreMap() {
		this.store = new HashMap<String, Double>();
		// 存距离矩阵最后一行可能的列号
		for (int i = 0; i < this.length - 1; i++) {
			this.store.put(this.toLengthOfLength(i),
					this.dArray[this.length - 1][i]);
		}
		// 存距离矩阵倒数两行可能的列号
		for (int i = 0; i < this.length; i++) {
			if (i == this.length - 2)
				continue;
			for (int j = 0; j < this.length - 1; j++) {
				if (i == j) {
					continue;
				}
				store.put(
						this.toLengthOfLength(i) + this.toLengthOfLength(j),
						this.dArray[this.length - 2][i]
								+ store.get(this.toLengthOfLength(j)));
			}
		}
	}

	// 两个相近的城市流，前length - 2 - temp个数相同，后面不同，用动态规划实现
	private void guihua(int temp) {
		if (list.size() == 1) {
			this.firnalRoad = list.get(0);
			this.thePrint(list.get(0));
			this.min = this.store.get(list.get(0)) + "";
			return;
		}
		for (int i = 0; i < (list.size() - 1); i++) {
			int next = (i + 1);
			if (list.get(i)
					.substring(0, temp * this.lengthOfLength)
					.equals(list.get(next).substring(0,
							temp * this.lengthOfLength))) {
				double iValue = 0;
				double nextValue = 0;

				iValue = this.dArray[temp][Integer.parseInt(list.get(i)
						.substring(temp, temp + this.lengthOfLength))]
						+ store.get(list.get(i).substring(
								(temp + 1) * this.lengthOfLength));
				nextValue = this.dArray[temp][Integer.parseInt(list.get(next)
						.substring(temp, temp + this.lengthOfLength))]
						+ store.get(list.get(next).substring(
								(temp + 1) * this.lengthOfLength));

				this.store.put(list.get(i)
						.substring(temp * this.lengthOfLength), iValue);
				this.store.put(
						list.get(next).substring(temp * this.lengthOfLength),
						nextValue);

				if (iValue >= nextValue) {
					list.remove(i);
				} else {
					list.remove(next);
				}
				i--;
			}
		}
		this.guihua(temp - 1);
	}

	// 组成所有的城市流

	private void allFlow() {
		while (!this.biggest.equals(this.allzero)) {
			this.allzero = this.addone(this.allzero);
			if (this.oneFlow(this.allzero)) {
				this.list.add(this.allzero);
			}
		}
	}

	// 将length进制的字符串加1操作

	private String addone(String str) {
		List<String> listString = new ArrayList<String>();
		for (int i = 0; i < (this.length * this.lengthOfLength);) {
			listString.add(str.substring(i, i + this.lengthOfLength));
			i += this.lengthOfLength;
		}
		for (int i = (length - 1); i > -1; i--) {
			int last = Integer.parseInt(listString.get(i));
			if (last == (length - 1)) {
				last = 0;
				String strLast = this.toLengthOfLength(last);
				listString.set(i, strLast);
			} else {
				last++;
				String strLast = this.toLengthOfLength(last);
				listString.set(i, strLast);
				break;
			}
		}
		String ret = "";
		for (String s : listString) {
			ret += s;
		}
		return ret;
	}

	// 如果一个int字符串长度不够lengthOfLength 则补足

	private String toLengthOfLength(Object i) {
		String returnString = i.toString();
		while (returnString.length() < this.lengthOfLength) {
			returnString = (0 + returnString);
		}
		return returnString;
	}

	// 将一个字符串键值映射，并标准输出

	private void thePrint(String str) {
		Map<Integer, Integer> map = new HashMap<Integer, Integer>();
		for (int i = 0; i < this.length;) {
			map.put(i,
					Integer.parseInt(str.substring(i, i + this.lengthOfLength)));
			i += this.lengthOfLength;
		}
		String cityFlow = this.toLengthOfLength(0);
		for (int i = 0;;) {
			i = map.get(i);
			cityFlow += this.toLengthOfLength(i);
			if (i == 0) {
				break;
			}
		}
		for (int i = 0; i < this.length + 1;) {
			if (i < (this.length)) {
				this.firnalCityFlow += Integer.parseInt(cityFlow.substring(i, i
						+ this.lengthOfLength))
						+ "->";
			} else {
				this.firnalCityFlow += Integer.parseInt(cityFlow.substring(i, i
						+ this.lengthOfLength));
			}
			i += this.lengthOfLength;
		}
	} 
}
