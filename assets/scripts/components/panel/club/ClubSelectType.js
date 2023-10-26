cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad:function(){
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            
            var width = cc.winSize.width;
            this.node.width = width;
        }
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case "type_ptz":{
                cc.vv.hall.create_room = 2;
                cc.vv.popMgr.pop('hall/new_CreateRoom',function(obj){
                    obj.emit('show');
                });
            }
            break;
            case "type_pwz":{
                cc.vv.hall.create_room = 3;
                cc.vv.popMgr.pop('hall/new_CreateRoom',function(obj){
                    obj.emit('show');
                });
            }
            break;
            case "bg_shadow":{
                
            }
            break;
        }
        this.node.destroy();
    }
});
