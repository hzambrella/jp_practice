package TSP;

import java.util.ArrayList;
import java.util.HashMap;

//参考http://blog.csdn.net/hellonerd/article/details/50920234  。原代码不能用于较大数据的计算。已修改。
public class DP2 {
	private double[][] graph;

	private String firnalCityFlow = ""; // 最终形成的城市流
	private double minDistance = 0; // 最终求得的最小值

	public String getFirnalCityFlow() {
		return firnalCityFlow;
	}

	public void setFirnalCityFlow(String firnalCityFlow) {
		this.firnalCityFlow = firnalCityFlow;
	}

	public double getMinDistance() {
		return minDistance;
	}

	public void setMinDistance(double minDistance) {
		this.minDistance = minDistance;
	}

	HashMap<Integer, ArrayList<Integer>> idtoset = new HashMap<Integer, ArrayList<Integer>>();
	// get subset by id
	HashMap<ArrayList<Integer>, Integer> settoid = new HashMap<ArrayList<Integer>, Integer>();

	// get id by subset
	public DP2(double[][] graph) {
		this.graph = graph;
		DP();
	}

	/**
	 * Solve Traveling Salesperson Probl em by Dynamic Programming
	 * 
	 * @return the min length
	 * */
	private void DP() {
		int n = graph.length;
		int[] vertex = new int[n - 1];
		int vertexid = 1;
		for (int i = 0; i < vertex.length; i++) {
			vertex[i] = vertexid;
			vertexid++;
		}
		getsubsets(vertex);
		double[][] D = new double[n][settoid.size()];// To record the distance
		int[][] P = new int[n][settoid.size()];// To track the path

		// 第1层。
		for (int i = 1; i < n; i++) {
			D[i][0] = this.graph[i][0];
		}
		for (int k = 1; k <= n - 2; k++) {
			for (int id = 0; id < idtoset.size(); id++) {
				ArrayList<Integer> subset = idtoset.get(id);
				if (subset.size() != k)
					continue;
				for (int i = 1; i < n; i++) {
					if (subset.contains(i))
						continue;
					double min = Double.MAX_VALUE;
					double value = 0;
					for (int j : subset) {
						ArrayList<Integer> Aminusj = remove(subset, j);
						int idj = settoid.get(Aminusj);
						try {
							value = this.graph[i][j] + D[j][idj];
						} catch (Exception e) {
							System.out.print("Error!___");
							System.out.println("i: " + String.valueOf(i)
									+ " j: " + String.valueOf(j));
							int size = this.graph[i].length;
							System.out.println(" graph.length: "
									+ String.valueOf(size));
							System.out.println(" D.length: "
									+ String.valueOf(D.length));
						}
						if (value < min && value != 0) {
							min = value;
							P[i][id] = j;
						}
					}
					/*
					 * if (min < 9999) ;
					 */
					D[i][id] = min;
				}
			}
		}
		ArrayList<Integer> Vminusv0 = new ArrayList<Integer>();
		for (int i = 0; i < vertex.length; i++) {
			Vminusv0.add(vertex[i]);
		}
		int vminusv0id = settoid.get(Vminusv0);
		double min = Double.MAX_VALUE;
		for (int j : Vminusv0) {
			ArrayList<Integer> Vminusv0vj = remove(Vminusv0, j);
			int idj = settoid.get(Vminusv0vj);

			double value = (this.graph[0][j] != 0 && D[j][idj] != 0) ? this.graph[0][j]
					+ D[j][idj]
					: 0;

			if (value < min && value != 0) {
				min = value;
				P[0][vminusv0id] = j;
			}
		}
		/*
		 * if (min < 99999) ;
		 */
		D[0][vminusv0id] = min;
		generateOpttour(P, Vminusv0);
		this.setMinDistance(D[0][vminusv0id]);
	}

	private void printDP(double[][] D) {
		for (int i = 0; i < D.length; i++) {
			for (int j = 0; j < D[i].length; j++) {
				System.out.print(D[i][j]);
				System.out.print(" ");
			}
			System.out.println();
		}
	}

	/**
	 * Generate optimal tour by P, and print it
	 * 
	 * @param P
	 * @param list
	 *            containing all vertexes except V0
	 * */
	private void generateOpttour(int[][] P, ArrayList<Integer> V) {
		/*
		 * System.out.println("start generateOpttour");
		 * System.out.println(JSON.toJSONString(P));
		 */
		String path = "0->";
		ArrayList<Integer> Set = V;
		int start = 0;
		while (!Set.isEmpty()) {
			// System.out.println(Set);
			int id = settoid.get(Set);
			String vertex = String.valueOf(P[start][id]);
			/* System.out.println("start:"+start+" id:"+id+" vertex:"+vertex); */
			path += vertex + "->";
			Set = remove(Set, P[start][id]);
			start = P[start][id];
		}
		path += "0";
		this.setFirnalCityFlow(path);
	}

	/**
	 * Get all subsets of a input set. And number subsets All results will be
	 * recorded in member variables
	 * 
	 * @param set
	 *            input set
	 * */
	private void getsubsets(int[] set) {
		idtoset.clear();
		settoid.clear();
		int max = 1 << set.length; // how many sub sets
		int id = 0;
		for (int i = 0; i < max; i++) {
			int index = 0;
			int k = i;
			ArrayList<Integer> s = new ArrayList<Integer>();
			while (k > 0) {
				if ((k & 1) > 0) {
					s.add(set[index]);
				}
				k >>= 1;
				index++;
			}
			idtoset.put(id, s);
			settoid.put(s, id);
			id++;
		}
	}

	/**
	 * Remove an input value in a list
	 * 
	 * @param src
	 *            source list
	 * @param n
	 *            the value to be removed
	 * @return list after removing n
	 * */
	private ArrayList<Integer> remove(ArrayList<Integer> src, int n) {
		ArrayList<Integer> dest = new ArrayList<Integer>();
		// int j = 0;
		for (int i = 0; i < src.size(); i++) {
			int vertex = src.get(i);
			if (vertex == n)
				continue;
			dest.add(vertex);
		}
		return dest;
	}
}
