const SPWNCOUNT = 6;
cc.Class({
    extends: cc.Component,

    properties: {
        content:cc.Node,
        scrollView: cc.ScrollView,
        spacing: 20,
        bufferZone: 500,
        prefabCellHeight:200,
        historyItem5:cc.Prefab,
        itmeJs:"HIstoryItem",
        flagName: "history",
    }, 
    onLoad(){
        
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.scrollView.node.on('scrolling', this.scrollevent, this);
    },
    history:function(list){
        this.flagName = "history";
        this.frameLoading(list);
    },
    frameLoading(list){
        if(!list){
            return;
        }
        this.items = [];
        this.data = list;
        if(this.flagName == "history"){
            cc.vv.history_list = list;
        }
      
        this.content.removeAllChildren();
        this._totalCount = list.length;
        this._spawnCount = this._totalCount <= SPWNCOUNT? this._totalCount : SPWNCOUNT;
    
        this._lastContentPosY = 0;
        this.scrollView.scrollToOffset(cc.v2(-10, 0),0);
        let delayT = 0.01;
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
        if(this._curIndex >= this._spawnCount){
            this.node.stopAllActions()
            cc.vv.popMgr.hide();
            return
        }
        var node = cc.instantiate(this.historyItem5);
        if(!node){
            return;
        }
        node.setPosition(0,-node.height * (0.5 + this._curIndex) - this.spacing * (this._curIndex + 1));
        this.content.addChild(node);
        this.items.push(node);
       
        if(this.flagName == "round"){
            this.history.scores = this.data[this._curIndex].scores;
            node.emit("history",this.history); 
            node.emit("round", this.data[this._curIndex]);   
        }else{
            node.emit("history",this.data[this._curIndex]);
        }
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
            if(this.flagName == "round"){
                this.history.scores = this.data[itemId].scores;
                node.emit("history",this.history); 
                node.emit("round",this.data[itemId]); 
            }else{
                node.emit("history",this.data[itemId]);
            }
        }else{
            node.active = false;
        }
        item.updateID(itemId);
    },


    round:function(data){
        this.flagName = "round";
        //找到记录
        this.history = null;
        for(var i = 0; i < cc.vv.history_list.length; ++i){
            if(cc.vv.history_list[i].battle_id == data.battle_id){
                this.history = cc.vv.history_list[i];
            }
        }
      
        this.frameLoading(data.list);

    },
    close(){
        this.node.destroy();
    }
});
