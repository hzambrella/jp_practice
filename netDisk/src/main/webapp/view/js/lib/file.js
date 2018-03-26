//通过后缀判断非文件夹文件的类型
// image document video music
function getFileTypeBySuffix(suffix) {
    var img = ["bmp", "jpg", "jpeg", "png", "tiff", "gif", "pcx", "tga", "exif", "fpx", "svg", "psd",
        "cdr", "pcd", "dxf", "ufo", "eps", "ai", "raw", "wmf"
    ];
    var document = ["txt", "doc", "docx", "xls","xlsx", "htm", "html", "jsp", "rtf", "wpd", "pdf", "ppt"];

    var video = ["mp4", "avi", "mov", "wmv", "asf", "navi", "3gp", "mkv", "f4v", "rmvb", "webm"];

    var music = ["mp3", "wma", "wav", "mod", "ra", "cd", "md", "asf", "aac", "vqf", "ape", "mid", "ogg",
        "m4a", "vqf"
    ];

    if ($.inArray(suffix, img) >= 0) {
        return "image"
    }

    if ($.inArray(suffix, document) >= 0) {
        return "document"
    }

    if ($.inArray(suffix, video) >= 0) {
        return "video"
    }

    if ($.inArray(suffix, music) >= 0) {
        return "music"
    }

    return suffix;
}

//输入int 类型的文件大小。
//输出带单位的文件大小
function formatFileSize(size){
    size==null?size=0:size=size;
    if (size<=0){
        return 0;
    }

    if (size<1024){
        return size+"B"
    }else if (size<1024*1024){
        return Math.round(size*100/1024)/100+"KB"
    }else if (size<1024*1024*1024){
        return Math.round(size*100/(1024*1024))/100+"MB"
    }else{
        return Math.round(size*100/(1024*1024*1024))/100+"GB"
    }
}