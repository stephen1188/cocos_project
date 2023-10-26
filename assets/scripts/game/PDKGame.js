
var US_NULL     =   0;
var US_READY    =   1;
var US_PLAY     =   2;

var SSZConst =  {
     CT_SINGLE		: 10,	  					//乌龙
	 CT_ONE_LONG	: 20,						//对子类型
	 CT_TOU_SHUN    : 30,						//头顺
	 CT_TOU_JIN		: 40,						//头金
	 CT_TWO_LONG	: 50,						//两对类型
	 CT_THREE_TIAO	: 60,						//三条类型
	 CT_SHUN_ZI		: 70,						//顺子类型
	 CT_TONG_HUA    : 80,						//同花类型
	 CT_HU_LU		: 90,						//葫芦类型
	 CT_TIE_ZHI		: 100,						//铁支类型
	 CT_TONG_HUA_SHUN :	110,					//同花顺型
	 CT_FIVE_TIAO	: 120,						//五同
	
	 CT_SIX_LONG    : 200,						//六对半
	 CT_THREE_SHUN  : 210,						//三顺子
	 CT_THREE_TONG  : 220,						//三同花
	 CT_FOUR_THREE  : 230,						//四套三条
	 CT_THREE_FEN   :240,						//三分天下
	 CT_THREE_TONGHUA : 250,					//三同花顺
	 CT_YITIAO_LONG : 260,						//一条龙
	 CT_QING_LONG	: 270                       //清龙
}

var Constants=[
    {CT_NO:10,AUDIO:"common1",CT_NAME:'乌龙',SP:false,FD:1,SD:1,TD:1},
    {CT_NO:20,AUDIO:"common2",CT_NAME:'对子',SP:false,FD:1,SD:1,TD:1},
    {CT_NO:30,AUDIO:"common5",CT_NAME:'头顺',SP:false,FD:1,SD:1,TD:1},
    {CT_NO:40,AUDIO:"common6",CT_NAME:'头金',SP:false,FD:1,SD:1,TD:1},
    {CT_NO:50,AUDIO:"common3",CT_NAME:'两对',SP:false,FD:1,SD:1,TD:1},
    {CT_NO:60,AUDIO:"common4",CT_NAME:'三条',SP:false,FD:3,SD:1,TD:1},
    {CT_NO:70,AUDIO:"common5",CT_NAME:'顺子',SP:false,FD:1,SD:1,TD:1},
    {CT_NO:80,AUDIO:"common6",CT_NAME:'同花',SP:false,FD:1,SD:1,TD:1},
    {CT_NO:90,AUDIO:"common7",CT_NAME:'葫芦',SP:false,FD:1,SD:2,TD:1},
    {CT_NO:100,AUDIO:"common8",CT_NAME:'铁支',SP:false,FD:1,SD:8,TD:4},
    {CT_NO:110,AUDIO:"common9",CT_NAME:'同花顺',SP:false,FD:1,SD:10,TD:5},
    {CT_NO:120,AUDIO:"common10",CT_NAME:'五同',SP:false,FD:1,SD:8,TD:4},

    //特殊牌型
    {CT_NO:200,AUDIO:"special4",CT_NAME:'六对半',SP:true,FD:4,SD:0,TD:0},
    {CT_NO:210,AUDIO:"special3",CT_NAME:'三顺子',SP:true,FD:4,SD:0,TD:0},
    {CT_NO:220,AUDIO:"special2",CT_NAME:'三同花',SP:true,FD:4,SD:0,TD:0},
    {CT_NO:230,AUDIO:"special6",CT_NAME:'四套三条',SP:true,FD:8,SD:0,TD:0},
    {CT_NO:240,AUDIO:"special10",CT_NAME:'三分天下',SP:true,FD:16,SD:0,TD:0},
    {CT_NO:250,AUDIO:"special11",CT_NAME:'三同花顺',SP:true,FD:18,SD:0,TD:0},
    {CT_NO:260,AUDIO:"special13",CT_NAME:'一条龙',SP:true,FD:26,SD:0,TD:0},
    {CT_NO:270,AUDIO:"special14",CT_NAME:'清龙',SP:true,FD:108,SD:0,TD:0},
];

var CardList = cc.Class({
    extends: cc.Node,
    properties: {

    },

    initData: function () {
        this.currentCardList = [];

        for(var i =0;i<9;i++){this.currentCardList[i] = [];};

        this.curGroupCardList = [];
        for(var i =0;i<9;i++){this.curGroupCardList[i] = [];};

        this.AiGroupList = [];
        this.spGroup = [];
        this.santonghuaTag = false;
        this.sanshunzhi = [];
    },

    initGroup:function(){
        this.currentCardList = [];
        for(var i =0;i<9;i++){this.currentCardList[i] = [];};

        this.curGroupCardList = [];
        for(var i =0;i<9;i++){this.curGroupCardList[i] = [];};
    },

    getAiGroup: function(){
        return this.AiGroupList;
    },

    RandCardList: function (cbCardBuffer, cbBufferCount) {
        var m_byPokerPai = [
            0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,	//方块 A - K
            0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,	//梅花 A - K
            0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,	//红桃 A - K
            0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,	//黑桃 A - K
        ];
        //混乱准备
        var m_byFetchPos = 0;
        var randseed1 = 0;
        var randseed2 = 0;
        for (var i = 0;i < 2000;i++)
        {
            randseed1 += randseed2;
            randseed2  =  Math.ceil(Math.random()*9999)+1;;
            var randPos1 = randseed1 % 52;
            var randPos2 = randseed2 % 52;

            var by1,by2;
            by1= m_byPokerPai[randPos1];
            by2= m_byPokerPai[randPos2];
            m_byPokerPai[randPos1] = by2;
            m_byPokerPai[randPos2] = by1;
        }

        //混乱扑克
        var bRandCount = 0, bPosition = 0;
        do
        {
            bPosition = (Math.ceil(Math.random()*9999)+1) % (52 - m_byFetchPos);
            cbCardBuffer[m_byFetchPos++] = m_byPokerPai[bPosition];
            m_byPokerPai[bPosition] = m_byPokerPai[52 - m_byFetchPos];
        } while (m_byFetchPos < cbBufferCount);

        return;
    },

    checkIsShunZi:function(arr){
        var flag = true;
        var _temp = [];
        for(var i = 0 ; i<arr.length ;i++){
            _temp.push(arr[i]%16);
        }

        _temp.sort(function(a,b){return a-b;})
            .forEach(function(a,b){ a == _temp[0]+b ? null : flag=false;});
        // 补充 AQK 和 A,10,J,Q,k 这种特殊情况
        if(!flag){
            if(arr.length == 3){
                if(_temp[0]==1 && _temp[1]==12 && _temp[2]==13){
                    flag = true;
                }
            }
    
            if(arr.length == 5){
                if(_temp[0]==1 && _temp[1]==10 && _temp[2]==11 && _temp[3]==12 && _temp[4]==13){
                    flag = true; 
                }
            }
        }
        return flag;
    },
    
    //返回清龙
    getQingLong:function(cards){
        var that = this;
        var result = [];
        var resultTemp = [];
        var colors = this.classifyCard(cards).colors;
        
        colors.forEach(function(data,i){
            if(data.length == 13){
                // 还原成点数
                var _tempData = data.map(function(a){ return i*16+a;});
                // 排列组合 data ,并 push 到结果 resultTemp 中
                resultTemp.push(_tempData);
            }
        });

        for(var i = 0; i< resultTemp.length ;i++){
            var _aa = resultTemp[i];
            var isShunzi = this.checkIsShunZi( _aa );
            if(isShunzi){
                result.push(_aa);
            }
        }

        return result;
    },

    //返回一条龙
    getYiTiaoLong:function(cards){
        var that = this;
        var result = [];

        if(cards.length == 13){
            var isShunzi = this.checkIsShunZi( cards );
            if(isShunzi){
                result.push(cards);
            }
        }
    
        return result;
    },

    //返回三分天下
    getSanFenTianXia:function(cards){
        var that = this;
        var result = [];
        var arrNum = [];
        if(cards.length == 13){
            var numbers = this.classifyCard(cards).numbers;
            numbers.forEach(function(data,i){
                if( data.length == 4){
                    arrNum.push(i);
                }
            });

            if(arrNum.length == 3){
                var vecTdPai = [];
                var vecSdPai = [];
                var vecFdPai = [];
                var iTd = -1;
                var iSd = -1;
                var iFd = -1;
                var iSg = -1;
                numbers.forEach(function(data,i){
                    if( data.length == 1){
                        iSg = i;
                    }
                });

                if(arrNum[0] == 1){ //A
                    iTd = arrNum[0];
                    iSd = arrNum[2];
                    iFd = arrNum[1];
                }
                else{
                    iTd = arrNum[2];
                    iSd = arrNum[1];
                    iFd = arrNum[0];
                }

                //尾道                    
                for(var i = 0; i < 4; i++){
                    vecTdPai.push(numbers[iTd][i] *16 +iTd);
                }
                //中道
                for(var i = 0; i < 4; i++){
                    vecSdPai.push(numbers[iSd][i] *16 +iSd);
                }
                //头道
                for(var i = 0; i < 3; i++){
                    vecFdPai.push(numbers[iFd][i] *16 +iFd);
                }
                
                vecSdPai.push(numbers[iFd][3] *16 +iFd);                
                vecTdPai.push(numbers[iSg][0] *16 +iSg);

                result.push(vecTdPai);
                result.push(vecSdPai);
                result.push(vecFdPai);
            }
        }

        return result;
    },

    //返回四套三条
    getSiTaoSanTiao:function(cards){
        var that = this;
        var result = [];
        var arrNum = [];
        if(cards.length == 13){
            var numbers = this.classifyCard(cards).numbers;
            numbers.forEach(function(data,i){
                if( data.length == 3){
                    arrNum.push(i);
                }
            })

            if(arrNum.length == 4){
                var vecTdPai = [];
                var vecSdPai = [];
                var vecFdPai = [];
                var iTd = -1;
                var iSd = -1;
                var iFd = -1;
                var iCf = -1;
                var iSg = -1;

                numbers.forEach(function(data,i){
                    if( data.length == 1){
                        iSg = i;
                    }
                });

                if(arrNum[0] == 1){ //A
                    iTd = arrNum[0];
                    iSd = arrNum[3];
                    iFd = arrNum[2];
                    iCf = arrNum[1];
                }
                else{
                    iTd = arrNum[3];
                    iSd = arrNum[2];
                    iFd = arrNum[1];
                    iCf = arrNum[0];
                }

                 //尾道                    
                for(var i = 0; i < 3; i++){
                    vecTdPai.push(numbers[iTd][i] *16 +iTd);
                }
                //中道
                for(var i = 0; i < 3; i++){
                    vecSdPai.push(numbers[iSd][i] *16 +iSd);
                }
                //头道
                for(var i = 0; i < 3; i++){
                    vecFdPai.push(numbers[iFd][i] *16 +iFd);
                }
                
                vecSdPai.push(numbers[iSg][0] *16 +iSg);   
                vecSdPai.push(numbers[iCf][0] *16 +iCf);
                vecTdPai.push(numbers[iCf][1] *16 +iCf);
                vecTdPai.push(numbers[iCf][2] *16 +iCf);
                result.push(vecTdPai);
                result.push(vecSdPai);
                result.push(vecFdPai);
            }
        }
    
        return result;
    },

    //返回六对半
    getLiuDuiBan:function(cards){
        var that = this;
        var result = [];
        var sum = 0;

        if(cards.length == 13){
            var numbers = this.classifyCard(cards).numbers;
            numbers.forEach(function(data,i){
                if( data.length == 2){
                    sum++;
                }else if(data.length == 3){
                    sum++;
                }else if(data.length == 4){
                    sum+=2;
                }else if(data.length == 5){
                    sum+=2;
                }
            })

            if(sum == 6){
                result.push(cards);
            }
        }
    
        return result;
    },

    //返回三同花顺
    getSanTongHuaShun:function(cards){
        var that = this;
        var myTag=false;

        //做次预判：必须要要有三同花        
        this.getSanTongHua(cards,0);
        if(!this.santonghuaTag){
            return [];
        }

        var result = this.getSanShunZi(cards);
        if(result.length == 0){
            return [];
        }
        
        //取所有的三顺子，来做同花判断
        for(var i = 0 ; i < this.sanshunzhi.length; i++){
            var shunzi =  this.sanshunzhi[i];
            var no = 0;

            for(var j=0; j < shunzi.length;j++ ){
                var colors = this.classifyCard(shunzi[j]).colors;
                var num = 0;
                for(var g = 0; g < colors.length ; g++){
                    if(colors[g].length > 0){
                        num++
                    }
                }

                if(num ==1){
                    no++;
                }
            }

            //获取到一个三同花顺
            if(no == 3){
                //做倒水比较
                var daoshui = false;
                if(!daoshui){
                    return shunzi;
                }                
            }
        }
    },

    //返回三同花
    getSanTongHua:function(cards,flag){
        var sanTongHua = [];
        //用于预判
        if(flag == 0){
            this.santonghuaTag = false;
            var iClosrNum = 0;
            var colors = this.classifyCard(cards).colors;
            //不能四种花色都存在,且花色数，只能是：13/10，3/8，5/5，5，3/
            for(var i=0;i<colors.length;i++){
                if(colors[i].length > 0){
                    iClosrNum++;
                }

                var limitNum = [1,2,4,6,7,9,11,12];
                //如果同花色，牌数为[1，2 ，4，6，7，9，10，11，12]，肯定不可能有三同花
                for(var j =0 ; j < limitNum.length; j++){
                    if(colors[i].length == limitNum[j]){
                        return [];
                    }
                }
            }

            if(iClosrNum ==4){
                return[];
            }

            this.santonghuaTag = true;
            return [];
        }
        else{
            //复用一下三同花预判
            if(!this.santonghuaTag){
                return[];
            }
            var colorsTmp = [];
            //花色数只有以下排列：13/10，3/8，5/5，5，3/
            var colors = this.classifyCard(cards).colors;
            colors.forEach(function(data,i){
                if(data.length > 0){
                    colorsTmp.push([data.length,i])                   
                }
            });

            var vecTdPai = [];
            var vecSdPai = [];
            var vecFdPai = [];
            
            //13
            if(colorsTmp.length == 1){
                var idx = cardstmp[0][1];
                var cardstmp =  [];
                
                for(var i = 0;i<colors[idx].length;i++){
                    cardstmp.push(idx*16 + colors[idx][i]);
                }
                
                this.setSanPai(cardstmp,SSZConst.CT_SINGLE,vecTdPai,5);
                this.setSanPai(cardstmp,SSZConst.CT_SINGLE,vecSdPai,5);
                this.setSanPai(cardstmp,SSZConst.CT_SINGLE,vecFdPai,3);
            }

            //10,3 及 8，5
            if(colorsTmp.length == 2){
                if(colorsTmp[0][0] == 10 || colorsTmp[0][0] == 3){
                    var idx10 = 0;
                    var idx3  = 0;

                    if(colorsTmp[0][0] == 10){                 
                        idx10 = colorsTmp[0][1];
                        //取尾道，中道
                        idx3  = colorsTmp[1][1];
                    }else{
                        idx10 = colorsTmp[1][1];
                        //取尾道，中道
                        idx3  = colorsTmp[0][1];
                    }
                    
                    var cards10 =  [];
                    var cards3  =  [];
                    for(var i = 0;i<colors[idx10].length;i++){
                        cards10.push(idx10*16 + colors[idx10][i]);
                    }

                    for(var i = 0;i<colors[idx3].length;i++){
                        cards3.push(idx3*16 + colors[idx3][i]);
                    }

                    this.setSanPai(cards10,SSZConst.CT_SINGLE,vecTdPai,5);
                    this.setSanPai(cards10,SSZConst.CT_SINGLE,vecSdPai,5);
                    this.setSanPai(cards3,SSZConst.CT_SINGLE,vecFdPai,3);
                }else{
                    var idx8  = 0;
                    var idx5  = 0;

                    if(colorsTmp[0][0] == 8){                 
                        idx8 = colorsTmp[0][1];
                        idx5  = colorsTmp[1][1];
                    }else{
                        idx8 = colorsTmp[1][1];      
                        idx5  = colorsTmp[0][1];
                    }
                    
                    var cards8 =  [];
                    var cards5 =  [];

                    for(var i = 0;i<colors[idx8].length;i++){
                        cards8.push(idx8*16 + colors[idx8][i]);
                    }

                    for(var i = 0;i<colors[idx5].length;i++){
                        cards5.push(idx5*16 + colors[idx5][i]);
                    }

                    this.setSanPai(cards8,SSZConst.CT_SINGLE,vecTdPai,5);
                    this.setSanPai(cards5,SSZConst.CT_SINGLE,vecSdPai,5);
                    this.setSanPai(cards8,SSZConst.CT_SINGLE,vecFdPai,3);
                }
            }

            //5,5,3
            if(colorsTmp.length == 3){
                var idx5_1 = -1;
                var idx5_2 = -1;
                var idx3 = -1;

                for(var i = 0; i < colorsTmp.length; i++){
                    if(colorsTmp[i][0] == 5){
                        if(idx5_1 == -1){
                            idx5_1 = colorsTmp[i][1];
                        }else{
                            idx5_2 = colorsTmp[i][1];
                        }
                    }
                    
                    if(colorsTmp[i][0] == 3){
                        idx3 = colorsTmp[i][1];
                    }
                }

                var cards5_1 = [];
                var cards5_2 = [];
                var cards3 = [];
                for(var i = 0;i<colors[idx5_1].length;i++){
                    cards5_1.push(idx5_1*16 + colors[idx5_1][i]);
                }

                for(var i = 0;i<colors[idx5_2].length;i++){
                    cards5_2.push(idx5_2*16 + colors[idx5_2][i]);
                }

                for(var i = 0;i<colors[idx3].length;i++){
                    cards3.push(idx3*16 + colors[idx3][i]);
                }

                this.setSanPai(cards5_1,SSZConst.CT_SINGLE,vecTdPai,5);
                this.setSanPai(cards5_2,SSZConst.CT_SINGLE,vecSdPai,5);
                this.setSanPai(cards3,SSZConst.CT_SINGLE,vecFdPai,3);
            }

            sanTongHua.push(vecTdPai);
            sanTongHua.push(vecSdPai);
            sanTongHua.push(vecFdPai);
            return sanTongHua;
        }
    },

    //返回三顺子
    getSanShunZi:function(cards){

        var vecSdPai = [];
        var vecFdPai = [];

        var vecTdPai = this.getShunzi(cards);
        if(vecTdPai.length <= 0){
            return [];
        }

        for(var i = 0; i < vecTdPai.length;i++){           
            var cardSD = [].concat(cards);
            this.arrRemove(cardSD,vecTdPai[i]);
            vecFdPai[i] = [];
            vecSdPai[i] = this.getShunzi(cardSD);
            if(vecSdPai[i].length <= 0){
                continue;
            }
                        
            for(var j = 0; j < vecSdPai[i].length;j++){
                var cardFD = [].concat(cardSD);
                this.arrRemove(cardFD,vecSdPai[i][j]);

                vecFdPai[i][j] = [];
                var isShunZi = this.checkIsShunZi(cardFD);
                if(!isShunZi){
                    continue;
                }
                vecFdPai[i][j] = [].concat(cardFD);                                
            }
        }

        //确定是否有三顺子
        for(var i = 0; i < vecFdPai.length; i++){
            for(var j = 0; j < vecFdPai[i].length; j++){
                //处理倒水情况                        
                if(vecFdPai[i][j].length > 0){
                    this.sanshunzhi.push([vecTdPai[i],vecSdPai[i][j], vecFdPai[i][j]]);
                }                                
            }
        }

        if(this.sanshunzhi.length > 0){
            return this.sanshunzhi[0];
        }
        else{
            return [];
        }
    },

    //返回五同
    getWuTong:function(cards){
        var result = [];
        var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if( data.length == 5){
                result.push([data[0]*16+i ,data[1]*16+i ,data[2]*16+i ,data[3]*16+i,data[4]*16+i]);
            }
        })
        return result;
    },

    //返回同花顺
    getTongHuaShun:function(cards){
        var result = [];
        var _tempResult = this.getTonghua(cards);
        for(var i = 0; i< _tempResult.length ;i++){
            var _aa = _tempResult[i];
            var isShunzi = this.checkIsShunZi( _aa );
            if(isShunzi){
                result.push(_aa);
            }
        }
        return result;
    },

    // 返回铁枝
    getTieZhi:function(cards){
        var result = [];
        var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if( data.length == 4){
                result.push([data[0]*16+i ,data[1]*16+i ,data[2]*16+i ,data[3]*16+i]);
            }
        })
        return result;
    },

    // 返回葫芦
    getHulu:function(cards){
        var that = this;
        var result = [];
        var sanTiao = this.getSantiao(cards);
        var duizi = this.getDuizi(cards);
        var _temp = [];
        // 如果三条和对子都存在
        if(sanTiao.length && duizi.length){
            _temp = that.combination2([sanTiao,duizi],2);
        }
        for(var i=0 ;i<_temp.length ;i++){
            if(_temp[i][0]%16 != _temp[i][4]%16){
                result.push(_temp[i]);
            }
        }
        return result;
    },

    // 返回同花
    getTonghua:function(cards){
        var that = this;
        var result = [];
        var resultTemp = [];
        var colors = this.classifyCard(cards).colors;
        
        colors.forEach(function(data,i){
            if(data.length > 4){
                // 还原成点数
                var _tempData = data.map(function(a){ return i*16+a;});
                // 排列组合 data ,并 push 到结果 resultTemp 中
                resultTemp.push( that.combination(_tempData ,5) );
            }
        });

        //为统一格式
        for(var i = 0; i<resultTemp.length;i++){
            for(var j =0;j<resultTemp[i].length;j++){
                result.push(resultTemp[i][j]);
            }
        }
       
        return result;
    },

    // 返回顺子
    getShunzi:function(cards){
        var that = this;
        var result = [];
        var resultTemp = [];
        var numbers = this.classifyCard(cards).numbers;
        var _tempArr = [];// [[],[i ,len ]],i前的 len 个连在一起
        var len = 0;
        numbers.push(numbers[1]); //将A复制到最后面来
        for(var i = 0;i<15;i++){
            if(numbers[i].length == 0){
                len > 4 ? _tempArr.push([i,len]):null;
                len = 0;
            }else{
                len++;
            }
            if( i==14 && len > 4 ){
                _tempArr.push([15,len]);
            }
        }

        // 第一层循环，所有连成片的
        for(var i = 0 ;i<_tempArr.length; i++){
            // 第二层，单个连片的;每次取出
            for(var j = 0;j<_tempArr[i][1]-4 ;j++){//每次取5个,j 表示分片起始位置
                var _aa = _tempArr[i][0] - _tempArr[i][1] + j;//记下 numbers 连续五组的起始点
                resultTemp.push(that.combination2([
                    numbers[_aa].map(function(a,i){return (_aa+a*16)}),
                    numbers[_aa+1].map(function(a,i){return (_aa+1)+a*16}),
                    numbers[_aa+2].map(function(a,i){return (_aa+2)+a*16}),
                    numbers[_aa+3].map(function(a,i){return (_aa+3)+a*16}),
                    numbers[_aa+4].map(function(a,i){return (((_aa+4) ==14)?1:(_aa+4))+a*16})],5));
            }
        }

        //为统一格式
        for(var i = 0; i<resultTemp.length;i++){
            for(var j =0;j<resultTemp[i].length;j++){
                result.push(resultTemp[i][j]);
            }
        }

        return result;
    },

    // 返回三条
    getSantiao:function(cards){
        var result = [];
        var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
        if( data.length == 3 ){
            result.push( [ data[0]*16+i ,data[1]*16+i ,data[2]*16+i] );
        }
        if( data.length == 4){
            result.push(
                [ data[0]*16+i ,data[1]*16+i ,data[2]*16+i],
                [ data[3]*16+i ,data[1]*16+i ,data[2]*16+i],
                [ data[0]*16+i ,data[1]*16+i ,data[3]*16+i],
                [ data[0]*16+i ,data[2]*16+i ,data[3]*16+i])
            }
        })

        return result;
    },

    //返回两对
    getLiangDui:function(cards){
        var result = [];
        var resultTemp = [];
        var duizi  = this.getDuizi(cards);
        var tmp = [];
        if(duizi.length >=2){
            resultTemp = this.combination(duizi,2);

            for(var i = 0; i < resultTemp.length; i++){
                var numList = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                for(var j=0;j<resultTemp[i].length;j++)
                {
                    var num = resultTemp[i][j]%16;
                    if(num == 1) {numList[0]++;}
                    if(num == 2) {numList[1]++;}
                    if(num == 3) {numList[2]++;}
                    if(num == 4) {numList[3]++;}
                    if(num == 5) {numList[4]++;}
                    if(num == 6) {numList[5]++;}
                    if(num == 7) {numList[6]++;}
                    if(num == 8) {numList[7]++;}
                    if(num == 9) {numList[8]++;}
                    if(num == 10) {numList[9]++;}
                    if(num == 11) {numList[10]++;}
                    if(num == 12) {numList[11]++;}
                    if(num == 13) {numList[12]++;}
                }

                var repeatTag = false;
                for(var k =0; k <13;k++){
                    if(numList[k] >=3)
                    {
                        repeatTag = true;
                        break;
                    }
                }

                if(!repeatTag){
                    result.push(resultTemp[i]);
                }
            }
        }

        return result;
    },

    // 返回对子
    getDuizi:function(cards){
        // @params: cards 为后台发回来的牌组
        // 长度判断，暂不做
        var result = [];
        var numbers = this.classifyCard(cards).numbers;
        // 得到对子
        numbers.forEach(function(data ,i){
            if( data.length == 2 ){
                // 表明有对子
                result.push( [ data[0]*16+i ,data[1]*16+i ] );
            }
            if( data.length == 3 ){
                result.push(
                    [ data[0]*16+i ,data[2]*16+i ],
                    [ data[0]*16+i ,data[1]*16+i ],
                    [ data[1]*16+i ,data[2]*16+i ]
                    );
            }
            if( data.length == 4 ){
                result.push(
                    [ data[0]*16+i ,data[1]*16+i ],
                    [ data[0]*16+i ,data[2]*16+i ],
                    [ data[0]*16+i ,data[3]*16+i ],
                    [ data[1]*16+i ,data[2]*16+i ],
                    [ data[1]*16+i ,data[3]*16+i ],
                    [ data[2]*16+i ,data[3]*16+i ]
                    );
            }}
        );
        
        return result;
    },

    // 排列组合
    combination:function(arr, num){
        var r=[];
        (function f(t,a,n){
            if (n==0)
            {
                return r.push(t);
            }
            for (var i=0,l=a.length; i<=l-n; i++)
            {
                f(t.concat(a[i]), a.slice(i+1), n-1);
            }
        })([],arr,num);
        return r;
    },

    // 畸形排列组合 --- 用于找顺子后的排列，包含同一点数不同花数
    combination2:function(arr, num){
        var r=[];
        (function f(t,a,n)
        {
            if (n==0)
            {
                return r.push(t);
            }
            for (var i=0,l=a.length; i<=l-n; i++)
            {
                for(var j=0;j<a[i].length ;j++){
                    f(t.concat(a[i][j]), a.slice(i+1), n-1);
                }
            }

        })([],arr,num);
        return r;
    },

    // 对牌进行分类
    classifyCard:function(cards){
        // 将牌进行排序分类
        // color 花色
        var colors = [
        // "黑":[],
        // "红":[],
        // "梅":[],
        // "方":[],
        // "0":[],"1":[],"2":[],"3":[]
        [],[],[],[]
        ];

        // number 点数
        var numbers = [
        // "0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[],"7":[],"8":[],"9":[],"10":[],"11":[],"12":[],"13":[]
        // 0,1,2,3,4,5,6,7,8,9,10,11,12,13
        // 注意 0 位是“无效的”，主要为因为有效牌是从1开始的
        [],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ];
        // 将牌分类;
        cards.forEach(function(card){
            // 获取花色 :0-3 为同一花色     
            var _color = parseInt(card / 16);
            // 获取点数 :1-13
            var _num = card%16;
           
            colors[_color].push(_num);
            numbers[_num].push(_color);
        });

        // 还原成牌的大小; 0-13 为同一花色的写法
        // colors[i][j] : card = i*16 + j;
        // numbers[i][j] : card = j*16 + i;

        return {"colors":colors,"numbers":numbers};
    },

    //排序
    SortCardList: function (cbCardData,cbCardCount) {
        //转换数值
        var cbLogicValue = new Array(cbCardData.length);
        for (var i = 0; i < cbCardCount; i++) cbLogicValue[i] = cbCardData[i]%16;

        //排序操作
        var bSorted = true;
        var cbTempData, bLast = (cbCardCount - 1);
        do
        {
            bSorted = true;
            for (var i = 0; i < bLast; i++)
            {
                if ((cbLogicValue[i] > cbLogicValue[i + 1]) ||
                    ((cbLogicValue[i] == cbLogicValue[i + 1])))
                {
                    //交换位置
                    cbTempData = cbCardData[i+1];
                    cbCardData[i+1] = cbCardData[i];
                    cbCardData[i] = cbTempData;
                    cbTempData = cbLogicValue[i+1];
                    cbLogicValue[i+1] = cbLogicValue[i];
                    cbLogicValue[i] = cbTempData;
                    bSorted = false;
                }
            }
            bLast--;
        } while (bSorted == false);
    },

    arrRemove:function(arrSrc,arrMove){
        if(arrMove.length > arrSrc.length){
            return;
        }

        for(var i =0; i<arrMove.length;i++){
            for(var j=0;j<arrSrc.length;j++){
                if(arrSrc[j] == arrMove[i]){
                    arrSrc.splice(j,1);
                    break;
                }
            }
        }
    },

    //为各牌型，补足散牌
    setSanPai:function(cardData,ct_no,vecPai,MaxNum){    
        var len = cardData.length;
        //已经有牌型，只需给最小的牌
        if(vecPai.length > 0){
            if(MaxNum == 5){
                if(vecPai.length == 5){
                    return true;
                }

                //对子  -- 加3张
                if(ct_no == SSZConst.CT_ONE_LONG){
                    var twoNum = vecPai[0]%16;
                    for(var i = len-1; i >= 0;i--){
                        if(cardData[i]%16 != twoNum){
                            var randomNum1 = cardData[i];
                            for(var g=len-1;g>=0;g--){
                                if(cardData[g]%16 != twoNum && cardData[g]%16 != randomNum1%16){
                                    var randomNum2 =cardData[g];
                                    for(var k=len-1;k >=0;k--){
                                        if(cardData[k]%16 != twoNum 
                                            && cardData[k]%16 != randomNum1%16 
                                            && cardData[k]%16 != randomNum2%16){
                                            var randomNum3 =cardData[k];
                                            vecPai.push(randomNum1);
                                            vecPai.push(randomNum2);
                                            vecPai.push(randomNum3);
                                            this.arrRemove(cardData,[randomNum1,randomNum2,randomNum3]);
                                            return true;  
                                        }                                        
                                    }                                                                      
                                }
                            }
                        }
                    }
                }

                //两对  -- 加1张
                if(ct_no == SSZConst.CT_TWO_LONG){
                    for(var i = len-1; i >= 0;i--){
                        if(cardData[i]%16 != vecPai[0]%16 && cardData[i]%16 != vecPai[1]%16
                        && cardData[i]%16 != vecPai[2]%16 && cardData[i]%16 != vecPai[3]%16){
                            vecPai.push(cardData[i]);
                            this.arrRemove(cardData,[cardData[i]]);
                            return true;
                        }
                    }
                }

                //三条  -- 加2张
                if(ct_no == SSZConst.CT_THREE_TIAO){
                    for(var i = len-1; i >= 0;i--){
                        if(cardData[i]%16 !=vecPai[0]%16)
                        {
                            var randomNum1 = cardData[i];
                            for(var g=len-1;g>=0;g--){
                                if(cardData[g]%16 !=vecPai[0]%16 && cardData[g]%16 != randomNum1%16){
                                    var randomNum2 =cardData[g];
                                    vecPai.push(randomNum1);
                                    vecPai.push(randomNum2);
                                    this.arrRemove(cardData,[randomNum1,randomNum2]);
                                    return true;                                    
                                }
                            }
                        }
                    }
                }

                //铁枝  -- 加1张
                if(ct_no == SSZConst.CT_TIE_ZHI){
                    for(var i = len-1; i >= 0;i--){
                        if(cardData[i]%16 != vecPai[0]%16){
                            vecPai.push(cardData[i]);
                            this.arrRemove(cardData,[cardData[i]]);
                            return true;
                        }
                    }   
                }
            }else{

                if(vecPai.length == 3){
                    return true;
                }

                //对子  -- 加1张
                if(ct_no == SSZConst.CT_ONE_LONG){
                    for(var i = len-1; i >= 0;i--){
                        if(cardData[i]%16 != vecPai[0]%16){
                            vecPai.push(cardData[i]);
                            this.arrRemove(cardData,[cardData[i]]);
                            return true;
                        }
                    }
                }
            }

            return false;
        }
        else{
            //给乌龙
            if(MaxNum == 5){
                //取最大一个
                vecPai[0] = cardData[0];
                //取最小的4个
                vecPai[1] = cardData[len-4];
                vecPai[2] = cardData[len-3];
                vecPai[3] = cardData[len-2];
                vecPai[4] = cardData[len-1];
            }else{
                //取最大一个
                vecPai[0] = cardData[0];
                //取最小的2个
                vecPai[1] = cardData[len-2];
                vecPai[2] = cardData[len-1];
            }

            this.arrRemove(cardData,vecPai);
            return true;            
        }        
    },

    /*
    checkSanPai:function(cardData,ct_no,vecPai,MaxNum){    
        
    },    
    //乌龙牌的优化算法，未完成
    setSanPaiEx:function(cardData,groupNode){
        //删除所已经选择的牌
        for(var i = 0; i < groupNode.length; i++){
            this.arrRemove(cardData,groupNode[i][1]);
        }
        var vecUsedArrTD = [];
        //根据需要的牌的数量，枚举出所有的牌
        //尾道                   
        var needNum = 5 - groupNode[0][1].length;
        if(needNum > 0){
            var vecSanPai = combination(cardData,needNum);
            for(var j =0; j < vecSanPai.length; j++){
                var usedTag = this.checkSanPai(vecSanPai[j],groupNode[0][0],groupNode[0][1],5);
                vecUsedArr[0].push([vecUsedArr[0],[false,vecSanPai[j]]]);
            }
        }
    },
    */

    /*
    *   cardData: 牌，typeArray：类型标识数组，last_CTNo：上一道牌的类型，
        daoType：第几道，xuanpaiType：0:传统选牌，1：智能选派
    **
    */
    //普通牌型智能算法
    getCardTypeAi:function(cardData,typeArray,last_CTNo,daoType,xuanpaiType){
        var result = null;
        var ct_arr = [];
                
        for(var i = 0; i < Constants.length;i++){
            ct_arr.push([Constants[i].CT_NO,false]);
        }

        for(var i =0; i< ct_arr.length;i++){
            if(ct_arr[i][0] <= last_CTNo){
                ct_arr[i][1] = true;
            }
        }

        this.SortCardList(cardData,cardData.length);

        for(var i = ct_arr.length-1; i >= 0;i--){
            if(!ct_arr[i][1]){
                continue;
            }
            
            switch(ct_arr[i][0]){
                case SSZConst.CT_SINGLE: //乌龙
                    break;
                case SSZConst.CT_ONE_LONG://对子
                    if(xuanpaiType == 1){
                        //智能选派时，如果该组牌，能选择“两对”以上的牌型，那么对子就不在选择范围内
                        var sumNum = 0;
                        for(var j =0; j < 7;j++){
                            if(typeArray[j] ==1){
                                sumNum++;
                            }
                        }

                        if(sumNum >0){
                            break;
                        }
                    }

                    result = this.getDuizi(cardData);                    
                    if(result != null && result.length > 0){                    
                        this.curGroupCardList[8] = [20,result];
                        typeArray[8] = 1;
                    }
                    break;
                case SSZConst.CT_TOU_SHUN://头顺
                case SSZConst.CT_TOU_JIN: //头金
                    break;

                case SSZConst.CT_TWO_LONG://两对
                    if(daoType != 3){
                        result = this.getLiangDui(cardData);
                        if(result != null && result.length > 0){
                            this.curGroupCardList[7] = [50,result];
                            typeArray[7] = 1;
                        }
                    }
                    break;
                case SSZConst.CT_THREE_TIAO://三条                    
                    result = this.getSantiao(cardData);
                    if(result != null && result.length > 0){
                        this.curGroupCardList[6] = [60,result];
                        typeArray[6] = 1;
                    }
                    break;
                case SSZConst.CT_SHUN_ZI: //顺子
                    if(daoType != 3){
                        result = this.getShunzi(cardData);
                        if(result != null && result.length > 0){
                            this.curGroupCardList[5] = [70,result];
                            typeArray[5] = 1;
                        }
                    }           
                    break;         
                case SSZConst.CT_TONG_HUA://同花
                    if(daoType != 3){
                        result = this.getTonghua(cardData);
                        if(result != null && result.length > 0){
                            this.curGroupCardList[4] = [80,result];
                            typeArray[4] = 1;
                        }
                    }
                    break;
                case SSZConst.CT_HU_LU://葫芦
                    if(daoType != 3){
                        result = this.getHulu(cardData);
                        if(result != null && result.length > 0){
                            this.curGroupCardList[3] = [90,result];
                            typeArray[3] = 1;
                        }
                    }
                    break;
                case SSZConst.CT_TIE_ZHI://铁支
                    if(daoType != 3){
                        result = this.getTieZhi(cardData);
                        if(result != null && result.length > 0){
                            this.curGroupCardList[2] = [100,result];
                            typeArray[2] = 1;
                        }
                    }
                    break;
                case SSZConst.CT_TONG_HUA_SHUN://同花顺
                    if(daoType != 3){
                        result = this.getTongHuaShun(cardData);
                        if(result != null && result.length > 0){
                            this.curGroupCardList[1] = [110,result];
                            typeArray[1] = 1;
                        }
                    }
                    break;
                case SSZConst.CT_FIVE_TIAO://五同
                    if(daoType != 3){
                        result = this.getWuTong(cardData);
                        if(result != null && result.length > 0){
                            this.curGroupCardList[0]=[120,result];
                            typeArray[0] = 1;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    },

    vecPush: function(group,vecPai){
        var vec = [];
        vec[0] = vecPai[0];
        vec[1] = [].concat(vecPai[1]);
        group.push(vec);
    },

    //特殊牌型智能算法
    getSpecialCardTypeAi:function(ct_arr,cardData){
        var result = null;
        var iTag = false;
        if(this.spGroup.length > 0){
            return;
        }

        this.SortCardList(cardData,cardData.length);

        for(var i = 0; i < ct_arr.length;i++){
            var iTag = false;
            switch(ct_arr[i][0]){
                case SSZConst.CT_QING_LONG: //清龙
                    //var qinglong = [17,18,19,20,21,22,23,24,25,26,27,29,28];
                    //var qinglong = [1,18,19,20,21,22,23,24,25,26,27,29,28];//错误的
                    result = this.getQingLong(cardData);
                    break;
                case SSZConst.CT_YITIAO_LONG: //一条龙
                    //var yitiaolong = [17,2,3,4,5,6,7,8,9,10,11,12,13];
                    //var yitiaolong = [2,2,3,4,5,6,7,8,9,10,11,12,13];//错误的
                    result = this.getYiTiaoLong(cardData);
                    break;
                case SSZConst.CT_THREE_TONGHUA: //三同花顺
                    result = this.getSanTongHuaShun(cardData);
                    iTag = true;
                    break;
                case SSZConst.CT_THREE_FEN://三分天下
                    //var sanfentianxia = [1,33,17,49,34,2,18,50,3,35,19,51,4];
                    //var sanfentianxia = [1,33,17,49,34,2,18,50,3,35,19,51,4];//错误的
                    result = this.getSanFenTianXia(cardData);
                    iTag = true;
                    break;
                case SSZConst.CT_FOUR_THREE://四套三条
                    //var sitaosantiao = [1,17,33,2,18,34,3,19,35,4,20,36,5];
                    result = this.getSiTaoSanTiao(cardData);
                    iTag = true;
                    break;
                case SSZConst.CT_THREE_TONG://三同花
                    result = this.getSanTongHua(cardData,1);
                    iTag = true;
                    break;
                case SSZConst.CT_THREE_SHUN://三顺子                                                                                       
                    result = this.getSanShunZi(cardData); 
                    iTag = true;                           
                    break;
                case SSZConst.CT_SIX_LONG://六对半
                    //var niuduiban = [1,17,2,18,3,19,4,20,5,21,6,22,23];
                    result = this.getLiuDuiBan(cardData);
                    break;
                default:
                    break;
            }

            if(result != null && result.length > 0){
                ct_arr[i][1] = true;
                if(!iTag){
                    this.spGroup.push([ct_arr[i][0],[cardData[8],cardData[9],cardData[10],cardData[11],cardData[12]]]);
                    this.spGroup.push([ct_arr[i][0],[cardData[3],cardData[4],cardData[5],cardData[6],cardData[7]]]);
                    this.spGroup.push([ct_arr[i][0],[cardData[0],cardData[1],cardData[2]]]);
                }
                else{
                    this.spGroup.push([ct_arr[i][0],result[0]]);
                    this.spGroup.push([ct_arr[i][0],result[1]]);
                    this.spGroup.push([ct_arr[i][0],result[2]]);
                }                
                break;
            }
        }           
    },

    //智能组牌
    SortCardTypeGroupAi:function(cardData,spWanfa){
        var groupList = [];
        //1.特殊牌型
        var SpCt_arr = [];
        for(var i = Constants.length-1; i >= 0;i--){
            SpCt_arr.push([Constants[i].CT_NO,false]);
        }

        if(spWanfa){
            this.getSpecialCardTypeAi(SpCt_arr,cardData);
            for(var i = 0; i < SpCt_arr.length;i ++){
                if(SpCt_arr[i][1]){
                    this.AiGroupList.push(this.spGroup);
                    break;
                }
            }
        }

        //2.普通牌型
        var typeArray = [0,0,0,0,0,0,0,0,0];
        //推荐牌型最大个数
        var maxTuijianNo = 5;
        this.vecFDPai = []; //头道
        this.vecSDPai = []; //中道
        this.vecTDPai = []; //尾道

        //取尾道
        this.getCardTypeAi(cardData,typeArray,9999,1,1);
        for(var i= 0; i< this.curGroupCardList.length;i++){
            if(typeArray[i] == 1){
                var ct_no  = this.curGroupCardList[i][0];
                var result = this.curGroupCardList[i][1];
                for(var j =0;j < result.length;j++){
                    this.vecTDPai.push([ct_no,result[j]]);
                }                
            }
        }

        for(var i= 0; i< this.vecTDPai.length;i++){
            //去掉尾道数据,剩余8张牌
            var card8 = [].concat(cardData);
            this.arrRemove(card8,this.vecTDPai[i][1]);

            //剩余的8张牌，重新取中道的数据
            this.vecSDPai[i] = [];
            this.vecFDPai[i] = [];
            var lastDaoType = this.vecTDPai[i][0]; //用于牌型倒水的判断
            this.initGroup();
            typeArray = [0,0,0,0,0,0,0,0,0];
            
            this.getCardTypeAi(card8,typeArray,lastDaoType,2,1);
            
            //取中道
            for(var j=0;j < this.curGroupCardList.length;j++){
                if(typeArray[j] == 1){
                    var ct_no = this.curGroupCardList[j][0];
                    var result = this.curGroupCardList[j][1];
                
                    for(var k = 0; k < result.length;k++){
                        //中道与尾道，牌型相同，做倒水判断
                        if(ct_no == lastDaoType){
                            var ret = this.CompareSameCtCard(result[k],this.vecTDPai[i][1],ct_no);
                            if(ret==2){
                                continue;
                            }
                        }
                        this.vecSDPai[i].push([ct_no,result[k]]);                            
                    }   
                }
            }

            for(var g=0;g<this.vecSDPai[i].length;g++){
                //从牌中去掉中道的数据，剩余的3张为尾道
                var card3 = [].concat(card8);
                this.arrRemove(card3,this.vecSDPai[i][g][1]);
                this.vecFDPai[i][g] = [];

                this.initGroup();
                typeArray = [0,0,0,0,0,0,0,0,0];
                this.getCardTypeAi(card3,typeArray,this.vecSDPai[i][g][0],3,1);

                //取头道
                for(var j=0;j < this.curGroupCardList.length;j++){
                    if(typeArray[j] == 1){
                        var ct_no = this.curGroupCardList[j][0];
                        var result = this.curGroupCardList[j][1];                                             
                        for(var k = 0; k < result.length;k++){
                            //头道与中道，牌型相同，做倒水判断
                            var ret = this.CompareSameCtCard(result[k],this.vecSDPai[i][g][1],ct_no);
                            if(ret==2){
                                continue;
                            }
                            this.vecFDPai[i][g].push([ct_no,result[k]]);                            
                        }                        
                    }          
                }
            }                                
        }
        
        //组排
        var ctArrList = [];//保存每道的类型

        for(var i = 0; i<this.vecTDPai.length;i++){
            if(this.vecSDPai[i].length > 0){
                for(var j=0;j<this.vecSDPai[i].length;j++){
                    if(this.vecFDPai[i][j].length > 0){
                        for(var k = 0; k < this.vecFDPai[i][j].length;k ++){    
                            var group = [];
                            this.vecPush(group,this.vecTDPai[i]);
                            this.vecPush(group,this.vecSDPai[i][j]);
                            this.vecPush(group,this.vecFDPai[i][j][k]);
                            groupList.push(group);                            
                            ctArrList.push([false,[group[0][0],group[1][0],group[2][0]]]);
                        }
                    }
                    else{
                        var group = [];
                        this.vecPush(group,this.vecTDPai[i]);
                        this.vecPush(group,this.vecSDPai[i][j]);
                        group.push([10,[]]); 
                        groupList.push(group);
                        ctArrList.push([false,[group[0][0],group[1][0],group[2][0]]]);
                    }
                }
            }
            else{
                var group = [];
                this.vecPush(group,this.vecTDPai[i]);
                group.push([10,[]]);
                group.push([10,[]]); 
                groupList.push(group);
                ctArrList.push([false,[group[0][0],group[1][0],group[2][0]]]);
            }
        }

        //挑牌，第一次：三道进行比较，如果三道类型都相同，挑选出最大组
        //分组
        var vecMaxGroupId = [];
        for(var i = 0; i<ctArrList.length;i++){
            var ctNode = ctArrList[i];
            if(ctNode[0]){
                continue;
            }

            //比较同一种类型
            var maxid = i;
            ctNode[0] = true;

            for(var j=0;j<ctArrList.length;j++){
                if(ctArrList[j][0]){
                    continue;
                }
                
                //比较
                if(ctNode[1][0] != ctArrList[j][1][0] 
                    || ctNode[1][1] != ctArrList[j][1][1] 
                    || ctNode[1][2] != ctArrList[j][1][2]){
                    continue;
                }

                ctArrList[j][0] = true;
                //在牌型相同的情况下，考虑的优先级：头道，中道，尾道
                //头道比较
                var ret2 = this.CompareSameCtCard(groupList[maxid][2][1],groupList[j][2][1],ctNode[1][2]);
                if(ret2 == 2){
                    continue;
                }
                else if(ret2 == 0){
                    //中道比较
                    var ret1 = this.CompareSameCtCard(groupList[maxid][1][1],groupList[j][1][1],ctNode[1][1]);
                    if(ret0 == 2){
                        continue;
                    }
                    else if(ret0 == 0){
                        //尾道比较
                        var ret0 = this.CompareSameCtCard(groupList[maxid][0][1],groupList[j][0][1],ctNode[1][0]);
                        if(ret0  == 2){
                            continue;
                        }
                        else{
                            maxid = j
                        }                        
                    }else{
                        maxid = j;
                    }
                }
                else{
                    maxid = j;
                }
            }

            //取到该类型的最大数  maxid,是否比较过，是否剔除
            vecMaxGroupId.push([maxid,false,false,0]);
        }

        //挑牌，第二次：三道进行比较，按尾道，中道，头道顺序，前几道相同，后面道,一组道是非乌龙，一组乌龙，丢弃乌龙组
        for(var i = 0; i < vecMaxGroupId.length;i++){
            var maxidF = vecMaxGroupId[i][0];
            var maxGroupF  = ctArrList[maxidF][1];
            //已经比较过了
            if(vecMaxGroupId[i][1]){
                continue;
            }
            vecMaxGroupId[i][1] = true;
            
            for(var j = 0; j < vecMaxGroupId.length;j++){
                if(vecMaxGroupId[j][1]){
                    continue;
                }
                var maxidS = vecMaxGroupId[j][0];
                var maxGroupS = ctArrList[maxidS][1];
                for(var k=0; k<3;k++){
                    if(maxGroupF[k] == maxGroupS[k]){
                        continue;
                    }
                    else{
                        var myTag = false;
                        if(maxGroupF[k] != 10 && maxGroupS[k] != 10){
                            myTag = true;
                        }else{
                            if(maxGroupF[k] == 10){
                                vecMaxGroupId[i][2] = true;   
                                myTag = true;                         
                            }

                            if(maxGroupS[k] == 10){
                                vecMaxGroupId[j][1] = true;
                                vecMaxGroupId[j][2] = true;
                                myTag = true;
                            }
                        }
                        
                        if(myTag){
                            break;
                        }
                    }
                }    
            }
            
        }

        //第三次挑牌，进行排序，按照牌型数量，以及各道牌型的比较,通比
        //通比，算分
        for(var i =0; i < vecMaxGroupId.length;i++){
            //因乌龙，被剔除
            if(vecMaxGroupId[i][2]){
                continue;
            }

            for(j = i+1 ; j < vecMaxGroupId.length ; j++){
                if(vecMaxGroupId[j][2]){
                    continue;
                }

                var iLast = vecMaxGroupId[i][0];
                var iNext =  vecMaxGroupId[j][0];

                var sum = this.CompareGroup(groupList[iLast],groupList[iNext]);
                vecMaxGroupId[i][3] += sum;
                vecMaxGroupId[j][3] -= sum;
            }
        }

        //排序
        var bSorted = true;
        var cbTempData, bLast = (vecMaxGroupId.length - 1);
        do
        {
            bSorted = true;
            for (var i = 0; i < bLast; i++)
            {
                if (vecMaxGroupId[i][3] < vecMaxGroupId[i+1][3]
                    || vecMaxGroupId[i][3] == vecMaxGroupId[i+1][3])
                {
                    //交换位置
                    cbTempData =[].concat(vecMaxGroupId[i+1]);
                    for(var k = 0; k < vecMaxGroupId[i].length;k++){
                        vecMaxGroupId[i+1][k] = vecMaxGroupId[i][k];
                    }

                    for(var k = 0; k < vecMaxGroupId[i].length;k++){
                        vecMaxGroupId[i][k] = cbTempData[k];
                    }
                    bSorted = false;
                }
            }
            bLast--;
        } while (bSorted == false);

        //取前四个
        var selNum =0;
        for(var i =0; i < vecMaxGroupId.length;i++){
            if(vecMaxGroupId[i][2]){
                continue;
            }
            if(selNum >3){
                //因乌龙，被剔除
                vecMaxGroupId[i][2] = true;
            }else{
                selNum ++;
            }
        }

        //填牌
        if(vecMaxGroupId.length <= 0){ //如果尾道没有牌型，给乌龙（包括尾道，中道，和头道）
            var cardTD =  [].concat(cardData);
            var group = [];
  
            //取尾道乌龙
            var vec = [10,[]];
            this.setSanPai(cardTD,vec[0],vec[1],5);
            group.push(vec);

            //取中道乌龙
            vec = [10,[]];
            this.setSanPai(cardTD,vec[0],vec[1],5);
            group.push(vec);
 
            //取头道乌龙
             var vec = [10,[]];
            this.setSanPai(cardTD,vec[0],vec[1],3);
            this.AiGroupList.push(group);
        }
        else{
            for(var i =0;i<vecMaxGroupId.length;i++){
                //因乌龙，被剔除
                if(vecMaxGroupId[i][2]){
                    continue;
                }

                var idx = vecMaxGroupId[i][0];

                var group = groupList[idx];

                //清除尾道数据
                var cardTD = [].concat(cardData);
                
                //删除已选牌
                for(var x = 0;x < group.length;x++){
                    if(group[x].length > 0){
                        if(group[x][1].length > 0){
                            this.arrRemove(cardTD,group[x][1]);
                        }
                    }
                }

                //填牌
                var iTag = true;
                var iTagNum = 0;
                for(var x = 0;x < group.length;x++){
                    iTag = this.setSanPai(cardTD,group[x][0],group[x][1], x >1?3:5);
                    if(!iTag){
                        iTagNum++;
                    }
                }

                if(iTagNum ==0){
                    this.AiGroupList.push(group);
                }
                
            }
        }
    },

    getCardTypeFenEx: function(card_type,daotype){
        for(var i =0;i<Constants.length;i++){
            if(Constants[i].CT_NO == card_type){
                if(daotype == 0){
                    return  Constants[i].TD;
                }
                else if(daotype == 1){
                    return  Constants[i].SD;
                }
                else{
                    return  Constants[i].FD;
                }
            }
        }
    },

    CompareGroup:function(cbFistGroup,cbNextGroup){
        var sum = 0;
        for(var i = 0 ; i < 3;i++){
            
            var cbFirstType = cbFistGroup[i][0];
            var cbNextType  = cbNextGroup[i][0];
            var fen = 0;
            var myTag = 0;

            //大
            if(cbFirstType > cbNextType){
                fen = this.getCardTypeFenEx(cbFirstType,i);
                myTag = 2
            }

            //小
            if(cbFirstType<cbNextType){
                fen = this.getCardTypeFenEx(cbNextType,i);
                myTag = 1;
            }

            if(cbFirstType == cbNextType){
                //比较牌
                fen = this.getCardTypeFenEx(cbNextType,i);
                myTag = this.CompareSameCtCard(cbFistGroup[i][1],cbNextGroup[i][1],cbNextType);
            }

            
            if(myTag == 2){
                sum += fen;
            }else if(myTag == 1){
                sum -= fen;
            }
            else{
                sum += 0;
            }
        }
        return sum;
    },

    CompareSameCtCard:function(cbFirstData,cbNextData,cbType){       
        //分析扑克,保证牌是从大到小，经过排序
        var AnalyseResultFirst =this.AnalysebCardData(cbFirstData);
        var AnalyseResultNext = this.AnalysebCardData(cbNextData);
        //取牌数最小的
        var cbCardCount =  cbFirstData.length > cbNextData.length?cbFirstData.length:cbNextData.length;

       //简单类型
        switch(cbType){
            case SSZConst.CT_SINGLE:	//乌龙
            {           
                //对比数值
                for (var i=0;i<cbCardCount;i++){
                    var cbNextValue=AnalyseResultNext.cbLogicValue[0];
                    var cbFirstValue=AnalyseResultFirst.cbLogicValue[0];
                    if(cbFirstValue != cbNextValue){
                        return (cbFirstValue > cbNextValue)?2:1;
                    }
                    continue;
                }

                return 0;
            }
            case SSZConst.CT_ONE_LONG:		//对子
            case SSZConst.CT_TWO_LONG:		//两对
            case SSZConst.CT_THREE_TIAO:	//三条
            case SSZConst.CT_TIE_ZHI:		//铁支
            case SSZConst.CT_HU_LU:		    //葫芦
            {
                //四条数值
                if (AnalyseResultFirst.cbFourCount>0){
                    var cbNextValue=AnalyseResultNext.cbFourLogicVolue[0];
                    var cbFirstValue=AnalyseResultFirst.cbFourLogicVolue[0];

                    //比较四条
                    if(cbFirstValue != cbNextValue)return (cbFirstValue > cbNextValue)?2:1;

                    //比较单牌
                    cbFirstValue = AnalyseResultFirst.cbSignedLogicVolue[0];
                    cbNextValue = AnalyseResultNext.cbSignedLogicVolue[0];
                    if(cbFirstValue != cbNextValue){
                        return (cbFirstValue > cbNextValue)?2:1;
                    }             
                    return 0;
                }

                //三条数值
                if (AnalyseResultFirst.cbThreeCount>0){
                    var cbNextValue=AnalyseResultNext.cbThreeLogicVolue[0];
                    var cbFirstValue=AnalyseResultFirst.cbThreeLogicVolue[0];

                    //比较三条
                    if(cbFirstValue != cbNextValue){
                        return (cbFirstValue > cbNextValue)?2:1;
                    }

                    //葫芦牌型
                    if(SSZConst.CT_HU_LU == cbType){
                        //比较对牌
                        cbFirstValue = AnalyseResultFirst.cbLONGLogicVolue[0];
                        cbNextValue = AnalyseResultNext.cbLONGLogicVolue[0];
                        if(cbFirstValue != cbNextValue){
                            return (cbFirstValue > cbNextValue)?2:1;
                        }
                        return 0;
                    }
                    else {//三条带单
                        //比较单牌
                        for (var i =0;i<AnalyseResultFirst.cbSignedCount;i++){
                            var cbNextValue2=AnalyseResultNext.cbSignedLogicVolue[i];
                            var cbFirstValue2=AnalyseResultFirst.cbSignedLogicVolue[i];
                            if(cbFirstValue2 != cbNextValue2){
                                return (cbFirstValue2 > cbNextValue2)?2:1;
                            }                  
                        }
                        return 0;                        
                    }
                }

                //对子数值
                for (var i=0;i<AnalyseResultFirst.cbLONGCount;i++){
                    var cbNextValue=AnalyseResultNext.cbLONGLogicVolue[i];
                    var cbFirstValue=AnalyseResultFirst.cbLONGLogicVolue[i];
                    if(cbFirstValue != cbNextValue){
                        return (cbFirstValue > cbNextValue)?2:1;
                    }
                }


                //比较单牌
                for (i=0;i<AnalyseResultFirst.cbSignedCount;i++){
                    var cbNextValue=AnalyseResultNext.cbSignedLogicVolue[i];
                    var cbFirstValue=AnalyseResultFirst.cbSignedLogicVolue[i];
                    if(cbFirstValue != cbNextValue){
                        return (cbFirstValue > cbNextValue)?2:1;
                    }
                }
                return 0;
            }
            case SSZConst.CT_SHUN_ZI:		//顺子
            case SSZConst.CT_TONG_HUA_SHUN:	//同花顺
            {
                //数值判断
                var cbNextValue= AnalyseResultNext.cbLogicValue[0];
                var cbFirstValue= AnalyseResultFirst.cbLogicValue[0];

                // 14,5,4,3,2 5+9 = 14  小顺子
                var bFirstmin = (cbFirstValue == (AnalyseResultFirst.cbLogicValue[1] + 9));
                var bNextmin = (cbNextValue == (AnalyseResultNext.cbLogicValue[1] + 9));

                var bFirstMax = (13 == AnalyseResultFirst.cbLogicValue[1]);
                var bNextMax  = (13 == AnalyseResultNext.cbLogicValue[1]);

                //大小顺子
                if(bFirstmin　== true){
                    if(bNextMax == true){
                        return 1;
                    }

                    if(bNextMax != true && bNextmin != true){
                        return 2;
                    }             
                }
                
                if(bNextmin == true){
                    if(bFirstMax == true){
                        return 2;
                    }

                    if(bFirstMax != true && bFirstmin != true){
                        return 1;
                    }   
                }

                for(var i =0; i<cbCardCount;i++){
                    cbNextValue = AnalyseResultNext.cbLogicValue[i];
                    cbFirstValue = AnalyseResultFirst.cbLogicValue[i];
                
                    if(cbFirstValue != cbNextValue){
                        return (cbFirstValue > cbNextValue)?2:1;
                    }                    
                }

                return 0;
            }
            case SSZConst.CT_TONG_HUA:		//同花
            {
                //散牌数值
                for (var i=0;i<cbCardCount;i++){
                    var cbNextValue = AnalyseResultNext.cbLogicValue[i];
                    var cbFirstValue=AnalyseResultFirst.cbLogicValue[i];

                    if(cbFirstValue != cbNextValue)
                        return (cbFirstValue > cbNextValue)?2:1;
                }
                //平
                return 0;
            }
        }
    },
    
    CompareCard: function (cbFirstData,cbNextData) {
        //获取类型
        var cbNextType=this.GetCardType(cbNextData,cbNextData.length);
        var cbFirstType=this.GetCardType(cbFirstData,cbFirstData.length);

        //类型判断
        //大
        if(cbFirstType>cbNextType)
            return 2;

        //小
        if(cbFirstType<cbNextType)
            return 1;

        return CompareSameCtCard(cbFirstData,cbNextData,cbFirstType);
    },
    
    GetCardType: function (cbCardData,cbCardCount) {
        //变量定义
        var cbSameColor=true,bLineCard=true;
        var cbFirstColor=this.GetCardColor(cbCardData[0]);
        var cbFirstValue=this.GetCardLogicValue(cbCardData[0]);

        //牌形分析
        for (var i=1;i<cbCardCount;i++)
        {
            //数据分析
            if (this.GetCardColor(cbCardData[i])!=cbFirstColor) cbSameColor=false;
            if (cbFirstValue!=(this.GetCardLogicValue(cbCardData[i])+i)) bLineCard=false;

            //结束判断
            if ((cbSameColor==false)&&(bLineCard==false)) break;
        }

        //最小同花顺
        if((bLineCard == false)&&(cbFirstValue == 14))
        {
            var i=1;
            for (i=1;i<cbCardCount;i++)
            {
                var cbLogicValue=this.GetCardLogicValue(cbCardData[i]);
                if ((cbFirstValue!=(cbLogicValue+i+8))) break;
            }
            if( i == cbCardCount)
                bLineCard =true;
        }

        if(cbCardCount == 3)
        {
            //扑克分析
            var AnalyseResult = ssz.tagAnalyseResult1;
            AnalyseResult.initData();
            this.AnalysebCardData(cbCardData,cbCardCount,AnalyseResult);

            //类型判断
            if (AnalyseResult.cbThreeCount==1)
                return Constants.CT_THREE_TIAO;
            if (AnalyseResult.cbLONGCount==1)
                return Constants.CT_ONE_LONG;

        }else{

            //皇家同花顺
            if ((cbSameColor==true)&&(bLineCard==true)&&(this.GetCardLogicValue(cbCardData[1]) ==13 ))
                return Constants.CT_KING_TONG_HUA_SHUN;

            //顺子类型
            if ((cbSameColor==false)&&(bLineCard==true))
                return Constants.CT_SHUN_ZI;

            //同花类型
            if ((cbSameColor==true)&&(bLineCard==false))
                return Constants.CT_TONG_HUA;

            //同花顺类型
            if ((cbSameColor==true)&&(bLineCard==true))
                return Constants.CT_TONG_HUA_SHUN;

            //扑克分析
            var AnalyseResult = ssz.tagAnalyseResult1;
            AnalyseResult.initData();
            this.AnalysebCardData(cbCardData,cbCardCount,AnalyseResult);

            //类型判断
            if (AnalyseResult.cbFourCount==1)
                return Constants.CT_TIE_ZHI;
            if (AnalyseResult.cbLONGCount==2)
                return Constants.CT_TWO_LONG;
            if ((AnalyseResult.cbLONGCount==1)&&(AnalyseResult.cbThreeCount==1))
                return Constants.CT_HU_LU;
            if ((AnalyseResult.cbThreeCount==1)&&(AnalyseResult.cbLONGCount==0))
                return Constants.CT_THREE_TIAO;
            if ((AnalyseResult.cbLONGCount==1)&&(AnalyseResult.cbSignedCount==3))
                return Constants.CT_ONE_LONG;
        }
        return Constants.CT_SINGLE;
    },

    GetCardColor: function (data) {
        var bCardValue = parseInt(data/16);
        return bCardValue;
    },

    GetCardLogicValue: function (data) {
        var bCardValue = data%16;
        if(bCardValue ==1)
        {
            bCardValue = 14;
        }
        return bCardValue;
    },

    AnalysebCardData: function (cbCardData) {
       var AnalyseResult = {
            cbLogicValue:[],
            cbSignedLogicVolue : [],
            cbLONGLogicVolue   : [],
            cbThreeLogicVolue : [],
            cbFourLogicVolue  : [],
            cbSignedCount : 0,
            cbLONGCount : 0,
            cbThreeCount : 0,
            cbFourCount : 0,
        };

        //设置结果
        var  cbCardCount = cbCardData.length;

        var numbers = this.classifyCard(cbCardData).numbers;
        
        if(numbers[1].length > 0){
            numbers.push(numbers[1]); //将A复制到最后面
            numbers[1] = [];          //清除原来A的位置
        }
        
        //扑克分析
        for (var i = numbers.length-1;i>=0;i--){
            //变量定义
            var cbSameCount= numbers[i].length;
            if(0 == cbSameCount){
                continue;
            }

            //从大到小，保存数字
            for(var j = 0 ; j < cbSameCount; j++){
                AnalyseResult.cbLogicValue.push(i);
            }

            //保存结果
            switch (cbSameCount){
                case 1:		//单张
                {
                    AnalyseResult.cbSignedLogicVolue.push(i);
                    AnalyseResult.cbSignedCount++;                    
                    break;
                }
                case 2:		//两张
                {
                    AnalyseResult.cbLONGLogicVolue.push(i);
                    AnalyseResult.cbLONGCount++;
                    break;
                }
                case 3:		//三张
                {
                    AnalyseResult.cbThreeLogicVolue.push(i);
                    AnalyseResult.cbThreeCount++;
                    break;
                }
                case 4:		//四张
                {
                    AnalyseResult.cbFourLogicVolue.push(i);
                    AnalyseResult.cbFourCount++;
                    break;
                }
            }
        }

        return AnalyseResult;
    },
});


cc.Class({
    extends: cc.Component,

    properties: {
        _wanfa:1,
        _seatid:0,
        players:3,
        sszPokerAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        _kaipai:false,
        _baipaiMode:0,
        _timeLabel:null,
        _lastPlayTime:null,
        _voiceMsgQueue:[],
    },
    
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        
        this.m_bGameStarted = false;
        this.m_bTableStarted = false;
        this.vecReadyCard = [null,null,null];
        this.isSpeType = false;

        this.addComponent("UserInfoShow");
        
        this.sszCardList = new CardList();
        this.Constants = Constants;
        
        this.initView();
        this.initEventHandlers();

        this.baipaiComponent = this.node.getComponent("SSZBaiPai");
        
        cc.vv.audioMgr.playBGM("bgFight");
    },

 
    /**
     * add by linqx
     * 十三水初始化
     */
    initMain: function () {
        var that = this;
        // var players = 4;//玩家数量


        this.deskBack=this.node.getChildByName("ID_SPRITE_DESKBACK");

        //获取默认的摆牌模式
        this._baipaiMode = cc.sys.localStorage.getItem("baipaiMode");
        if(!this._baipaiMode)this._baipaiMode = 0;
        this._baipaiMode = parseInt(this._baipaiMode);

        //Layout_FuncBtn-------------------------------------------------start
        this.funcBtn = this.node.getChildByName("Layout_FuncBtn");
        //ID_BUTTON_INVITE
        this.inviteBtn = this.funcBtn.getChildByName("ID_BUTTON_INVITE");
        this.readyBtn = this.funcBtn.getChildByName("ID_BUTTON_READY")
        this.readyBtn.active = false;        
        
        this._timeLabel =  this.funcBtn.getChildByName("time").getComponent(cc.Label);

        //Layout_FuncBtn-------------------------------------------------end

        //Layout_UserInfo-------------------------------------------------start
        this.userList=[];
        
        var seats = this.deskBack.getChildByName("ID_LAYOUT_USERINFO");
        for(var i = 0; i < seats.children.length; ++i){
            this.userList.push(seats.children[i].getComponent("Seat"));
        }
        this.fjhLabel = this.node.getChildByName("ID_LABEL_FJH").getComponent(cc.Label);
        this.roundLabel = this.node.getChildByName("ID_LABEL_ROUND").getComponent(cc.Label);
        this.descLabel = this.node.getChildByName("ID_LABEL_DESC").getComponent(cc.Label);
        this.mapaiSprite = this.node.getChildByName("ID_SPARTE_MAPAI");

        this.initXuanPaiLayer();
        this.initTanPaiCard();
            
        //Layout_CardPlay----------------------------------------------------------------------end

        this.gameresult = this.node.getChildByName("game_result");
        this.gameresult.active = false;


        //////提示框
        this.hintBack=this.node.getChildByName("ID_SPRITE_HINT_MSG");
        this.hintBack.active = false;
        this.hintLabel=this.hintBack.getChildByName("ID_LABEL_HINTLABEL");

        /*
        //动画初始化
        var Layout_Effect = this.node.getChildByName("Layout_Effect");
        //开始游戏动画
        this.sszStartAnimaNode = Layout_Effect.getChildByName("ssz_startAnimanode");
        this.sszStartspine = this.sszStartAnimaNode.getComponent('sp.Skeleton');
        this.sszStartAnimaNode.active = false;
        //开始比牌动画
        this.sszBgCompCardAnimaNode = Layout_Effect.getChildByName("ssz_BgCompCardAnimanode");
        this.sszBgCompCardspine = this.sszBgCompCardAnimaNode.getComponent('sp.Skeleton');
        this.sszBgCompCardAnimaNode.active = false;
        //全垒打动画
        this.sszHomeRunAnimaNode = Layout_Effect.getChildByName("ssz_HomeRunAnimanode");
        this.sszHomeRunspine = this.sszHomeRunAnimaNode.getComponent('sp.Skeleton');
        this.sszHomeRunAnimaNode.active = false;
        //打枪准备动画
        this.sszShotReadyAnimaNode = Layout_Effect.getChildByName("ssz_shotReadyAnimanode");
        this.sszShotReadyspine = this.sszShotReadyAnimaNode.getComponent('sp.Skeleton');
        this.sszShotReadyAnimaNode.active = false;
        //打枪动画
        this.sszShotAnimaNode  = this.deskBack.getChildByName("ssz_shotAnimanode");
        this.sszShotspine = this.sszShotAnimaNode.getComponent('sp.Skeleton');
        this.sszShotAnimaNode.active = false;    
        //即将开始动画
        this.sszReadyAnimaNode = Layout_Effect.getChildByName("ssz_ReadyAnimanode");
        this.sszReadyspine = this.sszReadyAnimaNode.getComponent('sp.Skeleton');
        this.sszReadyAnimaNode.active = false;
        */
    },

    getsszPokerSpriteFrame:function(data){
        var colorList = ["D","C","H","S"];
        var color = parseInt(data/16);
        var num = data%16;

        if(num == 1){
            num = 14;
        }
        var PokerFrameName = this.pngStr = colorList[color]+num;
        return this.sszPokerAtlas.getSpriteFrame(PokerFrameName);            
    },

    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    getCardTypeInfo: function(card_type){
        for(var i =0;i<Constants.length;i++){
            if(Constants[i].CT_NO == card_type){
                return Constants[i];
            }
        }
    },

    checkIsSpecialType:function(card_type){

        //房间为无特殊牌
        if(this.paixin == 0)return false;

        for(var i =0;i<Constants.length;i++){
            if(Constants[i].CT_NO == card_type){
                switch(Constants[i].CT_NO){
                    case 200:
                    case 210:
                    case 220:
                    case 230:
                    case 240:
                    case 250:
                    case 260:
                    case 270:
                        return true;
                    default:
                        return false;
                }
            }
        }
        return false;
    },
    
    playSexSFX:function(sex,AudioName){
        if(sex == 1){
            var mp3File = "ssz/1/" + AudioName;
        }else{
            var mp3File = "ssz/2/" + AudioName;
        }
        cc.vv.audioMgr.playSFX(mp3File);
    },
                
    showDaoFen:function(index,score){
        //显示分数
        var item = this.VecJieSuan[index];
        item.active = true;
        var winscore = item.getChildByName("winscore");
        var losescore = item.getChildByName("losescore");
        if(score >= 0){
            score = "+"+score;
            losescore.active = false;
            winscore.getComponent(cc.Label).string = score;
            winscore.active = true;
        }else{
            winscore.active = false;
            losescore.getComponent(cc.Label).string = score;
            losescore.active = true;
        }

        var oldx = item.x;
        item.setPosition(item.x -200,item.y);
        item.runAction(cc.moveTo(0.2,cc.v2(oldx,item.y)));
    },

    doKaiSepcialPai:function(delay,wViewChairID,vecCardData,SpecialCardType){
        var that = this;
        this.scheduleOnce(function(){
            var cardTypeinfo = that.getCardTypeInfo(SpecialCardType);            
            var card_type_string =  cardTypeinfo.CT_NAME;
            //初始化牌
            for(var j =0;j<3;j++){
                var max = (j==0)?3:5;
                for(var m =0;m<max;m++){
                    var data = vecCardData[j][m];
                    if(data != 0){
                        that.userDoneCard[wViewChairID][j][m].getComponent(cc.Sprite).spriteFrame = that.getsszPokerSpriteFrame(data);
                        
                        //贴上马牌标识
                        if(data == that.mapai){
                            that.addMaPaiToPai(that.userDoneCard[wViewChairID][j][m],cc.v2(20,36));
                        }
                    }
                }
            }

            cc.vv.audioMgr.playSFX("ssz/openface/teshupai");
            that.playSexSFX(that.userList[wViewChairID]._sex,cardTypeinfo.AUDIO);

            //隐藏特殊牌型大图标
            that.userSpecialType[wViewChairID].runAction(
                cc.sequence(
                    cc.spawn(
                        cc.fadeOut(0.5),
                        cc.scaleTo(0.5,5)
                    ),
                    cc.callFunc(function () {
                        //显示牌型
                        var cadtype = that.vecSpriteEffect[wViewChairID].getChildByName("cardtype");
                        cadtype.getComponent(cc.Label).string = card_type_string;
                        that.vecSpriteEffect[wViewChairID].active = true;
                        that.vecSpriteEffect[wViewChairID].zIndex = 99;   

                        //获取当前道的坐标
                        var x = that.userDoneCardBack[wViewChairID][1].x;
                        var y = that.userDoneCardBack[wViewChairID][1].y;
                        //reset the pos
                        that.vecSpriteEffect[wViewChairID].setPosition(x,y);
                        
                    },this)
                )
            );

        },delay);
    },

    addMaPaiToPai:function(root,ccp){
        var node = new cc.Node("horse");
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.mapaiSprite.getChildByName("MA_logo").getComponent(cc.Sprite).spriteFrame;
        node.setAnchorPoint(0.5,0.5);
        // node.setPosition(20,36);
        node.setPosition(ccp);
        root.addChild(node);
        
    },

    doKaiDaoPai: function (delay,wViewChairID,daoIndex,vecCardData,cardType,daoScore,endTag) {
        var that = this;

        this.scheduleOnce(function(){
            var cardTypeinfo = that.getCardTypeInfo(cardType);            
            var card_type_string =  cardTypeinfo.CT_NAME;
            var IsSpecialType = that.checkIsSpecialType(cardType);
            
            if(!IsSpecialType){

                var max = (daoIndex == 0)?3:5;

                //翻牌
                for(var m =0;m<max;m++){
                    var data = vecCardData[m];                    
                    if(data != 0){    

                        that.userDoneCard[wViewChairID][daoIndex][m].getComponent(cc.Sprite).spriteFrame = that.getsszPokerSpriteFrame(data);
                        
                        //贴上马牌标识
                        if(data == that.mapai){
                            that.addMaPaiToPai(that.userDoneCard[wViewChairID][daoIndex][m],cc.v2(15,40));
                        }
                    }
                }

                

                //放大
                that.userDoneCardBack[wViewChairID][daoIndex].runAction(cc.sequence(

                            cc.spawn(
                                cc.callFunc(function(){
                                    
                                    that.userDoneCardBack[wViewChairID][daoIndex].zIndex = daoIndex +3;

                                    //显示每道的类型
                                    if(card_type_string){
                                        var cadtype = that.vecSpriteEffect[wViewChairID].getChildByName("cardtype");
                                        cadtype.getComponent(cc.Label).string = card_type_string;

                                        //获取当前道的坐标
                                        var x = that.userDoneCardBack[wViewChairID][daoIndex].x;
                                        var y = that.userDoneCardBack[wViewChairID][daoIndex].y - that.userDoneCardBack[wViewChairID][daoIndex].height/2 /**- that.vecSpriteEffect[wViewChairID].height / 2*/;
                                        //reset the pos
                                        that.vecSpriteEffect[wViewChairID].setPosition(x,y);
                                        that.vecSpriteEffect[wViewChairID].zIndex = daoIndex + 4;
                                        that.vecSpriteEffect[wViewChairID].active = true;
                                    }
                                },this),
                                cc.scaleTo(0.1,1.2),
                            ),
                            cc.delayTime(0.8),
                            cc.spawn(
                                cc.callFunc(function () {
                                    that.userDoneCardBack[wViewChairID][daoIndex].zIndex = daoIndex-3;                      
                                    that.vecSpriteEffect[wViewChairID].active = false;  
                                },this),
                                cc.scaleTo(0.1,1),
                            )));


                that.playSexSFX(that.userList[wViewChairID]._sex,cardTypeinfo.AUDIO);
            }

            //一道，所有用户显示完成
            if(endTag){
                //显示每道分数
                that.showDaoFen(daoIndex,daoScore);
            }
           
        },delay);
    },
    
    doShot:function(delay,shotInfo){
        var that = this;
        this.scheduleOnce(function(){
            that.playShotAnimation(shotInfo);
        },delay);
    },

    OnUserKaiPai:function(cardData,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag){
        var that = this;
        
        var time = 0;

        // this.nodeXuanPai.active = false;
        // this.xuanPaiAction(false);
        this.Layout_Desktop.active = true;

        //显示分数
        for(var i=0;i<this.VecJieSuan.length;i++){
            this.VecJieSuan[i].active = false;
        }

        this.nodeJieSuan.active = true;
        this.vecCardList = cardData;
        
        //立即显示所有特殊牌型
        for(var i = 0;i<this.players;i++){
            var IsSpecialType = this.checkIsSpecialType(vecDaoCardType[i][0]);
            var wViewChairID  = this.SwitchViewChairID(i);
            if(IsSpecialType){
                that.userSpecialType[wViewChairID].scale = 1.0;
                that.userSpecialType[wViewChairID].opacity = 255;
                this.userSpecialType[wViewChairID].active = true;
                this.userSpecialType[wViewChairID].zIndex = 4;
            }
        }

        //每道显示时间
        var t = 1;
        //逐列显示
        for(var f=0;f<3;f++){

            //先拿出分
            var fenList = [];
            var fenListSeat = [];
            for(var i = 0;i<this.players;i++){

                //如果自己是特殊牌型，每道分显示为0
                var daoScore  = 0;
                var isSelfSpc = this.checkIsSpecialType(vecDaoCardType[i][f]);
                if(!isSelfSpc){
                    daoScore = vecDaoScore[i][f];
                }

                fenList.push(daoScore);
                fenListSeat.push(i);
            }

            //从小到大排序
            var len = fenList.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                    if (fenList[j] > fenList[j+1]) {        //相邻元素两两对比
                        var temp = fenList[j+1];            //元素交换
                        fenList[j+1] = fenList[j];
                        fenList[j] = temp;

                        var tempSeat = fenListSeat[j+1];            //元素交换
                        fenListSeat[j+1] = fenListSeat[j];
                        fenListSeat[j] = tempSeat;
                    }
                }
            }
 
            for(var j = 0;j< fenListSeat.length ;j++){

                var i = fenListSeat[j];

                var wViewChairID = this.SwitchViewChairID(i);
                var endTag = false;
                if(j == fenListSeat.length - 1){
                    endTag = true;
                }

                var IsSpecialType = this.checkIsSpecialType(vecDaoCardType[i][f]);
                if(IsSpecialType){
                    if(this.mChairID == i){ 
                        time +=0.2;//如果自己，需要显示道分，需要时间
                    }else{
                        time +=0; //如果非自己，直接跳过，不需要时间
                    }
                }else{
                    time +=0.9;
                }

                //如果自己是特殊牌型，每道分显示为0
                var daoScore  = 0;
                var isSelfSpc = this.checkIsSpecialType(vecDaoCardType[this.mChairID][f]);
                if(!isSelfSpc){
                    daoScore = vecDaoScore[this.mChairID][f];
                }
                
                this.doKaiDaoPai(time,wViewChairID,f,
                                cardData[i][f],vecDaoCardType[i][f],daoScore,endTag);               
            }
        }

        //特殊牌型逐个翻牌
        for(var i = 0;i<this.players;i++){
            var IsSpecialType = this.checkIsSpecialType(vecDaoCardType[i][0]);
            var wViewChairID  = this.SwitchViewChairID(i);
            if(IsSpecialType){
                time += 0.9;
                this.doKaiSepcialPai(time,wViewChairID,cardData[i],vecDaoCardType[i][0]);
            }
        }

        
        //显示打枪
        if(vecShot!=null){
            this.scheduleOnce(function(){
                if(vecShot.length >0){
                    that.playShotReadyAnimation();
                }
            },time+0.5);

            time +=1;

            for(var i=0;i<vecShot.length;i++){
                this.doShot(time+(i+1)*1.5,vecShot[i]);
            }

            time += vecShot.length*1.5;
        }

        if(homeRunTag){
            time +=1;
            //显示全垒打
            this.scheduleOnce(function(){
                that.playHomeRunAnimation();
            },time);
        }
        
        //显示总计分数
        time += 0.2;
        this.scheduleOnce(function(){
            //显示结算栏的总计分数
            that.showDaoFen(3,that.vecTotalScore[this.mChairID]);
            //显示单局，所有人的输赢分数情况
            for(var i = 0; i<this.players;i++){   
                var wViewChairID = that.SwitchViewChairID(i);                    
                that.userList[wViewChairID].setWinCoinFixed(that.vecTotalScore[i]);
                //that.userList[wViewChairID].setWinCoin(vecTotalScore[i]);
                that.userList[wViewChairID].setScore(vecUserTotalScore[i]);
                that.vecUser[i].score = vecUserTotalScore[i];
            }
        },time);
        
        time+=0.5;
        this.scheduleOnce(function(){
            if(that.final_report){
                 this.scheduleOnce(function(){
                    cc.vv.GameResult.showReport(that.mRoomID,0,that.final_report,that.m_nRound,that.m_nMaxRound);
                    that.gameresult.active = true;
                },1);
            }
            else{
                that.readyBtn.active = true;
            }
        },time);
    },


    turnCard : function(){

        var that = this;
        var cardInfo1 = this.m_vecXuanPaiCard[this.iIndex][this.jIndex];
        var cardInfo2 = this.m_vecXuanPaiCard[this.iPopIndex][this.jPopIndex];

        cardInfo1.card.y -= 10;
        cardInfo2.card.y -= 10;

        var moveNode = this.nodeXuanPai.getChildByName("Sprite_CardPut").getChildByName("Layout_Move");
        moveNode.active = true;

        //原坐标
        var cardPos1 = cardInfo1.card.parent.convertToWorldSpaceAR(cardInfo1.card.getPosition());
        var cardPos2 = cardInfo2.card.parent.convertToWorldSpaceAR(cardInfo2.card.getPosition());

        var temp1 = {};
        
        temp1.color =cardInfo1.color;
        temp1.num = cardInfo1.num;
        temp1.byPai = cardInfo1.byPai;
        temp1.value = cardInfo1.value;
        temp1.colorIdx = cardInfo1.colorIdx;

        var temp2 = {};
        
        temp2.color =cardInfo2.color;
        temp2.num = cardInfo2.num;
        temp2.byPai = cardInfo2.byPai;
        temp2.value = cardInfo2.value;
        temp2.colorIdx = cardInfo2.colorIdx;

        //初始化假牌
        var node1 = moveNode.getChildByName("Card0");
        var node2 = moveNode.getChildByName("Card1");
        node1.getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(cardInfo1.byPai);
        node2.getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(cardInfo2.byPai);
        node1.setContentSize(cardInfo1.card.getContentSize());
        node2.setContentSize(cardInfo2.card.getContentSize());
        node1.setPosition(moveNode.convertToNodeSpaceAR(cardPos1));
        node2.setPosition(moveNode.convertToNodeSpaceAR(cardPos2));

        node1.removeAllChildren();
        node2.removeAllChildren();
        
        //增加马牌标识
        if(cardInfo1.byPai == this.mapai){
            this.addMaPaiToPai(node1,cc.v2(27,-38));
        } 

        //增加马牌标识
        if(cardInfo2.byPai == this.mapai){
            this.addMaPaiToPai(node2,cc.v2(27,-38));
        } 

        node1.active = true;
        node2.active = true;

        cardInfo1.card.active = false;
        cardInfo2.card.active = false;

        node1.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.15,moveNode.convertToNodeSpaceAR(cardPos2)),
                    cc.scaleTo(0.15,node2.width / node1.width)
                ),
                cc.callFunc(function () {

                    node1.active = false;

                    cardInfo1.card.active = true;
                    cardInfo1.isSelected = false;
                    cardInfo1.isPop  =  false;
                    
                    cardInfo1.isFloor = false;
                    cardInfo1.color =temp2.color;
                    cardInfo1.num = temp2.num;
                    cardInfo1.byPai = temp2.byPai;
                    cardInfo1.value = temp2.value;
                    cardInfo1.colorIdx = temp2.colorIdx;
                    cardInfo1.card.getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(cardInfo1.byPai);

                    cardInfo1.card.removeAllChildren();

                    //增加马牌标识
                    if(cardInfo1.byPai == this.mapai){
                        this.addMaPaiToPai(cardInfo1.card,cc.v2(27,-38));
                    } 

                },this)
            )
        );
        
        node2.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.15,moveNode.convertToNodeSpaceAR(cardPos1)),
                    cc.scaleTo(0.15,node1.width / node2.width)
                ),
                cc.callFunc(function () {

                    node2.active = false;

                    cardInfo2.card.active = true;
                    cardInfo2.isSelected = false;
                    cardInfo2.isPop  =  false;
                    cardInfo2.isFloor = false;
                    cardInfo2.color =temp1.color;
                    cardInfo2.num = temp1.num;
                    cardInfo2.byPai = temp1.byPai;
                    cardInfo2.value = temp1.value;
                    cardInfo2.colorIdx = temp1.colorIdx;
            
                    cardInfo2.card.getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(cardInfo2.byPai);
                    cardInfo2.card.removeAllChildren(); 
                      
                    //增加马牌标识
                    if(cardInfo2.byPai == this.mapai){
                        this.addMaPaiToPai(cardInfo2.card,cc.v2(27,-38));
                    } 

                },this)
            )
        );

        

        this.scheduleOnce(function(){
            moveNode.active = false;

            for(var i = 0; i< 3;i++){
            if(i == 0){                
                for(var j = 0; j< 3; j++){
                    this.vecReadyCard[i][j] =  this.m_vecXuanPaiCard[i][j].byPai;
                }
            }
            else{
                for(var j = 0; j< 5; j++){
                     this.vecReadyCard[i][j] =  this.m_vecXuanPaiCard[i][j].byPai;
                }
            }
        }

        },0.3)

        //重置智能推荐，设置为未选择状态
        this.reSetCardTypeGroupList();
    },

    /**
     * 按钮处理
     */
    onCardClicked:function(event){
        cc.vv.audioMgr.playSFX("ui_click");
        cc.log(event.target.name);
        var iIndex = -1;
        var jIndex = -1;
        var iPopIndex = -1;
        var jPopIndex = -1;

        //get
        for(var i =0;i<3;i++){
            var total = 0;
            var iTag = false;
            var cardList =this.m_vecXuanPaiCard[i];
            if(i == 0){   
                total = 3;        
            }
            else {
                total = 5;
            }

            for(var j = 0;j<total; j++){
                
                if(cardList[j].cardName == event.target.name){
                    //get the clicked card
                    iIndex = i;
                    jIndex = j;
                }

                if(this.m_vecXuanPaiCard[i][j].isSelected){
                    iPopIndex = i;
                    jPopIndex = j;
                }
            }
        }

        //已经有牌被选中
        if(iPopIndex !=-1 && jPopIndex != -1){
            //点击的牌和已选的牌相同，牌回位
            if(iPopIndex == iIndex && jPopIndex ==jIndex){
                this.m_vecXuanPaiCard[iIndex][jIndex].card.y -= 10;
                this.m_vecXuanPaiCard[iIndex][jIndex].isSelected = false;
                this.m_vecXuanPaiCard[iIndex][jIndex].isPop =  false;
            }else{
                this.m_vecXuanPaiCard[iIndex][jIndex].card.y += 10;
                this.m_vecXuanPaiCard[iIndex][jIndex].isSelected = true;
                this.m_vecXuanPaiCard[iIndex][jIndex].isPop =  true;

                //启动计时器
                this.iIndex = iIndex;
                this.jIndex = jIndex;
                this.iPopIndex = iPopIndex;
                this.jPopIndex = jPopIndex;

                this.turnCard();
            }
        }
        else{
            this.m_vecXuanPaiCard[iIndex][jIndex].card.y += 10;
            this.m_vecXuanPaiCard[iIndex][jIndex].isSelected = true;
            this.m_vecXuanPaiCard[iIndex][jIndex].isPop =  true;
        }
    },

    newCard:function(card,cardName){
        var cardInfo = {};
        cardInfo.card = card;
        cardInfo.cardName=cardName;

        cardInfo.isSelected = false;        
        cardInfo.isPop = false;
        cardInfo.isFloor = false;
        cardInfo.isSelectPop = false;
        
        cardInfo.color =0;
        cardInfo.num = 0;
        cardInfo.byPai = 0;
        cardInfo.value = 0;
        cardInfo.colorIdx = 0;

        return cardInfo;
    },

    initXuanPaiLayer: function () {
        this.nodeXuanPai = this.node.getChildByName("ID_LAYOUT_XUANPAI");
        this.nodeBaiPai = this.node.getChildByName("ID_LAYOUT_BAIPAI");
        var Sprite_CardPut = this.nodeXuanPai.getChildByName("Sprite_CardPut");

        //剩余时间
        this.nodeXuanPaiTime = this.nodeXuanPai.getChildByName('time').getComponent(cc.Label);
        this.nodeBaiPaiTime = this.nodeBaiPai.getChildByName('time').getComponent(cc.Label);

        this.m_vecXuanPaiCard = [];
        for(var i =0;i<3;i++){
            var cardList = [];
            if(i == 0){
                var Layout_FirstDun = Sprite_CardPut.getChildByName("Layout_FirstDun");
                for(var j=0;j<3;j++)
                {                    
                    var card = Layout_FirstDun.getChildByName("Sprite_FD_Card"+j);
                    card.myTag = j;
                    card.active = false;                       
                    cardList[j] = this.newCard(card,"Sprite_FD_Card"+j);
                    this.addClickEvent(card,this.node,"SSZGame","onCardClicked");
                }
            }
            else if(i == 1){
                var Layout_SecondDun = Sprite_CardPut.getChildByName("Layout_SecondDun");
                for(var j=0;j<5;j++){
                    var card = Layout_SecondDun.getChildByName("Sprite_SD_Card"+j);
                    card.myTag = j;                    
                    card.active = false;
                    cardList[j] = this.newCard(card,"Sprite_SD_Card"+j);
                    this.addClickEvent(card,this.node,"SSZGame","onCardClicked");
                }
            }
            else if(i==2){
                var Layout_ThirdDun = Sprite_CardPut.getChildByName("Layout_ThirdDun");
                for(var j=0;j<5;j++){
                    var card = Layout_ThirdDun.getChildByName("Sprite_TD_Card"+j);
                    card.myTag = j;                
                    card.active = false;
                    cardList[j] = this.newCard(card,"Sprite_TD_Card"+j);
                    this.addClickEvent(card,this.node,"SSZGame","onCardClicked");
                }
            }

            this.m_vecXuanPaiCard[i] = cardList;
        }
        
        this._CardGroupSelect = this.nodeXuanPai.getChildByName("Layout_CardGroupSelect");
        this._CardGroupSelect.active = false;
        
        this._viewlist = this._CardGroupSelect.getChildByName("viewlist");
        this._content = cc.find("view/content",this._viewlist);
        
        this._viewitemTemp = this._content.children[0];
        this._content.removeChild(this._viewitemTemp);

        var finishBtn = Sprite_CardPut.getChildByName("ID_BUTTON_FINISH");        

        //记录已经在上面的牌数组初始化
        this.m_vecFloorCard = [];
        for(var i=0;i<3;i++){
            this.m_vecFloorCard[i] = [];
        }
    },

    initTanPaiCard: function () {
        this.Layout_Desktop =  this.node.getChildByName("Layout_Desktop");

        this.userDoneCard = [];
        this.userDoneCardBack = [];
        this.userDoneCardName = [];
        this.vecSpriteEffect  = [];
        this.userBullet       = [];
        this.userSpecialType  = [];

        for(var i=0;i<4;i++){
            this.userDoneCard[i] = [];
            this.userDoneCardBack[i] = [];
            this.userDoneCardName[i] = [];
            var userCard = this.Layout_Desktop.getChildByName("Layout_UserCard"+i);
            this.vecSpriteEffect[i] = userCard.getChildByName("cardtype_bg");
            this.vecSpriteEffect[i].active = false;
            this.userSpecialType[i] = userCard.getChildByName("specialType");
            this.userSpecialType[i].active = false;

            this.userBullet[i] = [];
            var bullets = userCard.getChildByName("bullets");            
            for(var k = 0; k < bullets.children.length; k++){
                this.userBullet[i][k] = bullets.children[k];
                this.userBullet[i][k].active = false;
            }

            for(var j =0;j<3;j++){
                this.userDoneCard[i][j] = [];
                this.userDoneCardName[i][j] = [];
                if(j == 0){
                    var Layout_FirstDun = userCard.getChildByName("Layout_FirstDun");
                    this.userDoneCardBack[i][j] = Layout_FirstDun;
                    this.userDoneCardBack[i][j].active = false;
                    
                    for(var m =0;m<3;m++){
                        this.userDoneCard[i][j][m] = Layout_FirstDun.getChildByName("Sprite_FD_Card"+m);
                        this.userDoneCardName[i][j][m] = "Sprite_FD_Card"+m;
                    }
                }
                else if(j==1){
                    var Layout_SecondDun = userCard.getChildByName("Layout_SecondDun");
                    this.userDoneCardBack[i][j] = Layout_SecondDun;
                    this.userDoneCardBack[i][j].active = false;
                    for(var m =0;m<5;m++){
                        this.userDoneCard[i][j][m] = Layout_SecondDun.getChildByName("Sprite_SD_Card"+m);
                        this.userDoneCardName[i][j][m] = "Sprite_SD_Card"+m;
                    }
                }else if(j==2){
                    var Layout_ThirdDun = userCard.getChildByName("Layout_ThirdDun");
                    this.userDoneCardBack[i][j] = Layout_ThirdDun;
                    this.userDoneCardBack[i][j].active = false;
                    for(var m =0;m<5;m++){
                        this.userDoneCard[i][j][m] = Layout_ThirdDun.getChildByName("Sprite_TD_Card"+m);
                        this.userDoneCardName[i][j][m] = "Sprite_TD_Card"+m;
                    }
                }

                this.userDoneCardBack[i][j].zIndex = j;
            }
        }

        //结算
        this.VecJieSuan = [];
        var nodeJieSuan =  this.nodeJieSuan = this.node.getChildByName("ID_NODE_JIESUAN");
        for(var i= 0;i<  nodeJieSuan.children.length;i++){
            this.VecJieSuan.push(nodeJieSuan.children[i]);
            nodeJieSuan.children[i].active = false;
        }
        nodeJieSuan.active =false;
    },


    initCardTypeGroupList:function(data){
        for(var i = 0; i < data.length; ++i){
            var node = this.getViewItem(i);
            node.idx = i;

            var IsSpecialType = this.checkIsSpecialType(data[i][0][0]);
            
            var highLight = node.getChildByName("highLight");
            var cardtype_selTag = node.getChildByName("cardtype_selTag");
            if(i == 0){
                highLight.active = true;
                cardtype_selTag.active = true;
            }
            else{
                highLight.active = false;
                cardtype_selTag.active = false;
            }

            var cardGroup = node.getChildByName("cardTypeSel");
            var groupNo     = cardGroup.getChildByName("groupNo");
            groupNo.getComponent(cc.Label).string = i + 1;

            for(var j=0;j<4;j++){
                var cardtype = cardGroup.getChildByName("cardtype"+j);
                 //特殊牌型
                if(IsSpecialType){
                    if(j==0){
                        cardtype.active = true;
                        var cardInfo = this.getCardTypeInfo(data[i][0][0]);
                        cardtype.getChildByName("cardtypeLabel").getComponent(cc.Label).string = cardInfo.CT_NAME;
                    }
                    else{
                        cardtype.active = false;
                    }
                }
                else{
                    if(j==0){
                        cardtype.active = false;
                    }
                    else{
                        cardtype.active = true;
                        var cardInfo = this.getCardTypeInfo(data[i][3-j][0]);
                        cardtype.getChildByName("cardtypeLabel").getComponent(cc.Label).string = cardInfo.CT_NAME;
                    }
                }                   
            }
        }        
        this.shrinkContent(data.length);
        this._CardGroupSelect.active = true;
        this._viewlist.getComponent(cc.ScrollView).scrollToLeft();  
        
        
        if(data.length > 0){
            // 头道
            this.cardDataList = [].concat(data[0][2][1]);
             // 中道
            this.cardDataList = this.cardDataList.concat(data[0][1][1]);
            // 尾道
            this.cardDataList = this.cardDataList.concat(data[0][0][1]);
        }
    },
    
    getViewItem:function(index){
        var content = this._content;
        if(content.childrenCount > index){
            return content.children[index];
        }
        var node = cc.instantiate(this._viewitemTemp);
        content.addChild(node);
        return node;
    },

    shrinkContent:function(num){
        while(this._content.childrenCount > num){
            var lastOne = this._content.children[this._content.childrenCount -1];
            this._content.removeChild(lastOne,true);
        }
    },

    getSelectedGroupId:function(){
        var idx = -1;
        var content = this._content;
        //重置所有node为常态
        for(var i =0; i<　content.childrenCount;i++){
            var node =  content.children[i];

            var highLight = node.getChildByName("highLight");
            var cardtype_selTag = node.getChildByName("cardtype_selTag");
            if(cardtype_selTag.active){
                idx = i;
                break;
            }
        }
        return idx;
    },

    reSetCardTypeGroupList:function(){
        var content = this._content;
        //重置所有node为常态
        for(var i =0; i<　content.childrenCount;i++){
            var node =  content.children[i];

            var highLight = node.getChildByName("highLight");
            var cardtype_selTag = node.getChildByName("cardtype_selTag");
            
            highLight.active = false;
            cardtype_selTag.active = false;
        }
    },

    onBtnOpClicked:function(event){
        cc.vv.audioMgr.playSFX("ui_click");
        var idx = event.target.idx;
        if(idx  >=  this.aiGroupList.length){
            return;
        }

        var content = this._content;
        this.reSetCardTypeGroupList();

        //get the select item
        var node =  content.children[idx];
        var highLight = node.getChildByName("highLight");
        var cardtype_selTag = node.getChildByName("cardtype_selTag");
        highLight.active = true;
        cardtype_selTag.active = true;

        if(this.aiGroupList[idx].length > 0){
             // 头道
            this.cardDataList = [].concat(this.aiGroupList[idx][2][1]);
             // 中道
            this.cardDataList = this.cardDataList.concat(this.aiGroupList[idx][1][1]);
            // 尾道
            this.cardDataList = this.cardDataList.concat(this.aiGroupList[idx][0][1]);
        }
        
        this.ReInitCardPut();
    },

    OnFinishBtnEvent: function () {
        cc.vv.audioMgr.click();

        if(this.vecReadyCard[0] && this.vecReadyCard[1] && this.vecReadyCard[2]){
            var tanpai = [];
            var idx = -1;
            var teshu = 0;
            //check the select ai group
            idx = this.getSelectedGroupId();
            if(idx > -1){
                if(this.checkIsSpecialType(this.aiGroupList[idx][0][0])){
                     teshu = 1;
                }
            }

            for(var i=0;i<3;i++){
                for(var j = 0;j < this.vecReadyCard[i].length;j++){
                    tanpai.push(this.vecReadyCard[i][j]);
                }
            }

            this.common("kaipai",{tanpai:tanpai,teshu:teshu});
        }
    },  

    initView:function(){
        this.initMain();
         //进入房间后，尝试坐入位置
        this.common('sit',{roomid:cc.vv.userMgr.room_id});
    },

    initEventHandlers:function(){
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        
        //初始化事件监听器
        var self = this;

        this.node.on('sit',function(ret){
 
            //进房失败，返回大厅
            if(ret.errcode != 0){
                cc.vv.alert.show('进房失败',ret.errmsg,function(){
                    cc.vv.sceneMgr.gotoHall();
                });
                return;
            }

            self.deal('sit',ret);
        });

        this.node.on('leave',function(ret){
            var data = ret;
            if(data.errcode == 0){
                //cc.director.loadScene("hall");
                cc.vv.sceneMgr.gotoHall();
                 //可以再次回来
            }
        });

        //房间信息
        this.node.on('param',function(ret){
            self.deal('param',ret);
        });

        //桌面信息
        this.node.on('table',function(ret){
           self.deal('table',ret);
        });

        this.node.on('table_begin',function(ret){
           self.deal('table_begin',ret);
        });

        this.node.on('table_side',function(ret){
           self.deal('table_side',ret);
        });

        this.node.on('table_end',function(ret){
           self.deal('table_end',ret);
        });

        //当局信息
        this.node.on('stage',function(ret){
           self.deal('stage',ret);
        });

        //准备
        this.node.on('ready',function(ret){
           self.deal('ready',ret);
        });

        //开局
        this.node.on('start',function(ret){
           self.deal('start',ret);
        });

        //锁定房间 不允许进入旁观
        this.node.on('lock',function(ret){
           self.deal('lock',ret);
        });

        //发牌
        this.node.on('fapai',function(ret){
            self.deal('fapai',ret);
        });

        //开牌
        this.node.on('kaipai',function(ret){
            self.deal('kaipai',ret);
        });
        
        //算分
        this.node.on('suanfen',function(ret){
            self.deal('suanfen',ret);
        });

        //抢庄
        this.node.on('qiangzhuang',function(ret){
           self.deal('qiangzhuang',ret);
        });

        //不抢庄
        this.node.on('buqiangzhuang',function(ret){
           self.deal('buqiangzhuang',ret);
        });

        //定庄
        this.node.on('dingzhuang',function(ret){
           self.deal('dingzhuang',ret);
        });

        //拒绝解散房间
        this.node.on('refuse_dismiss_room',function(ret){
           self.deal('refuse_dismiss_room',ret);
        });

        //同意解散房间
        this.node.on('agree_dismiss_room',function(ret){
           self.deal('agree_dismiss_room',ret);
        });

        //发起解散房间
        this.node.on('try_dismiss_room',function(ret){
           self.deal('try_dismiss_room',ret);
        });

        this.node.on('dismissroom',function name(ret) {
            self.deal('dismissroom',ret);
        });

        //快捷语音
        this.node.on('voice',function(ret){
            self.deal('voice',ret);
        });

        //聊天
        this.node.on('chat',function(ret){
            self.deal('chat',ret);
        });

        //语音
        this.node.on('yuyin',function(ret){
            self.deal('yuyin',ret);
        });

        //表情
        this.node.on('biaoqing',function(ret){
            self.deal('biaoqing',ret);
        });
        
        //终局结算
        this.node.on('report',function(ret){
           self.deal('report',ret);
        });

        //玩家离线
        this.node.on('offline',function(ret){
            ret = ret.data;
            if(cc.vv.tip != null){
                self.vecUser[ret.seat].offline = true;
                var wViewChairID = self.SwitchViewChairID(ret.seat);
                self.userList[wViewChairID].setOffline(true);
                var message = "玩家 " + ret.name + " 离线";
                cc.vv.tip.show(message);
            }
        });

        //玩家上线
        this.node.on('online',function(ret){
            ret = ret.data;
            if(cc.vv.tip != null){
                self.vecUser[ret.seat].offline = false;
                var wViewChairID = self.SwitchViewChairID(ret.seat);
                self.userList[wViewChairID].setOffline(false);
                var message = "玩家 " + ret.name + " 上线";
                cc.vv.tip.show(message);
            }
        });
    },

    /**
     * 提示框
     */
    OnShowHint:function (content){
        var that=this;
        this.hintLabel.getComponent(cc.Label).string = content;

        this.hintBack.active = true;
        this.hintBack.stopAllActions();
        this.hintLabel.stopAllActions();
        
        this.hintLabel.setPosition(0,-25);

        this.hintBack.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function () {
            that.hintBack.active = false;
            that.hintLabel.setPosition(0,0);
        },this)));

        this.hintLabel.runAction(cc.moveBy(0.2,cc.v2(0,25)));        
    },

    onBtnSettingsClicked:function(){
        cc.vv.audioMgr.playSFX("ui_click");
        cc.vv.popupMgr.showSettings();   
    },

    OnClockBtnClick: function () {
        if(this.unlocked)
        {
            this.unlocked = false;
            //that.lockBtn.setSelected(false);
            //that.OnShowHint("禁止其他玩家加入");
            //zjh.ZJH_Data.SendLock(1);
        }else{
            this.unlocked = true;
            //that.lockBtn.setSelected(true);
            //that.OnShowHint("允许其他玩家加入");
            //zjh.ZJH_Data.SendLock(0);
        }
    },
    
    common:function(method,param){
        cc.vv.net.common('pdk',method,param);
    },

    OnReady: function () {
        this.common("ready");
        this.readyBtn.active = false;
        this.playReadyAnimation();
        this.userList[0].setReady(true);
    },

    OnInvite : function(){
        cc.vv.audioMgr.playSFX("ui_click");
        var title = cc.GAME_NAME + "房间号：" + this.mRoomID;//+ ' 点击直接进入';
        cc.vv.share_url = 'http://'+ cc.GAME_CODE + '.game.fingerjoys.com/room/'+ this.mRoomID;
        cc.vv.anysdkMgr.share(title,"玩法: " + this.descLabel.getComponent(cc.Label).string+ " " + this.m_nMaxRound + "局",'0','2','');
    },

    renew_ui : function(){
        this.roundLabel.string = "局数:第" + this.m_nRound + "/" + this.m_nMaxRound+"局";
        // this.lefttimeLabel.string = ""+this.m_nLeftTime;

        for(var i=0;i<this.players;i++)
        {
            var wViewChairID=this.SwitchViewChairID(i);
            //this.userList[wViewChairID].setXiaZhu(false);
            //this.userList[wViewChairID].setQiangZhuang(false);      
            if(this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0){
                this.userList[wViewChairID].setID(this.vecUser[i].uid);
                this.userList[wViewChairID].setInfo(this.vecUser[i].nickname,this.vecUser[i].score,
                                                    this.vecUser[i].gender,this.vecUser[i].ip); 
                //准备状态               
                if(this.vecUser[i].state == US_READY){
                    this.userList[wViewChairID].setReady(true);
                }else{
                    this.userList[wViewChairID].setReady(false);
                } 

                this.userList[wViewChairID].setOffline((this.vecUser[i].online == 1)?false:true);

                //自己判断的情况下，播放等待动画
                if(wViewChairID == 0 && this.vecUser[i].state == US_READY){
                    this.playReadyAnimation();
                    this.readyBtn.active = false;
                }
                
            }else{
                this.userList[wViewChairID].setInfo(null,null,null,null,null);
            }

            if(this.m_bGameStarted && this.m_byZhuang == i){
                this.userList[wViewChairID].setZhuang(true);
            }else{
                this.userList[wViewChairID].setZhuang(false);
            }
        }

        /*
        if(this.mChairID == 0){
            this.lockBtn.active = true;
        }else {
            this.lockBtn.active = false;
        }
        */
    },

    OnSubBiaoQing : function(uid,seat,index){
        var wViewChairID=this.SwitchViewChairID(seat);
        this.showBiaoQing(wViewChairID,index);
    },

    showBiaoQing : function(seat,idx){        
        this.userList[seat].emoji(idx);
    },

    onSubChat : function(uid,seat,content){
        var wViewChairID=this.SwitchViewChairID(seat);
        this.showChat(wViewChairID,content);
    },

    showChat : function(seat,content){
        this.userList[seat].chat(content);
    },

    OnSubYuYin : function(uid,seat,index){
        var wViewChairID=this.SwitchViewChairID(seat);
        this.showYuYin(wViewChairID,index);
    },

    showYuYin : function(seat,index){
        var info = cc.vv.chat.getQuickChatInfo(index);
        this.userList[seat].chat(info.content);
        cc.vv.audioMgr.playSFX(info.sound);
    },

    OnSubTable : function(userInfoList) {
        if (this.vecUser == undefined) {
            this.vecUser = [null, null, null, null, null, null];
        }

        for (var seat = 0; seat < this.players; seat++) {
            if (this.vecUser[seat] == undefined) {
                this.vecUser[seat] = {};
            }
            this.vecUser[seat].uid = userInfoList[seat].uid;
            this.vecUser[seat].seat = seat;
            this.vecUser[seat].score = userInfoList[seat].score;
            this.vecUser[seat].nickname = userInfoList[seat].nickname;
            this.vecUser[seat].avatar = userInfoList[seat].avatar;
            this.vecUser[seat].gender = userInfoList[seat].gender;
            this.vecUser[seat].state = userInfoList[seat].state;
            this.vecUser[seat].ip = userInfoList[seat].ip;
            this.vecUser[seat].online = userInfoList[seat].online;
        }
        var cntUser = 0;
        for (var i = 0; i < this.players; i++) {
            if (this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0) {
                cntUser++;
            }
        }

        if (this.m_bTableStarted) {
                this.inviteBtn.active = false;
        } else {
            if (cntUser >= this.players) {
                this.inviteBtn.active = false;
            } else {
                this.inviteBtn.active = true;
            }
            this.readyBtn.active =  true;
        }
        
        this.renew_ui();
    },

    OnSubStage : function(stage,deal_time,data)
    {
        var that = this;
        //this.RepositTable();
        var cntUser = 0;
        var vecFaPaiUser = [];
        for(var i=0;i<5;i++)
        {
            if(this.vecUser && this.vecUser[i] && this.vecUser[i].uid)
            {
                cntUser++;
                vecFaPaiUser.push(i);
            }
        }

        //int STAGE_NULL = 0;
        //int STAGE_START = 1;
        //int STAGE_QIANGZHUANG = 2;
        //int STAGE_FAPAI = 3;
        //int STAGE_JIESUAN = 5;

        if(stage == 0)
        {
            if(this.mChairID == 0)
            {
                this.readyBtn.active =  true;
            }else{
                this.readyBtn.active = false;
            }
        }

        if(stage == 1)
        {

        }

        if(stage == 2)
        {
        
        }

        if(stage == 3 || stage == 5){

            var byRound = data.round;

            var vecIsReady = [];
            for(var i = 0; i < data.list.length;i++){
                vecIsReady.push(data.list[i].ready);
            }

            //置其它人的开牌状态
            this.OnSubKaiPaiReady(byRound,vecIsReady);

            //如果未开牌
            if(data.list[this.mChairID].ready == 0){

                that.baipaiUIReady = false;
                that.sortPaiReady  = false;

                for(var i = 0; i<this.players;i++){   
                    var wViewChairID = this.SwitchViewChairID(i);                    
                    this.userList[wViewChairID].setWinCoinFixed(null);
                }

                //开始算牌
                this.scheduleOnce(function(){
                    that.sszCardList.initData();
                    that.sszCardList.SortCardTypeGroupAi(data.list[that.mChairID].cards,that.paixin);
                    if(that.baipaiUIReady){
                        that.ReInitAiXuanPaiGroup();
                        that.ReInitCardPut();
                        that.baipaiComponent.initBaiPaiList();
                    }
                    that.sortPaiReady = true;
                },0);

                this.OnSubFaPai(vecIsReady,data.list[this.mChairID].cards);
            }
        }

        // if(stage == 5)
        // {
        //     this.OnReady();
        // }
    },

    InitTable : function()
    {
        this.RepositTable();
    },

    RepositTable : function()
    {
        //this.nodeCardTypeEffect.removeAllChildren();
        for(var i=0;i<4;i++)
        {
            this.userDoneCardBack[i][0].active = false;
            this.userDoneCardBack[i][1].active = false;
            this.userDoneCardBack[i][2].active = false;
            this.userBullet[i][0].active = false;
            this.userBullet[i][1].active = false;
            this.userBullet[i][2].active = false;
        }
       for(var i=0;i<4;i++){

           for(var j =0;j<3;j++)
           {
               if(j == 0)
               {
                   for(var m =0;m<3;m++)
                   {
                       this.userDoneCard[i][j][m].initWithFile(dwc.g_arrSSZRes.defaultCard_png);
                   }
               }else
               {
                   for(var m =0;m<5;m++)
                   {
                       this.userDoneCard[i][j][m].initWithFile(dwc.g_arrSSZRes.defaultCard_png);
                   }
               }
           }
       }


        this.m_waitState = "STATE_NULL";

        this.m_vecHandPai = [255,255,255,255,255];

        this.m_vecRoundScore = [0,0,0,0,0];
        this.m_vecRoundScore = [0,0,0,0,0];

        this.m_vecCardData = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
        this.vecRealScoreData = [];
        this.m_bGameStarted = false;
        for (var i=0;i<4;i++)
        {
            for (var j=0;j<13;j++) {
                if (this.vecTableCard && this.vecTableCard[i] && this.vecTableCard[i][j]) {
                    this.vecTableCard[i][j].destroy();
                    this.vecTableCard[i][j] = null;
                }
            }
        }


        this.isCanTouch=false;
        this.nodeJieSuanBg.setVisible(false);
        this.nodeXuanPai.setVisible(false);
        this.nodeBaiPai.setVisible(false);

        this.vecTableCard=[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]];

        this.voiceBtn.setVisible(true);

        this.userList[0].userInfoBG.setVisible(true);
        this.userList[0].userName.setString(dwc.Myself.GetData().GetNickName());
    },

    //显示或隐藏选牌窗口
    xuanPaiAction:function(show){

        var node = null;
        
        switch(this._baipaiMode){
            case 0:{
                node = this.nodeBaiPai;
            }
            break;
            case 1:{
                node = this.nodeXuanPai;
            }
            break;
        }

        if(show){

            //30秒摆牌时间
            this.m_nLeftTime = 30;
            this.schedule(this.tipBaiPaiTime,1);

            node.setPosition(cc.v2(0,-720));
            node.active = true;
            node.runAction(cc.sequence(
                cc.moveBy(0.2,cc.v2(0,720))
            ));
        }else{

            //停止倒计时
            cc.vv.audioMgr.stopSFX(this.alarm_id);
            this.unschedule(this.tipBaiPaiTime);
            
            node.setPosition(cc.v2(0,0));
            node.runAction(cc.sequence(
                cc.moveBy(0.2,cc.v2(0,-720))
            ));
        }
    },

    tipBaiPaiTime:function(){

        this.m_nLeftTime--;
        if(this.m_nLeftTime < 0){

            if(Math.abs(this.m_nLeftTime + 4) % 5 == 0){
                this.alarm_id = cc.vv.audioMgr.playSFX("timeup_alarm");
            }
            
            return;
        }
        this.nodeXuanPaiTime.string = "" + this.m_nLeftTime;
        this.nodeBaiPaiTime.string = "" + this.m_nLeftTime;
    },


    //上桌
    OnSubSit : function(uid,seat,table_id,score,nickname,gender,avatar,ip,state){
        if(uid == cc.vv.userMgr.userid)
        {
            this.mRoomID  = table_id;
            this.mChairID = seat;
            if(state == 0)
            {
                this.readyBtn.active = true;
            }else{
                this.readyBtn.active = false;
            }
        }else{
            //cc.audioEngine.playEffect("res/audio/sit.wav",false);
        }

        if(this.vecUser == undefined){
            this.vecUser = [null,null,null,null];
        }

        //如果人坐满，隐藏邀请
        if(seat == this.players - 1){
            this.inviteBtn.active = false;
        }
        
        if(seat < this.players)
        {
            if(this.vecUser[seat] == undefined)
            {
                this.vecUser[seat] = {};
            }
            this.vecUser[seat].uid = uid;
            this.vecUser[seat].seat = seat;
            this.vecUser[seat].score = score;
            this.vecUser[seat].nickname = nickname;
            this.vecUser[seat].gender = gender;
            this.vecUser[seat].avatar = avatar;
            this.vecUser[seat].online = 1;
            
            if(state != undefined)
            {
                this.vecUser[seat].state = state;
            }
            
            this.vecUser[seat].ip = ip;
            this.vecUser[seat].offline = false;

            var wViewChairID=this.SwitchViewChairID(seat);
            this.userList[wViewChairID].setOffline(this.vecUser[seat].offline);

            // var cntUser = 0;
            // for(var i=0;i<this.players;i++)
            // {
            //     if (this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0)
            //     {
            //         cntUser++;
            //     }
            // }
            // if(this.m_bTableStarted)
            // {
            //     this.inviteBtn.active = false;
            //     this.readyBtn.active = false;
            // }else{
            //     if(cntUser>= this.players)
            //     {
            //         this.inviteBtn.active = false;

            //     }else{
            //         this.inviteBtn.active = true;
            //     }
            // }
            this.renew_ui();
        }else{
            cc.log("OnSubSit error seat : " + seat);
        }
    },

    //退出桌子
    OnSubStandUp : function(uid){
        if(this.vecUser) {
            for (var i = 0; i < this.vecUser.length; i++) {
                var wViewChairID = this.SwitchViewChairID(i);
                if (this.vecUser && this.vecUser[i] && this.vecUser[i].uid == uid) {
                    if (this.m_bTableStarted )
                    {
                        this.vecUser[i].offline = true;
                        this.userList[wViewChairID].userOfflineSprite.active = this.vecUser[i].offline;
                    }else
                    {
                        this.vecUser[i].uid = 0;
                        this.vecUser[i].seat = 0;
                        this.vecUser[i].score = 0;
                        this.vecUser[i].nickname = "";
                        this.vecUser[i].gender = 0;
                        this.vecUser[i].avatar = 0;
                        this.vecUser[i].state = 0;
                        this.vecUser[i].offline = false;
                        this.vecUser[i].ip = "0.0.0.0";
                        
                        this.userList[wViewChairID].setInfo(null,null);
                    }
                }
            }
        }

        if(uid == cc.vv.userMgr.userid)
        {
            if(this.vecUser) {
                for (var i = 0; i < this.vecUser.length; i++) {
                    if (this.vecUser && this.vecUser[i]) {
                        this.vecUser[i].uid = 0;
                        this.vecUser[i].seat = 0;
                        this.vecUser[i].score = 0;
                        this.vecUser[i].nickname = "";
                        this.vecUser[i].gender = 0;
                        this.vecUser[i].avatar = 0;
                        this.vecUser[i].state = 0;
                        this.vecUser[i].ip = "0.0.0.0";
                        this.vecUser[i].offline = false;
                        var wViewChairID = this.SwitchViewChairID(i);
                        this.userList[wViewChairID].setInfo(null,null);
                    }
                }
            }

            this.RepositTable();
        }

        if (this.m_bTableStarted || this.mChairID == 0)
        {

        }else{
            dwc.Myself.SetMyRoom(null);
        }
    },

    OnSubKick : function(uid){
        if(this.vecUser)
        {
            if(uid == cc.vv.userMgr.userid)
            {
                var pScene = new dwc.DT_MainScene();
                cc.director.runScene(pScene);
                cc.vv.alert.show("提示","由于超过3局未准备，您被踢出房间");
            }else{
                for(var i=0;i<this.vecUser.length;i++) {
                    if (this.vecUser && this.vecUser[i] && this.vecUser[i].uid == uid) {
                        this.vecUser[i].uid=0;
                        this.vecUser[i].seat=0;
                        this.vecUser[i].score=0;
                        this.vecUser[i].nickname="";
                        this.vecUser[i].gender=0;
                        this.vecUser[i].avatar=0;
                        this.vecUser[i].state=0;
                        this.vecUser[i].ip = "0.0.0.0";
                        var wViewChairID=this.SwitchViewChairID(i);

                        this.userList[wViewChairID].setInfo(null,null);
                    }
                }
            }
        }
    },

    OnSubReady: function(uid,seat){
        var wViewChairID=this.SwitchViewChairID(seat);
        if(seat < this.players) {
            if (this.vecUser && this.vecUser[seat]) {
                this.vecUser[seat].state = US_READY;
            }
        }
        if(this.m_bGameStarted == false)
        {
            if(wViewChairID == 0)
            {
                this.readyBtn.active = false;
            }
        }

        for(var i=0;i<this.players;i++)
        {
            var wViewChairID=this.SwitchViewChairID(i);
            if(this.vecUser[i].state == US_READY)
            {
                this.userList[wViewChairID].setReady(true);
            }else{
                this.userList[wViewChairID].setReady(false);
            }
        }
    },

    OnSubFaPai: function(vecIsReady,byFaPai){
        this.m_bTableStarted = true;
        this.m_bGameStarted = true;
        this.kaipaiFlg = false;
        
        for(var i=0;i<this.players;i++){
            this.userList[i].setReady(false);
            if(i == 0){
                this.userList[i].setSortPai(false);
            }else{
                this.userList[i].setSortPai(true);
            }
        }

        for(var i=0;i<this.players;i++){
            this.vecUser[i].state = US_NULL;
        }

        this.readyBtn.active = false;
        this.inviteBtn.active = false;

        this.m_vecReady = vecIsReady;
        this.cardDataList = byFaPai;//[11,58,36,34,8,56,54,7,4,55,21,28,57];//byFaPai;//[1,2,3,4,5,17,33,49,9,10,18,12,13];// [33,26,41,61,21,39,22,25,45,55,3,23,37];//[49,33,45,60,44,43,42,57,8,5,52,4,35];//
        this.SortSelectCardList(this.cardDataList,13);

        //手动摆牌 数据
        this.baipaiComponent.setHandPai(this.cardDataList);
        
        // this.nodeXuanPai.active = true;
        this.xuanPaiAction(true);

        //重置楼上的牌状态
        for(var i=0;i<3;i++){
            if(i == 0){
                for(var j =0;j<3;j++){
                    this.m_vecXuanPaiCard[i][j].card.active = false;
                }
            }else{
                for(var j =0;j<5;j++){
                    this.m_vecXuanPaiCard[i][j].card.active = false;
                }
            }
        }

        //记录已经在上面的牌数组初始化
        this.m_vecFloorCard = [];
        for(var i=0;i<3;i++){
            this.m_vecFloorCard[i] = [];
        }

        //完成界面牌的初始化隐藏
        this.reInitBackCard();
        for(var f = 0;f<3;f++)
        {
            for(var i = 0;i<4;i++)
            {
                this.userDoneCardBack[i][f].active = false;
            }
        }
        //完成界面算分的初始化隐藏
        for(var i=0;i<this.VecJieSuan.length;i++){
            this.VecJieSuan[i].active = false;
        }
        this.nodeJieSuan.active = false;

        //如果牌已经计算结束，直接上牌
        if(this.sortPaiReady == true){
            this.ReInitAiXuanPaiGroup();
            this.ReInitCardPut();
            this.baipaiComponent.initBaiPaiList();
        }

        this.renew_ui();

        this.baipaiUIReady = true;
    },

    showMyDoneCard : function(){
        //初始化牌
        for(var j =0;j<3;j++)
        {
            if(j == 0)
            {
                for(var m =0;m<3;m++)
                {
                    var data = this.vecReadyCard[j][m];
                    if(data != 0)
                    {
                        this.userDoneCard[0][j][m].getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(data);
                    }
                }
            }
            else
            {
                for(var m =0;m<5;m++)
                {
                    var data = this.vecReadyCard[j][m];
                    if(data != 0)
                    {
                        this.userDoneCard[0][j][m].getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(data);
                    }
                }
            }
        }

        //逐列显示
        for(var f = 0;f<3;f++)
        {
            if(data != 0){
                this.userDoneCardBack[0][f].runAction(cc.sequence(cc.delayTime((f + 1) * 1), cc.show()));
            }
        }
    },

    reInitBackCard : function(){
        for(var i =0; i<4;i++){
            //初始化背牌
            for(var j =0;j<3;j++){
                var max = (j==0)?3:5;
                for(var m =0;m<max;m++){
                    this.userDoneCard[i][j][m].getComponent(cc.Sprite).spriteFrame = this.sszPokerAtlas.getSpriteFrame(255);
                    this.userDoneCard[i][j][m].removeAllChildren();
                }
            }

            //隐藏道类型提示
            this.vecSpriteEffect[i].active = false;
        }
    },

    OnSubKaiPaiReady : function(byRound,vecIsKaiPaiReady){
        var that = this;

        this.m_vecIsKaiPaiReady = vecIsKaiPaiReady;

        this.Layout_Desktop.active = true;
        for(var i=0;i<this.players;i++)
        {
            var wViewChairID = this.SwitchViewChairID(i);
            if(vecIsKaiPaiReady[i] == 1)
            {
                if(wViewChairID == 0 && this._kaipai == false){
                    // this.nodeXuanPai.active = false;
                    this.xuanPaiAction(false);
                    this._kaipai = true;

                    //this.showMyDoneCard();
                }
                this.userDoneCardBack[wViewChairID][0].active = true;
                this.userDoneCardBack[wViewChairID][1].active = true;
                this.userDoneCardBack[wViewChairID][2].active = true;
                //关闭"理牌中..."
                this.userList[wViewChairID].setSortPai(false);                
            }else{
                //显示"理牌中..."
                this.userList[wViewChairID].setSortPai(true);
                this.userDoneCardBack[wViewChairID][0].active = false;
                this.userDoneCardBack[wViewChairID][1].active = false;
                this.userDoneCardBack[wViewChairID][2].active = false;
            }
        }
    },

    OnSubJieSuan : function(round,ScoreList){
        var that = this;
        this.againBtn.setVisible(true);
        this.reportBtn.setVisible(false);
        this.m_vecRoundScore = [0,0,0,0,0];
        this.m_vecUserScore = [0,0,0,0,0];

        for(var i=1;i<this.players;i++)
        {
            this.userDoneCardBack[i][0].active = false;
            this.userDoneCardBack[i][1].active = false;
            this.userDoneCardBack[i][2].active = false;

            this.userBullet[i][0].active = false;
            this.userBullet[i][1].active = false;
            this.userBullet[i][2].active = false;
        }

        for (var i=0;i<this.players;i++)
        {
            this.m_vecRoundScore[i] = ScoreList[i].round_score;
            this.m_vecUserScore[i] =  ScoreList[i].user_score;

            if(this.vecUser && this.vecUser[i]  && this.vecUser[i].uid > 0)
            {
                this.vecUser[i].score = ScoreList[i].user_score;
            }
        }
    },

    SortSelectCardList: function (cbCardData,cbCardCount) {
        //转换数值
        var cbLogicValue = new Array(cbCardData.length);
        for (var i = 0; i < cbCardCount; i++) cbLogicValue[i] = this.GetCardLogicValue(cbCardData[i]);

        //排序操作
        var bSorted = true;
        var cbTempData, bLast = (cbCardCount - 1);
        do
        {
            bSorted = true;
            for (var i = 0; i < bLast; i++)
            {
                if ((cbLogicValue[i] < cbLogicValue[i + 1]) ||
                    ((cbLogicValue[i] == cbLogicValue[i + 1])))
                {
                    //交换位置
                    cbTempData = cbCardData[i];
                    cbCardData[i] = cbCardData[i+1];
                    cbCardData[i+1] = cbTempData;
                    cbTempData = cbLogicValue[i];
                    cbLogicValue[i] = cbLogicValue[i+1];
                    cbLogicValue[i+1] = cbTempData;
                    bSorted = false;
                }
            }
            bLast--;
        } while (bSorted == false);

    },
    
    ReInitAiXuanPaiGroup:function(){
        this.aiGroupList = this.sszCardList.getAiGroup();
        /*
        for(var i = 0; i<this.aiGroupList.length;i++){
            var groupNode = this.aiGroupList[i];
            var vecTDPai = groupNode[0];
            var vecSDPai = groupNode[1];
            var vecFDPai = groupNode[2];
        }
        */
        
        this.initCardTypeGroupList(this.aiGroupList);
    },

    ReinitOneCard:function(cardNode,cardData){
        cardNode.card.getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(cardData);
        cardNode.card.removeAllChildren();

        //增加马牌标识
        if(cardData == this.mapai){
            this.addMaPaiToPai(cardNode.card,cc.v2(27,-38));
        } 

        cardNode.card.active = true;
        cardNode.byPai = cardData;
        if(cardNode.isSelected == true){
            cardNode.isSelected = false;
            cardNode.isPop  =  false;
            cardNode.card.y -= 10;
            cardNode.isFloor = false;
        }
    },  

    ReInitCardPut:function(){
         for(var i =0;i<3;i++){
            var cardList = this.m_vecXuanPaiCard[i];
            this.vecReadyCard[i] = [];
            if(i == 0){
                for(var j=0;j<3;j++){
                    this.ReinitOneCard(cardList[j],this.cardDataList[j]);
                    this.vecReadyCard[i][j] = this.cardDataList[j];                  
                }
            }
            else if(i == 1){
                for(var j=0;j<5;j++){
                    this.ReinitOneCard(cardList[j],this.cardDataList[3+j]);
                    this.vecReadyCard[i][j] = this.cardDataList[3+j];
                }
            }
            else if(i==2){
                for(var j=0;j<5;j++){
                    this.ReinitOneCard(cardList[j],this.cardDataList[8+j]);
                    this.vecReadyCard[i][j] = this.cardDataList[8+j];                     
                }
            }
        }
    },

    CompareCard: function (cbFirstData,cbNextData,cbCardCount) {
        //获取类型
        var cbNextType=this.GetCardType(cbNextData,cbCardCount);
        var cbFirstType=this.GetCardType(cbFirstData,cbCardCount);

        //类型判断
        //大
        if(cbFirstType>cbNextType)
            return 2;

        //小
        if(cbFirstType<cbNextType)
            return 1;

        //简单类型
        switch(cbFirstType)
        {
            case Constants.CT_SINGLE:			//单牌
            {
                //对比数值
                var i=0;
                for (i=0;i<cbCardCount;i++)
                {
                    var cbNextValue=this.GetCardLogicValue(cbNextData[i]);
                    var cbFirstValue=this.GetCardLogicValue(cbFirstData[i]);

                    //大
                    if(cbFirstValue > cbNextValue)
                        return 2;
                    //小
                    else if(cbFirstValue <cbNextValue)
                        return 1;
                    //等
                    else
                        continue;
                }
                //平
                if( i == cbCardCount)
                {
                    i = 0;
                    for (i = 0; i < cbCardCount; i++) {

                        var cbFirstColor = this.GetCardColor(cbFirstData[i]);
                        var cbNextColor = this.GetCardColor(cbNextData[i]);

                        // 大
                        if (cbFirstColor > cbNextColor)
                            return 2;
                        // 小
                        else if (cbFirstColor < cbNextColor)
                            return 1;
                        // 等
                        else
                            continue;
                    }
                    return 0;
                }
                break;
            }
            case Constants.CT_ONE_LONG:		//对子
            case Constants.CT_TWO_LONG:		//两对
            case Constants.CT_THREE_TIAO:	//三条
            case Constants.CT_TIE_ZHI:		//铁支
            case Constants.CT_HU_LU:		//葫芦
            {
                //分析扑克
                var AnalyseResultNext = ssz.tagAnalyseResult2;
                AnalyseResultNext.initData();
                var AnalyseResultFirst = ssz.tagAnalyseResult3;
                AnalyseResultFirst.initData();
                this.AnalysebCardData(cbNextData,cbCardCount,AnalyseResultNext);
                this.AnalysebCardData(cbFirstData,cbCardCount,AnalyseResultFirst);

                //四条数值
                if (AnalyseResultFirst.cbFourCount>0)
                {
                    var cbNextValue=AnalyseResultNext.cbFourLogicVolue[0];
                    var cbFirstValue=AnalyseResultFirst.cbFourLogicVolue[0];

                    //比较四条
                    if(cbFirstValue != cbNextValue)return (cbFirstValue > cbNextValue)?2:1;

                    //比较单牌
                    cbFirstValue = AnalyseResultFirst.cbSignedLogicVolue[0];
                    cbNextValue = AnalyseResultNext.cbSignedLogicVolue[0];
                    if(cbFirstValue != cbNextValue)return (cbFirstValue > cbNextValue)?2:1;
                    else
                    {
                        var i = 0;
                        for (i = 0; i < cbCardCount; i++) {

                            var cbFirstColor = this.GetCardColor(cbFirstData[i]);
                            var cbNextColor = this.GetCardColor(cbNextData[i]);

                            // 大
                            if (cbFirstColor > cbNextColor)
                                return 2;
                            // 小
                            else if (cbFirstColor < cbNextColor)
                                return 1;
                            // 等
                            else
                                continue;
                        }
                        return 0;
                    }
                }

                //三条数值
                if (AnalyseResultFirst.cbThreeCount>0)
                {
                    var cbNextValue=AnalyseResultNext.cbThreeLogicVolue[0];
                    var cbFirstValue=AnalyseResultFirst.cbThreeLogicVolue[0];

                    //比较三条
                    if(cbFirstValue != cbNextValue)return (cbFirstValue > cbNextValue)?2:1;

                    //葫芦牌型
                    if(Constants.CT_HU_LU == cbFirstType)
                    {
                        //比较对牌
                        cbFirstValue = AnalyseResultFirst.cbLONGLogicVolue[0];
                        cbNextValue = AnalyseResultNext.cbLONGLogicVolue[0];
                        if(cbFirstValue != cbNextValue)return (cbFirstValue > cbNextValue)?2:1;
                        else
                        {
                            var i = 0;
                            for (i = 0; i < cbCardCount; i++) {

                                var cbFirstColor = this.GetCardColor(cbFirstData[i]);
                                var cbNextColor = this.GetCardColor(cbNextData[i]);

                                // 大
                                if (cbFirstColor > cbNextColor)
                                    return 2;
                                // 小
                                else if (cbFirstColor < cbNextColor)
                                    return 1;
                                // 等
                                else
                                    continue;
                            }
                            return 0;
                        }
                    }
                    else //三条带单
                    {
                        //比较单牌

                        //散牌数值
                        var i=0;
                        for (i=0;i<AnalyseResultFirst.cbSignedCount;i++)
                        {
                            var cbNextValue2=AnalyseResultNext.cbSignedLogicVolue[i];
                            var cbFirstValue2=AnalyseResultFirst.cbSignedLogicVolue[i];
                            //大
                            if(cbFirstValue > cbNextValue2)
                                return 2;
                            //小
                            else if(cbFirstValue2 <cbNextValue2)
                                return 1;
                            //等
                            else continue;
                        }
                        if( i == AnalyseResultFirst.cbSignedCount)
                        {
                            var i = 0;
                            for (i = 0; i < cbCardCount; i++) {

                                var cbFirstColor = this.GetCardColor(cbFirstData[i]);
                                var cbNextColor = this.GetCardColor(cbNextData[i]);

                                // 大
                                if (cbFirstColor > cbNextColor)
                                    return 2;
                                // 小
                                else if (cbFirstColor < cbNextColor)
                                    return 1;
                                // 等
                                else
                                    continue;
                            }
                            return 0;
                        }
                    }
                }

                //对子数值
                var i=0;
                for ( i=0;i<AnalyseResultFirst.cbLONGCount;i++)
                {
                    var cbNextValue=AnalyseResultNext.cbLONGLogicVolue[i];
                    var cbFirstValue=AnalyseResultFirst.cbLONGLogicVolue[i];
                    //大
                    if(cbFirstValue > cbNextValue)
                        return 2;
                    //小
                    else if(cbFirstValue <cbNextValue)
                        return 1;
                    //平
                    else
                        continue;
                }

                //比较单牌
                {

                    //散牌数值
                    for (i=0;i<AnalyseResultFirst.cbSignedCount;i++)
                    {
                        var cbNextValue=AnalyseResultNext.cbSignedLogicVolue[i];
                        var cbFirstValue=AnalyseResultFirst.cbSignedLogicVolue[i];
                        //大
                        if(cbFirstValue > cbNextValue)
                            return 2;
                        //小
                        else if(cbFirstValue <cbNextValue)
                            return 1;
                        //等
                        else continue;
                    }
                    //平
                    if( i == AnalyseResultFirst.cbSignedCount)
                    {
                        i = 0;
                        for (i = 0; i < cbCardCount; i++) {

                            var cbFirstColor = this.GetCardColor(cbFirstData[i]);
                            var cbNextColor = this.GetCardColor(cbNextData[i]);

                            // 大
                            if (cbFirstColor > cbNextColor)
                                return 2;
                            // 小
                            else if (cbFirstColor < cbNextColor)
                                return 1;
                            // 等
                            else
                                continue;
                        }
                        return 0;
                    }
                }
                break;
            }

            case Constants.CT_SHUN_ZI:		//顺子
            case Constants.CT_TONG_HUA_SHUN:	//同花顺
            {
                //数值判断
                var cbNextValue=this.GetCardLogicValue(cbNextData[0]);
                var cbFirstValue=this.GetCardLogicValue(cbFirstData[0]);

                var bFirstmin = (cbFirstValue == (this.GetCardLogicValue(cbFirstData[1]) + 9));
                var bNextmin = (cbNextValue == (this.GetCardLogicValue(cbNextData[1]) + 9));

                /*
                var bFirstmin = false;
                if(cbFirstValue ==(this.GetCardLogicValue(cbFirstData[1])+9))
                {
                    bFirstmin = true;
                }else {
                    bFirstmin = false;
                }
                var bNextmin = false;
                if(cbNextValue ==(this.GetCardLogicValue(cbNextData[1])+9))
                {
                    bNextmin = true;
                }else {
                    bNextmin = false;
                }
                //大小顺子
                if ((bFirstmin==true)&&(bNextmin == false))
                {
                    return 1;
                }
                //大小顺子
                else if ((bFirstmin==false)&&(bNextmin == true))
                {
                    return 2;
                }
                //等同顺子
                else
                {
                */
                if(cbFirstValue > cbNextValue)
                {
                    return 2;
                }else if(cbFirstValue < cbNextValue)
                {
                    return 1;
                }else {
                    //平
                    if(cbFirstValue == cbNextValue)
                    {
                        if ((cbFirstValue == 14) && (bFirstmin == true) && (bNextmin == false)) {
                            return 1;
                        }
                        if ((cbNextValue == 14) && (bFirstmin == false) && (bNextmin == true)) {
                            return 2;
                        }
                        var i = 0;
                        for (i = 0; i < cbCardCount; i++) {

                            var cbFirstColor = this.GetCardColor(cbFirstData[i]);
                            var cbNextColor = this.GetCardColor(cbNextData[i]);

                            // 大
                            if (cbFirstColor > cbNextColor)
                                return 2;
                            // 小
                            else if (cbFirstColor < cbNextColor)
                                return 1;
                            // 等
                            else
                                continue;
                        }
                        return 0;
                    }
                    return (cbFirstValue > cbNextValue)?2:1;
                }
            }
            case Constants.CT_TONG_HUA:		//同花
            {
                var i = 0;
                //散牌数值
                for (i=0;i<cbCardCount;i++)
                {
                    var cbNextValue=this.GetCardLogicValue(cbNextData[i]);
                    var cbFirstValue=this.GetCardLogicValue(cbFirstData[i]);

                    if(cbFirstValue == cbNextValue)continue;
                    return (cbFirstValue > cbNextValue)?2:1;
                }
                //平
                if( i == cbCardCount)
                {
                    i = 0;
                    for (i = 0; i < cbCardCount; i++) {

                        var cbFirstColor = this.GetCardColor(cbFirstData[i]);
                        var cbNextColor = this.GetCardColor(cbNextData[i]);

                        // 大
                        if (cbFirstColor > cbNextColor)
                            return 2;
                        // 小
                        else if (cbFirstColor < cbNextColor)
                            return 1;
                        // 等
                        else
                            continue;
                    }
                    return 0;
                }
            }
        }

        return  0;
    },
    
    GetCardType: function (cbCardData,cbCardCount) {
        //数据校验

        //变量定义
        var cbSameColor=true,bLineCard=true;
        var cbFirstColor=this.GetCardColor(cbCardData[0]);
        var cbFirstValue=this.GetCardLogicValue(cbCardData[0]);

        //牌形分析
        for (var i=1;i<cbCardCount;i++)
        {
            //数据分析
            if (this.GetCardColor(cbCardData[i])!=cbFirstColor) cbSameColor=false;
            if (cbFirstValue!=(this.GetCardLogicValue(cbCardData[i])+i)) bLineCard=false;

            //结束判断
            if ((cbSameColor==false)&&(bLineCard==false)) break;
        }

        //最小同花顺
        if((bLineCard == false)&&(cbFirstValue == 14))
        {
            var i=1;
            for (i=1;i<cbCardCount;i++)
            {
                var cbLogicValue=this.GetCardLogicValue(cbCardData[i]);
                if ((cbFirstValue!=(cbLogicValue+i+8))) break;
            }
            if( i == cbCardCount)
                bLineCard =true;
        }

        if(cbCardCount == 3)
        {
            //扑克分析
            var AnalyseResult = ssz.tagAnalyseResult1;
            AnalyseResult.initData();
            this.AnalysebCardData(cbCardData,cbCardCount,AnalyseResult);

            //类型判断
            if (AnalyseResult.cbThreeCount==1)
                return Constants.CT_THREE_TIAO;
            if (AnalyseResult.cbLONGCount==1)
                return Constants.CT_ONE_LONG;

        }else{

            //皇家同花顺
            if ((cbSameColor==true)&&(bLineCard==true)&&(this.GetCardLogicValue(cbCardData[1]) ==13 ))
                return Constants.CT_KING_TONG_HUA_SHUN;

            //顺子类型
            if ((cbSameColor==false)&&(bLineCard==true))
                return Constants.CT_SHUN_ZI;

            //同花类型
            if ((cbSameColor==true)&&(bLineCard==false))
                return Constants.CT_TONG_HUA;

            //同花顺类型
            if ((cbSameColor==true)&&(bLineCard==true))
                return Constants.CT_TONG_HUA_SHUN;

            //扑克分析
            var AnalyseResult = ssz.tagAnalyseResult1;
            AnalyseResult.initData();
            this.AnalysebCardData(cbCardData,cbCardCount,AnalyseResult);

            //类型判断
            if (AnalyseResult.cbFourCount==1)
                return Constants.CT_TIE_ZHI;
            if (AnalyseResult.cbLONGCount==2)
                return Constants.CT_TWO_LONG;
            if ((AnalyseResult.cbLONGCount==1)&&(AnalyseResult.cbThreeCount==1))
                return Constants.CT_HU_LU;
            if ((AnalyseResult.cbThreeCount==1)&&(AnalyseResult.cbLONGCount==0))
                return Constants.CT_THREE_TIAO;
            if ((AnalyseResult.cbLONGCount==1)&&(AnalyseResult.cbSignedCount==3))
                return Constants.CT_ONE_LONG;

        }
        return Constants.CT_SINGLE;
    },

    GetCardColor: function (data) {
        var bCardValue = parseInt(data/16);
        return bCardValue;
    },

    GetCardLogicValue: function (data) {
        var bCardValue = data%16;
        if(bCardValue ==1)
        {
            bCardValue = 14;
        }
        return bCardValue;
    },

    AnalysebCardData: function (cbCardData,cbCardCount,AnalyseResult) {
        //设置结果
       // AnalyseResult.clear();

        //扑克分析
        for (var i=0;i<cbCardCount;i++)
        {
            //变量定义
            var cbSameCount=1;
            var cbSameCardData = [cbCardData[i],0,0,0,0];
            var cbLogicValue=this.GetCardLogicValue(cbCardData[i]);
            if(cbLogicValue ==1){cbLogicValue=14};

            //获取同牌
            for (var j=i+1;j<cbCardCount;j++)
            {
                //逻辑对比
                var temValue = cbCardData[j]%16;
                if(temValue ==1){temValue = 14;}
                if (temValue!=cbLogicValue)
                {
                    break;
                }
                //设置扑克
                cbSameCardData[cbSameCount++]=cbCardData[j];
            }

            //保存结果
            switch (cbSameCount)
            {
                case 1:		//单张
                {
                    AnalyseResult.cbSignedLogicVolue[AnalyseResult.cbSignedCount]=cbLogicValue;
                    for(var k=0;k<cbSameCount;k++)
                    {
                        AnalyseResult.cbSignedCardData[(AnalyseResult.cbSignedCount)*cbSameCount+k] = cbSameCardData[k];
                    }
                    AnalyseResult.cbSignedCount++;
                    break;
                }
                case 2:		//两张
                {
                    AnalyseResult.cbLONGLogicVolue[AnalyseResult.cbLONGCount]=cbLogicValue;
                    for(var k=0;k<cbSameCount;k++)
                    {
                        AnalyseResult.cbLONGCardData[(AnalyseResult.cbLONGCount)*cbSameCount+k] = cbSameCardData[k];
                    }
                    AnalyseResult.cbLONGCount++;
                    break;
                }
                case 3:		//三张
                {
                    AnalyseResult.cbThreeLogicVolue[AnalyseResult.cbThreeCount]=cbLogicValue;
                    for(var k=0;k<cbSameCount;k++)
                    {
                        AnalyseResult.cbThreeCardData[(AnalyseResult.cbThreeCount)*cbSameCount+k] = cbSameCardData[k];
                    }
                    AnalyseResult.cbThreeCount++;
                    break;
                }
                case 4:		//四张
                {
                    AnalyseResult.cbFourLogicVolue[AnalyseResult.cbFourCount]=cbLogicValue;
                    for(var k=0;k<cbSameCount;k++)
                    {
                        AnalyseResult.cbFourCardData[(AnalyseResult.cbFourCount)*cbSameCount+k] = cbSameCardData[k];
                    }
                    AnalyseResult.cbFourCount++;
                    break;
                }
            }

            //设置递增
            i+=cbSameCount-1;
        }

        return;
    },

    //TODO
    OnSubQiangZhuang: function()
    {
        this.getCurrentZhuang();
        if (this.m_zhuangMode == "DINGZHUANG") {
            var realSeat = this.SwitchRealChairID(0);
            if(realSeat == 0){               
                this.common('qiangzhuang',{power:1});
                
            }else {
                this.nodeQiangZhuang.active = false;
            }
        }

        if (this.m_zhuangMode == "LUNZHUANG") {
            if(this.zhuangSeat == 0){                
                this.common('qiangzhuang',{power:1});                
            }else {
                this.nodeQiangZhuang.active = false;
            }
        }

        if (this.m_zhuangMode == "QIANGZHUANG") {
            this.nodeQiangZhuang.active = true;
        }
    },

    getCurrentZhuang:function () {
        var cntUser = 0;
        for(var i = 0;i<5;i++)
        {
            if(this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0)
            {
                cntUser++;
            }
        }

        this.zhuangSeat++;
        if(this.zhuangSeat == cntUser){
            this.zhuangSeat=0;
        }
    },

    OnSubDingZhuang: function(uid,seat,power,vecQiangZhuang)
    {
        var that = this;
        that.nodeQiangZhuang.active = false;
        this.unschedule(this.tip_qiangzhuang_game);
        this.OnBuQiangZhuangBtnClick();
        var vecQiangZhuangViewChair= [] ;
        for (var i=0;i<5;i++)
        {
            if(vecQiangZhuang[i] > 0) {
                vecQiangZhuangViewChair.push(this.SwitchViewChairID(i));
            }
        }
        this.m_byZhuang = seat;
        var wViewZhuang= this.SwitchViewChairID(seat);
        this.xuanZhuangIndex = 0;
        this.xuanZhuangCounter = 0;
        this.playXuanZhuangEffect(vecQiangZhuangViewChair,wViewZhuang,this.OnDingZhuangCallBack.bind(this));
    },

    //开始
    OnStartBtnClick: function () {
        var that = this
        var cntUser = 0;
        for(var i = 0;i<this.players;i++){
            if(that.vecUser && that.vecUser[i] && that.vecUser[i].uid > 0){
                cntUser++;
            }
        }

        if(cntUser > 1) {
            this.startBtn.active = false;
            this.inviteBtn.active = false;
            this.common('start');
        }else{
            this.OnShowHint("房间内至少有2个人才能开始");
        }
    },

    //解散
    OnJieSanBtnClick: function () {

        //如果房间已经解散，掉线回去后回大厅
        if(cc.vv.userMgr.room_id == 0 && cc.director.getScene().name != 'hall'){
            cc.vv.sceneMgr.gotoHall();
            return;
        }

        var that = this;
        var cntUser = 0;
        for(var i = 0;i<5;i++)
        {
            if(that.vecUser && that.vecUser[i] && that.vecUser[i].uid > 0)
            {
                cntUser++;
            }
        }

        if(cntUser > 1) {
            cc.vv.alert.show("提示","您是否确认要申请解散房间？",function(){
                that.common('try_dismiss_room');
            },true); 
        }else{
            cc.vv.alert.show("提示","解散房间不扣钻石,\n是否确认解散？",function(){
                that.common('try_dismiss_room');
            },true);
        }
    },
    
    OnSubFinalReport : function(cbReason,vecResultScore)
    {
        var that = this;
        var report = [];

        for(var i=0;i<4;i++){
            report[i] = {};
            if(this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0){
                report[i].uid = this.vecUser[i].uid;
                report[i].nickname = this.vecUser[i].nickname;
                report[i].avatar_url = this.vecUser[i].avatar_url;
                report[i].resultScore = vecResultScore[i];
            }else{
                report[i].uid = 0;
                report[i].nickname = "";
                report[i].avatar_url = "";
                report[i].resultScore = 0;
            }
        }

        this.report = report;
        this.final_report = report;

        if(cbReason == 4){
            cc.vv.GameResult.showReport(this.mRoomID,cbReason,this.final_report,this.m_nRound,this.m_nMaxRound);
            this.gameresult.active = true;
        }
        else{
            /*
            if(that.final_report){
                this.scheduleOnce(function(){
                    cc.vv.GameResult.showReport(that.mRoomID,cbReason,that.final_report,that.m_nRound,that.m_nMaxRound);
                    that.gameresult.active = true;
                },4);
            }
            */
        }
    },

    /////////////////////////////////////////////非按钮方法逻辑///////////////////////////////////////////////
    //开始游戏动画
    playGameStartAnimation: function (vecIsReady,vecPai) {
        var that=this;        
        this.sszStartspine.setAnimation(0,'kaishi',false);
        this.sszStartspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            that.sszStartAnimaNode.active = false;
            that.OnSubFaPai(vecIsReady,vecPai);            
            that.playSexSFX(that.userList[0]._sex,"start_poker");
        });

        this.sszStartAnimaNode.active = true;
        cc.vv.audioMgr.playSFX("ssz/openface/fantasy");
    },

    //开始比牌动画
    playBgCCardAnimation:function(vecCard,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag){
        var that=this;
        this.sszBgCompCardspine.setAnimation(0,'bipai',false);
        this.sszBgCompCardspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            that.sszBgCompCardAnimaNode.active = false;

            that.OnUserKaiPai(vecCard,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag);
        });

        this.sszBgCompCardAnimaNode.active = true;
        cc.vv.audioMgr.playSFX("ssz/openface/fantasy");
        this.playSexSFX(this.userList[0]._sex,"start_compare");
    },

    //显示全垒打动画
    playHomeRunAnimation:function(){
        var that = this;
        this.sszHomeRunspine.setAnimation(0,'quanleida',false);
        this.sszHomeRunspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            that.sszHomeRunAnimaNode.active = false;
        });

        this.sszHomeRunAnimaNode.active = true;
        this.playSexSFX(this.userList[0]._sex,"special1");
    },

    //显示打枪准备动画
    playShotReadyAnimation:function(){
        var that = this;
        this.sszShotReadyspine.setAnimation(0,'daqiang',false);
        this.sszShotReadyspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            that.sszShotReadyAnimaNode.active = false;
        });

        this.sszShotReadyAnimaNode.active = true;
        this.playSexSFX(this.userList[0]._sex,"daqiang1");
    },

    //计算两点之间的直角坐标系内，角度
    go: function(p1, p2)
    {
        return Math.atan((p2.y - p1.y) / (p2.x - p1.x)) * 180 / Math.PI;
    },

    //显示打枪动画
    playShotAnimation:function(shotInfo){
        var that = this;
        
        var shot_effect = [{pos:cc.v2(-155,-195),face:[{x:1,y:1,rate:0},   {x:1,y:-1,rate:165}, {x:1,y:-1,rate:128},{x:1,y:1,rate:55}]},
                           {pos:cc.v2(554,70),   face:[{x:1,y:1,rate:-38}, {x:1,y:1,rate:0},    {x:1,y:1,rate:12},  {x:1,y:1,rate:-15}]},
                           {pos:cc.v2(190,188), face:[{x:1,y:1,rate:-75},{x:1,y:-1,rate:-120},{x:1,y:1,rate:0},{x:1,y:1,rate:-32}]},
                           {pos:cc.v2(-520,-40), face:[{x:-1,y:1,rate:30}, {x:-1,y:1,rate:0},  {x:-1,y:1,rate:-20},{x:1,y:1,rate:0}]}];
            
        var wViewChairID_f = this.SwitchViewChairID(shotInfo.f_seat_id);
        var wViewChairID_t = this.SwitchViewChairID(shotInfo.t_seat_id);
        var seat_f = this.userList[wViewChairID_f];
        var seat_t = this.userList[wViewChairID_t];

        var pos = shot_effect[wViewChairID_f].pos;
        var face = shot_effect[wViewChairID_f].face[wViewChairID_t];


        //调整枪的位置，角度

        //var rotation =  this.go(seat_f.node.position,seat_t.node.position);
        //转化成世界坐标
        //var gunWorldPos = seat_f.node.convertToWorldSpace(seat_f.node.position);
        //var nodeEndPoint = this.sszShotAnimaNode.convertToNodeSpace(gunWorldPos);
        //this.sszShotAnimaNode.setPosition(seat_f.node.position);
        //this.sszShotAnimaNode.rotation = 0 - rotation;
        
        this.sszShotAnimaNode.setPosition(pos);
        this.sszShotAnimaNode.scaleX = face.x * Math.abs(this.sszShotAnimaNode.scaleX);
        this.sszShotAnimaNode.scaleY = face.y * Math.abs(this.sszShotAnimaNode.scaleY);
        this.sszShotAnimaNode.rotation = face.rate;

        this.sszShotspine.setAnimation(0,'kaiqiang',false);
        this.sszShotspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            this.userBullet[wViewChairID_t][0].active = false;
            this.userBullet[wViewChairID_t][1].active = false;
            this.userBullet[wViewChairID_t][2].active = false;
            that.sszShotAnimaNode.active = false;
        });

        this.sszShotspine.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);

            //显示抢眼
            if('slot1' == event.data.name){
                this.userBullet[wViewChairID_t][0].active = true;    
            }else if('slot2' == event.data.name){
                this.userBullet[wViewChairID_t][1].active = true;
            }else if('slot3' == event.data.name){
                this.userBullet[wViewChairID_t][2].active = true;
            }

            cc.vv.audioMgr.playSFX("ssz/openface/daqiang3");
        });
        
        this.sszShotAnimaNode.active = true;
        cc.vv.audioMgr.playSFX("ssz/openface/bullets");
    },

    //显示即将开始动画
    playReadyAnimation:function(){
        var that = this;
        this.sszReadyspine.setAnimation(0,'jijiangkaishi',true);
        this.sszReadyspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
        });
        this.sszReadyAnimaNode.active = false;
    },

    GetMeChairID : function()//坐标映射
    {
        return this.mChairID;
    },

    SwitchViewChairID : function( wChairID )//坐标映射
    {
        //转换椅子
        var wViewChairID=Math.abs(wChairID+this.players-this.GetMeChairID());

        return wViewChairID % this.players;
    },
    SwitchRealChairID : function( wChairID )//坐标映射
    {
        //转换椅子
        var wRealChairID=this.GetMeChairID() + wChairID;

        return wRealChairID % this.players;
    },
    VecStr2Int : function(vec){
        var result = [];
        for(var i = 0;i<vec.length;i++)
        {
            result[i] = parseInt(vec[i])
        }
        return result;
    },

    deal:function(name,data){
        if(data.errcode != 0){
            cc.vv.tip.show(data.errmsg);
            return;
        }
        data = data.data;
        var self = this;

        if(name == 'table'){
            this.mRoomID = data.roomid;//房间ID
            this.m_bTableStarted = data.table_started;//房间状态
            this.m_nRound = data.round;//局数
            this.m_nMaxRound = data.max_round;//总局数
            this.m_bGameStarted = data.game_started;//是否开局
            this.m_cntLookon = data.lookon;//观众
            //this.m_cntUser = data.user;//玩家数量

            if(this.m_nRound == 0){
                this.m_nRound = 1;
            }

            this.fjhLabel.string = "房号:"+this.mRoomID;

            if(this.m_bTableStarted){
                this.inviteBtn.active = false;
                this.readyBtn.active  = false;
            }
            else{
                this.inviteBtn.active = true;
            }

            var vecSeatInfo =data.list;
     
            var userInfoList = [];
            for(var i =0;i< this.players ;i++){
                var seatInfo = vecSeatInfo[i];
                var userInfo={};
                userInfo.uid = seatInfo.userid;
                userInfo.score=seatInfo.coins;
                userInfo.nickname=seatInfo.nickname;
                //userInfo.diFen=seatInfo.bet_coins;
                userInfo.gender=seatInfo.sex;
                userInfo.avatar=seatInfo.avatar;
                userInfo.state=seatInfo.status;
                userInfo.vip=seatInfo.vip;
                userInfo.title=seatInfo.title;
                userInfo.lookon=seatInfo.lookon;
                userInfo.ip=seatInfo.ip;
                userInfo.online=seatInfo.online;
                userInfoList.push(userInfo);
            }
            this.OnSubTable(userInfoList);
        }        
        else if (name == "table_begin"){
            this.m_bTableStarted = true;
            this.m_bGameStarted  = true;

            var byRound = data.now_round;
            var byMaxRound = data.max_round;
            var vecIsReady = [];
            var vecIsKaiPaiReady = [];
            if(data.list){
                for(var i =0;i++;i<data.list.length){
                    vecIsReady.push(data.list[i].ready);
                    vecIsKaiPaiReady.push(data.list[i].status);                    
                }
            }

            this.m_vecIsReady = vecIsReady;
            this.m_vecIsKaiPaiReady = vecIsKaiPaiReady;
        }
        else if (name == "table_side")
        {
            var bySeatID = data.seatid;
            var bIsReady = data.ready;
            var bIsKaiPaiReady = data.status;
            var byHandPai = data.cards;
            //byHandPai = [49,41,45,60,44,43,42,57,8,5,52,4,35];
            if(bySeatID == this.mChairID){
                this.cardDataList = byHandPai;
                this.SortSelectCardList(this.cardDataList,13);
                this.sszCardList.initData();
                this.sszCardList.SortCardTypeGroupAi(this.cardDataList,this.paixin);
            }
        }
        else if (name == "table_end")
        {
            this.renew_ui();

            for(var i=0;i<4;i++){
                var wViewChairID = this.SwitchViewChairID(i);
                if(this.m_vecIsKaiPaiReady[i] == 1){
                    this.userDoneCardBack[wViewChairID][0].active = true;
                    this.userDoneCardBack[wViewChairID][1].active = true;
                    this.userDoneCardBack[wViewChairID][2].active = true;
                }else{
                    this.userDoneCardBack[wViewChairID][0].active = true;
                    this.userDoneCardBack[wViewChairID][1].active = true;
                    this.userDoneCardBack[wViewChairID][2].active = true;
                }
            }

            this.m_bTableStarted = true;
            this.m_bGameStarted = true;

            this.readyBtn.active = false;
            this.inviteBtn.active = false;

            // this.nodeXuanPai.active = true;
            this.xuanPaiAction(true);

            //重置楼上的牌状态
            for(var i=0;i<3;i++){
                if(i == 0){
                    for(var j =0;j<3;j++)
                    {
                        this.m_vecXuanPaiCard[i][j].card.active = false;
                    }
                }
                else{
                    for(var j =0;j<5;j++)
                    {
                        this.m_vecXuanPaiCard[i][j].card.active = false;
                    }
                }
            }

            //记录已经在上面的牌数组初始化
            this.m_vecFloorCard = [];
            for(var i=0;i<3;i++){
                this.m_vecFloorCard[i] = [];
            }

            //完成界面牌的初始化隐藏
            for(var f = 0;f<3;f++)
            {
                for(var i = 0;i<4;i++)
                {
                    this.userDoneCardBack[i][f].active = false;
                }
            }

            for(var i = 0;i<4;i++){
                this.userBullet[i][0].active = false;
                this.userBullet[i][1].active = false;
                this.userBullet[i][2].active = false;
            }

            this.ReInitAiXuanPaiGroup();         
            this.ReInitCardPut();
        }
        else if (name == 'param') {
            var room_id = data.roomid;//房间ID

            // //1传统 3 345倍 10 疯狂10倍 15 疯狂15倍
            // this._yabei = data.yabei;

            // //0 明牌 1 暗牌
            // this._wanfa = data.wanfa;

            //是否有特殊牌 
            //1：有 0：无
            this.paixin = data.paixin;

            //玩家人数
            this.players = data.ren;
            
            //房间介绍
            this.descLabel.getComponent(cc.Label).string = data.desc;

            //马牌
            this.mapai = data.mapai;

            //马牌
            if(data.mapai == 0){
                this.mapaiSprite.active = false;
            }else{
                this.mapaiSprite.getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(data.mapai); 
                this.mapaiSprite.active = true;                           
            }
            
        }
        else if (name == "stage"){
            var stage = data.stage;
            var deal_time = data.deal_time;

            this.OnSubStage(stage,deal_time,data);
        }
        else if(name == 'ready'){
            var uid  = data.userid;
            var seat = data.seatid;
            this.OnSubReady(uid,seat);
        }
        else if(name == 'sit'){
            var uid = data.userid;
            var seat = data.seatid;
            var table_id = data.roomid;
            var score = data.score;
            var nickname = data.nickname;
            var gender =  data.sex;
            var avatar = data.avatar;
            var ip = data.ip;
            var stage = data.status;

            this.OnSubSit(uid,seat,table_id,score,nickname,gender,avatar,ip,stage);
        }
        else if (name == "standup") {
            var uid = parseInt(vecArg[1]);

            this.OnSubStandUp(uid);
        }
        else if(name == "fapai"){
            var vecIsReady = data.ready;
            var vecPai = data.pai;
            this.m_nRound = data.round;
            this.m_nMaxRound = data.max_round;

            this.baipaiHand = vecPai;

            this.sszReadyspine.clearTrack(0);
            this.sszReadyAnimaNode.active = false;
            this._kaipai = false;

            this.baipaiUIReady = false;
            this.sortPaiReady  = false;
            var that = this;

            for(var i = 0; i<this.players;i++){   
                var wViewChairID = this.SwitchViewChairID(i);                    
                this.userList[wViewChairID].setWinCoinFixed(null);
            }

            //开始算牌
            this.scheduleOnce(function(){
                that.sszCardList.initData();
                that.sszCardList.SortCardTypeGroupAi(vecPai,that.paixin);
                if(that.baipaiUIReady){
                    that.ReInitAiXuanPaiGroup();
                    that.ReInitCardPut();
                    that.baipaiComponent.initBaiPaiList();
                }
                that.sortPaiReady = true;
            },0);

            this.playGameStartAnimation(vecIsReady,vecPai);
        }
        else if(name  == "kaipai"){
            var byRound = data.round;
            var vecIsReady = [];
            for(var i = 0; i < data.list.length;i++){
                vecIsReady.push(data.list[i].ready);
            }
            this.OnSubKaiPaiReady(byRound,vecIsReady);
        }
        else if (name == "qiangzhuang")
        {
            //十三水没有庄家
            // var uid = data.userid;
            // var seat = data.seatid;
            // var power = data.power;
            // this.OnSubQiangZhuang(uid,seat,power);
        }else if (name == "dingzhuang")
        {
            //庄家模式
            var uid = data.userid;
            var seat = data.seatid;
            var power = data.power;

            var wViewChairID = this.SwitchViewChairID(data.seatid);
            this.userList[wViewChairID].setZhuang(true);

        }else if(name == "suanfen"){ 
            
            if(this.kaipaiFlg == true){
                this.readyBtn.active = true;
                return;
            }
                
            this.kaipaiFlg = true;
            
            var userScoreList = this.userScoreList = data.list;
            var vecCard = [];
            var vecDaoCardType = [];
            var vecDaoScore = [];
            var vecTotalScore = [];
            var vecUserTotalScore = [];
            var vecShot = data.daqiang;
            var homeRunTag = false;

            for(var i = 0; i<4;i++){

                if(i>=this.players)continue;

                var FScard = [];
                var SDcard = [];
                var TDcard = [];
                for(var j = 0; j<13;j++){
                    if(j<3){
                        FScard.push(userScoreList[i].pai[j]);
                    }
                    else if(j>=3 && j<8){
                        SDcard.push(userScoreList[i].pai[j]);
                    }else{
                        TDcard.push(userScoreList[i].pai[j]);
                    }
                }
                var Cards = [];
                Cards.push(FScard);
                Cards.push(SDcard);
                Cards.push(TDcard);                
                vecCard.push(Cards);

                vecDaoCardType.push(userScoreList[i].type)
                vecDaoScore.push(userScoreList[i].dao);
                vecTotalScore.push(userScoreList[i].score);
                vecUserTotalScore.push(userScoreList[i].result_score);

                if(userScoreList[i].quanleida == 1){
                    homeRunTag = true;
                }
            }

            this.vecTotalScore = vecTotalScore;

            //显示开始比牌动画
            this.playBgCCardAnimation(vecCard,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag);

        }
        else if (name == "jiesuan"){
            var byRound = data.round;
            
            //this.OnSubJieSuan(byRound,userScoreList);
        }
	    else if(name ==  "report"){

            //显示结算时，隐藏所有POPUP(主要处理申请解散后，POPUP不隐藏问题)
            cc.vv.popupMgr.closeAll();

            //结束滴滴声
            cc.vv.audioMgr.stopSFX(this.alarm_id);

            //保存摆牌模式
            cc.sys.localStorage.setItem("baipaiMode",this._baipaiMode);

            var cbReason = data.reason;
            this.vecResultScore  = [];
            for(var i = 0; i<this.players;i++){
                this.vecResultScore.push(data.list[i].result_score);
            }
            
            this.OnSubFinalReport(cbReason,this.vecResultScore);
        }
        else if(name =='dismissroom'){
            var uid =  data.userid;
            cc.vv.sceneMgr.gotoHall();
        }
        else if (name == "cancel_dismiss_room") {
            var uid =  data.userid;
            var nickname = data.nickname;
            var room_id = data.roomid;
        }
        else if(name == 'voice'){//快捷语音
            self._voiceMsgQueue.push(data);
            self.playVoice();
        }else if(name == 'chat'){//聊天
            var uid = data.userid;
            var seatid = data.seatid;
            var content = data.content;
            this.onSubChat(uid,seatid,content);
        }
        else if(name == 'yuyin'){//语音
            var index  = data.index;
            var uid    = data.userid;
            var seatid = data.seatid;
            this.OnSubYuYin(uid,seatid,index);
        }
        else if(name == 'biaoqing'){//表情
            var index  = data.index;
            var uid    = data.userid;
            var seatid = data.seatid;        
            this.OnSubBiaoQing(uid,seatid,index);
        }
    },

    playVoice:function(){
        if(this._playingSeat == null && this._voiceMsgQueue.length){
            var data = this._voiceMsgQueue.shift();
            // var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.userid);
            // var localIndex = cc.vv.gameNetMgr.getLocalIndex(idx);
            // var localIndex = data.seatid;
            // this._playingSeat = localIndex;

            // var seat =  this.userList[localIndex];

            this._playingSeat = data.seatid;
            var wViewChairID = this.SwitchViewChairID(data.seatid);
            this.userList[wViewChairID].voiceMsg(true);
            // this._seats[localIndex].voiceMsg(true);
            // this._seats2[localIndex].voiceMsg(true);
            
            // var msgInfo = JSON.parse(data.content);
            // log.debug("playVoice");
            // log.debug(msgInfo);
            var msgfile = "voicemsg.amr";
            // cc.vv.log3.debug(msgInfo.msg.length);
            cc.vv.voiceMgr.writeVoice(msgfile,data.content);
            cc.vv.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + data.time;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var minutes = Math.floor(Date.now()/1000/60);
        if(this._lastMinute != minutes){
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10? "0"+h:h;
            
            var m = date.getMinutes();
            m = m < 10? "0"+m:m;
            this._timeLabel.string = "" + h + ":" + m;             
        }

        if(this._lastPlayTime != null){
            if(Date.now() > this._lastPlayTime + 200){
                this.onPlayerOver();
                this._lastPlayTime = null;    
            }
        }
        else{
            this.playVoice();
        }
    },
    
    onPlayerOver:function(){
        cc.vv.audioMgr.resumeAll();
        cc.vv.log3.debug("onPlayCallback:" + this._playingSeat);

        var wViewChairID = this.SwitchViewChairID(this._playingSeat);
        this._playingSeat = null;
        this.userList[wViewChairID].voiceMsg(false);
        
        // var localIndex = this._playingSeat;
        // this._playingSeat = null;
        // this._seats[localIndex].voiceMsg(false);
        // this._seats2[localIndex].voiceMsg(false);
    },

    onDestroy:function(){
        // cc.vv.log3.debug("onDestroy");
        if(cc.vv){
            cc.vv.gameNetMgr.clear();   
        }
    },    
});




