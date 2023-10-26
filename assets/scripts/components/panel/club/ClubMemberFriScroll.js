const SPWNCOUNT = 50;
cc.Class({
    extends: cc.Component,

    properties: {
        friendNode: cc.Node,
        masterNode: cc.Node,
        friendContent: cc.Node,
        masterContent:cc.Node,
        firendEdit:cc.EditBox,
        setSelfDlNode: cc.Node,
    },

    onDisable(){
        this.friendNode.active = false;
        this.masterNode.active = false;
        this.friendContent.removeAllChildren();
        this.masterContent.removeAllChildren();
    },
    // 返回第一层
    onclickBackMaster(flag){ 
        this.firendEdit.string = "";
        this.isShow(true)
    },
    isShow(flag){ //master = true
        this.friendNode.active = !flag;
        this.masterNode.active = flag;
    },
    openFriend(){
        this.friendNode.active = true;
    },
    isShowSelfDlr(flag){
        this.setSelfDlNode.active = flag;
    }
});
