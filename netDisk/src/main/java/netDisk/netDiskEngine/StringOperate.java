package netDisk.netDiskEngine;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringOperate {
	/** 
     * 通过正则表达式的方式获取字符串中指定字符的个数 
     * @param text 指定的字符串 
     * @return 指定字符的个数 
     */  
    public static int getSubStringNumFromString(String text) {  
        // 根据指定的字符构建正则  
        Pattern pattern = Pattern.compile("cs");  
        // 构建字符串和正则的匹配  
        Matcher matcher = pattern.matcher(text);  
        int count = 0;  
        // 循环依次往下匹配  
        while (matcher.find()){ // 如果匹配,则数量+1  
            count++;  
        }  
        return  count;  
    }  
}
