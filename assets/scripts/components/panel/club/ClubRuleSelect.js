cc.Class({
    extends: cc.Component,

    properties: {
        list:cc.Node,
        pwsRuleItem:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    show:function(pwz){
        this.list.removeAllChildren();
        for(var i = 0; i < pwz.length; ++i){
            var node = cc.instantiate(this.pwsRuleItem);
            this.list.addChild(node);
            node.id = pwz[i].id;
            node.emit('new',pwz[i]);
        }
    },

    oBtnClicked:function(event){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case 'bg_shadow':{
                this.node.destroy();
            }
            break;
        }
    }


    // update (dt) {},
});
