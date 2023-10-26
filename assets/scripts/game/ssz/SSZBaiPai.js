var DAO_POS = [cc.v2(-87,425),cc.v2(-168,312),cc.v2(-210,190)];
var DAO_ADD = [84,84,104];
var DAO_MAX = [3,5,5];
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab:cc.Prefab
    },
    
    onLoad: function () {

        this.noMove = false;

        this.sszGame = this.node.getComponent('SSZ1100Game');
        this.nodeBaiPai = this.node.getChildByName("ID_LAYOUT_BAIPAI");
        this.nodeXuanPai = this.node.getChildByName("ID_LAYOUT_XUANPAI");
        this.nodeHandList = this.nodeBaiPai.getChildByName("card_layout");
        this.nodePaiBtn = this.nodeBaiPai.getChildByName("Pai_btn");

        var button = this.nodeBaiPai.getComponent(cc.Button);
        button.node.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
        button.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
        button.node.on(cc.Node.EventType.TOUCH_END, this.touchend, this);
        
        this.vecCandSelect= [];
        var fdSelect = this.nodeBaiPai.getChildByName("FdCardSelect");
        var sdSelect = this.nodeBaiPai.getChildByName("SdCardSelect");
        var tdSelect = this.nodeBaiPai.getChildByName("TdCardSelect");
        this.vecCandSelect.push(fdSelect);
        this.vecCandSelect.push(sdSelect);
        this.vecCandSelect.push(tdSelect);
        this.hideDaoCandSelect();
        
        this.vecCardTypeTips = [];
        var fdTip = this.nodeBaiPai.getChildByName("FDCt");
        var sdTip = this.nodeBaiPai.getChildByName("SDCt");
        var tdTip = this.nodeBaiPai.getChildByName("TDCt");
        this.vecCardTypeTips.push(fdTip);
        this.vecCardTypeTips.push(sdTip);
        this.vecCardTypeTips.push(tdTip);
        this.hideCardTypeTips(-1); 
        
        this.autoCheckOne = true;       
    },    

    showDaoTypeTip:function(dao,cardTypeId){
        this.vecCardTypeTips[dao].active = true;

        var cardEffectBg = null;
        var cardInfo = this.sszGame.getCardTypeInfo(cardTypeId);
        var iFen = 1;
        if(dao == 0){
            iFen = cardInfo.FD;
        }
        else if(dao == 1){
            iFen = cardInfo.SD;
        }else if(dao == 2){
            iFen = cardInfo.TD;
        }

        // if(iFen > 1){
        //     cardEffectBg = "cardtype_specile_bg";                                            
        // }else{
        //     cardEffectBg = "cardtype_nomal_bg";
        // }

        // this.vecCardTypeTips[dao].getComponent(cc.Sprite).spriteFrame = this.sszGame.getCardTypeBgSpriteFrame(cardEffectBg);

        var cardTitle = this.vecCardTypeTips[dao].getChildByName("typeTitle");
        cardTitle.getComponent(cc.Sprite).spriteFrame = this.sszGame.getCardTypeSpriteFrame(cardTypeId);
        this.daoTypeVec[dao][0] = cardTypeId;
    },

    hideCardTypeTips:function(dao){
        if(dao == -1){
            for(var i =0; i < this.vecCardTypeTips.length; i++){
                this.vecCardTypeTips[i].active = false;
            }
            this.daoTypeVec =[[-1,[]],[-1,[]],[-1,[]]];            
        }else{
            this.vecCardTypeTips[dao].active = false;
            this.daoTypeVec[dao][0] = -1;
            this.daoTypeVec[dao][1] = [];
        }
    },

    showDaoCandSelect:function(selectLen){
        for(var i =0 ; i< DAO_MAX.length;i++){
            if(DAO_MAX[i] == selectLen){
                this.vecCandSelect[i].active = true;
            }
        }
    },

    hideDaoCandSelect:function(){
        for(var i =0 ; i< DAO_MAX.length;i++){
            this.vecCandSelect[i].active = false;
        }
    },

    selectCard:function(card,myTag){
        card.setSelect(myTag);
        var selectList = this.getSelectPaiList(1);        
        for(var i =0 ; i< DAO_MAX.length; i++){
            if(selectList.length == DAO_MAX[i]){
                var daoList = this.getDaoPaiList(i);
                if(daoList.length == 0){
                    this.vecCandSelect[i].active = true;
                }
                else{
                    this.vecCandSelect[i].active = false; 
                }
            }else{
                this.vecCandSelect[i].active = false;
            }
        }
    },

    isInRect:function(location){
        for (var i = this.nodeHandList.childrenCount - 1; i > -1; --i) {
            var item = this.nodeHandList.children[i];
            var rect = item.getBoundingBox();

            if(rect.contains(location)){
                item.color = new cc.Color(150, 150, 150);
                item.isChiose = true;
                return item;
            }
        }

        return null;
    },

    touchstart: function (event) {

        if(this.noMove)return false;

        event.stopPropagation();
        var location = this.nodeHandList.convertToNodeSpace(event.getLocation());
        var item = this.isInRect(location);

        if(item){
            return true;
        }

        this.setAllCardUnSelected();
        return false;
    },

    touchmove: function (event) {

        if(this.noMove)return;

        event.stopPropagation();
        var location = this.nodeHandList.convertToNodeSpace(event.getLocation());
        var item = this.isInRect(location);

        if(item){
            return;
        }
    },

    touchend: function (event) {

        if(this.noMove)return;

        var count = 0;
        for (var i = 0; i < this.nodeHandList.childrenCount; ++i) {
            var item = this.nodeHandList.children[i];
            if(item.isChiose){
                count++;
                item.color = new cc.Color(255, 255, 255);
                var card = item.getComponent('SSZBaiPaiCard');
                //card.setSelect(card.isSelect()?0:1);
                this.selectCard(card,card.isSelect()?0:1);
                item.isChiose = false;
            }
        }
        
        if(count>0){
            cc.vv.audioMgr.click();
        }
    },

    fisrtFaPai:function(){
        
        var that = this;

        this.noMove = true;

        //获取未摆的牌
        var daoList = this.getDaoPaiList(-1);

        //提交按钮显隐
        this.showFunction((daoList.length == 0));

        //隐藏牌型按钮
        var children = that.nodePaiBtn.children;
        for (var i = 0; i < children.length; ++i) {
            children[i].getComponent(cc.Button).interactable = false;
        }

        //隐藏特殊牌按钮
        this.teshu = 0;
        this.nodeBaiPai.getChildByName("Func_btn").getChildByName('spcard').active = false;
        this.nodeBaiPai.getChildByName("Func_btn").getChildByName("teshu").getComponent(cc.Button).interactable = false;

        for(var i = 0 ; i < daoList.length ;i++){
            // daoList[i].runAction(
            //     cc.sequence(
            //         cc.delayTime(i*0.15),
            //         cc.callFunc(function (){
            //             if(i!=12)cc.vv.audioMgr.playSFX('sfx/flop');
            //         }),
            //         cc.moveTo(0.15,cc.v2(-470 + i * 78)),
            //         cc.callFunc(function () {
            //             this.zIndex = i;
            //             that.fapaiOver();
            //         },this)
            //     )
            // ); 
            that.fapaiOver();
        }

        //清除所有选择状态
        this.setAllCardUnSelected();
    },

    fapaiOver:function(){
        this.fapaiSum++;

        if(this.fapaiSum != 13)return;

        this.noMove = false;

        var daoList = this.getDaoPaiList(-1);
        for(var j = 0;j < daoList.length;j++){
            var card =  daoList[j].getComponent('SSZBaiPaiCard');
            card.setPai(this.baipaiHand[j]);
            card.setMaPai(this.sszGame.mapai);
        }

        //牌型按钮控制
        this.updatePaiBtn();

        //检查是否有特殊牌型
        this.checkSpecialCard();
    },

    /////////////////////////////////////////////////////////////////////////////////////
    //手动摆牌处理
    /////////////////////////////////////////////////////////////////////////////////////
    //刷新手上的牌
    initBaiPaiList:function(){
        this.nodeHandList.removeAllChildren();
        this.selectHand = [[0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
        this.daoTypeVec = [[-1,[]],[-1,[]],[-1,[]]];
        this.hideCardTypeTips(-1);
        this.lastPaiList = [-1,-1];
        this.spGroup = [];
        this.fapaiSum = 0;
        for(var i=0;i< this.baipaiHand.length;i++){
            var item = cc.instantiate(this.itemPrefab);
            var card = item.getComponent('SSZBaiPaiCard');
            card.setTaget(this);
            card.setDao(-1);
            card.setPai(255);
            item.zIndex = i;
            // item.x = 480;
            item.x = -470 + i * 78
            card.setMaPai(this.sszGame.mapai);
            card.setGameType(1)
            this.nodeHandList.addChild(item,0,i);
        }
        
        //排余下的位置
        this.fisrtFaPai();
    },

    setHandPai:function(list){
        this.baipaiHand = [];
        for(var i=0;i<13;i++){
            this.baipaiHand.push(list[i]);
        }
        this.sszGame.SortSelectCardList(this.baipaiHand,13);
    },

    //上牌后刷新数据
    initBaiPaiListX:function( upTag ){

        this.noMove = false;
        
        //牌型按钮控制
        this.updatePaiBtn();

        //特殊标识显示
        this.nodeBaiPai.getChildByName("Func_btn").getChildByName('spcard').active = (this.teshu==1);

        //刷新手牌
        this.refreshHandCards();

        //检查中尾道倒水
        if (upTag) {
            this.checkDaoDaoShui();
        }
    },

    //刷新手牌
    refreshHandCards:function(params) {
        //获取未摆的牌
        var daoList = this.getDaoPaiList(-1);

        //提交按钮显隐
        this.showFunction((daoList.length == 0));

        if(daoList.length == 0)return;

        //左右扩展位置
        var mid = parseInt((daoList.length - 1) / 2);

        daoList[mid].x = 0;
        daoList[mid].zIndex = mid;
        for(var i = mid + 1 ; i < daoList.length;i++){
            daoList[i].x = (i - mid) * 78;
            daoList[i].zIndex = i;
        }

        for(var i = mid - 1 ; i >= 0;i--){
            daoList[i].x = (i - mid) * 78;
            daoList[i].zIndex = i;
        }

        //清除所有选择状态
        this.setAllCardUnSelected();
        
    },

    //单张牌点击取消
    cardCallback:function(item){
        var card =  item.getComponent('SSZBaiPaiCard');
        var dao = card.getDao();
        this.selectHand[card.getDao()][card.getIndex()] = 0;

        //card.setSelect(0);
        this.selectCard(card,0);
        card.setDao(-1);
        card.setIndex(-1);

        this.runBaiPaiAction(0.2,item,cc.v2(0,0),true,false);

        //自动补位
        this.fillNullIndex(dao);

        //只要手动摆了，就不是特殊
        this.toTeshu0();
    },

    //检查是不是最后一组未摆上牌
    checkOne:function(){
        var that = this;
        var daoList = this.getDaoPaiList(-1);

        if(!this.autoCheckOne)return false;
        if(daoList.length > 5 || daoList.length == 0)return false;

       
        for(var j = 0;j < daoList.length;j++){
            var card =  daoList[j].getComponent('SSZBaiPaiCard');
            this.selectCard(card,1);
        }

        for(var i=0;i<3;i++){
            var dao = this.getDaoNullIndex(i);
            if(dao != -1){
                this.onDaoClick(null,i);
                return true;
            }
        }

        // this.scheduleOnce(function(){
        //     that.updatePaiBtn();
        // },0.3);

        return false;
    },

    //提交按钮显隐
    showFunction:function(show){
        this.nodeBaiPai.getChildByName("Func_btn").getChildByName("reput").active = show;
        this.nodeBaiPai.getChildByName("Func_btn").getChildByName("putok").active = show;
    },

    checkDaoDaoShui:function(){
        var that = this;
        //获取未摆的牌
        var daoList = this.getDaoPaiList(-1);
        var res = this.sszGame.sszCardList.CompareDaoCtCard(this.daoTypeVec,this.selectHand);
        if(res[0] == 0){
            //正常
            //提交按钮显隐
            this.showFunction((daoList.length == 0));

            //检查最后一道是否自动上墙
            this.checkOne();
            return;
        }
        else if(res[0] == 2){
            /*
            //全部取消
            this.scheduleOnce(function(){
                that.onDaoReputCancel(null,null);
                //正常
            },0.3);    
            */

            //提交按钮显隐
            this.showFunction((daoList.length == 0));
        }else if(res[0] == 1){

            //中道，尾道做调换
            this.checkDaoshui();
            res[1] = "出牌顺序不符合规则，已帮您自动对调中道和尾道牌的顺序！"

            this.scheduleOnce(function(){
                //换类型和显示
                //保存中道
                var tmp = that.daoTypeVec[1];
                that.daoTypeVec[1] = that.daoTypeVec[2];
                that.daoTypeVec[2] = tmp;

                that.showDaoTypeTip(1,that.daoTypeVec[1][0]);
                that.showDaoTypeTip(2,that.daoTypeVec[2][0]);
                
                //提交按钮显隐
                that.showFunction((daoList.length == 0));
                //检查最后一道是否自动上墙
                this.checkOne();
            },0.5);
        }
        cc.vv.tip.show(res[1]);
    },


    //检查中尾道倒水
    checkDaoshui:function(){
        
        var that = this;
        var daoList1 = this.getDaoPaiList(1);
        var daoList2 = this.getDaoPaiList(2);

        if(daoList1.length == 0 || daoList2.length == 0)return;

        var pos1 = DAO_POS[2];
        var append1 = DAO_ADD[2];

        var pos2 = DAO_POS[1];
        var append2 = DAO_ADD[1];

        for(var i=0;i<daoList1.length;i++){
            
            var card1 =  daoList1[i].getComponent('SSZBaiPaiCard');
            var card2 =  daoList2[i].getComponent('SSZBaiPaiCard');
            card1._dao = 2;
            card2._dao = 1;

            //交换牌值
            var temp = this.selectHand[card1.getDao()][card1.getIndex()];
            this.selectHand[card1.getDao()][card1.getIndex()] = this.selectHand[card2.getDao()][card2.getIndex()];
            this.selectHand[card2.getDao()][card2.getIndex()] = temp;

            this.runBaiPaiAction(0.5,daoList1[i],cc.v2(pos1.x + append1 * i ,pos1.y),false,true);
            this.runBaiPaiAction(0.5,daoList2[i],cc.v2(pos2.x + append2 * i ,pos2.y),false,true);
        }

        this.refreshDaoCardIndex()
    },

    //刷新上道牌的显示层级关系防止新摆牌界面层级不对
    refreshDaoCardIndex:function(){
        var daolist
        var z = 0
        for (let dao = 0; dao < 3; dao++) {
            daolist = this.getDaoPaiList(dao)
            for (let card = 0; card < daolist.length; card++) {
                var onecard = daolist[card].getComponent('SSZBaiPaiCard')
                daolist[card].zIndex = dao * 10 + onecard.getIndex()
            }
        }
    },

    //全部取消
    onDaoReputCancel:function(event,data){
        
        cc.vv.audioMgr.click();

        var numCount=0;
        var No = 0;
        for(var j=0;j<3;j++){
            var daoList = this.getDaoPaiList(j);
            if(daoList.length >0){
                numCount+=daoList.length;
            }
        }

        for(var j=0;j<3;j++){
            var daoList = this.getDaoPaiList(j);

            for(var i=0;i<daoList.length;i++){
                var card =  daoList[i].getComponent('SSZBaiPaiCard');
                this.selectHand[card.getDao()][card.getIndex()] = 0;
                //card.setSelect(0);
                this.selectCard(card,0);
                card.setDao(-1);
                card.setIndex(-1);
                daoList[i].zIndex = i;
                No++;
                this.runBaiPaiAction(0.2,daoList[i],cc.v2(0,0),(No==numCount),false);
            }
        }

        this.autoCheckOne = true;

        //只要手动摆了，就不是特殊
        this.toTeshu0();
        this.hideCardTypeTips(-1);
    },

    //道的移牌下来后补位
    fillNullIndex:function(dao){

        var daoList = this.getDaoPaiList(dao);
        var pos = DAO_POS[dao];
        var append = DAO_ADD[dao];

        //从小到大排序
        var len = daoList.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                if (daoList[j].getComponent('SSZBaiPaiCard').getIndex() > daoList[j+1].getComponent('SSZBaiPaiCard').getIndex()) {        //相邻元素两两对比
                    var temp = daoList[j+1];            //元素交换
                    daoList[j+1] = daoList[j];
                    daoList[j] = temp;
                }
            }
        }
        
        for(var j=0;j<daoList.length;j++){
            daoList[j].zIndex = dao * 10 + j;

            var card =  daoList[j].getComponent('SSZBaiPaiCard');
            if(card.getIndex() == j)continue;

            this.selectHand[dao][j] = card.getPai();
            this.selectHand[card.getDao()][card.getIndex()] = 0;
            card.setIndex(j);
            //card.setSelect(0);
            this.selectCard(card,0);
            this.runBaiPaiAction(0.2,daoList[j],cc.v2(pos.x + append * j ,pos.y),false,true);   
        }
    },

    //提交组牌
    onDaoPutok:function(event,data){
        
        cc.vv.audioMgr.click();
        //判断是否倒水
        var that = this;
        //获取未摆的牌
        var res = this.sszGame.sszCardList.CompareDaoCtCard(this.daoTypeVec,this.selectHand);
        if(res[0] == 2){
            //全部取消
            this.scheduleOnce(function(){
                that.onDaoReputCancel(null,null);
            },0.3);  
            cc.vv.tip.show(res[1]);
            return;
        }

        var tanpai = [];
        for(var i=0;i<3;i++){
            this.sszGame.vecReadyCard[i] = [].concat(this.selectHand[i]);
            for(var j = 0;j < this.selectHand[i].length;j++){
                tanpai.push(this.selectHand[i][j]);
            }
        }

        //提交
        this.sszGame.common("kaipai",{tanpai:tanpai,teshu:this.teshu});
    },

    //取消
    onDaoCancel:function(event,data){
        
        cc.vv.audioMgr.click();

        //防移牌进程中点下
        if(this.noMove)return;

        var that = this;
        
        var dao = parseInt(data);
        var daoList = this.getDaoPaiList(dao);
        if(daoList.length == 0)return;

        // var myTag = [];
        for(var i=0;i<daoList.length;i++){
            var card =  daoList[i].getComponent('SSZBaiPaiCard');
            this.selectHand[card.getDao()][card.getIndex()] = 0;

            //card.setSelect(0);
            this.selectCard(card,0);
            card.setDao(-1);
            card.setIndex(-1);

            daoList[i].zIndex = i;
            this.runBaiPaiAction(0.2,daoList[i],cc.v2(0,100),(daoList.length - 1) == i,false);
        }

        this.autoCheckOne = false;

        //只要手动摆了，就不是特殊
        this.toTeshu0();

        this.hideCardTypeTips(dao);
    },

    onBlankClick:function(){
        // this.setAllCardUnSelected();
    },

    //特殊牌型上墙
    onTeshuPaiClick:function(){
        
        cc.vv.audioMgr.click();

        this.setAllCardUnSelected();
        
        var daoList = this.getDaoPaiList(null);

        //TODO 测试
        var paiList = [];

        paiList[0] = this.sszGame.sszCardList.spGroup[2][1];
        paiList[1] = this.sszGame.sszCardList.spGroup[1][1];
        paiList[2] = this.sszGame.sszCardList.spGroup[0][1];

        for (var i = 0; i < this.nodeHandList.childrenCount; ++i) {
            var node = cc.vv.utils.getChildByTag(this.nodeHandList,i);
            var card =  node.getComponent('SSZBaiPaiCard');
            card.setDao(-1);
            card.setIndex(-1);
        }
    
        //道
        for(var i=0;i<paiList.length;i++){

            //每道张
            for(var j=0;j < paiList[i].length;j++){

                //遍历手牌，打这张牌
                for(var k=0;k < daoList.length;k++){
                
                    var card =  daoList[k].getComponent('SSZBaiPaiCard');

                    if(paiList[i][j] == card.getPai() && card.getDao() == -1){
                        var pos = DAO_POS[i];
                        var append = DAO_ADD[i];
                        //card.setSelect(0);
                        this.selectCard(card,0);
                        card.setDao(i);
                        card.setIndex(j);
                        this.selectHand[i][j] = card.getPai();
                        daoList[k].zIndex = i * 10 + j;
                        this.runBaiPaiAction(0.3,daoList[k],cc.v2(pos.x + append * j ,pos.y),(0 == j-1) && (i -1) == 0,true);
                        break;
                    }
                }

            }
        }

        this.teshu = 1;
        this.hideCardTypeTips(-1);
    },

    //手动摆和自动摆切换
    onAutoBaiPai:function(event,data){
        cc.vv.audioMgr.click();

        var type = parseInt(data);
        this.sszGame._baipaiMode = type;

        this.nodeBaiPai.active = (type==0);
        this.nodeXuanPai.active = (type==1);

        if(this.nodeXuanPai.active){
            this.sszGame._viewlist.getComponent(cc.ScrollView).scrollToLeft();  
        }
    },

    //选牌上道
    onDaoClick:function(event,data){
        cc.vv.audioMgr.click();
        var that = this;
        
        var dao = parseInt(data);
        
        //道已经摆上的牌数限制
        var daoCount = this.getDaoCount(dao);
        if(daoCount == 0)return;

        var selectList = this.getSelectPaiList(1);
        var pos = DAO_POS[dao];
        var append = DAO_ADD[dao];
        var j = daoCount;

        //判断牌是否可以上道
        var selectCardNum = this.getDaoNullIndex(dao)
        if(DAO_MAX[dao] - selectCardNum < selectList.length){
            return;
        }

        //上牌
        for(var i= 0 ;i < selectList.length;i++){
            if(j > 0){
                var card = selectList[i].getComponent('SSZBaiPaiCard');
                var index = this.getDaoNullIndex(dao);
                //card.setSelect(0);
                this.selectCard(card,0);
                card.setDao(dao);
                card.setIndex(index);
                this.selectHand[dao][index] = card.getPai();
                this.runBaiPaiAction(0.2,selectList[i],cc.v2(pos.x + append * index ,pos.y),( 0 == j-1) || (selectList.length -1) == i,true);
            }
            j--;
        }        

        //显示牌型
        var cardtypeId = this.sszGame.sszCardList.getDaoCardType(this.selectHand[dao]);
        this.showDaoTypeTip(dao,cardtypeId);
        this.autoCheckOne = true;
        //刷新上道牌的zindex显示
        this.refreshDaoCardIndex()
    },

    //只要手动摆了，就不是特殊
    toTeshu0:function(){
        
        if(this.teshu == 1){ 
            cc.vv.tip.show('特殊牌型已取消');
            this.nodeBaiPai.getChildByName("Func_btn").getChildByName('spcard').active = false;
        }

        this.teshu = 0;
    },

    //得到一道中的空位
    getDaoNullIndex:function(dao){
        var max = (dao==0)?3:5;
        for(var i=0;i<max;i++){
            if(this.selectHand[dao][i] == 0){
                return i;
            }
        }

        return -1;
    },

    //得到一道中的空位
    getDaoCount:function(dao){
        var max = (dao==0)?3:5;
        var sum = 0;
        for(var i=0;i<max;i++){
            if(this.selectHand[dao][i] == 0){
                sum++;
            }
        }

        return sum;
    },

    //移牌动画
    runBaiPaiAction:function(runTime,node,ccp,myTag,upTag){
        var scaleX =0;
        var scaleY =0;
        if(upTag){
            scaleX = 1.1;
            scaleY = 1.1;
        }else{
            scaleX = 1.1;
            scaleY = 1.1;
        }

        this.noMove = true;
        //直接变化
        node.setScale(scaleX, scaleY)
        node.setPosition(ccp)
        
        node.runAction(cc.callFunc(function() {
            if (myTag) {
                this.initBaiPaiListX(upTag)
            }
        }, this))

        // node.runAction(
        //     cc.sequence(
        //         cc.spawn(cc.moveTo(runTime,ccp),cc.scaleTo(runTime,scaleX,scaleY)),                
        //         cc.delayTime(myTag?0.05:0.0),                
        //         cc.callFunc(function () {
        //             if(myTag){
        //                 this.initBaiPaiListX();
        //             }
        //         },this)
        //     )
        // );
    },

    //获取道列表
    getDaoPaiList:function(dao){
        var result = [];
        for (var i = 0; i < this.nodeHandList.childrenCount; ++i) {
            var node = cc.vv.utils.getChildByTag(this.nodeHandList,i);
            var card =  node.getComponent('SSZBaiPaiCard');
            if(card.getDao() == dao || dao == null){
                result.push(node);
            }
        }
        return result;
    },

    //获取道选中列表
    getSelectPaiList:function(selected){
        var result = [];
        for (var i = 0; i < this.nodeHandList.childrenCount; ++i) {
            var children = cc.vv.utils.getChildByTag(this.nodeHandList,i);
            var card =  children.getComponent('SSZBaiPaiCard');
            if(card.isSelect() == selected){
                result.push( children );
            }
        }
        return result;
    },

    //获取一道牌型
    getMeiYouHandPai:function(dao){
        var tanpai = [];
        var daoList = this.getDaoPaiList(dao);
        for(var j = 0;j < daoList.length;j++){
            var card =  daoList[j].getComponent('SSZBaiPaiCard');
            tanpai.push(card.getPai());
        }
        return tanpai;
    },

    //取消所有选择
    setAllCardUnSelected:function(){
        var daoList = this.getDaoPaiList(-1);
        for(var j = 0;j < daoList.length;j++){
            var card =  daoList[j].getComponent('SSZBaiPaiCard');
            //card.setSelect(0);
            this.selectCard(card,0);
        }
    },

    //所有能够组出来的牌型，来控制按钮状态
    updatePaiBtn:function(){

        var that = this;
        this.scheduleOnce(function(){

            var paiList = that.getMeiYouHandPai(-1);

            //根据手上的牌，算出可以组出的牌型
            that.paiListType = [0,0,0,0,0,0,0,0,0];

            if(paiList.length > 1){
                //取尾道
                that.sszGame.sszCardList.initData();
                that.sszGame.sszCardList.getCardTypeAi(paiList,that.paiListType,9999,(paiList.length>3)?1:3,0,true);                
                that.curGroupCardList = that.sszGame.sszCardList.curGroupCardList;
            }

            var children = that.nodePaiBtn.children;
            for (var i = 0; i < children.length; ++i) {
                children[i].getComponent(cc.Button).interactable = that.paiListType[that.paiListType.length-i-1]==1;
            }

        },0.0);
    },

    //检查特殊牌型
    checkSpecialCard:function(){

        var that = this;

        // 1.特殊牌型
        var SpCt_arr = [];
        for(var i = this.sszGame.Constants.length-1; i >= 0;i--){
            if(this.sszGame.Constants[i].SP){
                SpCt_arr.push([this.sszGame.Constants[i].CT_NO,false,this.sszGame.Constants[i].FD]);
            }            
        }

        this.nodeBaiPai.getChildByName("Func_btn").getChildByName("teshu").getComponent(cc.Button).interactable = false;

        //获取特殊牌
        if(this.sszGame.paixin){

            var baipaiHand = [];
            for(var i=0;i<13;i++){
                baipaiHand.push(this.baipaiHand[i]);
            }

            this.sszGame.sszCardList.initSpData();
            this.sszGame.sszCardList.getSpecialCardTypeAi(SpCt_arr,baipaiHand);

            // this.nodeBaiPai.getChildByName("Func_btn").getChildByName("teshu").getChildByName('texiao').stopAllActions();

            if(this.sszGame.sszCardList.spGroup.length != 0){
                
                this.nodeBaiPai.getChildByName("Func_btn").getChildByName("teshu").getComponent(cc.Button).interactable = true;
                
                that.onTeshuPaiClick();
                
                cc.vv.tip.show('已为您自动摆出特殊牌型');
    
                // this.nodeBaiPai.getChildByName("Func_btn").getChildByName("teshu").getChildByName('texiao').runAction(
                //     cc.repeatForever(
                //         cc.sequence(
                //             cc.delayTime(1.0),
                //             cc.scaleTo(0.1,1.0),
                //             cc.fadeIn(0.5),
                //             cc.show(),
                //             cc.spawn(
                //                 cc.fadeOut(0.5),
                //                 cc.scaleTo(0.5,3)
                //             ),
                //         )
                //     )
                // );

                var spcard = this.nodeBaiPai.getChildByName("Func_btn").getChildByName('spcard').getChildByName('name');
                spcard.getComponent(cc.Sprite).spriteFrame = this.sszGame.getSpCardTypeSpriteFrame(this.sszGame.sszCardList.spGroup[0][0]);

            }
        }
    },

    getTypePaiList:function(type){
        var paiList = this.getMeiYouHandPai(-1);
        var vecTDPai = [];
        for(var i= 0; i< this.curGroupCardList.length;i++){
            if(this.paiListType[i] == 1){
                var ct_no  = this.curGroupCardList[i][0];
                if(ct_no == type){
                    var result = this.curGroupCardList[i][1];
                    for(var j =0;j < result.length;j++){
                        vecTDPai.push(result[j]);
                    }       
                }        
            }
        }

        //如果与上次选择不动，从0开始
        var index = this.lastPaiList[1];
        if(this.lastPaiList[0] != type){
            index=0;
        }

        //到最后一个，从0开始
        if(index >= vecTDPai.length){
            index = 0;
        }

        var ret = index;
        this.lastPaiList[0] = type;
        this.lastPaiList[1] = ++index;

        return vecTDPai[ret];
    },

    //根据牌型选中牌
    onCardTypeClick:function(event,data){
        
        cc.vv.audioMgr.click();

        this.setAllCardUnSelected();

        var type = parseInt(data);
        var paiList = this.getTypePaiList(type);
        if(paiList==null || paiList.length == 0){
            return null;
        }

        var daoList = this.getDaoPaiList(-1);
        
        for(var i=0;i<paiList.length;i++){
            for(var j=0;j < daoList.length;j++){
                var card =  daoList[j].getComponent('SSZBaiPaiCard');
                if(paiList[i] == card.getPai() && !card.isSelect()){
                    //card.setSelect(1);
                    this.selectCard(card,1);
                    break;
                }
            }
        }
        return paiList;
    },
});