cc.Class({
    extends: cc.Component,

    properties: {
        manifestUrl: {
            type: cc.Asset,
            default: null
        },
        info: cc.Label,
        byteProgress: cc.ProgressBar,
        retryBtn: cc.Node,
        noteUi:cc.Node,
        _updating: false,
        _canRetry: false,
        _storagePath: '',
        _wait:null,
        // version:cc.Label
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;

        if(this._wait){
            var wait = this._wait.getComponent("WaitingConnection");
            wait.scheduleCannel()
            wait.hide();
            this._wait = null;
        }
        if(!cc.isValid(this.info)){
            return;
        }
        cc.log('------------0');
        // console.log("event.getEventCode() = ", event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('------------1');
                this.info.string = '本地配置文件不存在.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                cc.log('------------2');
                if(event.getPercent() > 0.02){
                    this.noteUi.active = true;
                    this.byteProgress.progress = event.getPercent();
                    this.info.string = (event.getPercent() * 100).toFixed(2) + '%';
                    // this.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                }else{
                    this.byteProgress.progress = 0.02;
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('------------3');
                this.info.string =""// '网络连接失败，请重试.';
                this.retryBtn.active = true;
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('------------4');
                this.info.string = '已经是最新版本.';
                this.node.active = false;
                cc.vv.login.loading();
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('------------5');
                this.info.string = '更新完成. ';
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('------------6');
                this.info.string = ""//'更新错误 ' + event.getMessage();
                this.retryBtn.active = false;
                this._updating = false;
                this._canRetry = true;
                if(this._failCount >= 3){
                    this.retryBtn.active = true;
                    failed = true
                }
                else{
                    this.retry();
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('------------7');
                this.info.string = ""//'资源更新失败';
                cc.vv.login.loading();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log('------------8');
                this.info.string = ""//'未知错误';
                cc.vv.login.loading();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
            cc.vv.login.loading();
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            // var searchPaths = jsb.fileUtils.getSearchPaths();
            // var newPaths = this._am.getLocalManifest().getSearchPaths();
            // Array.prototype.unshift(searchPaths, newPaths);
            // cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            // this.version.string = this._am.getLocalManifest().getVersion()//直接显示前端热更里的版本号
            Array.prototype.unshift.apply(searchPaths, newPaths);
         
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.game.restart();
        }
    },
    
    /**
     * 重试
     */
    retry: function () {

        // this.node.active = false;

        if (!this._updating && this._canRetry) {
            this.retryBtn.active = false;
            this._canRetry = false;
            
            this.info.string = '正在重试';
            this._failCount++;
            this._am.downloadFailedAssets();
        }
    },
    

    hotUpdate: function (node) {

        // // Hot update is only available in Native build

        //不走热更测试包 guobol
        cc.vv.login.loading();
        return;
        if (!cc.sys.isNative) {
            this.node.active = false;
            cc.vv.login.loading();
            return;
        }

        this.node.active = true;
        this.noteUi.active = false;
        this._wait = node;

        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this)) 
           
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
            }

            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    // use this for initialization
    onLoad: function () {
        
        // cc.log('启动热更新1');
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        // cc.log('启动热更新2');

        // cc.log("jsb.fileUtils = ", jsb.fileUtils);
        // cc.log("jsb.fileUtils.getWritablePath()  = ", jsb.fileUtils.getWritablePath() );
        // cc.log("(jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') = ", (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/'));
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset');
        // this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');
        cc.log('Storage path : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            cc.log('A = ', vA);
            cc.log('B = ', vB);
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        // cc.log("this._storagePath = ", this._storagePath);
        // cc.log("this.versionCompareHandle = ", this.versionCompareHandle);
        this._am = new jsb.AssetsManager('', this._storagePath,this.versionCompareHandle);
        // cc.log("this._am = ", this._am[0]);
        

        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        var self = this;
        this._am.setVerifyCallback(function (path, asset) {
            cc.log('path = ', path);
            // cc.log('asset = ', asset);
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if(!cc.isValid(this.info)){
                return true;
            }
            if (compressed) {
                self.info.string = "游戏内容验证中..";
                return true;
            }else {
                self.info.string = "游戏内容验证中..";
                return true;
            }
        });

        //安卓多线程
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }
        this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
        //开始检查更新
        this.info.string = '正在检查更新';
        this.byteProgress.progress = 0;
    },

    onDestroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
        // if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        //     this._am.release();
        // }
       
    }
});
