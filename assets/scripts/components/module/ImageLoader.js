function loadImage(url,callback){
    if(url == "https://thirdwx.qlogo.cn/"){
        // url = "http://wanshun.vip/aa.jpg";
        url = "http://img.wanshun.vip/icon.png";
    }
    cc.loader.load({url:url,type:'png'},function (err,tex) {
        if(err){
            loadImage('http://img.wanshun.vip/icon.png',callback);
            return;
        }
        // if(err){
        //     cc.log('err = ', err);
        // }
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        callback(spriteFrame);
    });
};

cc.Class({
    extends: cc.Component,
    properties: {
    },

    // use this for initialization
    onLoad: function () {
    },
    
    loadImg:function(imgurl){
  
        var self = this;
        // cc.log('img == ', imgurl);

        //加载默认头像
        if(imgurl == null || imgurl == ''){
            // cc.loader.loadRes('public/headimg', function( error, tex ){
            //     var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            //     self._spriteFrame = spriteFrame;
            //     self.setupSpriteFrame();
            // });
            cc.loader.loadRes('public/aa', function( error, tex ){
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                self._spriteFrame = spriteFrame;
                self.setupSpriteFrame();
            });
            return;
        }

        //原生，直接线上加载
        if(imgurl && !cc.sys.isNative){
            // cc.log('222222222222');
            loadImage(imgurl,function (spriteFrame) {
                self._spriteFrame = spriteFrame;
                self.setupSpriteFrame();
            });
            return;;
        };  

        //本地图片
        var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
        var key = cc.vv.utils.md5(imgurl);
        var filepath = dirpath + key + '.png';
       

        //加载到本地
        if( jsb.fileUtils.isFileExist(filepath) ){
            loadImage(filepath,function (spriteFrame) {
                self._spriteFrame = spriteFrame;
                self.setupSpriteFrame();
            });  
            return;
        }

        //保存到本地
        var saveFile = function(data){
            if( typeof data !== 'undefined' ){

                if(!jsb.fileUtils.isDirectoryExist(dirpath) ){
                    jsb.fileUtils.createDirectory(dirpath);
                }
    
                if( jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , filepath) ){
                    loadImage(filepath,function (spriteFrame) {
                        self._spriteFrame = spriteFrame;
                        self.setupSpriteFrame();
                    }); 
                    return;
                }
            }
        };

        //远程获取，保存到本地
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                saveFile(xhr.response);
            }
        };
        xhr.open("GET",imgurl, true);
        xhr.send();

        // var xhr = new XMLHttpRequest();
        // xhr.responseType = 'arraybuffer';
        // xhr.onreadystatechange = function() {
        //     if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                
        //         saveFile(xhr.response);
        //     }
        // };
        // xhr.open("GET",imgurl, true);
        // xhr.send();

        // var xhr = new XMLHttpRequest();

        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState === 4 ) {
        //         if(xhr.status === 200){
        //             xhr.responseType = 'arraybuffer';
        //             saveFile(xhr.response);
        //         }else{
        //             saveFile(null);
        //         }
        //     }
        // }.bind(this);
        // xhr.open("GET", imgurl, true);
        // xhr.send();
        
        // var self = this;
        // if(imgurl){
        //     loadImage(imgurl,function (spriteFrame) {
        //         self._spriteFrame = spriteFrame;
        //         self.setupSpriteFrame();
        //     });  
        // }else{
        //     //加载默认头像
        //     cc.loader.loadRes('textures/public/headimg', function( error, tex )
        //     {
        //         var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        //         self._spriteFrame = spriteFrame;
        //         self.setupSpriteFrame();
        //     });
        // }
    },
    
    setupSpriteFrame:function(){
        var self = this;
        if(self._spriteFrame){
            if(!self.node){
                return;
            }
            var spr = self.node.getComponent(cc.Sprite);
            if(spr){
                spr.spriteFrame = self._spriteFrame;    
            }
        }
    }
});
