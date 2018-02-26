package TSP;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// �ο�http://blog.csdn.net/ganglia/article/details/7074776
//��������store�������ġ��������4*4�������һ�е�һ��Ϊ00��
//store��key�Ǹ�λ��ʱ,��1������3-->1��ʮλ������12 ���� 2---1>   3--->2
//3012    0-->3  1-->0  2-->1  3-->2  =====>  0--->3---->2--->1--->0
//1230   =====��0-->1--->2--->3-->0
//���������nλ������m�����n��cityȥ��m��city��
//֤���ڷ���thePrint�ĵ����С�map()

//������򵱾���ά�ȴ��˻��������ڳ����������ϣ�������ٵķ�ʽ��O(n^n)
//������7�����С���������������
public class DP {
	private double[][] dArray; // �������
	private int length; // �������ĳ���
	private int lengthOfLength; // ������󳤶��ַ����ĳ���
	private String allzero = ""; // 0��ɵ��ַ��� ���ֵ��length��(length -
									// 1)�����������ַ�����ͬ����Сֵ��length��0��������
	private String biggest = "";
	private List<String> list = new ArrayList<String>(); // �������б�
	private Map<String, Double> store; // �洢�м�����
	private String notExist = "������";
	private String firnalRoad = notExist; // ���յ�·���������������к�ȡֵ
	private String firnalCityFlow = ""; // �����γɵĳ�����
	private String min = notExist; // ������õ���Сֵ
	private String allFlowTime = notExist; // ������г�������ʱ��
	private String guihuaTime = notExist; // ��̬�滮��ʱ��

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
			this.allFlowTime = end - start + "����";
			start = System.currentTimeMillis();
			this.initstoreMap();
			this.guihua(this.length - 2);
			end = System.currentTimeMillis();
			this.guihuaTime = end - start + "����";
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

	// �������������Ч���ж�

	private boolean check(double[][] dArray) {
		if (dArray.length < 3) {
			System.out.println("������Ϣ��������󳤶ȹ�С");
			return false;
		}
		for (int i = 0; i < dArray.length; i++) { // ÿ��double[]�ĳ��ȶ������ж�
			if (dArray.length != dArray[i].length) {
				System.out.println("������Ϣ���������鳤�Ȳ��Ϸ�");
				return false;
			}
		}
		for (int i = 0; i < dArray.length; i++) {
			if (!oneZero(dArray[i], i)) {
				System.out.println("������Ϣ����������˳���Ԫ��ֵ���ò��Ϸ�");
				return false;
			}
		}
		return true;
	}

	// ����һ��doulbe���͵����飬ֻ�е�i��Ԫ��Ϊ0���ж�

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

	// �ж�һ���������Ƿ�Ϸ�

	private boolean oneFlow(String str) {
		// ��һ���ַ�������Ϊһ���ַ�����
		List<String> listString = new ArrayList<String>();
		for (int i = 0; i < (this.length * this.lengthOfLength);) {
			listString.add(str.substring(i, i + this.lengthOfLength));
			i += this.lengthOfLength;
		}
		// �������ͬ��Ԫ�أ���false
		for (int i = 0; i < (this.length - 1); i++) {
			for (int j = i + 1; j < this.length; j++) {
				if (listString.get(i * this.lengthOfLength).equals(
						listString.get(j * this.lengthOfLength))) {
					return false;
				}
			}
		}
		// ����о������ȫ0�Խ����ϵ�Ԫ�أ���false
		for (int i = 0; i < listString.size(); i++) {
			if (Integer.parseInt(listString.get(i)) == i) {
				return false;
			}
		}
		// �ų�û�б������г��е��������0���������0�㣩
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

	// ��ʼ���洢map

	private void initstoreMap() {
		this.store = new HashMap<String, Double>();
		// �����������һ�п��ܵ��к�
		for (int i = 0; i < this.length - 1; i++) {
			this.store.put(this.toLengthOfLength(i),
					this.dArray[this.length - 1][i]);
		}
		// �������������п��ܵ��к�
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

	// ��������ĳ�������ǰlength - 2 - temp������ͬ�����治ͬ���ö�̬�滮ʵ��
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

	// ������еĳ�����

	private void allFlow() {
		while (!this.biggest.equals(this.allzero)) {
			this.allzero = this.addone(this.allzero);
			if (this.oneFlow(this.allzero)) {
				this.list.add(this.allzero);
			}
		}
	}

	// ��length���Ƶ��ַ�����1����

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

	// ���һ��int�ַ������Ȳ���lengthOfLength ����

	private String toLengthOfLength(Object i) {
		String returnString = i.toString();
		while (returnString.length() < this.lengthOfLength) {
			returnString = (0 + returnString);
		}
		return returnString;
	}

	// ��һ���ַ�����ֵӳ�䣬����׼���

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
