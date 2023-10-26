    cc.Class({
    extends: cc.Component,

    properties: {
        lblRoom:cc.Label
    },

    onLoad:function(){
        this.initEventHandlers();
    },

     /**
     * 监听事件
     */
    initEventHandlers: function() {

        //初始化事件监听器
        var self = this;

        //属性更新
        this.node.on('show', function () {
            self.lblRoom.string = "";
        });
    },


    onBtnClicked(event,data){
        cc.vv.audioMgr.click();
        switch(data){
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":{
                if(this.lblRoom.string.length <=5){
                    this.lblRoom.string = this.lblRoom.string + data;
                    this.checkNum();
                }
            }
            break;
            case "-1":{
                if(this.lblRoom.string.length > 0){
                    this.lblRoom.string = this.lblRoom.string.substr(0,this.lblRoom.string.length  -1);
                }
            }
            break;
            case "-2":{
                this.lblRoom.string = "";
            }
            break;
        }
    },

    checkNum:function(){
        var self = this;
        if(this.lblRoom.string.length == 6){
            setTimeout(() => {
                cc.vv.userMgr.join(self.lblRoom.string,0,0);
                self.lblRoom.string = "";
            }, 200);
        }
    }

    // update (dt) {},
});
