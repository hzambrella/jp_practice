package netDisk.netDiskEngine;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringOperate {
	/** 
     * ͨ��������ʽ�ķ�ʽ��ȡ�ַ�����ָ���ַ��ĸ��� 
     * @param text ָ�����ַ��� 
     * @return ָ���ַ��ĸ��� 
     */  
    public static int getSubStringNumFromString(String text) {  
        // ����ָ�����ַ���������  
        Pattern pattern = Pattern.compile("cs");  
        // �����ַ����������ƥ��  
        Matcher matcher = pattern.matcher(text);  
        int count = 0;  
        // ѭ����������ƥ��  
        while (matcher.find()){ // ���ƥ��,������+1  
            count++;  
        }  
        return  count;  
    }  
}
