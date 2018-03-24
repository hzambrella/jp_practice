
// not use
var aaa= [{name:'wwb',id:111},{name:'aaa',id:0,pid:"mei"},{name:'a',id:1,pid:"mei"},{name:'b',id:2,pid:1},{name:'c',id:3,pid:1},{name:'d',id:4,pid:2},{name:'e',id:5,pid:2}];

function test(ary,data){

    var data=data?data:(function(ary){
      var tempAry=[];
      var idList=[];
      ary.forEach(function(item){idList.push(item.id)});
     function deb(id,idList){
         var flag=true;
        for(var ida in idList){
            if(id==idList[ida]){
                flag=false;
            }       
        }
         return flag;
     }

      for(var i=0,len=ary.length;i<len;i++){
        if(ary[i].pid==undefined||(ary[i].pid!=undefined&&deb(ary[i].pid,idList))){
          var obj={name:ary[i].name,id:ary[i].id};
          tempAry.push(obj);
        }
       }
        return tempAry; 
    }(ary));

    var temp=0;
   if(data.constructor==Array){
     for(var i=0,len=data.length;i<len;i++){
        for(var j=0,lenA=ary.length;j<lenA;j++){
           if(ary[j].pid==data[i].id){
           var obj={name:ary[j].name,id:ary[j].id};
           data[i].child=data[i].child||[];
           data[i].child.push(obj);
           temp++;
       }
     }
    }
   }

   if(temp>0){
     if(data.constructor==Array){
      for(var n=0,lenB=data.length;n<lenB;n++){
        data[n].child=test(ary,data[n].child?data[n].child:[]);
        if(data[n].child.length==0){
            delete data[n].child;
        }
          delete data[n].id;
      } 
    }
   }else{
       for(var n=0,lenB=data.length;n<lenB;n++){
          delete data[n].id;
       } 

   }
    return data;

}
var a=test(aaa);
    console.log(a)