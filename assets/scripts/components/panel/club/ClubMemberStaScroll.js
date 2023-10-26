const SPWNCOUNT = 100;
cc.Class({
    extends: cc.Component,

    properties: {
        item:cc.Prefab,
        content:cc.Node,
        scrollView: cc.ScrollView,
        spacing: 20,
        bufferZone: 500,
        prefabCellHeight:200,
        toggleNode:[cc.Toggle]
     
    },

    onLoad () {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // this.scrollView.node.on('scrolling', this.scrollevent, this);
    },
   // 防止快速切换的时候update
    onEnable(){
        this.check_list = [];
    },
    onDisable(){
        if(this.masterFlag){
            this.content.removeAllChildren();
        }
        this.updateMasterFlag(true);
        if(!this.toggleNode[0]){
            return;
        }
        this.toggleNode[0].isChecked = true;
        for(let i=1; i<5; i++){
            this.toggleNode[i].isChecked = false;
        }
       
    },
    updateMasterFlag(flag){
        this.masterFlag = flag;
    },
    initialize() {
        this.items = [];
        let dd = this.itmeJs!="ClubMaster"?this._spawnCount:this.data.length
        for (let i = 0; i < dd; i++) {
    		let item = cc.instantiate(this.item);
            item.myTag = "";
            item.setPosition(0,-item.height * (0.5 + i) - this.spacing * (i + 1));
            this.items.push(item);
        }
    },
    frameLoading(list,search,flag){
        this.updateMasterFlag(true);
        this.flag = flag;
        this.itmeJs = flag=="master"?"ClubMaster":"ClubMemberStatus";
        this.data = list;
        this.content.removeAllChildren();
        this._totalCount = list.length;
        this._spawnCount = this._totalCount <= SPWNCOUNT? this._totalCount : SPWNCOUNT;
        this._lastContentPosY = 0;
        this.scrollView.scrollToOffset(cc.v2(-10, 0),0);
        this.initialize();
        let delayT = search?0 :0.02;
        this._curIndex = 0;
        this.content.height = this._totalCount  * (this.prefabCellHeight + this.spacing) + this.spacing;
        var delay = cc.delayTime(delayT)
        var callfunc = cc.callFunc(function(){
            this.showItem();
        }.bind(this));
        var seq = cc.sequence(delay,callfunc)
        this.node.stopAllActions()
        this.node.runAction(cc.repeatForever(seq))
    },

    showItem(){
        if(this._curIndex >= this._spawnCount&&this.itmeJs!="ClubMaster"){
            this.node.stopAllActions()
            cc.vv.popMgr.hide();
            return
        }
        if(this.itmeJs=="ClubMaster"&&this._curIndex >= this.data.length){
            this.node.stopAllActions()
            cc.vv.popMgr.hide();
            return
        }
        var node = this.items[this._curIndex];
        if(!node){
            return;
        }
        this.content.addChild(node);
     
        node.active = true;
        if(this.flag=="master"){
            node.myTag = this.data[this._curIndex].user_id + "";
        }else{
            node.myTag = this.data[this._curIndex].userid + "";
        }
        node.getComponent(this.itmeJs).init(this.data[this._curIndex]);
        node.getComponent(this.itmeJs).updateID(this._curIndex);
        this._curIndex += 1;
    },

    getPositionInView: function (item) {
        if(!item.parent){
            return cc.v2(0,0)
        }
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    scrollevent () {
        if(this._spawnCount < 6){
            return;
        }
        // cc.log("滚动中")
        this.updateTimer += 0.1;
        if (this.updateTimer < this.updateInterval) return;
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this._lastContentPosY;
        let offset = (this.prefabCellHeight + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            if(!items[i]){
                return;
            }
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    this.formateUpdate(items[i],true,offset)
                }
            } else {
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    this.formateUpdate(items[i],false,offset);
                }
            }
        }
        this._lastContentPosY = this.scrollView.content.y;
    },
    formateUpdate(node,flag,offset){
        let self = this;
        let item = node.getComponent(this.itmeJs);
        let itemId = 0;
        if(flag){
            node.y = node.y + offset;
            itemId = item.itemID - this.items.length;
        }else{
            node.y = node.y - offset;
            itemId = item.itemID + this.items.length
        }
        if(this.data[itemId]){
            node.active = true;
            if(this.flag=="master"){
                node.myTag = self.data[itemId].user_id + "";
            }else{
                node.myTag = self.data[itemId].userid + "";
            }
            item.init(this.data[itemId]);
        }else{
            node.active = false;
            node.myTag = "";
        }
        item.updateID(itemId);
    },
    onCheckToggle(event,index){
        let num = parseInt(index)
        // cc.vv.popMgr.wait('正在获取成员状态',function(){
        cc.vv.net1.quick("club_user_online_list",{club_id:cc.vv.userMgr.club_id,check_list:[num]});
        // });
    }

});
