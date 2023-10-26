const LINENUM = 6 // 一排多少个
cc.Class({
    extends: cc.Component,

    properties: {
        item:cc.Prefab,
        content:cc.Node,
        scrollView: cc.ScrollView,
        spacing: 20,
        bufferZone: 500,
        prefabCellHeight:200,
     
    },

    onLoad() {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // this.scrollView.node.on('scrolling', this.scrollevent, this);
    },
    onDisable(){
        this.content.removeAllChildren();
    },
    initialize() {
        this.items = [];
        let dd = this.itmeJs!="ClubFriend"?this.spawnCount:this.data.length
        for (let i = 0; i < dd; i++) {
    		let item = cc.instantiate(this.item);
            let numx = i%LINENUM;
            let numy = Math.floor(i/LINENUM);
            let x = item.width * (numx + 0.5) + this.spacing * (numx + 1);
            let y = -item.height * (0.5 + numy) - this.spacing * (numy + 1);
            item.myTag = "";
            item.setPosition(x,y);
            this.items.push(item);
        }
    },
    frameLoading(list,search,flag){
        cc.vv.popMgr.wait('正在获取成员列表',function(){});
        this.content.removeAllChildren();  
        this.flag = flag;
        this.itmeJs = flag=="friend"?"ClubFriend":"ClubMemberItem";
        this.data = list;
        this.totalCount = list.length;
        this.spawnCount = this.totalCount <= 100? this.totalCount : 100;
        this.lastContentPosY = 0;
        this.scrollView.scrollToOffset(cc.v2(-10, 0),0);
        this.initialize();
        let delayT = search?0 :0.02;
        this.curIndex = 0;
        if(this.itmeJs!="ClubFriend")
            this.content.height = Math.ceil(this.totalCount/LINENUM)  * (this.prefabCellHeight + this.spacing) + this.spacing;
        var delay = cc.delayTime(delayT)
        var callfunc = cc.callFunc(function(){
            this.showItem();
        }.bind(this));
        var seq = cc.sequence(delay,callfunc)
        this.node.stopAllActions()
        this.node.runAction(cc.repeatForever(seq))
    },

    showItem(){
        if(this.curIndex >= this.spawnCount&&this.itmeJs!="ClubFriend"){
            this.node.stopAllActions()
            cc.vv.popMgr.hide();
            return
        }
        if(this.itmeJs=="ClubFriend"&&this.curIndex >= this.data.length){
            this.node.stopAllActions()
            cc.vv.popMgr.hide();
            return
        }
        var node = this.items[this.curIndex];
        if(!node){
            return;
        }
        this.content.addChild(node);
        node.active = true;
        node.getComponent(this.itmeJs).init(this.data[this.curIndex]);
        node.getComponent(this.itmeJs).updateID(this.curIndex);
        if(this.flag=="friend"){
            node.myTag = this.data[this.curIndex].user_id + "";
        }else{
            node.myTag = this.data[this.curIndex].userid + "";
        }
        this.curIndex += 1;
    },

    getPositionInView: function (item) {
        if(!item.parent){
            return cc.v2(0,0)
        }
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    scrollevent(){
        if(this.totalCount<18){
            return;
        }
        // cc.log("滚动中")
        this.updateTimer += 0.1;
        if (this.updateTimer < this.updateInterval) return;
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY;
        let offset = (this.prefabCellHeight + this.spacing) * Math.ceil(items.length/LINENUM);

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
        this.lastContentPosY = this.scrollView.content.y;
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
            if(this.flag=="friend"){
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
    }

});
