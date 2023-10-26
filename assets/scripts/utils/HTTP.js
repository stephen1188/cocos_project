var HTTP = cc.Class({
    extends: cc.Component,

    statics:{
        sendRequest : function(path,data,handler,method = "GET"){

            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for(var k in data){
                if(str != "?"){
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            
            var requestURL = path + encodeURI(str);
            xhr.open(method,requestURL, true);
            if (cc.sys.isNative){
                // xhr.setRequestHeader("Accept-Encoding","deflate","text/html;charset=UTF-8");
                // httpRequest.setRequestHeader "Content-Type", "text/html"
                // xhr.setCharacterEncoding("UTF-8");
            }
            
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    cc.vv.log3.debug("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        if(handler !== null){
                            handler(xhr.responseText);
                        }
                    } catch (e) {
                        cc.vv.log3.error("err:" + e);
                    }
                    finally{
                    }
                }
            };
            
            xhr.send();
            return xhr;
        },

        sendRequestUrl : function(path,data,handler,method = "GET"){

            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "";
            for(var k in data){
                str += k + "=" + data[k];
            }
            
            // var requestURL = path + encodeURI(str);

            xhr.open(method,path, true);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
            if (cc.sys.isNative){
                // xhr.setRequestHeader("Accept-Encoding","deflate","text/html;charset=UTF-8");
                // httpRequest.setRequestHeader "Content-Type", "text/html"
                // xhr.setCharacterEncoding("UTF-8");
            }
            
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    cc.vv.log3.debug("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        if(handler !== null){
                            handler(xhr.responseText);
                        }
                    } catch (e) {
                        cc.vv.log3.error("err:" + e);
                    }
                    finally{
                    }
                }
            };
            
            xhr.send(str);
            return xhr;
        }
    },
});