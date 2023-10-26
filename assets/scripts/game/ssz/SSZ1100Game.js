
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
     CT_QUAN_XIAO_A : 221,                      //半小
     CT_QUAN_DA_A   : 222,                      //半大
     CT_QUAN_XIAO : 223,                        //全小
     CT_QUAN_DA   : 224,                        //全大
     CT_SIX_LONG_HAO: 225,                      //豪华六轮
     CT_QUAN_HEI_YI : 226,                      //全黑一点红
     CT_QUAN_HONG_YI : 227,                     //全红一点黑
     CT_QUAN_HEI : 228,                         //全黑
     CT_QUAN_HONG : 229,                        //全红
	 CT_FOUR_THREE  : 230,						//四套三条
	 CT_THREE_FEN   :240,						//三分天下
	 CT_THREE_TONGHUA : 250,					//三同花顺
	 CT_YITIAO_LONG : 260,						//一条龙
	 CT_QING_LONG	: 270                       //清龙
}

var Constants=[
    {CT_NO:10,AUDIO:"common1",CT_NAME:'乌龙',CT_TISHI:"w_wulong",SP:false,FD:1,SD:1,TD:1},
    {CT_NO:20,AUDIO:"common2",CT_NAME:'对子',CT_TISHI:"w_duizi",SP:false,FD:1,SD:1,TD:1},
    //{CT_NO:30,AUDIO:"common5",CT_NAME:'头顺',CT_TISHI:"",SP:false,FD:1,SD:1,TD:1},
    //{CT_NO:40,AUDIO:"common6",CT_NAME:'头金',CT_TISHI:"",SP:false,FD:1,SD:1,TD:1},
    {CT_NO:50,AUDIO:"common3",CT_NAME:'两对',CT_TISHI:"w_liangdui",SP:false,FD:1,SD:1,TD:1},
    {CT_NO:60,AUDIO:"common4",CT_NAME:'三条',CT_TISHI:"w_santiao",SP:false,FD:3,SD:1,TD:1},
    {CT_NO:70,AUDIO:"common5",CT_NAME:'顺子',CT_TISHI:"w_shunzi",SP:false,FD:1,SD:1,TD:1},
    {CT_NO:80,AUDIO:"common6",CT_NAME:'同花',CT_TISHI:"w_tonghua",SP:false,FD:1,SD:1,TD:1},
    {CT_NO:90,AUDIO:"common7",CT_NAME:'葫芦',CT_TISHI:"w_hulu",SP:false,FD:1,SD:2,TD:1},
    {CT_NO:100,AUDIO:"common8",CT_NAME:'铁支',CT_TISHI:"w_tiezhi",SP:false,FD:1,SD:8,TD:4},
    {CT_NO:110,AUDIO:"common9",CT_NAME:'同花顺',CT_TISHI:"w_tonghuashun",SP:false,FD:1,SD:10,TD:5},
    //{CT_NO:120,AUDIO:"common10",CT_NAME:'五同',CT_TISHI:"w_wutiao",SP:false,FD:1,SD:8,TD:4},

    //特殊牌型
    {CT_NO:200,AUDIO:"special4",CT_NAME:'六对半',CT_TISHI:"",SP:true,FD:6,SD:0,TD:0,IMG:'liuduiban',WORDS:['liu','dui','ban']},
    {CT_NO:210,AUDIO:"special3",CT_NAME:'三顺子',CT_TISHI:"",SP:true,FD:3,SD:0,TD:0,IMG:'sanshunzi',WORDS:['san','shun','zi']},
    {CT_NO:220,AUDIO:"special2",CT_NAME:'三同花',CT_TISHI:"",SP:true,FD:3,SD:0,TD:0,IMG:'santonghua',WORDS:['san','tong','hua']},

    {CT_NO:221,AUDIO:"special8",CT_NAME:'全小',CT_TISHI:"",SP:true,FD:3,SD:0,TD:0,IMG:'normal',WORDS:['quan','xiao']},
    {CT_NO:222,AUDIO:"special9",CT_NAME:'全大',CT_TISHI:"",SP:true,FD:3,SD:0,TD:0,IMG:'normal',WORDS:['quan','da2']},
    {CT_NO:223,AUDIO:"special8",CT_NAME:'全小',CT_TISHI:"",SP:true,FD:6,SD:0,TD:0,IMG:'normal',WORDS:['quan','xiao']},
    {CT_NO:224,AUDIO:"special9",CT_NAME:'全大',CT_TISHI:"",SP:true,FD:6,SD:0,TD:0,IMG:'normal',WORDS:['quan','da2']},
    {CT_NO:225,AUDIO:"",CT_NAME:'豪华六轮',CT_TISHI:"",SP:true,FD:9,SD:0,TD:0,IMG:'normal',WORDS:['hao','hua2','liu','lun']},
    {CT_NO:226,AUDIO:"",CT_NAME:'全黑一点红',CT_TISHI:"",SP:true,FD:13,SD:0,TD:0,IMG:'normal',WORDS:['quan','hei','yi','dian','hong']},
    {CT_NO:227,AUDIO:"",CT_NAME:'全红一点黑',CT_TISHI:"",SP:true,FD:13,SD:0,TD:0,IMG:'normal',WORDS:['quan','hong','yi','dian','hei']},
    {CT_NO:228,AUDIO:"special7",CT_NAME:'全黑',CT_TISHI:"",SP:true,FD:26,SD:0,TD:0,IMG:'normal',WORDS:['quan','hei']},
    {CT_NO:229,AUDIO:"special7",CT_NAME:'全红',CT_TISHI:"",SP:true,FD:26,SD:0,TD:0,IMG:'normal',WORDS:['quan','hong']},

    {CT_NO:230,AUDIO:"special6",CT_NAME:'四套三条',CT_TISHI:"",SP:true,FD:26,SD:0,TD:0,IMG:'sitaosantiao',WORDS:['si','tao','san','tiao']},
    {CT_NO:240,AUDIO:"special10",CT_NAME:'三分天下',CT_TISHI:"",SP:true,FD:52,SD:0,TD:0,IMG:'sanfentianxia',WORDS:['san','fen','tian','xia']},
    {CT_NO:250,AUDIO:"special11",CT_NAME:'三同花顺',SP:true,FD:18,SD:0,TD:0,IMG:'santonghuashun',WORDS:['quan','hong']},
    {CT_NO:260,AUDIO:"special13",CT_NAME:'一条龙',CT_TISHI:"",SP:true,FD:13,SD:0,TD:0,IMG:'yitiaolong',WORDS:['yi','tiao','long']},
    {CT_NO:270,AUDIO:"special14",CT_NAME:'清龙',CT_TISHI:"",SP:true,FD:108,SD:0,TD:0,IMG:'qinglong',WORDS:['qing','long']},
];

var ConstBPaiType = [
    120,110,100,90,80,70,60,50,20
];

//发牌点的世界坐标
var PlayFaPaiAnimationPos = [cc.v2(539,125), cc.v2(430,556), cc.v2(743,329), cc.v2(143,329)];

var DaoTypeNodeName = ["FDCt", "SDCt", "TDCt"];

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
        this.santonghuaTag = false;
        this.sanshunzhi = [];
    },

    initSpData:function(){
        this.spGroup = [];
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
            0x42, 0x43,                                                                     //小王，大王
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

    deepcopy:function(obj) {
        var out = [],i = 0,len = obj.length;
        for (; i < len; i++) {
            if (obj[i] instanceof Array){
                out[i] = this.deepcopy(obj[i]);
            }
            else out[i] = obj[i];
        }
        return out;
    },

    checkIsShunZi:function(arr){
        var Bw = false;
        var Sw = false;
        var isShunzi = false;
        var cardData = [];
        var m_byPokerPai = [
            0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,	//方块 A - K
            0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,	//梅花 A - K
            0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,	//红桃 A - K
            0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,	//黑桃 A - K
        ];

        //计算大小王,同时剔除大小王
        for(var i=0;i<arr.length;i++){
            if(arr[i] == 66){
                Sw = true;
            }
            else if(arr[i] == 67){
                Bw = true;
            }
            else{
                cardData.push(arr[i]);
            }
        }
    
        var numbers = this.classifyCard(cardData).numbers;

        if(Bw &&Sw){
            //两个王
            for(var i = 0; i <　m_byPokerPai.length; i++){
                var Num = m_byPokerPai[i] %16;
                if(numbers[Num].length >0){
                    continue;
                }
                
                for(var j =i+1; j< m_byPokerPai.length; j++){
                    Num = m_byPokerPai[i] %16;
                    if(numbers[Num].length >0){
                        continue;
                    }
                    var tmp = [].concat(cardData);
                    tmp.push(m_byPokerPai[i]);
                    tmp.push(m_byPokerPai[j]);
                    isShunzi = this.checkIsShunZiFx(tmp);
                    if(isShunzi){
                        return isShunzi;
                    }
                }
            }
        }else if(Bw || Sw){
            //一个王
            for(var i = 0; i < m_byPokerPai.length; i++){
                var Num = m_byPokerPai[i] %16;
                if(numbers[Num].length >0){
                    continue;
                }
                var tmp = [].concat(cardData);
                tmp.push(m_byPokerPai[i]);
                isShunzi = this.checkIsShunZiFx(tmp);
                if(isShunzi){
                    return isShunzi;
                }
            }
        }else{
            isShunzi = this.checkIsShunZiFx(arr);
        }
        return isShunzi;
    },

    checkIsShunZiFx:function(arr){
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
    getQingLong:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var resultTemp = [];
        //var colors = this.classifyCard(cards).colors;
        
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
            var isShunzi = this.checkIsShunZi(_aa);
            if(isShunzi){
                result.push(_aa);
            }
        }

        return result;
    },

    //返回一条龙
    getYiTiaoLong:function(cards,numbers,colors){
        var that = this;
        var result = [];

        if(cards.length == 13){
            var isShunzi = this.checkIsShunZi(cards);
            if(isShunzi){
                result.push(cards);
            }
        }
    
        return result;
    },

    //返回三分天下
    getSanFenTianXia:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var arrNum = [];
        if(cards.length == 13){
            //var numbers = this.classifyCard(cards).numbers;
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

    //返回半小 A-10
    getHalfSmall:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var myTag = false;
        var Atag = false;
        //var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if(i>10){
                if(data.length > 0){
                    myTag = true;
                }
            }

            if(i == 1 && data.length > 0){
                Atag = true;
            }
        });

        if(!myTag && Atag){
            //半小
            result.push(cards);
        }
        
        return result;
    },

    //返回全小 2-10
    getAllSmall:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var myTag = false;
        //var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if(i>10 || i < 2){
                if(data.length > 0){
                    myTag = true;
                }
            }
        });

        if(!myTag){
            result.push(cards);        
        }
        
        return result;
    },

    //返回半大 6-A
    getHalfBig:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var myTag = false;
        var Atag = false;
        //var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if( 1 < i && i< 6){
                if(data.length > 0){
                    myTag = true;
                }
            }

            if(i == 1 && data.length > 0){
                Atag = true;
            }
        });

        if(!myTag && Atag){
            result.push(cards);
        }
        
        return result;
    },

    //返回全大 6-K
    getAllBig:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var myTag = false;
        var Atag = false;
        //var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if( 0 < i && i< 6){
                if(data.length > 0){
                    myTag = true;
                }
            }
        });

        if(!myTag){
            result.push(cards);            
        }
        
        return result;
    },

    //豪华六对半
    getLuxurySix:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var sum = 0;
        var myTag = false;
        if(cards.length == 13){
            //var numbers = this.classifyCard(cards).numbers;
            numbers.forEach(function(data,i){
                if( data.length == 2){
                    sum++;
                }else if(data.length == 3){
                    sum++;
                    myTag = true;
                }else if(data.length == 4){
                    sum+=2;
                    myTag = true;
                }else if(data.length == 5){
                    sum+=2;
                    myTag = true;
                }
            });

            if(sum == 6 && myTag){
                result.push(cards);
            }
        }
    
        return result;
    },

    //返回全黑一点红
    getAllBlackOneRed:function(cards,numbers,colors){
        var iBlackNum = 0;
        var result = [];
        //var colors = this.classifyCard(cards).colors;
        colors.forEach(function(data,i){
            if(i == 1 || i == 3){
                iBlackNum += data.length;
            }
        });

        if(iBlackNum == 12){
            result.push(cards);
        }  
        return result;
    },

    //返回全红一点黑
    getAllRedOneBlack:function(cards,numbers,colors){
        var iRedNum = 0;
        var result = [];
        //var colors = this.classifyCard(cards).colors;        
        colors.forEach(function(data,i){
            if(i == 0 || i == 2){
                iRedNum += data.length;
            }
        });

        if(iRedNum == 12){
            result.push(cards);
        }        
        return result;
    },

    //返回全黑
    getAllblack:function(cards,numbers,colors){
        var iBlackNum = 0;
        var result = [];
        //var colors = this.classifyCard(cards).colors;
        colors.forEach(function(data,i){
            if(i == 1 || i == 3){
                iBlackNum += data.length;
            }
        });

        if(iBlackNum == 13){
            result.push(cards);
        }  
        return result;
    },

    //返回全红
    getAllRed:function(cards,numbers,colors){
        var iRedNum = 0;
        var result = [];
        //var colors = this.classifyCard(cards).colors;        
        colors.forEach(function(data,i){
            if(i == 0 || i == 2){
                iRedNum += data.length;
            }
        });

        if(iRedNum == 13){
            result.push(cards);
        }        
        return result;
    },

    //返回四套三条
    getSiTaoSanTiao:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var arrNum = [];
        if(cards.length == 13){
            //var numbers = this.classifyCard(cards).numbers;
            numbers.forEach(function(data,i){
                if( data.length == 3){
                    arrNum.push(i);
                }
            });

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
    getLiuDuiBan:function(cards,numbers,colors){
        var that = this;
        var result = [];
        var sum = 0;

        if(cards.length == 13){
            //var numbers = this.classifyCard(cards).numbers;
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
    getSanTongHuaShun:function(cards,numbers,colors){
        var that = this;
        var myTag=false;

        //做次预判：必须要要有三同花        
        this.getSanTongHua(cards,numbers,colors,0);
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
                var color = this.classifyCard(shunzi[j]).colors;
                var num = 0;
                for(var g = 0; g < color.length ; g++){
                    if(color[g].length > 0){
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
    getSanTongHua:function(cards,numbers,colors,flag){
        var sanTongHua = [];
        //用于预判
        if(flag == 0){
            this.santonghuaTag = false;
            var iClosrNum = 0;            
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
            colors.forEach(function(data,i){
                if(data.length > 0){
                    colorsTmp.push([data.length,i]);              
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

        var vecTdPai = this.getShunziAll(cards,false,false);
        if(vecTdPai.length <= 0){
            return [];
        }

        for(var i = 0; i < vecTdPai.length;i++){           
            var cardSD = [].concat(cards);
            this.arrRemove(cardSD,vecTdPai[i]);
            vecFdPai[i] = [];
            vecSdPai[i] = this.getShunziAll(cardSD,false,false);
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
    getTongHuaShun:function(cards,Bw,Sw){
        var result = [];
        var _tempResult = this.getTonghuaFx(cards,Bw,Sw);
        for(var i = 0; i< _tempResult.length ;i++){
            var _aa = _tempResult[i];
            var isShunzi = this.checkIsShunZi(_aa);
            if(isShunzi){
                result.push(_aa);
            }
        }
        return result;
    },

    // 返回铁枝
    getTieZhi:function(cards,Bw,Sw){
        var result = [];
        var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if( data.length == 2){
                if(Bw && Sw){
                    result.push([data[0]*16+i ,data[1]*16+i ,66 ,67]);
                }                
            }
            if( data.length == 3){
                if(Sw){
                    result.push([data[0]*16+i ,data[1]*16+i ,data[2]*16+i ,66]);
                }
                if(Bw){
                    result.push([data[0]*16+i ,data[1]*16+i ,data[2]*16+i ,67]);
                }
            }

            if( data.length == 4){
                result.push([data[0]*16+i ,data[1]*16+i ,data[2]*16+i ,data[3]*16+i]);
            }
        })
        return result;
    },

    // 返回葫芦
    getHulu:function(cards,Bw,Sw){
        var that = this;
        var result = [];
        var sanTiao = this.getSantiao(cards,Bw,Sw);
        var duizi = this.getDuizi(cards,Bw,Sw);
        var _temp = [];
        var wangCount = 0;

        if(Bw){
            wangCount++; 
        }
        if(Sw){
            wangCount++; 
        }

        // 如果三条和对子都存在
        if(sanTiao.length && duizi.length){
            _temp = that.combination2([sanTiao,duizi],2);
        }

        for(var i=0 ;i<_temp.length ;i++){
            var huluTmp = [];
            var bwNo = 0;
            var swNo = 0;
            
            for(var j =0;j<_temp[i].length;j++){
                if(_temp[i][j] == 66){
                    swNo++;
                }
                else if(_temp[i][j] == 67){
                    bwNo++;
                }
                else{
                    huluTmp.push(_temp[i][j]);
                }
            }
            
            //剔除大王对，小王对,带两王（如果带两王，组出了铁支或者5同）,或者本身一个王，确组出了两个王
            if((bwNo+swNo) >= 2){
                continue;
            }

            var myTag = false;
            var numbers = this.classifyCard(huluTmp).numbers;
            numbers.forEach(function(data,i){
                if(data.length == 3){
                    if(bwNo==1 || swNo == 1){
                        myTag = true;
                    }
                }
                if( data.length == 4){
                    myTag = true;
                }
                if(data.length == 5){
                    myTag = true;
                }
            })

            if(myTag){
                continue;
            }
            result.push(_temp[i]);
        }
        return result;
    },

    getTonghua:function(cards,Bw,Sw){
        var that   = this;
        var result = [];
        var resultTemp = [];

        resultTemp = this.getTonghuaFx(cards,Bw,Sw);
        //剔除同花顺
        for(var i= 0; i<resultTemp.length;i++){
            var isShunzi = this.checkIsShunZi(resultTemp[i]);
            if(isShunzi){
                continue;
            }

            result.push(resultTemp[i]);
        }

        return result;
    },

    // 返回同花
    getTonghuaFx:function(cards,Bw,Sw){
        var that = this;
        var result = [];
        var resultTemp = [];
        var colors = this.classifyCard(cards).colors;
        
        colors.forEach(function(data,i){
            if(data.length== 3){
                //必须要有两个王
                if(Bw && Sw){
                    var _tempData = data.map(function(a){ return i*16+a;});
                    _tempData.push(66);
                    _tempData.push(67);
                    resultTemp.push( that.combination(_tempData ,5) );
                }
            }

            if(data.length == 4){  
                if(Bw || Sw){
                    var _tempData = data.map(function(a){ return i*16+a;});
                    if(Bw){
                        _tempData.push(67);
                    }
                    if(Sw){
                        _tempData.push(66);
                    }
                    resultTemp.push( that.combination(_tempData ,5) );
                }
            }

            if(data.length > 4){
                // 还原成点数
                var _tempData = data.map(function(a){ return i*16+a;});

                if(Bw){
                    _tempData.push(67);
                }
                if(Sw){
                    _tempData.push(66);
                }
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
    
    // 返回顺子 (乱花顺子)
    getShunzi:function(cards,Bw,Sw){
        var result = [];
        var shunzi = this.getShunziAll(cards,Bw,Sw);
        //剔除同花顺
        for(var i = 0; i<shunzi.length;i++){     
            var cardsTemp = [];
            for(var j = 0;  j < shunzi[i].length; j++){
                if(shunzi[i][j] != 66 && shunzi[i][j] != 67){
                    cardsTemp.push(shunzi[i][j]);
                }
            }

            var iClosrNum = 0;
            var colors = this.classifyCard(cardsTemp).colors;
            for(var k = 0; k <　colors.length ; k++){
                if(colors[k].length >0){
                    iClosrNum++;
                }
            }

            if(iClosrNum == 1){
                continue;                     
            }
            result.push(shunzi[i]);
        }

        return result;
    },

    //返回顺子(所有顺子)
    getShunziAll:function(cards,Bw,Sw){
        var that = this;
        var result = [];
        var resultTemp = [];
        var numbers = this.classifyCard(cards).numbers;
        var _tempArr = [];// [[],[i ,len ]],i前的 len 个连在一起
        
        var shunziList = [];
        var wangCount = 0;

        if(Bw){
            wangCount++; 
        }
        if(Sw){
            wangCount++; 
        }
        
        //数组变成了15个
        numbers.push(numbers[1]); //将A复制到最后面来
        
        for(var i =1; i<11; i++){
            var shunziNode = [];
            var CanUseWangNum = wangCount;
            var len = 0;
            for(var j = 0;j<5;j++){
               if(numbers[i+j].length == 0){
                   if(CanUseWangNum > 0){
                        CanUseWangNum--;
                        len++;
                        shunziNode.push([i+j,false]);
                   }
               }else{
                   len++;
                   shunziNode.push([i+j,true]);
               }
            }  

            if(len != 5){
                continue;
            }

            //替王开始
            if(wangCount == 0){
                shunziList.push(shunziNode);
            }else if(wangCount == 1){
                var wangNum = 0;
                //判断顺子里面有没有王
                for(var k =0; k < 5; k++){
                    if(!shunziNode[k][1]){
                        wangNum++;
                        break;
                    }         
                }

                if(wangNum == 1){
                    shunziList.push(shunziNode);
                }else{       
                    //真的    
                    shunziList.push(shunziNode);
                    //带一张
                    for(var k=0; k < 5; k++){
                        var tmpNode = this.deepcopy(shunziNode);
                        tmpNode[k][1] = false;
                        shunziList.push(tmpNode);
                    }                
                }
            }else if(wangCount == 2){
                var wangNum = 0;
                //判断顺子里面有没有王,同时有几个王
                for(var k =0; k < 5; k++){
                    if(!shunziNode[k][1]){
                        wangNum++;
                    }        
                }
                //两个王，都使用了
                if(wangNum == 2){
                    shunziList.push(shunziNode);
                }else if(wangNum == 1){
                    //带一张王
                    shunziList.push(shunziNode);
                    //带两张王
                    for(var k=0; k < 5; k++){
                        var tmpNode = this.deepcopy(shunziNode);
                        if(!tmpNode[k][1]){
                           continue;
                        }
                        tmpNode[k][1] = false;
                        shunziList.push(tmpNode);
                    }
                }else{
                    //真的
                    shunziList.push(shunziNode);

                    //带一张
                    for(var k=0; k < 5; k++){
                        var tmpNode = this.deepcopy(shunziNode);
                        tmpNode[k][1] = false;
                        shunziList.push(tmpNode);
                    }

                    //带两张
                    for(var k=0; k < 5; k++){                        
                        for(var x = k+1;x <5; x++){
                            var tmpNode = this.deepcopy(shunziNode);
                            tmpNode[k][1] = false;
                            tmpNode[x][1] = false;
                            shunziList.push(tmpNode);
                        }
                    }
                }
            }    
        }

        for(var i =0; i < shunziList.length; i++){
            var wang = null;
            if(wangCount == 1){
                if(Bw){
                    wang = [67];
                }
                if(Sw){
                    wang = [66];
                }                
            }else if(wangCount == 2){
                wang =[66,67];
            }

            var mapArr = [];
            for(var j= 0; j < 5 ; j++){
                var index = shunziList[i][j][0];
                if(shunziList[i][j][1]){
                    mapArr.push(numbers[index].map(function(a,i){return ((index ==14)?1:index)+a*16}))
                }
                else{
                    mapArr.push(wang);
                }
            }
            resultTemp.push(that.combination2(mapArr,5));
        }

        //为统一格式
        for(var i = 0; i<resultTemp.length;i++){
            for(var j =0;j<resultTemp[i].length;j++){
                //剔除双王放在同一个顺子里面时，可能出现小王对，大王对
                if(wangCount > 0){
                    var bwNo = 0;
                    var swNo = 0;
                    for(var k =0; k<resultTemp[i][j].length;k++){                        
                        if(resultTemp[i][j][k] == 66){
                            swNo++;
                        }

                        if(resultTemp[i][j][k] == 67){
                            bwNo++;
                        }
                    }

                    if(bwNo ==2||swNo == 2){
                        continue;
                    }          
                }
                
                result.push(resultTemp[i][j]);
            }
        }

        return result;
    },

    // 返回三条
    getSantiao:function(cards,Bw,Sw){
        var result = [];
        var numbers = this.classifyCard(cards).numbers;
        numbers.forEach(function(data,i){
            if(data.length == 1){
                if(Bw && Sw){
                    result.push([ data[0]*16+i ,66 ,67]);
                }
            }
            if(data.length == 2){
                if(Bw){
                    result.push([ data[0]*16+i ,data[1]*16+i ,67]);
                }

                if(Sw){
                    result.push([ data[0]*16+i ,data[1]*16+i ,66]);
                }
            }

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
    getLiangDui:function(cards,Bw,Sw){
        var result = [];
        var resultTemp = [];
        var duizi  = this.getDuizi(cards,Bw,Sw);
        var tmp = [];
        
        
        if(duizi.length >=2){
            resultTemp = this.combination(duizi,2);

            for(var i = 0; i < resultTemp.length; i++){
                var wangCount = 0;
                var numList = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                for(var j=0;j<resultTemp[i].length;j++)
                {
                    if(resultTemp[i][j] == 66 || resultTemp[i][j] == 67){
                        wangCount++;
                    }

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

                    if(wangCount > 0){
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
    getDuizi:function(cards,Bw,Sw){
        // @params: cards 为后台发回来的牌组
        // 长度判断，暂不做
        var result = [];
        var numbers = this.classifyCard(cards).numbers;
        // 得到对子
        numbers.forEach(function(data ,i){

            if(data.length == 1){
                if(Bw){
                    result.push([data[0]*16+i,67]);
                }

                if(Sw){
                    result.push([data[0]*16+i,66]);
                }
            }

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
        
        if(Bw && Sw){
            result.push([66,67]);
        }
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
        [],[],[],[],[]
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
    
    SortSpTypeList: function (cbSpType,cbSpTypeCount) {
       
        //排序操作
        var bSorted = true;
        var cbTempData = [];
        var bLast = cbSpTypeCount - 1;
        do
        {
            bSorted = true;
            for (var i = 0; i < bLast; i++)
            {
                if ((cbSpType[i][2] < cbSpType[i + 1][2]) ||
                    ((cbSpType[i] == cbSpType[i + 1])))
                {
                    //交换位置
                    cbTempData =[].concat(cbSpType[i+1]);
                    cbSpType[i+1][0] = cbSpType[i][0];
                    cbSpType[i+1][1] = cbSpType[i][1];
                    cbSpType[i+1][2] = cbSpType[i][2];

                    cbSpType[i][0] = cbTempData[0];           
                    cbSpType[i][1] = cbTempData[1];   
                    cbSpType[i][2] = cbTempData[2];            
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

    getCardBigValue:function(cardData,cbType){
        //get wang 
        var Bw = false;
        var Sw = false;        
        var cardTmp = [];

        var colorsTmp = [
        // "黑":[],
        // "红":[],
        // "梅":[],
        // "方":[],
        // "0":[],"1":[],"2":[],"3":[]
        [],[],[],[],[]
        ];

        // number 点数
        var numbersTmp = [
        // "0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[],"7":[],"8":[],"9":[],"10":[],"11":[],"12":[],"13":[]
        // 0,1,2,3,4,5,6,7,8,9,10,11,12,13
        // 注意 0 位是“无效的”，主要为因为有效牌是从1开始的
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ];

        //挑选出大小王
        for(var i =0 ;i < cardData.length; i++){
            if(cardData[i] == 0x42){
                Sw = true;
            }
            else if(cardData[i] == 0x43){
                Bw = true;
            }
            else{
                cardTmp.push(cardData[i]);
            }
        }

        var ilen = cardTmp.length;
        var numbers = this.classifyCard(cardTmp).numbers;
        
        for(var i=0 ; i<numbers.length;i++){
            if(numbers[i].length > 0){
                for(var j =0; j< numbers[i].length;j++){
                    numbersTmp[i].push([numbers[i][j],true]);
                }
            }
        }

        switch(cbType){
            case SSZConst.CT_SINGLE://乌龙
            {
                if(numbers[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }
                break;
            }
            case SSZConst.CT_ONE_LONG://对子
            {
                //取值最大的那个
                if(Bw || Sw){
                    if(numbers[1].length != 0){
                        numbersTmp[1].push([0,false]);                                                    
                    }else{
                        for(var i = numbers.length-1; i>=0 ;i--){
                            if(numbers[i].length > 0){
                                numbersTmp[i].push([0,false]);
                                break;
                            }
                        }
                    }                    
                }

                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }
                break;
            }
            case SSZConst.CT_TWO_LONG:  //两对
            {
                //不用考虑王，如果有王，不会组出两对                                
                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }
                break;
            }
            case SSZConst.CT_THREE_TIAO://三条
            {          
                if(Bw || Sw){
                    if(Bw && Sw){
                        //取单张，最大值
                        if(numbers[1].length != 0){
                            numbersTmp[1].push([0,false]);    
                            numbersTmp[1].push([0,false]);                                          
                        }else{
                            for(var i = numbers.length-1; i>=0 ;i--){
                                if(numbers[i].length > 0){
                                    numbersTmp[i].push([0,false]);
                                    numbersTmp[i].push([0,false]);
                                    break;
                                }
                            }
                        }     
                    }
                    else{
                        //取对子
                        for(var i= numbers.length -1; i>=0;i--){
                            if(numbers[i].length == 2){   
                                numbersTmp[i].push([0,false]);
                                break;
                            }
                        }
                    }                                 
                }
                
                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }

                break;
            }
            case SSZConst.CT_SHUN_ZI://顺子
            {
                if(Bw||Sw){
                    var max  = -1;
                    var min  = -1;
                    for(var i = numbers.length -1 ; i >=0; i--){
                        if(numbers[i].length > 0){
                            max = i;    
                            break;                        
                        }
                    }

                    for(var i=0;i<numbers.length;i++){
                        if(numbers[i].length > 0){
                            min = i;
                            break;
                        }
                    }

                    //如果最小值是A，且最大值<=5,那么肯定是小顺子，反之，是大顺子
                    if(min == 1){
                        if(max > 5){                      
                            numbers.push(numbers[1]); //将A复制到最后面
                            numbers[1] = [];          //清除原来A的位置

                            max = 14;
                            for(var i=0;i<numbers.length;i++){
                                if(numbers[i].length > 0){
                                    min = i;
                                    break;
                                }
                            }
                        }
                    }

                    //最大值和最小值之间，有没有空位。如果有，用王替代
                    for(var i = min; i <= max;i++){
                        if(numbers[i].length > 0){
                            continue;
                        }
                        numbersTmp[i].push([0,false]);
                    }
                    
                    //最小值 -->最大值,是多少位
                    if(max - min == 3){
                        //大顺子,
                        if(max  == 14){
                            numbersTmp[max-4].push([0,false]);
                        }
                        else if(max == 5){
                            numbersTmp[1].push([0,false]);
                        }
                        else{
                            numbersTmp[max+1].push([0,false]);
                        }
                    }else if(max - min == 2){
                        if(max == 14){
                            numbersTmp[max-3].push([0,false]);
                            numbersTmp[max-4].push([0,false]);
                        }else if(max == 13){
                            numbersTmp[14].push([0,false]);
                            numbersTmp[10].push([0,false]);
                        }else if(max == 5){
                            numbersTmp[1].push([0,false]);
                            numbersTmp[2].push([0,false]);
                        }else if(max == 4){
                            numbersTmp[1].push([0,false]);
                            numbersTmp[5].push([0,false]);
                        }
                        else {
                            numbersTmp[max+1].push([0,false]);
                            numbersTmp[max+2].push([0,false]);
                        }
                    }       
                }

                //把A放到前面来
                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }
                break;
            }
            case SSZConst.CT_TONG_HUA: //同花
            {   
                if(Bw){
                    numbersTmp[1].push([0,false]);
                }

                if(Sw){
                    numbersTmp[1].push([0,false]);
                }

                //把A放到前面来
                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }

                break;
            }
            case SSZConst.CT_HU_LU: //葫芦
            {
                //葫芦，如果有王的，必须是一张王，必须要有两对，
                if(Bw || Sw){
                    //两对中，哪一对值大，王替哪对
                    if(numbersTmp[1].length != 0){
                        numbersTmp[1].push([0,false]);
                    }else{
                        for(var i = numbers.length-1; i>=0 ;i--){
                            if(numbers[i].length == 2){
                                numbersTmp[i].push([0,false]);
                                break;
                            }
                        }
                    }
                }
                //把A放到前面来
                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }

                break;
            }
            case SSZConst.CT_TIE_ZHI://铁支
            {
                if(Bw || Sw){
                    if(Bw &&　Sw){
                        for(var i = numbers.length-1; i>=0 ;i--){
                            if(numbers[i].length == 2){
                                numbersTmp[i].push([0,false]);
                                numbersTmp[i].push([0,false]);
                                break;
                            }
                        }
                    }else{
                        for(var i = numbers.length-1; i>=0 ;i--){
                            if(numbers[i].length == 3){
                                numbersTmp[i].push([0,false]);
                                break;
                            }
                        }
                    }
                }

                //把A放到前面来
                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }
                break;
            }
            case SSZConst.CT_TONG_HUA_SHUN://同花顺      
            {
                if(Bw||Sw){
                    var max  = -1;
                    var min  = -1;
                    for(var i = numbers.length -1 ; i >=0; i--){
                        if(numbers[i].length > 0){
                            max = i;    
                            break;                        
                        }
                    }

                    for(var i=0;i<numbers.length;i++){
                        if(numbers[i].length > 0){
                            min = i;
                            break;
                        }
                    }
                    var color = numbers[min][0];

                    //如果最小值是A，且最大值<=5,那么肯定是小顺子，反之，是大顺子
                    if(min == 1){
                        if(max > 5){                            
                            numbers.push(numbers[1]); //将A复制到最后面
                            numbers[1] = [];          //清除原来A的位置

                            max = 14;
                            for(var i=0;i<numbers.length;i++){
                                if(numbers[i].length > 0){
                                    min = i;
                                    break;
                                }
                            }
                        }
                    }

                    //最大值和最小值之间，有没有空位。如果有，用王替代
                    for(var i = min; i <= max;i++){
                        if(numbers[i].length > 0){
                            continue;
                        }
                        numbersTmp[i].push([color,false]);
                    }
                    
                    //最小值 -->最大值,是多少位
                    if(max - min == 3){
                        //大顺子,
                        if(max  == 14){
                            numbersTmp[max-4].push([color,false]);
                        }
                        else if(max == 5){
                            numbersTmp[1].push([color,false]);
                        }else{
                            numbersTmp[max+1].push([color,false]);
                        }
                    }else if(max - min == 2){
                        if(max == 14){
                            numbersTmp[max-3].push([color,false]);
                            numbersTmp[max-4].push([color,false]);
                        }else if(max == 13){
                            numbersTmp[14].push([color,false]);
                            numbersTmp[10].push([0,false]);
                        }else if(max == 5){
                            numbersTmp[1].push([0,false]);
                            numbersTmp[2].push([0,false]);
                        }else if(max == 4){
                            numbersTmp[1].push([0,false]);
                            numbersTmp[5].push([0,false]);
                        }else{
                            numbersTmp[max+1].push([color,false]);
                            numbersTmp[max+2].push([color,false]);
                        }
                    }       
                }

                //把A放到前面来
                if(numbersTmp[1].length != 0){
                    numbersTmp[14] = this.deepcopy(numbersTmp[1]);
                    numbersTmp[1]  = [];
                }

                break;
            }      
        }

        return numbersTmp;
    },

    CompareSameCardTypeDao:function(cbFirstData,cbNextData,cbFirstDataW,cbNextDataW,cbType){        
        //取牌数最小的
        var cbCardCount =  cbFirstData.length > cbNextData.length?cbFirstData.length:cbNextData.length;

       //简单类型
        switch(cbType){
            case SSZConst.CT_SINGLE:        //乌龙
            {
                var Num  = 0;                
                //对比数值
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(Num == cbCardCount){
                        break;
                    }
                    if(cbFirstDataW[i].length > 0 &&  cbNextDataW[i].length > 0){
                        Num++;
                        continue;
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length > 0){
                        Num++
                        return 2;
                    }
                    else if(cbNextDataW[i].length > 0){
                        Num++;
                        return 1;
                    }
                }

                //比花色,取第一个最大值来比花色,兼容加一色
                var cbFirstColor = 0;
                var cbNextColor  = 0;
                Num = 0;
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(Num == cbCardCount){
                        break;
                    }
                    
                    if(cbFirstDataW[i].length > 0 &&  cbNextDataW[i].length > 0){
                        cbFirstColor = cbFirstDataW[i][0][0];
                        cbNextColor  = cbNextDataW[i][0][0];
                        if(cbFirstColor != cbNextColor){
                             return (cbFirstColor > cbNextColor)?2:1;
                        }
                        Num++;
                        continue;
                    }
                }            
                return 0;
            }
            case SSZConst.CT_ONE_LONG:		//对子
            {
                var index = 0;//对子位置                
                //对比数值
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 2 &&  cbNextDataW[i].length == 2){
                        index = i;
                        break;
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length == 2){
                        return 2;
                    }
                    else if(cbNextDataW[i].length==2){                        
                        return 1;
                    }
                }

                //对子值相同，且长度相同，比单条
                if(cbFirstData.length == cbNextData.length){
                    for (var i=cbFirstDataW.length-1;i>=0;i--){
                        if(cbFirstDataW[i].length == 1 &&  cbNextDataW[i].length == 1){
                            break;
                        }
                        else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                            continue;
                        }
                        else if(cbFirstDataW[i].length == 1){
                            return 2;
                        }
                        else if(cbNextDataW[i].length == 1){                        
                            return 1;
                        }
                    }
                }

                //所有值相同，比对子花色
                for(var color = 3;color>=0;color--){
                    var firstFind = false;
                    var nextFind  = false;
                    for(var i =0; i<cbFirstDataW[index].length;i++){
                        if(cbFirstDataW[index][i][0] == color && cbFirstDataW[index][i][1] != false){
                            firstFind = true;
                        }
                    }

                    for(var i =0; i<cbNextDataW[index].length;i++){
                        if(cbNextDataW[index][i][0] == color && cbNextDataW[index][i][1] != false){
                            nextFind = true;
                        }
                    }

                    if(firstFind == nextFind){
                        continue;
                    }
                    else if(firstFind){
                        return 2
                    }
                    else if(nextFind){
                        return 1;
                    }
                }
                return 0;
            }
            case SSZConst.CT_TWO_LONG:      //两对
            {
                var index = -1;//第一个对子位置                

                //对比数值
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 2 &&  cbNextDataW[i].length == 2){
                        if(index == -1){
                            index = i;
                        }
                          
                        continue;                  
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length == 2){
                        return 2;
                    }
                    else if(cbNextDataW[i].length==2){                        
                        return 1;
                    }
                }

                //对子值相同，且长度相同，比单条
                if(cbFirstData.length == cbNextData.length){
                    for (var i=cbFirstDataW.length-1;i>=0;i--){
                        if(cbFirstDataW[i].length == 1 &&  cbNextDataW[i].length == 1){
                            break;
                        }
                        else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                            continue;
                        }
                        else if(cbFirstDataW[i].length == 1){
                            return 2;
                        }
                        else if(cbNextDataW[i].length == 1){                        
                            return 1;
                        }
                    }
                }

                //所有值相同，比第一个对子花色
                for(var color = 3;color>=0;color--){
                    var firstFind = false;
                    var nextFind  = false;
                    for(var i =0; i<cbFirstDataW[index].length;i++){
                        if(cbFirstDataW[index][i][0] == color && cbFirstDataW[index][i][1] != false){
                            firstFind = true;
                        }
                    }

                    for(var i =0; i<cbNextDataW[index].length;i++){
                        if(cbNextDataW[index][i][0] == color && cbNextDataW[index][i][1] != false){
                            nextFind = true;
                        }
                    }

                    if(firstFind == nextFind){
                        continue;
                    }
                    else if(firstFind){
                        return 2
                    }
                    else if(nextFind){
                        return 1;
                    }
                }

                return 0;
            }
            case SSZConst.CT_THREE_TIAO:	//三条                        
            {
                var index = 0;//三条位置
                //对比数值
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 3 &&  cbNextDataW[i].length == 3){
                        index = i;
                        break;
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length == 3){
                        return 2;
                    }
                    else if(cbNextDataW[i].length == 3){                        
                        return 1;
                    }
                }

                //三条值相同，且长度相同，比单条
                if(cbFirstData.length == cbNextData.length){
                    for (var i=cbFirstDataW.length-1;i>=0;i--){
                        if(cbFirstDataW[i].length == 1 &&  cbNextDataW[i].length == 1){
                            break;
                        }
                        else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                            continue;
                        }
                        else if(cbFirstDataW[i].length == 1){
                            return 2;
                        }
                        else if(cbNextDataW[i].length == 1){                        
                            return 1;
                        }
                    }
                }

                //所有值相同，比三条花色
                for(var color = 3;color>=0;color--){
                    var firstFind = false;
                    var nextFind  = false;
                    for(var i =0; i<cbFirstDataW[index].length;i++){
                        if(cbFirstDataW[index][i][0] == color && cbFirstDataW[index][i][1] != false){
                            firstFind = true;
                        }
                    }

                    for(var i =0; i<cbNextDataW[index].length;i++){
                        if(cbNextDataW[index][i][0] == color && cbNextDataW[index][i][1] != false){
                            nextFind = true;
                        }
                    }

                    if(firstFind == nextFind){
                        continue;
                    }
                    else if(firstFind){
                        return 2
                    }
                    else if(nextFind){
                        return 1;
                    }
                }

                return 0;
            }
            case SSZConst.CT_SHUN_ZI:		//顺子
            {
                //对比数值
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 1 &&  cbNextDataW[i].length == 1){  
                        continue;
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length == 1){
                        return 2;
                    }
                    else if(cbNextDataW[i].length==1){         
                        return 1;
                    }
                }

                //对比花色
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 1 &&  cbNextDataW[i].length == 1){                 
                        //所有值相同，比对子花色
                        for(var color = 3;color>=0;color--){
                            var firstFind = false;
                            var nextFind  = false;
                            
                            if(cbFirstDataW[i][0][0] == color && cbFirstDataW[i][0][1] != false){
                                firstFind = true;
                            }                            
                        
                            if(cbNextDataW[i][0][0] == color && cbNextDataW[i][0][1] != false){
                                nextFind = true;
                            }
                            
                            if(firstFind == nextFind){
                                continue;
                            }
                            else if(firstFind){
                                return 2
                            }
                            else if(nextFind){
                                return 1;
                            }
                        }
                    }
                }
                return 0;
            }
            case SSZConst.CT_TONG_HUA:      //同花
            {
                //对比数值
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length > 0 &&  cbNextDataW[i].length > 0){
                        //值相同，但是个数也相同,考虑加一色情况
                        if(cbFirstDataW[i].length == cbNextDataW[i].length){
                            continue;
                        }
                        else if(cbFirstDataW[i].length > cbNextDataW[i].length){
                            return 2;
                        }
                        else{
                            return 1;
                        }                                   
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length > 0){
                        return 2;
                    }
                    else if(cbNextDataW[i].length > 0){         
                        return 1;
                    }
                }

                var firstColor = 0;
                var nextColor  = 0;
                //对比花色
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length > 0){                                                         
                        if(cbFirstDataW[i][0][1] != false){                            
                            firstColor = cbFirstDataW[i][0][0];
                            break;
                        } 
                    }
                }

                for (var i=cbNextDataW.length-1;i>=0;i--){
                    if(cbNextDataW[i].length > 0){                                                 
                        if(cbNextDataW[i][0][1] != false){                            
                            nextColor = cbNextDataW[i][0][0];
                            break;
                        }
                    }
                }

                if(firstColor > nextColor){
                    return 2;
                }
                else if(firstColor < nextColor){
                    return 1
                }

                return 0;
            }
            case SSZConst.CT_HU_LU:         //葫芦
            {
                //对比数值
                //比三条
                var index3 = -1;
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 3 &&  cbNextDataW[i].length == 3){
                        index3 = i;
                        break;
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length == 3){
                        return 2;
                    }
                    else if(cbNextDataW[i].length == 3){
                        return 1;
                    }
                }

                //比对子
                var index2 = -1;
                for (var i = cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 2 &&  cbNextDataW[i].length == 2){
                        index2 = i;
                        break;
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length == 2){
                        return 2;
                    }
                    else if(cbNextDataW[i].length == 2){
                        return 1;
                    }
                }

                //先比三条的花色
                for(var color = 3;color>=0;color--){
                    var firstFind = false;
                    var nextFind  = false;
                    for(var i =0; i<cbFirstDataW[index3].length;i++){
                        if(cbFirstDataW[index3][i][0] == color && cbFirstDataW[index3][i][1] != false){
                            firstFind = true;
                        }
                    }

                    for(var i =0; i<cbNextDataW[index3].length;i++){
                        if(cbNextDataW[index3][i][0] == color && cbNextDataW[index3][i][1] != false){
                            nextFind = true;
                        }
                    }

                    if(firstFind == nextFind){
                        continue;
                    }
                    else if(firstFind){
                        return 2
                    }
                    else if(nextFind){
                        return 1;
                    }
                }

                //再比对子花色
                for(var color = 3;color>=0;color--){
                    var firstFind = false;
                    var nextFind  = false;
                    for(var i =0; i<cbFirstDataW[index2].length;i++){
                        if(cbFirstDataW[index2][i][0] == color && cbFirstDataW[index2][i][1] != false){
                            firstFind = true;
                        }
                    }

                    for(var i =0; i<cbNextDataW[index2].length;i++){
                        if(cbNextDataW[index2][i][0] == color && cbNextDataW[index2][i][1] != false){
                            nextFind = true;
                        }
                    }

                    if(firstFind == nextFind){
                        continue;
                    }
                    else if(firstFind){
                        return 2
                    }
                    else if(nextFind){
                        return 1;
                    }
                }
                return 0;
            }
            case SSZConst.CT_TIE_ZHI:       //铁支
            {
                var FirstIndex = -1;
                var FirstReal  = true;
                var NextIndex  = -1;
                var NextReal   = true;

                //比数值，就够了
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 4 ){
                        FirstIndex = i;
                        for(var j = 0; j< cbFirstDataW[i].length; j++){
                            if(cbFirstDataW[i][j][1] == false){
                                FirstReal = false;
                                break;
                            }
                        }
                    }

                    if(cbNextDataW[i].length == 4){
                        NextIndex  = i;
                        for(var j = 0; j< cbNextDataW[i].length; j++){
                            if(cbNextDataW[i][j][1] == false){
                                NextReal = false;
                                break;
                            }
                        }
                    }
                }

                //判断真假铁支
                if(FirstReal == NextReal){
                    //两个都是真的，或者都是假的
                    if(FirstIndex == NextIndex){
                        //自己倒水，先不做单牌和花色比较。因为拿到的牌，不可能有8张相同                    
                        return 0;
                    }else if(FirstIndex > NextIndex){
                        return 2;
                    }else if(FirstIndex < NextIndex){
                        return 1;
                    }
                }
                else{
                    if(FirstReal){
                        return 2;
                    }
                    else{
                        return 1;
                    }
                }
                return 0;
            }
            case SSZConst.CT_TONG_HUA_SHUN:	//同花顺
            {
                var FirstReal  = true;
                var NextReal   = true;
                
                //取真假
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 1 && cbFirstDataW[i][0][1] == false){
                        FirstReal = false;
                    }

                    if(cbNextDataW[i].length == 1 && cbNextDataW[i][0][1] == false){              
                        NextReal = false;                        
                    }                    
                }

                //判断真假同花顺
                if(FirstReal != NextReal){
                   if(FirstReal){
                        return 2;
                    }
                    else{
                        return 1;
                    }
                }

                //两个都是真的，或者都是假的
                //对比数值
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 1 &&  cbNextDataW[i].length == 1){                            
                        continue;
                    }
                    else if(cbFirstDataW[i].length ==0 &&　cbNextDataW[i].length == 0){
                        continue;
                    }
                    else if(cbFirstDataW[i].length == 1){
                        return 2;
                    }
                    else if(cbNextDataW[i].length==1){                        
                        return 1;
                    }
                }

                //比花色                
                var firstColor = 0;
                var nextColor  = 0;
                //对比花色
                for (var i=cbFirstDataW.length-1;i>=0;i--){
                    if(cbFirstDataW[i].length == 1){                                                         
                        if(cbFirstDataW[i][0][1] != false){                            
                            firstColor = cbFirstDataW[i][0][0];
                            break;
                        } 
                    }
                }

                for (var i=cbNextDataW.length-1;i>=0;i--){
                    if(cbNextDataW[i].length == 1){                                                 
                        if(cbNextDataW[i][0][1] != false){                            
                            nextColor = cbNextDataW[i][0][0];
                            break;
                        }
                    }
                }

                if(firstColor > nextColor){
                    return 2;
                }
                else if(firstColor < nextColor){
                    return 1
                }
              
                return 0;
            }
        }
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
            //case SSZConst.CT_TWO_LONG:	//两对
            case SSZConst.CT_THREE_TIAO:	//三条
            //case SSZConst.CT_TIE_ZHI:		//铁支
            //case SSZConst.CT_HU_LU:		//葫芦
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

                // 14,2 2+12 = 14  小顺子
                var bFirstmin = (cbFirstValue == (AnalyseResultFirst.cbLogicValue[1] + 12));
                var bNextmin = (cbNextValue == (AnalyseResultNext.cbLogicValue[1] + 12));

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

                //数值相同，比花色
                for(var i =0; i<cbCardCount;i++){
                    cbNextValue =  parseInt(cbNextData[i]/16);
                    cbFirstValue = parseInt(cbFirstData[i]/16);
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

    checkisSameCards:function(cards,list){
        for(var i =0 ; i < list.length; i++){
            var iTag = false;

            var node1 = [].concat(list[i]);
            var node2 = [].concat(cards);
            
            node1.sort();
            node2.sort();

            for(var j =0; j <node1.length;j++){
                if(node1[j] != node2[j]){
                    iTag = true;
                    break;
                }
            }

            if(iTag == false){
                return true;
            }
        }
        
        return false;
    },
    
    //ctvec存放头道，中道，尾道的
    CompareDaoCtCard:function(ctVec,ctDataVec){
        var result = [0,""];
        var res = 0;
        var tip ="";
        
        do{
            if(ctVec[0][0] != -1){
                //头道 和 中道比
                if(ctVec[1][0] != -1){
                    if(ctVec[0][0] > ctVec[1][0]){     
                        tip = "出牌顺序不符合规则，请重新选牌";              
                        res = 2; //全部取消
                        break;
                    }
                    else if(ctVec[0][0] < ctVec[1][0]){
                        res = 0;
                    }else{
                        //取头道最大值                    
                        if(ctVec[0][1].length == 0){
                            ctVec[0][1] = this.getCardBigValue(ctDataVec[0],ctVec[0][0]);
                        }
                        //取中道最大值
                        if(ctVec[1][1].length == 0){                        
                            ctVec[1][1] = this.getCardBigValue(ctDataVec[1],ctVec[0][0]);
                        }                    
                        res = this.CompareSameCardTypeDao(ctDataVec[0],ctDataVec[1],ctVec[0][1],ctVec[1][1],ctVec[0][0]);
                        if(res == 2){
                            tip = "出牌顺序不符合规则，请重新选牌";   
                            res = 2;
                            break;
                        }
                        else{
                            res = 0;
                        }
                    }
                }

                //头道 和 尾道比
                if(ctVec[2][0] != -1){
                    if(ctVec[0][0] > ctVec[2][0]){
                        tip = "出牌顺序不符合规则，请重新选牌";   
                        res = 2; //全部取消
                        break;
                    }
                    else if(ctVec[0][0] < ctVec[2][0]){
                        res = 0;
                    }else{
                        //取头道最大值
                        if(ctVec[0][1].length == 0){
                            ctVec[0][1] = this.getCardBigValue(ctDataVec[0],ctVec[0][0]);
                        }

                        //取尾道最大值
                        if(ctVec[2][1].length == 0){
                            ctVec[2][1] = this.getCardBigValue(ctDataVec[2],ctVec[0][0]);
                        }

                        res = this.CompareSameCardTypeDao(ctDataVec[0],ctDataVec[2],ctVec[0][1],ctVec[2][1],ctVec[0][0]);
                        if(res == 2){
                            tip = "出牌顺序不符合规则，请重新选牌";   
                            res = 2;
                            break;
                        } 
                        else{
                            res = 0;
                        } 
                    }
                }
            }
            //中道和尾道比
            if(ctVec[1][0] != -1){
                if(ctVec[2][0] != -1){
                    if(ctVec[1][0] > ctVec[2][0]){
                        tip = "出牌顺序不符合规则";   
                        res = 1;
                        break;
                    }
                    else if(ctVec[1][0] < ctVec[2][0]){
                        res = 0;
                    }else{
                        //取中道最大值
                        if(ctVec[1][1].length == 0){
                            ctVec[1][1] = this.getCardBigValue(ctDataVec[1],ctVec[1][0]);
                        }
                        
                        //取尾道最大值
                        if(ctVec[2][1].length == 0){
                            ctVec[2][1] = this.getCardBigValue(ctDataVec[2],ctVec[1][0]);
                        }
                                            
                        res = this.CompareSameCardTypeDao(ctDataVec[1],ctDataVec[2],ctVec[1][1],ctVec[2][1],ctVec[1][0]);
                        if(res == 2){
                            tip = "出牌顺序不符合规则";  
                            res = 1;
                            break;
                        }
                        else{
                            res = 0;
                        } 
                    }
                }
            }
        }while(0);

        result[0] = res;
        result[1] = tip;
        return result;
    },

    getDaoCardType:function(card){
        var cardType = SSZConst.CT_SINGLE;
        var myTag =false;
        var typeArray = [0,0,0,0,0,0,0,0,0];
        var result = this.getCardTypeAi(card,typeArray,9999,(card.length>3)?1:3,0,false);   
                         
        for(var i =0; i < typeArray.length;i++){
            if(typeArray[i] == 1){
                myTag = true;
                break;
            }
        }

        if(!myTag){
            return SSZConst.CT_SINGLE;
        }else{
            return ConstBPaiType[i];
        }
    },

    /*
    *   cardData: 牌，typeArray：类型标识数组，last_CTNo：上一道牌的类型，
        daoType：第几道，xuanpaiType：0:传统选牌，1：智能选派 ;allGet:false--选择一个最大的牌型，退出
    **
    */
    //普通牌型智能算法
    getCardTypeAi:function(cardDatas,typeArray,last_CTNo,daoType,xuanpaiType,allGet){
        var result = null;
        var ct_arr = [];
        var Bw = false;
        var Sw = false;
        var cardData = [];

        for(var i = 0; i < Constants.length;i++){
            if(!Constants[i].SP){
                ct_arr.push([Constants[i].CT_NO,false]);
            }
        }

        for(var i =0; i< ct_arr.length;i++){
            if(ct_arr[i][0] <= last_CTNo){
                ct_arr[i][1] = true;
            }
        }

        //计算大小王,同时剔除大小王
        for(var i=0;i<cardDatas.length;i++){
            if(cardDatas[i] == 66){
                Sw = true;
            }
            else if(cardDatas[i] == 67){
                Bw = true;
            }
            else{
                cardData.push(cardDatas[i]);
            }
        }

        this.SortCardList(cardData,cardData.length);

        for(var i = ct_arr.length-1; i >= 0;i--){
            if(!ct_arr[i][1]){
                continue;
            }
            
            switch(ct_arr[i][0]){
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

                    result = this.getDuizi(cardData,Bw,Sw);                    
                    if(result != null && result.length > 0){  
                        typeArray[8] = 1;
                        if(!allGet){
                            return result;
                        }  
                        this.curGroupCardList[8] = [SSZConst.CT_ONE_LONG,result];
                    }
                    break;
                case SSZConst.CT_TWO_LONG://两对
                    if(daoType != 3){
                        result = this.getLiangDui(cardData,Bw,Sw);
                        if(result != null && result.length > 0){
                            typeArray[7] = 1;
                            if(!allGet){
                                return result;
                            }
                            this.curGroupCardList[7] = [SSZConst.CT_TWO_LONG,result];
                            
                        }
                    }
                    break;
                case SSZConst.CT_THREE_TIAO://三条                    
                    result = this.getSantiao(cardData,Bw,Sw);
                    if(result != null && result.length > 0){
                        typeArray[6] = 1;
                        if(!allGet){
                            return result;
                        }

                        this.curGroupCardList[6] = [SSZConst.CT_THREE_TIAO,result];                        
                    }
                    break;
                case SSZConst.CT_SHUN_ZI: //顺子
                    if(daoType != 3){
                        result = this.getShunzi(cardData,Bw,Sw);
                        if(result != null && result.length > 0){
                            typeArray[5] = 1;
                            if(!allGet){
                                return result;
                            }
                            this.curGroupCardList[5] = [SSZConst.CT_SHUN_ZI,result];                    
                        }
                    }
                    break;         
                case SSZConst.CT_TONG_HUA://同花
                    if(daoType != 3){
                        result = this.getTonghua(cardData,Bw,Sw);
                        if(result != null && result.length > 0){
                            typeArray[4] = 1;
                            if(!allGet){
                                return result;
                            }
                            this.curGroupCardList[4] = [SSZConst.CT_TONG_HUA,result];                    
                        }
                    }
                    break;
                case SSZConst.CT_HU_LU://葫芦
                    if(daoType != 3){
                        result = this.getHulu(cardData,Bw,Sw);
                        if(result != null && result.length > 0){
                            typeArray[3] = 1;
                            if(!allGet){
                                return result;
                            }
                            this.curGroupCardList[3] = [SSZConst.CT_HU_LU,result];                            
                        }
                    }
                    break;
                case SSZConst.CT_TIE_ZHI://铁支
                    if(daoType != 3){
                        result = this.getTieZhi(cardData,Bw,Sw);
                        if(result != null && result.length > 0){
                            typeArray[2] = 1;
                            if(!allGet){
                                return result;
                            } 
                            this.curGroupCardList[2] = [SSZConst.CT_TIE_ZHI,result];                            
                        }
                    }
                    break;
                case SSZConst.CT_TONG_HUA_SHUN://同花顺
                    if(daoType != 3){
                        result = this.getTongHuaShun(cardData,Bw,Sw);
                        if(result != null && result.length > 0){
                            typeArray[1] = 1;
                            if(!allGet){
                                return result;
                            } 
                            this.curGroupCardList[1] = [SSZConst.CT_TONG_HUA_SHUN,result];
                            
                        }
                    }
                    break;
                case SSZConst.CT_FIVE_TIAO://五同
                    if(daoType != 3){
                        result = this.getWuTong(cardData);
                        if(result != null && result.length > 0){
                            typeArray[0] = 1;
                            if(!allGet){
                                return result;
                            } 
                            this.curGroupCardList[0]=[SSZConst.CT_FIVE_TIAO,result];                            
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

    getSpecialCardTypeGroup:function(ct_arr,cardData){
        var result = null;
        var iTag = false;
        var spGroup = [];
        this.SortCardList(cardData,cardData.length);
        var numbers = this.classifyCard(cardData).numbers;
        var colors  = this.classifyCard(cardData).colors;

        for(var i = 0; i < ct_arr.length;i++){
            var iTag = false;
            switch(ct_arr[i][0]){
                case SSZConst.CT_QING_LONG: //清龙
                    result = this.getQingLong(cardData,numbers,colors);
                    break;
                case SSZConst.CT_YITIAO_LONG: //一条龙
                    result = this.getYiTiaoLong(cardData,numbers,colors);
                    break;
                case SSZConst.CT_THREE_TONGHUA: //三同花顺
                    result = this.getSanTongHuaShun(cardData,numbers,colors);
                    iTag = true;
                    break;
                case SSZConst.CT_QUAN_XIAO_A://半小
                    result  = this.getHalfSmall(cardData,numbers,colors);
                    break;
                case SSZConst.CT_QUAN_XIAO://全小
                    result = this.getAllSmall(cardData,numbers,colors);
                    break;
                case SSZConst.CT_QUAN_DA_A://半大
                    result = this.getHalfBig(cardData,numbers,colors);
                    break;
                case SSZConst.CT_QUAN_DA://全大
                    result = this.getAllBig(cardData,numbers,colors);
                    break;
                case SSZConst.CT_QUAN_HEI_YI://全黑一点红
                     result = this.getAllBlackOneRed(cardData,numbers,colors);
                    break;
                case SSZConst.CT_QUAN_HEI://全黑
                     result = this.getAllblack(cardData,numbers,colors);
                    break;
                case SSZConst.CT_QUAN_HONG_YI://全红一点黑
                     result = this.getAllRedOneBlack(cardData,numbers,colors);
                    break;
                case SSZConst.CT_QUAN_HONG://全黑
                     result = this.getAllRed(cardData,numbers,colors);
                    break;                
                case SSZConst.CT_THREE_FEN://三分天下
                    result = this.getSanFenTianXia(cardData,numbers,colors);
                    iTag = true;
                    break;
                case SSZConst.CT_FOUR_THREE://四套三条
                    result = this.getSiTaoSanTiao(cardData,numbers,colors);
                    iTag = true;
                    break;
                case SSZConst.CT_THREE_TONG://三同花
                    this.getSanTongHua(cardData,numbers,colors,0);
                    result = this.getSanTongHua(cardData,numbers,colors,1);
                    iTag = true;
                    break;
                case SSZConst.CT_THREE_SHUN://三顺子                                                                                       
                    result = this.getSanShunZi(cardData); 
                    iTag = true;                           
                    break;
                case SSZConst.CT_SIX_LONG://六对半
                    result = this.getLiuDuiBan(cardData,numbers,colors);
                    break;
                case SSZConst.CT_SIX_LONG_HAO://豪华六对半
                    result = this.getLuxurySix(cardData,numbers,colors);
                    break;
                default:
                    break;
            }

            if(result != null && result.length > 0){
                ct_arr[i][1] = true;
                if(!iTag){
                    spGroup.push([ct_arr[i][0],[cardData[8],cardData[9],cardData[10],cardData[11],cardData[12]]]);
                    spGroup.push([ct_arr[i][0],[cardData[3],cardData[4],cardData[5],cardData[6],cardData[7]]]);
                    spGroup.push([ct_arr[i][0],[cardData[0],cardData[1],cardData[2]]]);
                }
                else{
                    spGroup.push([ct_arr[i][0],result[0]]);
                    spGroup.push([ct_arr[i][0],result[1]]);
                    spGroup.push([ct_arr[i][0],result[2]]);
                }                
                break;
            }
        }
        return spGroup;
    },

    //特殊牌型智能算法
    getSpecialCardTypeAi:function(ct_arr,cardData){
        
        if(this.spGroup.length > 0){
            return;
        }

        var Sw = false; //小王
        var Bw = false; //大王

        var m_byPokerPai = [
            0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,	//方块 A - K
            0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,	//梅花 A - K
            0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,	//红桃 A - K
            0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,	//黑桃 A - K
        ];

        //按分值大小，做排序
        this.SortSpTypeList(ct_arr,ct_arr.length);

        var cardTmp = [];
        //挑选出大小王
        for(var i =0 ;i < cardData.length; i++){
            if(cardData[i] == 0x42){
                Sw = true;
            }
            else if(cardData[i] == 0x43){
                Bw = true;
            }
            else{
                cardTmp.push(cardData[i]);
            }
        }

        //如果有大小王，不能组特殊牌型
        if(Sw || Bw)return;

        var ilen = cardTmp.length;

        if((Sw== true && Bw == false)  || (Sw== false && Bw == true)){
            //一个王
            for(var i =0; i < m_byPokerPai.length; i++){
                //原来里面有几个这样的牌
                var iNum = 0;
                for(var g =0; g< ilen;g++){
                    if(cardTmp[g] == m_byPokerPai[i]){
                        iNum++;
                    }
                }

                var cardDataNew = [];
                cardDataNew = [].concat(cardTmp);
                //把王放进去
                cardDataNew.push(m_byPokerPai[i]);
                var spGroupOne = this.getSpecialCardTypeGroup(ct_arr,cardDataNew);

                //找出放进去的大小王，再放回去
                var myTag =false;
                for(var l = 0; l< spGroupOne.length; l++){                              
                    var result = spGroupOne[l][1];
                    for(var k =0 ;k < result.length;k++){
                        if(result[k] == m_byPokerPai[i]){
                            if(iNum == 0 && myTag == false){
                                if(Sw== true){
                                    result[k] = 0x42;
                                }
                                else{
                                    result[k] = 0x43;
                                }
                                myTag = true;
                                break;
                            }else{
                                iNum--;
                            }
                        }                                          
                    }
                }

                if(spGroupOne.length == 0){
                    continue;
                }
                
                //找出最大的特殊牌型
                if(this.spGroup.length == 0){
                    this.spGroup = spGroupOne;
                }else{                    
                    var Fen1 = this.getCardTypeFenEx(this.spGroup[0][0],2);
                    var Fen2 = this.getCardTypeFenEx(spGroupOne[0][0],2);                    
                    if(Fen1 < Fen2){
                        this.spGroup = spGroupOne;
                    }
                }
            }
        }
        else if(Sw== true && Bw == true){
            //两个王
            for(var i =0; i < m_byPokerPai.length; i++){
                for(var j =0; j < m_byPokerPai.length; j++){
                    //原来有几个像大小王所替的牌,
                    var iNumS = 0;
                    var iNumB = 0;
                    for(var g =0; g< ilen ;g++){
                        if(cardTmp[g] == m_byPokerPai[i]){
                            iNumS++;
                        }
                        if(cardTmp[g] == m_byPokerPai[j]){
                            iNumB++;
                        }
                    }

                    var cardDataNew = [];
                    cardDataNew = [].concat(cardTmp);
                    //放小王
                    cardDataNew.push(m_byPokerPai[i]);
                    //放大王
                    cardDataNew.push(m_byPokerPai[j]);
                    
                    var spGroupOne = this.getSpecialCardTypeGroup(ct_arr,cardDataNew);
                    
                    //找出放进去的大小王，再放回去
                    var tagS = false; 
                    var tagB = false;
                    for(var l = 0; l< spGroupOne.length; l++){
                        var result = spGroupOne[l][1];
                        for(var k =0 ;k < result.length;k++){
                            //小王                          
                            if(result[k] == m_byPokerPai[i]){
                                if(iNumS == 0 && tagS == false){
                                    result[k] = 0x42;
                                    tagS = true;
                                    break;
                                }else{
                                    iNumS--;
                                }
                            }

                            //大王                           
                            if(result[k] == m_byPokerPai[j]){
                                if(iNumB == 0 &&tagB == false){
                                    result[k] = 0x43;
                                    tagB = true;
                                    break;
                                }else{
                                    iNumB--;
                                }
                            }
                        }
                    }

                    if(spGroupOne.length == 0){
                        continue;
                    }

                    //找出最大的特殊牌型
                    if(this.spGroup.length == 0){
                        this.spGroup = spGroupOne;
                    }else{
                        var Fen1 = this.getCardTypeFenEx(this.spGroup[0][0],2);
                        var Fen2 = this.getCardTypeFenEx(spGroupOne[0][0],2);                    
                        if(Fen1 < Fen2){
                            this.spGroup = spGroupOne;
                        }
                    }
                }
            }
        }else{
            this.spGroup = this.getSpecialCardTypeGroup(ct_arr,cardData);
        }           
    },

    //智能组牌
    SortCardTypeGroupAi:function(cardData,spWanfa){
        var groupList = [];
        //1.特殊牌型
        var SpCt_arr = [];
        for(var i = Constants.length-1; i >= 0;i--){
            if(Constants[i].SP){                
                SpCt_arr.push([Constants[i].CT_NO,false,Constants[i].FD]);                
            }
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
        this.getCardTypeAi(cardData,typeArray,9999,1,1,true);
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
            
            this.getCardTypeAi(card8,typeArray,lastDaoType,2,1,true);
            
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
                this.getCardTypeAi(card3,typeArray,this.vecSDPai[i][g][0],3,1,true);

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
        players:4,
        sszPokerAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        sszPokerAtlas2:{
            default:null,
            type:cc.SpriteAtlas  
        },
        
        sszTableAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        SpCardAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        SpEffectAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        CardTypeAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        SpecialCardTypeSpineData:{
            default:[],
            type:sp.SkeletonData
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
        
        this.refreshPlayerStatus()

        this.addComponent("UserInfoShow");
        
        this.sszCardList = new CardList();
        this.Constants = Constants;
        
        this.initView();
        this.initEventHandlers();

        this.baipaiComponent = this.node.getComponent("SSZBaiPai");
        
        this.paiMianType = 1;
        var paimian = cc.sys.localStorage.getItem("paimian");
        if(paimian != null){
            this.paiMianType = paimian;
        }

        cc.vv.audioMgr.playBGM("bgFight");
    },

    refreshPlayerStatus:function(params) {
        //准备开始游戏状态
        this.m_vecIsReady = [0, 0, 0, 0]
        //摆牌完成状态
        this.m_vecIsKaiPaiReady = [0, 0, 0, 0]
    },

 
    /**
     * add by linqx
     * 十三水初始化
     */
    initMain: function () {
        var that = this;
        // var players = 4;//玩家数量
        this.byRound = 0;//当前回合


        this.deskBack=this.node.getChildByName("ID_SPRITE_DESKBACK");

        //获取默认的摆牌模式
        /*
        this._baipaiMode = cc.sys.localStorage.getItem("baipaiMode");
        if(!this._baipaiMode)this._baipaiMode = 0;
        this._baipaiMode = parseInt(this._baipaiMode);
        */

        //Layout_FuncBtn-------------------------------------------------start
        this.funcBtn = this.node.getChildByName("Layout_FuncBtn");
        //ID_BUTTON_INVITE
        this.inviteBtn = this.funcBtn.getChildByName("ID_BUTTON_INVITE");
        this.readyBtn = this.funcBtn.getChildByName("ID_BUTTON_READY");
        this.readyBtn.active = false;        

        this.roundinfo = this.node.getChildByName("roundinfo");
        this.reportBtn = this.roundinfo.getChildByName("ID_BUTTON_START");
        this.reportBtn.active = false;

        this.readyBtn2 = this.roundinfo.getChildByName("ID_BUTTON_READY");
        this.readyBtn2.active = false;
        
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
        this.roundLabelTotal = this.node.getChildByName("ID_LABEL_ROUND_TOTAL").getComponent(cc.Label);
        this.descLabel = this.node.getChildByName("ID_LABEL_DESC").getComponent(cc.Label);
        this.mapaiSprite = this.node.getChildByName("ID_SPARTE_MAPAI");

        this.initXuanPaiLayer();
        this.initTanPaiCard();

	    //this.unlocked = true;
        //this.lockBtn  = this.node.getChildByName("ID_CHECKBOX_LOCK");
            
        //Layout_CardPlay----------------------------------------------------------------------end

        this.gameresult = this.node.getChildByName("game_result");
        this.gameresult.active = false;


        //////提示框
        this.hintBack=this.node.getChildByName("ID_SPRITE_HINT_MSG");
        this.hintBack.active = false;
        this.hintLabel=this.hintBack.getChildByName("ID_LABEL_HINTLABEL");

        //动画初始化
        this.Layout_Effect = this.node.getChildByName("Layout_Effect");
        //开始游戏动画
        this.sszStartAnimaNode = this.Layout_Effect.getChildByName("ssz_startAnimanode");
        this.sszStartspine = this.sszStartAnimaNode.getComponent('sp.Skeleton');
        this.sszStartAnimaNode.active = false;
        //开始比牌动画
        this.sszBgCompCardAnimaNode = this.Layout_Effect.getChildByName("ssz_BgCompCardAnimanode");
        this.sszBgCompCardspine = this.sszBgCompCardAnimaNode.getComponent('sp.Skeleton');
        this.sszBgCompCardAnimaNode.active = false;
        //全垒打动画
        this.sszHomeRunAnimaNode = this.Layout_Effect.getChildByName("ssz_HomeRunAnimanode");
        this.sszHomeRunspine = this.sszHomeRunAnimaNode.getComponent('sp.Skeleton');
        this.sszHomeRunAnimaNode.active = false;
        //打枪准备动画
        this.sszShotReadyAnimaNode = this.Layout_Effect.getChildByName("ssz_shotReadyAnimanode");
        this.sszShotReadyspine = this.sszShotReadyAnimaNode.getComponent('sp.Skeleton');
        this.sszShotReadyAnimaNode.active = false;
        //打枪动画
        this.sszShotAnimaNode  = this.deskBack.getChildByName("ssz_shotAnimanode");
        this.sszShotspine = this.sszShotAnimaNode.getComponent('sp.Skeleton');
        this.sszShotAnimaNode.active = false;    
        //即将开始动画
        this.sszReadyAnimaNode = this.Layout_Effect.getChildByName("ssz_ReadyAnimanode");
        this.sszReadyspine = this.sszReadyAnimaNode.getComponent('sp.Skeleton');
        this.sszReadyAnimaNode.active = false;

        //特殊牌型spine
        this.sszSpecialCardTypeAnimationNode = this.Layout_Effect.getChildByName("ssz_SpecialCardTypeAnimationNode");
        this.sszSpecialCardTypeSpine = this.sszSpecialCardTypeAnimationNode.getComponent('sp.Skeleton')
        this.sszSpecialCardTypeAnimationNode.active = false;
    },

    getsszPokerSpriteFrame:function(data){
        
        var PokerFrameName = '255';
        var PokerAtlas = null;
        if(this.paiMianType == 0){
            PokerAtlas = this.sszPokerAtlas;
        }else{
            PokerAtlas = this.sszPokerAtlas2;
        }

        if(data != 255){

            var colorList = ["D","C","H","S","A"];
            var color = parseInt(data/16);
            var num = data%16;

            if(num == 1){
                num = 14;
            }
            
            PokerFrameName = this.pngStr = colorList[color]+num;
            return PokerAtlas.getSpriteFrame(PokerFrameName); 
        }
        else{
            return PokerAtlas.getSpriteFrame(PokerFrameName); 
        }               
    },
    
    getCardTypeBgSpriteFrame:function(FrameName){
        return this.sszTableAtlas.getSpriteFrame(FrameName);
    },
    
    getSpCardTypeSpriteFrame:function(typeId){

        if(typeId == 221){
            typeId = 223;
        }

        if(typeId == 222){
            typeId = 224;
        }
        var SpCardTypeName = "sp_"+typeId;
        return this.SpCardAtlas.getSpriteFrame(SpCardTypeName);
    },

    getCardTypeSpriteFrame:function(typeId){
        var cardTypeinfo = this.getCardTypeInfo(typeId);            
         return  this.CardTypeAtlas.getSpriteFrame(cardTypeinfo.CT_TISHI);
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
        
        return card_type >= SSZConst.CT_SIX_LONG;
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
            //初始化牌值
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

            var mChairID = that.SwitchViewChairID(this.mChairID);  
            if(mChairID == wViewChairID){
                cc.vv.audioMgr.playSFX("ssz/openface/teshupai");
                that.playSexSFX(that.userList[wViewChairID]._sex,cardTypeinfo.AUDIO);
            }

            that.userSpecialType[wViewChairID].active = false;

            //特殊效果全屏显示
            var special_effect = that.node.getChildByName('special_effect');
            var special_effect_main = special_effect.getChildByName('main');
            //var special_effect_img = special_effect.getChildByName('img');
            var special_effect_words = special_effect.getChildByName('words');

            // special_effect.active = true;

            //先清除所有上把显示
            special_effect_words.removeAllChildren();
            
            //播放spine
            var spineData
            var spinename = cardTypeinfo.IMG
            for (var index = 0; index < that.SpecialCardTypeSpineData.length; index++) {
                if (that.SpecialCardTypeSpineData[index].name == spinename) {
                    spineData = that.SpecialCardTypeSpineData[index]
                    break
                }
            }
            that.sszSpecialCardTypeSpine.skeletonData = spineData
            that.sszSpecialCardTypeSpine.setAnimation(0, spinename, false);
            that.sszSpecialCardTypeSpine.setCompleteListener((trackEntry, loopCount) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
                that.sszSpecialCardTypeAnimationNode.active = false;
            });
            that.sszSpecialCardTypeAnimationNode.active = true;
            cc.vv.log3.info("animation" + that.ssz_specialCardTypeSpine.animation)


            //文字
            // var wordsList = cardTypeinfo.WORDS;

            // //背景放大同时渐入
            // var imgName = "spefx_bg_"+cardTypeinfo.IMG;
            // special_effect_main.getComponent(cc.Sprite).spriteFrame = that.SpEffectAtlas.getSpriteFrame(imgName);
            
            // special_effect_main.scale = 0.8;
            // special_effect_main.opacity = 0;
            // special_effect_main.runAction(
            //     cc.sequence(
            //         cc.spawn(
            //             cc.fadeIn(0.2),
            //             cc.scaleTo(0.2,1.0)
            //         ),
            //         cc.delayTime(0.3 + wordsList.length * 0.3),
            //         cc.callFunc(function(){
            //             special_effect.active = false;
                        
            //         })
            //     )
            // );
            
            // /*
            // //特殊牌图
            // var imgName = "specialImg_"+cardTypeinfo.IMG;
            // special_effect_img.getComponent(cc.Sprite).spriteFrame = that.SpEffectAtlas.getSpriteFrame(imgName);

            // special_effect_img.scale = 0.8;
            // special_effect_img.opacity = 0;
            // special_effect_img.runAction(
            //     cc.spawn(
            //         cc.fadeIn(0.2),
            //         cc.scaleTo(0.2,1.0)
            //     )
            // );
            // */

            // var index = 0;
            // //动态加入文字
            // var wordsList = cardTypeinfo.WORDS;
            // for(var i=0;i<wordsList.length;i++){

            //     //创建文字节点
            //     var word = new cc.Node('word');
            //     word.active = true;
            //     word.opacity = 0;
            //     special_effect_words.addChild(word);

            //     var wordName = "specialWord_"+wordsList[i];
            //     var wordSprite = word.addComponent(cc.Sprite);
            //     wordSprite.spriteFrame = that.SpEffectAtlas.getSpriteFrame(wordName);

            //     word.runAction(
            //         cc.sequence(
            //             cc.spawn(
            //                 cc.scaleTo(0.0,1.5),
            //                 cc.hide()),
            //             cc.delayTime(0.1+ i*0.2),
            //             cc.show(),
            //             cc.spawn(
            //                 cc.fadeIn(0.2),
            //                 cc.scaleTo(0.2,1.0)
            //             ),
            //             cc.callFunc(function () {
            //                 index++;
            //                 if(index == wordsList.length){
            //                     var cadtype = that.vecSpSpriteEffect[wViewChairID].getChildByName("cardtype");                        
            //                     cadtype.getComponent(cc.Sprite).spriteFrame  = that.getSpCardTypeSpriteFrame(SpecialCardType);

            //                     that.vecSpSpriteEffect[wViewChairID].active = true;
            //                     that.vecSpSpriteEffect[wViewChairID].zIndex = 99;  
            //                 }
            //             })

            //         )
            //     )
            // }

  

            //隐藏特殊牌型大图标
            // that.userSpecialType[wViewChairID].runAction(
            //     cc.sequence(
            //         cc.spawn(
            //             cc.fadeOut(0.5),
            //             cc.scaleTo(0.5,5)
            //         ),
            //         cc.callFunc(function () {
            //             //显示牌型
            //             //that.vecSpriteEffect[wViewChairID].getComponent(cc.Sprite).spriteFrame = that.getCardTypeBgSpriteFrame("cardtype_specile_bg");
            //             var cadtype = that.vecSpSpriteEffect[wViewChairID].getChildByName("cardtype");                        
            //             cadtype.getComponent(cc.Sprite).spriteFrame  = that.getSpCardTypeSpriteFrame(SpecialCardType);
                        
            //             that.vecSpSpriteEffect[wViewChairID].active = true;
            //             that.vecSpSpriteEffect[wViewChairID].zIndex = 99;   

            //             //获取当前道的坐标
            //             // var x = that.userDoneCardBack[wViewChairID][1].x;
            //             var y = that.userDoneCardBack[wViewChairID][1].y;

                        
            //         },this)
            //     )
            // );

        },delay);
    },

    addMaPaiToPai:function(root,ccp){
        var node = new cc.Node("horse");
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.mapaiSprite.getChildByName("MA_logo").getComponent(cc.Sprite).spriteFrame;
        node.setAnchorPoint(0.5,0.5);
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
                                        var cardEffectBg = null;
                                        var cardInfo = that.getCardTypeInfo(cardType);
                                        var iFen = 1;
                                        if(daoIndex == 0){
                                            iFen = cardInfo.FD;
                                        }
                                        else if(daoIndex == 1){
                                            iFen = cardInfo.SD;
                                        }else if(daoIndex == 2){
                                            iFen = cardInfo.TD;
                                        }
                                        
                                        if(iFen > 1){
                                            cardEffectBg = "cardtype_specile_bg";                                            
                                        }else{
                                            cardEffectBg = "cardtype_nomal_bg";
                                        }                 
                                        
                                        that.vecSpriteEffect[wViewChairID].getComponent(cc.Sprite).spriteFrame = that.getCardTypeBgSpriteFrame(cardEffectBg);

                                        var cadtype = that.vecSpriteEffect[wViewChairID].getChildByName("cardtype");
                                        cadtype.getComponent(cc.Sprite).spriteFrame = that.getCardTypeSpriteFrame(cardType);

                                        //获取当前道的坐标
                                        var x = that.userDoneCardBack[wViewChairID][daoIndex].x;
                                        var y = that.userDoneCardBack[wViewChairID][daoIndex].y - that.userDoneCardBack[wViewChairID][daoIndex].height/2 + 20 /**- that.vecSpriteEffect[wViewChairID].height / 2*/;
                                        //reset the pos
                                        that.vecSpriteEffect[wViewChairID].setPositionY(y);
                                        that.vecSpriteEffect[wViewChairID].zIndex = daoIndex + 4;
                                        that.vecSpriteEffect[wViewChairID].active = true;

                                        //显示每道牌的类型
                                        /*
                                        that.userDaoCardType[wViewChairID][daoIndex].getComponent(cc.Sprite).spriteFrame = that.getCardTypeSpriteFrame(cardType);
                                        that.userDaoCardType[wViewChairID][daoIndex].active = true;
                                        */
                                    }
                                },this),
                                cc.scaleTo(0.1,1.2),
                            ),
                            cc.delayTime(1.1),
                            cc.spawn(
                                cc.callFunc(function () {
                                    that.userDoneCardBack[wViewChairID][daoIndex].zIndex = daoIndex-3;                      
                                    that.vecSpriteEffect[wViewChairID].active = false;  
                                },this),
                                cc.scaleTo(0.1,1),
                            )));


                var mChairID = that.SwitchViewChairID(this.mChairID);  
                if(mChairID == wViewChairID){
                    that.playSexSFX(that.userList[wViewChairID]._sex,cardTypeinfo.AUDIO);
                }
            }

            //一道，所有用户显示完成
            /*
            if(endTag){
                //显示每道分数
                // that.showDaoFen(daoIndex,daoScore);
            }
            */
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
 
            time +=1.25;

            for(var j = 0;j< fenListSeat.length ;j++){

                var i = fenListSeat[j];

                var wViewChairID = this.SwitchViewChairID(i);
                var endTag = false;
                if(j == fenListSeat.length - 1){
                    endTag = true;
                }

                // var IsSpecialType = this.checkIsSpecialType(vecDaoCardType[i][f]);
                // if(IsSpecialType){
                //     if(this.mChairID == i){ 
                //         time +=0.2;//如果自己，需要显示道分，需要时间
                //     }else{
                //         time +=0; //如果非自己，直接跳过，不需要时间
                //     }
                // }else{
                //     time +=0.9;
                // }

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
                time += 2;
                this.doKaiSepcialPai(time,wViewChairID,cardData[i],vecDaoCardType[i][0]);
            }
        }

        
        //显示打枪
        if(vecShot!=null){
            /*
            this.scheduleOnce(function(){
                if(vecShot.length >0){
                    that.playShotReadyAnimation();
                }
            },time+0.5);
            */

            time +=1;

            for(var i=0;i<vecShot.length;i++){
                this.doShot(time+(i+1)*1.2,vecShot[i]);
            }

            time += vecShot.length*1.2;
        }

        if(homeRunTag){
            
            time += 1;

            //显示全垒打
            this.scheduleOnce(function(){
                that.playHomeRunAnimation();
            },time + 0.5);

            time += 1;
        }
        
        //显示总计分数
        time += 0.8;
        this.scheduleOnce(function(){

            // //显示结算栏的总计分数
            // that.showDaoFen(3,that.vecTotalScore[this.mChairID]);
            //显示单局，所有人的输赢分数情况
            for(var i = 0; i<this.players;i++){   
                var wViewChairID = that.SwitchViewChairID(i);                    
                //that.userList[wViewChairID].setWinCoinFixed(that.vecTotalScore[i]);
                //that.userList[wViewChairID].setWinCoin(vecTotalScore[i]);                
                that.userList[wViewChairID].setWinCoinNoAction(vecTotalScore[i]);
                
                that.userList[wViewChairID].setScore(vecUserTotalScore[i]);
                that.vecUser[i].score = vecUserTotalScore[i];
            }

            that.showRoundInfo();

        },time);
        
        // time+=0.5;
        // this.scheduleOnce(function(){
        //     if(that.final_report){
        //          that.cbReason = 4;
        //          this.scheduleOnce(function(){
        //             //cc.vv.GameResult.showReport(that.mRoomID,0,that.final_report,that.m_nRound,that.m_nMaxRound);
        //             // that.gameresult.active = true;
        //             // that.readyBtn.active = true;
        //         },1);
        //     }
        //     else{
        //         that.readyBtn.active = true;
        //     }
        // },time);
    },

    doKaiDaoPaiByOrder: function (delay,wViewChairID,daoIndex,vecCardData,cardType,daoScore,endTag, callbackfun, index, updao) {
        var that = this;

        this.scheduleOnce(function(){
            var cardTypeinfo = that.getCardTypeInfo(cardType);            
            var card_type_string =  cardTypeinfo.CT_NAME;
            var IsSpecialType = that.checkIsSpecialType(cardType);
            
            if(!IsSpecialType){

                var max = (daoIndex == 0)?3:5;

                //对应道翻牌
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
                            cc.callFunc(function(){
                                
                                that.userDoneCardBack[wViewChairID][daoIndex].zIndex = daoIndex +3;

                                //显示每道的类型
                                if(card_type_string){          
                                    var cadtype = that.userDoneCardBack[wViewChairID][daoIndex].parent.getChildByName( DaoTypeNodeName[daoIndex] );
                                    cadtype.getComponent(cc.Sprite).spriteFrame = that.getCardTypeSpriteFrame(cardType);
                                    cadtype.getChildByName("score").getComponent(cc.Label).string = daoScore;
                                    cadtype.active = true;
                                    cadtype.runAction(cc.sequence(
                                        cc.scaleTo(0.1,1.2),
                                        cc.delayTime(0.5),
                                        cc.scaleTo(0.1,1),
                                    ))
                                }
                            },this),
                            
                            cc.delayTime(1.1),

                            cc.callFunc(function () {
                                that.userDoneCardBack[wViewChairID][daoIndex].zIndex = daoIndex-3;
                                if (endTag) {
                                    that.specialCardKaiPaiByOrder();
                                    return;
                                }else{
                                    if (updao) {
                                        daoIndex = daoIndex + 1
                                    }
                                    callbackfun(daoIndex, index + 1)
                                }
                            },this),
                        )
                    );


                var mChairID = that.SwitchViewChairID(this.mChairID);  
                if(mChairID == wViewChairID){
                    that.playSexSFX(that.userList[wViewChairID]._sex,cardTypeinfo.AUDIO);
                }
            }else{
                if (endTag) {
                    that.specialCardKaiPaiByOrder();
                    return;
                }else{
                    if (updao) {
                        daoIndex = daoIndex + 1
                    }
                    callbackfun(daoIndex, index + 1)
                }
            }
        },delay);
    },

    OnUserKaiPaiByOrder:function(vecCard,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag){
        var that = this;

        // this.nodeXuanPai.active = false;
        // this.xuanPaiAction(false);
        this.Layout_Desktop.active = true;

        //自己的分数显示初始化
        for(var i=0;i<this.VecJieSuan.length;i++){
            this.VecJieSuan[i].active = false;
        }

        this.nodeJieSuan.active = true;
        this.vecCardList = this.vecCard;
        
        //立即显示所有特殊牌型
        for(var i = 0;i<this.players;i++){
            var IsSpecialType = this.checkIsSpecialType(this.vecDaoCardType[i][0]);
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
        //数据处理
        var fenList = [];
        var fenListSeat = [];
        for(var f=0;f<3;f++){
            //先拿出分
            fenList[f] = [];
            fenListSeat[f] = [];
            for(var i = 0;i<this.players;i++){

                //如果自己是特殊牌型，每道分显示为0
                var daoScore  = 0;
                var isSelfSpc = this.checkIsSpecialType(vecDaoCardType[i][f]);
                // daoScore = vecDaoScore[i][f];
                if(!isSelfSpc){
                    daoScore = vecDaoScore[i][f];
                }

                fenList[f].push(daoScore);
                fenListSeat[f].push(i);
            }

            //从小到大排序
            var len = fenList[f].length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                    if (fenList[f][j] > fenList[f][j+1]) {        //相邻元素两两对比
                        var temp = fenList[f][j+1];            //元素交换
                        fenList[f][j+1] = fenList[f][j];
                        fenList[f][j] = temp;

                        var tempSeat = fenListSeat[f][j+1];            //元素交换
                        fenListSeat[f][j+1] = fenListSeat[f][j];
                        fenListSeat[f][j] = tempSeat;
                    }
                }
            }
        }

        //顺序翻牌 非特殊牌
        var diguifun = function(dao, index) {
            cc.vv.log3.info("hahahahah:" + "dao:" + dao + "diguifun:" + index);
            index = index % that.players

            var i = fenListSeat[dao][index];
            var wViewChairID = that.SwitchViewChairID(i);
            var endTag = false;
            var updao = false
            if(index == fenListSeat[dao].length - 1){
                if (dao == fenListSeat.length - 1) {
                    endTag = true;
                }
                else{
                    updao = true
                }
            }

            //对应玩家分数
            var daoScore  = 0;
            daoScore = vecDaoScore[i][dao];

            that.doKaiDaoPaiByOrder(0, wViewChairID, dao,
                            vecCard[i][dao], vecDaoCardType[i][dao], daoScore, endTag, diguifun, index, updao);
        }

        diguifun(0, 0)
    },

    doKaiSepcialPaiByOrder:function(delay, seatids, index){
        var that = this;
        var seatid = seatids[index];
        var wViewChairID = this.SwitchViewChairID(seatid);
        var vecCardData = this.vecCard[seatid]
        var SpecialCardType = this.vecDaoCardType[seatid][0]

        var cardTypeinfo = that.getCardTypeInfo(SpecialCardType);            
        var card_type_string =  cardTypeinfo.CT_NAME;
        //牌型位置变化
        that.setPlayerCardPosToTwoType(seatid)
        //初始化牌值
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

        var mChairID = that.SwitchViewChairID(this.mChairID);  
        if(mChairID == wViewChairID){
            cc.vv.audioMgr.playSFX("ssz/openface/teshupai");
            that.playSexSFX(that.userList[wViewChairID]._sex,cardTypeinfo.AUDIO);
        }

        that.userSpecialType[wViewChairID].active = false;
        
        //播放spine
        var spineData
        var spinename = cardTypeinfo.IMG
        cc.vv.log3.info("hahahaha, play Sepcial spine")
        for (var index = 0; index < that.SpecialCardTypeSpineData.length; index++) {
            if (that.SpecialCardTypeSpineData[index].name == spinename) {
                spineData = that.SpecialCardTypeSpineData[index]
                break
            }
        }

        this.sszSpecialCardTypeSpine.skeletonData = spineData;
        this.sszSpecialCardTypeAnimationNode.active = true;
        this.sszSpecialCardTypeSpine.setAnimation(0, spinename,false);
        this.sszSpecialCardTypeSpine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            that.sszSpecialCardTypeAnimationNode.active = false;

            if ( index >= seatids.length - 1 ) {
                //打枪
                that.doShotAndQuanleida()
            }else{
                that.doKaiSepcialPaiByOrder(0, seatids, index + 1)
            }
        });
    },
    //特殊牌型逐个翻牌
    specialCardKaiPaiByOrder:function() {
        var seatids = [];
        var hasSpecialCard = false
        //特殊牌数量
        for(var i = 0;i<this.players;i++){
            var IsSpecialType = this.checkIsSpecialType(this.vecDaoCardType[i][0]);
            if(IsSpecialType){
                hasSpecialCard = true;
                seatids.push(i);
            }
        }

        if (hasSpecialCard) {
            var startindex = 0
            this.doKaiSepcialPaiByOrder(0, seatids, startindex);
        }else{
            this.doShotAndQuanleida()
        }
    },

    //打枪和全垒打
    doShotAndQuanleida:function(params) {
        var that = this
        //显示打枪
        if(this.vecShot!=null){
            for(var i=0; i < this.vecShot.length;i++){
                this.doShot((i)*1.2, this.vecShot[i]);
            }
        }

        if(this.homeRunTag){
            //显示全垒打
            this.Layout_Effect.runAction(cc.sequence(
                cc.delayTime(that.vecShot.length * 1.2),
                cc.callFunc(function(params) {
                    that.playHomeRunAnimation();
                }),
                cc.delayTime(0.5),
                cc.callFunc(function(params) {
                    that.showSmallResult();
                })
            ))
        }else{
            this.Layout_Effect.runAction(cc.sequence(
                cc.delayTime(that.vecShot.length * 1.2),
                cc.delayTime(0.5),
                cc.callFunc(function(params) {
                    that.showSmallResult();
                })
            ))
        }
    },

    //显示结算栏的总计分数
    showSmallResult:function(params) {
        var that = this
        this.scheduleOnce(function(){

            // //显示结算栏的总计分数
            // that.showDaoFen(3,that.vecTotalScore[this.mChairID]);
            //显示单局，所有人的输赢分数情况
            for(var i = 0; i<this.players;i++){   
                var wViewChairID = that.SwitchViewChairID(i);                    
                //that.userList[wViewChairID].setWinCoinFixed(that.vecTotalScore[i]);
                //that.userList[wViewChairID].setWinCoin(vecTotalScore[i]);                
                that.userList[wViewChairID].setWinCoinNoAction(that.vecTotalScore[i]);
                
                that.userList[wViewChairID].setScore(that.vecUserTotalScore[i]);
                that.vecUser[i].score = that.vecUserTotalScore[i];
            }

            that.showRoundInfo();

        },0.1);
    },

    onShowRoundInfo:function(event){

        cc.vv.audioMgr.playSFX("ui_click");
        
        switch(event.target.name){
            case 'show_score':{
                
                this.roundinfo.active = true;
                this.roundinfo.runAction(cc.sequence(
                    cc.moveTo(0.2,cc.v2(0,0))
                ));

                cc.find('Canvas/Layout_FuncBtn/show_score').active = false;
            }
            break;
            case 'hide_score':{
                // this.roundinfo.active = false;
                
                this.roundinfo.runAction(cc.sequence(
                    cc.moveTo(0.2,cc.v2(0,-720))
                ));

                cc.find('Canvas/Layout_FuncBtn/show_score').active = true;
            }
            break;
        }
    },

    showRoundInfo:function(){

        var that = this;
        
        this.roundinfo.setPosition(cc.v2(0,-720));
        this.roundinfo.active = true;

        this.showSuanFen = true;

        if(this.showReportFlg){

            this.readyBtn2.active = false;
            this.readyBtn.active = false;

            if(this.final_report){
                this.cbReason = 4;
                this.reportBtn.active = true;   
            }
        }
        else{
            this.cbReason = 0;
            this.readyBtn.active = true;
            this.readyBtn2.active = true;
            this.reportBtn.active = false;
        }
        
        this.roundinfo.runAction(
            cc.moveTo(0.2,cc.v2(0,0))
        );

        if(that.vecTotalScore[this.mChairID] < 0){
            this.roundinfo.getChildByName('bgpanel').getChildByName('win').active = false;
            this.roundinfo.getChildByName('bgpanel').getChildByName('lost').active = true;
        }else{
            this.roundinfo.getChildByName('bgpanel').getChildByName('win').active = true;
            this.roundinfo.getChildByName('bgpanel').getChildByName('lost').active = false;
        }

        this.roundinfo.getChildByName('bgpanel').getChildByName('num').getComponent(cc.Label).string = this.m_nRound;

        var seats = this.roundinfo.getChildByName('seats');
        //var seats2 = this.deskBack.getChildByName("ID_LAYOUT_USERINFO");
        for(var i = 0;i< seats.children.length;i++){
            seats.children[i].active = false;
        }


        for(var i = 0;i< seats.children.length;i++){
            
            var wViewChairID = this.SwitchViewChairID(i);
            var deskSeat = this.userList[wViewChairID];
            var seat = seats.children[wViewChairID];

            if(deskSeat._userId != null && deskSeat._userId != "0"){
                seat.active = true;

                var user_portrait = seat.getChildByName('user_portrait');
                var name = user_portrait.getChildByName('name').getChildByName('name');
                name.getComponent(cc.Label).string = deskSeat._userName;//this.vecUser[i].nickname;
                user_portrait.getChildByName('score').getComponent(cc.Label).string = deskSeat._score;//this.vecUser[i].score;
                user_portrait.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = deskSeat._Icon.getComponent(cc.Sprite).spriteFrame;
                //seats2.children[i].getChildByName('user_portrait').getChildByName('icon').getComponent(cc.Sprite).spriteFrame;

                name.stopAllActions();
                
                if(name.width > 90){
                    var move = (name.width - 90) / 2;
                    name.runAction(
                        cc.repeatForever(
                            cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,0)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,0)))
                        )
                    );
                }
                
                
                if(deskSeat._winScore < 0){
                    seat.getChildByName('winscore').active = false;
                    seat.getChildByName('losescore').active = true;
                    seat.getChildByName('losescore').getComponent(cc.Label).string = deskSeat._winScore;//that.vecTotalScore[i];
                }else{
                    seat.getChildByName('losescore').active = false;
                    seat.getChildByName('winscore').active = true;
                    seat.getChildByName('winscore').getComponent(cc.Label).string = '+' + deskSeat._winScore;//that.vecTotalScore[i];
                }
            }
        }

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
                    this.addClickEvent(card,this.node,"SSZ1100Game","onCardClicked");
                }
            }
            else if(i == 1){
                var Layout_SecondDun = Sprite_CardPut.getChildByName("Layout_SecondDun");
                for(var j=0;j<5;j++){
                    var card = Layout_SecondDun.getChildByName("Sprite_SD_Card"+j);
                    card.myTag = j;                    
                    card.active = false;
                    cardList[j] = this.newCard(card,"Sprite_SD_Card"+j);
                    this.addClickEvent(card,this.node,"SSZ1100Game","onCardClicked");
                }
            }
            else if(i==2){
                var Layout_ThirdDun = Sprite_CardPut.getChildByName("Layout_ThirdDun");
                for(var j=0;j<5;j++){
                    var card = Layout_ThirdDun.getChildByName("Sprite_TD_Card"+j);
                    card.myTag = j;                
                    card.active = false;
                    cardList[j] = this.newCard(card,"Sprite_TD_Card"+j);
                    this.addClickEvent(card,this.node,"SSZ1100Game","onCardClicked");
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
        this.vecSpSpriteEffect  = [];
        this.userBullet       = [];
        this.userSpecialType  = [];
        this.userDaoCardType  = [];

        for(var i=0;i<4;i++){
            this.userDoneCard[i] = [];
            this.userDoneCardBack[i] = [];
            this.userDoneCardName[i] = [];
            var userCard = this.Layout_Desktop.getChildByName("Layout_UserCard"+i);
            this.vecSpriteEffect[i] = userCard.getChildByName("cardtype_bg");
            this.vecSpriteEffect[i].active = false;
            this.vecSpSpriteEffect[i]  = userCard.getChildByName("sp_cardtype_bg");
            this.vecSpSpriteEffect[i].active = false;

            this.userSpecialType[i] = userCard.getChildByName("specialType");
            this.userSpecialType[i].active = false;

            this.userBullet[i] = [];
            var bullets = userCard.getChildByName("bullets");            
            for(var k = 0; k < bullets.children.length; k++){
                this.userBullet[i][k] = bullets.children[k];
                this.userBullet[i][k].active = false;
            }

            this.userDaoCardType[i] = [];
            var cardtype = null;
            cardtype = userCard.getChildByName("FDCt");
            cardtype.active = false;
            this.userDaoCardType[i].push(cardtype);
            cardtype = userCard.getChildByName("SDCt");
            cardtype.active = false;
            this.userDaoCardType[i].push(cardtype);
            cardtype = userCard.getChildByName("TDCt");
            cardtype.active = false;
            this.userDaoCardType[i].push(cardtype);


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
        this.common('sit',{room_id:cc.vv.roomMgr.roomid});
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

        this.node.on('renew',function(ret){
            
            //进房失败，返回大厅
            if(ret.errcode != 0){
                cc.vv.alert.show('续房失败',ret.errmsg);
                return;
            }

            //隐藏续费，显示开始游戏
            cc.find("Canvas/game_result/btnRenew").active = false;
            cc.find("Canvas/game_result/btnReady").active = true;
            cc.find('Canvas/Layout_FuncBtn/show_score').active = false;

            //清楚所有玩家的信息，只保留名字
            for (var i = 0; i < self.players; i++) {
                
                if(self.vecUser && self.vecUser[i] && self.vecUser[i].uid > 0){
                    
                    var seat = self.SwitchViewChairID(i);

                    self.userDoneCardBack[seat][0].active = false;
                    self.userDoneCardBack[seat][1].active = false;
                    self.userDoneCardBack[seat][2].active = false;
                    self.userBullet[seat][0].active = false;
                    self.userBullet[seat][1].active = false;
                    self.userBullet[seat][2].active = false;
                    self.userDaoCardType[seat][0].active = false;
                    self.userDaoCardType[seat][1].active = false;
                    self.userDaoCardType[seat][2].active = false;
                    //self.userList[seat].setID(null);
                    self.userList[seat].setZhuang(false);
                    self.userList[seat].setWinCoinFixed(null);
                    self.userList[seat].setInfo(null,null,null,null,null);
                    self.vecSpriteEffect[seat].active = false;
                    self.vecSpSpriteEffect[seat].active = false;
                    self.vecUser[i] = {};
                }
            }

            //清除庄标识
            self.m_byZhuang = -1;
            //清除各道提示
            //完成界面算分的初始化隐藏
            /*
            for(var i=0;i<self.VecJieSuan.length;i++){
                self.VecJieSuan[i].active = false;
            }
            self.nodeJieSuan.active = false;
            */
            self.final_report = null; 
        });

        this.node.on('leave',function(ret){
            
            var data = ret.data;
            if(data.userid == cc.vv.userMgr.userid)
            {
                if(ret.errcode == 0){
                    cc.vv.sceneMgr.gotoHall();
                }
            }else{
                var seat = data.seatid;
                seat = self.SwitchViewChairID(seat);

                self.userDoneCardBack[seat][0].active = false;
                self.userDoneCardBack[seat][1].active = false;
                self.userDoneCardBack[seat][2].active = false;
                self.userBullet[seat][0].active = false;
                self.userBullet[seat][1].active = false;
                self.userBullet[seat][2].active = false;
                self.userDaoCardType[seat][0].active = false;
                self.userDaoCardType[seat][1].active = false;
                self.userDaoCardType[seat][2].active = false;
                self.userList[seat].setID(null, "");
                self.userList[seat].setWinCoinFixed(null);
                self.userList[seat].setInfo(null,null,null,null,null);

                self.vecUser[data.seatid] = {};
                self.vecSpriteEffect[seat].active = false;
                self.vecSpSpriteEffect[seat].active = false;
                //有人离开，必定空位，继续显示分享按钮
                self.inviteBtn.active = true;
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
        this.node.on('jiesuan',function(ret){
            self.deal('jiesuan',ret);
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
            self.vecUser[ret.seat].online = 0;
            var wViewChairID = self.SwitchViewChairID(ret.seat);
            self.userList[wViewChairID].setOffline(true);
            // var message = "玩家 " + ret.name + " 离线";
            // if(cc.vv.tip != null){                
            //     cc.vv.tip.show(message);
            // }
        });

        //玩家上线
        this.node.on('online',function(ret){
            ret = ret.data;
            self.vecUser[ret.seat].online = 1;
            var wViewChairID = self.SwitchViewChairID(ret.seat);
            self.userList[wViewChairID].setOffline(false);
            // var message = "玩家 " + ret.name + " 上线";
            // if(cc.vv.tip != null){                
            //     cc.vv.tip.show(message);
            // }
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
        cc.vv.net.common('ssz_1100',method,param);
    },

    OnReadyStart: function () {
        this.cbReason = 4;
        this.OnSubFinalReport(this.report_data);
        this.gameresult.active = true;

        var that = this;
        this.roundinfo.runAction(cc.sequence(
            cc.moveTo(0.2,cc.v2(0,-720)),
            cc.callFunc(function(){
                that.roundinfo.active = false;
            })
        ));

        cc.find('Canvas/Layout_FuncBtn/show_score').active = false;
    },

    OnReady: function () {
        this.common("ready");
        this.readyBtn.active = false;
        this.roundinfo.active = false;
        cc.find('Canvas/Layout_FuncBtn/show_score').active = false;
        this.playReadyAnimation();
        this.userList[0].setReady(true);
    },

    OnInvite : function(){

        var cntUser = 0;
        for (var i = 0; i < this.players; i++) {
            if (this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0) {
                cntUser++;
            }
        }

        cc.vv.audioMgr.playSFX("ui_click");
        var title = cc.GAME_NAME + "房间号：" + this.mRoomID + ' [缺' + (this.players - cntUser) + "人]";
        cc.vv.share_url = 'http://game.fingerjoys.com/room/'+ cc.GAME_CODE +'/'+ this.mRoomID;
        cc.vv.anysdkMgr.share(title,"玩法: " + this.descLabel.getComponent(cc.Label).string+ " " + this.m_nMaxRound + "局",'0','2','');
    },

    renew_ui : function(){
        //this.roundLabel.string = "局数:第" + this.m_nRound + "/" + this.m_nMaxRound+"局";
        this.roundLabel.string = this.m_nRound;
        this.roundLabelTotal.string   = this.m_nMaxRound;
        
        // this.lefttimeLabel.string = ""+this.m_nLeftTime;

        for(var i=0;i<this.players;i++)
        {
            var wViewChairID=this.SwitchViewChairID(i);
            //this.userList[wViewChairID].setXiaZhu(false);
            //this.userList[wViewChairID].setQiangZhuang(false);      
            if(this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0){
                this.userList[wViewChairID].setID(this.vecUser[i].uid, "");
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
                this.userList[wViewChairID].setID(null, "");
                this.userList[wViewChairID].setWinCoinFixed(null);
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

    //隐藏桌面牌型结果
    hidePlayerResultType:function(params) {
        for (var wViewChairID = 0; wViewChairID < this.players; wViewChairID++) {
            for (var dao = 0; dao < 3; dao++) {
                this.userDoneCardBack[wViewChairID][dao].parent.getChildByName( DaoTypeNodeName[dao] ).active = false
            }
        }
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

            this.byRound = data.round;

            var vecIsReady = [];
            for(var i = 0; i < data.list.length;i++){
                vecIsReady.push(data.list[i].ready);
            }

            //置其它人的开牌状态
            this.OnSubKaiPaiReady(this.byRound,vecIsReady);
            
            var mycards = data.list[this.mChairID].cards;

            if(mycards!= null &&　mycards.length == 13){
                this.vecReadyCard[0] = [mycards[0],mycards[1],mycards[2]];
                this.vecReadyCard[1] = [mycards[3],mycards[4],mycards[5],mycards[6],mycards[7]];
                this.vecReadyCard[2] = [mycards[8],mycards[9],mycards[10],mycards[11],mycards[12]];            
            }
            

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
                    // that.sszCardList.SortCardTypeGroupAi(data.list[that.mChairID].cards,that.paixin);
                    if(that.baipaiUIReady){
                        // that.ReInitAiXuanPaiGroup();
                        // that.ReInitCardPut();
                        that.baipaiComponent.initBaiPaiList();
                    }
                    that.sortPaiReady = true;
                },0);

                this.OnSubFaPai(vecIsReady,data.list[this.mChairID].cards);
            }
        }
        //结算 重连会有结算协议下来
        if (stage == 97) {
            // this.showReportFlg = data.report
            // this.m_nRound = data.round

            // for(var i = 0; i<this.players;i++){   
            //     var wViewChairID = this.SwitchViewChairID(i);
            //     this.userList[wViewChairID].setWinCoinNoAction(vecTotalScore[i]);
            //     this.userList[wViewChairID].setScore(vecUserTotalScore[i]);     
            // }

            // this.showRoundInfo();
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
            this.userDaoCardType[i][0].active = false;
            this.userDaoCardType[i][1].active = false;
            this.userDaoCardType[i][2].active = false;
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
        //this.m_bGameStarted = false;
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
            //this.m_nLeftTime = 30;
            //this.schedule(this.tipBaiPaiTime,1);

            node.setPosition(cc.v2(0,720));
            node.active = true;
            // node.setPosition(cc.v2(0,0));
            node.runAction(
                cc.moveTo(0.2,cc.v2(0,0))
            );
        }else{

            //停止倒计时
            cc.vv.audioMgr.stopSFX(this.alarm_id);
            this.unschedule(this.tipBaiPaiTime);
            
            if(node.getPositionY() > -720){
                node.setPosition(cc.v2(0,-720));
                // node.setPosition(cc.v2(0,0));
                // node.runAction(cc.sequence(
                //     cc.moveBy(0.2,cc.v2(0,-720))
                // ));
            }
        }
    },

    tipBaiPaiTime:function(){
        
        this.m_nLeftTime--;
        if(this.m_nLeftTime < 0){

            if(Math.abs(this.m_nLeftTime) % 10 == 0){
                this.alarm_id = cc.vv.audioMgr.playSFX("timeup_alarm");
            }
        }

        if(this.m_nLeftTime <=-1)return;

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
            this.vecUser[seat].online = 1;

            var wViewChairID=this.SwitchViewChairID(seat);
            this.userList[wViewChairID].setOffline(false);

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
                this.userDaoCardType[i][f].active = false;
            }
        }
        //完成界面算分的初始化隐藏
        for(var i=0;i<this.VecJieSuan.length;i++){
            this.VecJieSuan[i].active = false;
        }
        this.nodeJieSuan.active = false;

        //如果牌已经计算结束，直接上牌
        if(this.sortPaiReady == true){
            // this.ReInitAiXuanPaiGroup();
            // this.ReInitCardPut();
            this.baipaiComponent.initBaiPaiList();
        }

        this.renew_ui();

        this.baipaiUIReady = true;
    },

    OnCheckReadyPai:function(){
        this.showMyDoneCard(0);
    },

    showMyDoneCard : function(mode){

        if(this.kaipaiFlg){
            return;
        }

        if(this._kaipai == false){
            return;
        }

        var cardList = null;
        if(this.vecReadyCard.length == 0){
           return;
        }
        
        if(this.vecReadyCard[0]==null){
            return;
        }
        
        if(this.vecReadyCard[0].length == 0){
             return;
        }

        if(mode == 0){
            //已经翻了，
            if(this.showSelfCard){                        
                this.showSelfCard = false;
            }else{
                this.showSelfCard = true;
            }
        }else if(mode ==1){
            if(this.showSelfCard){
                this.showSelfCard = false;
            }else{
                return;
            }            
        }

        //初始化牌
        for(var j =0;j<3;j++){
            if(j == 0){
                for(var m =0;m<3;m++){
                    var data = this.vecReadyCard[j][m];
                    if(data != 0){
                        if(this.showSelfCard == false){
                            this.userDoneCard[0][j][m].getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(255);
                        }
                        else{
                            this.userDoneCard[0][j][m].getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(data);
                        }                        
                    }
                }
            }
            else
            {
                for(var m =0;m<5;m++){
                    var data = this.vecReadyCard[j][m];
                    if(data != 0){
                        if(this.showSelfCard == false){
                            this.userDoneCard[0][j][m].getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(255);
                        }
                        else{
                            this.userDoneCard[0][j][m].getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(data);
                        }
                        
                    }
                }
            }
        }

        //逐列显示
        for(var f = 0;f<3;f++){
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
                    this.userDoneCard[i][j][m].getComponent(cc.Sprite).spriteFrame =this.getsszPokerSpriteFrame(255);
                    this.userDoneCard[i][j][m].removeAllChildren();
                }
            }

            //隐藏道类型提示
            this.vecSpriteEffect[i].active = false;
            this.vecSpSpriteEffect[i].active = false;
            this.userDaoCardType[i][0].active = false;
            this.userDaoCardType[i][1].active = false;
            this.userDaoCardType[i][2].active = false;
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

            this.userDaoCardType[i][0].active = false;
            this.userDaoCardType[i][1].active = false;
            this.userDaoCardType[i][2].active = false;
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

        if(data == 66)
        {
            bCardValue = 15;
        }

        if(data == 67)
        {
            bCardValue = 16;
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
            //是否已经开局
            if(this.m_bTableStarted){
                cc.vv.alert.show("提示","您是否确认要申请解散房间？",function(){
                    that.common('try_dismiss_room');
                },true); 
            }else{
                if(this.creator == cc.vv.userMgr.userid){
                    cc.vv.alert.show("提示","解散房间不扣钻石,\n是否确认解散？",function(){
                        that.common('leave');
                    },true); 
                }else{
                    cc.vv.alert.show("提示","您是否确认要退出房间？",function(){
                        that.common('leave');
                    },true);
                }
            }            
        }else{
            cc.vv.alert.show("提示","解散房间不扣钻石,\n是否确认解散？",function(){
                that.common('leave');
            },true);
        }
    },
    
    OnSubFinalReport : function(data)
    {
        var that = this;
        var report = [];

        var dismiss = data.dismiss;
        var time = data.time;

        for(var i=0;i< data.list.length;i++){
            report[i] = {};
            if(data.list[i].userid > 0){
                report[i].uid = data.list[i].userid;
                report[i].nickname = data.list[i].name;
                report[i].avatar_url = '';
                report[i].resultScore = data.list[i].result_score;
            }else{
                report[i].uid = 0;
                report[i].nickname = "";
                report[i].avatar_url = "";
                report[i].resultScore = 0;
            }
        }

        this.report_data = data;
        this.final_report = report;
    
        if(this.cbReason == 4){
            cc.vv.GameResult.showReport(data.roomid,this.cbReason,report,data.nowRound,data.maxRound,time);
            if(dismiss == 1){
                this.gameresult.active = true;
                this.roundinfo.active = false;
            }
        }
    },

    /////////////////////////////////////////////非按钮方法逻辑///////////////////////////////////////////////
    //开始游戏动画
    playGameStartAnimation: function(vecIsReady,vecPai) {
        var that=this;        
        this.sszStartspine.setAnimation(0,'kaishi',false);
        this.sszStartspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            that.sszStartAnimaNode.active = false;
            that.setPlayerCardSpriteToback()
            that.hidePlayerCard()
            that.playGameStartSendCardAnimation(vecIsReady, vecPai)
        });

        this.sszStartAnimaNode.active = true;
        cc.vv.audioMgr.playSFX("ssz/openface/fantasy");
    },

    //发牌动画
    playGameStartSendCardAnimation:function(vecIsReady, vecPai) {
        var len = vecIsReady.length
        for (let seatid = 0; seatid < len; seatid++) {
            if (vecIsReady[seatid] == 1) {
                var cardNodes = this.setPlayerCardPosToTwoType(seatid)
                this.playFapaiAnimation(cardNodes, seatid, vecIsReady, vecPai)
            }
        }
    },

    //开始发牌
    playFapaiAnimation:function(cardNodes, seatid, vecIsReady, vecPai) {
        //发牌动画
        var wViewChairID = this.SwitchViewChairID(seatid);
        var num = 0;
        var that = this;
        var mnode = this.vecSpriteEffect[wViewChairID].parent;

        var sequence = cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(function(params) {
                cardNodes[num].active = true;
                num = num + 1;
                if (num < cardNodes.length) {
                    mnode.runAction(sequence)
                }
                //发牌动画结束出摆牌界面
                if (num == cardNodes.length && wViewChairID == 0) {
                    that.OnSubFaPai(vecIsReady,vecPai);  
                    that.playSexSFX(that.userList[0]._sex,"start_poker");
                    //刷新桌面玩家牌状态
                    that.OnSubKaiPaiReady(that.m_nRound,that.m_vecIsKaiPaiReady);
                }
            }, this)
        )
        mnode.runAction(sequence)
    },

    //初始化牌组的第一套坐标
    initCardOldPos:function(params) {
        for (var index = 0; index < this.players; index++) {
            var wViewChairID = this.SwitchViewChairID(index);
            //初始化牌的位置
            for (var dao = 0; dao < 3; dao++) {
                var max = (dao == 0) ? 3 : 5;
                for (var m = 0; m < max; m++) {
                    var localpos = this.userDoneCard[wViewChairID][dao][m].getComponent('TableCardAttri').setOldPosition();
                }
            }
        }
    },

    //牌组显示为盖牌
    setPlayerCardSpriteToback:function(params) {
        for (var index = 0; index < this.players; index++) {
            var wViewChairID = this.SwitchViewChairID(index);
            //初始化牌的位置
            for (var dao = 0; dao < 3; dao++) {
                var max = (dao == 0) ? 3 : 5;
                for (var m = 0; m < max; m++) {
                    this.userDoneCard[wViewChairID][dao][m].getComponent(cc.Sprite).spriteFrame = this.getsszPokerSpriteFrame(255);
                }
            }
        }
    },

    //隐藏所有的牌
    hidePlayerCard:function(params) {
        for (var index = 0; index < this.players; index++) {
            var wViewChairID = this.SwitchViewChairID(index);
            //初始化牌的位置
            for (var dao = 0; dao < 3; dao++) {
                var max = (dao == 0) ? 3 : 5;
                for (var m = 0; m < max; m++) {
                    this.userDoneCard[wViewChairID][dao][m].active = false;
                }
            }
        }
    },

    //牌组的第一套坐标
    setPlayerCardPosToOneType:function(params) {
        for (var index = 0; index < this.players; index++) {
            var wViewChairID = this.SwitchViewChairID(index);
            //初始化牌的位置
            for (var dao = 0; dao < 3; dao++) {
                var max = (dao == 0) ? 3 : 5;
                for (var m = 0; m < max; m++) {
                    var localpos = this.userDoneCard[wViewChairID][dao][m].getComponent('TableCardAttri').getOldPosition()
                    this.userDoneCard[wViewChairID][dao][m].setPosition(localpos.x, localpos.y);
                }
            }
        }
    },

    //牌组的第二套坐标 一排
    setPlayerCardPosToTwoType:function(seatid) {
        var wViewChairID = this.SwitchViewChairID(seatid);
        //初始化牌的位置
        var cardNodes = [];
        var num = 0;
        var worldpos = PlayFaPaiAnimationPos[wViewChairID];
        for (var dao = 0; dao < 3; dao++) {
            var max = (dao == 0) ? 3 : 5;
            for (var m = 0; m < max; m++) {
                var localpos = this.userDoneCard[wViewChairID][dao][m].parent.convertToNodeSpaceAR(worldpos);
                this.userDoneCard[wViewChairID][dao][m].setPosition(localpos.x + num * 30, localpos.y);
                cardNodes.push(this.userDoneCard[wViewChairID][dao][m])
                num = num + 1;
            }
        }

        return cardNodes
    },

    //开始比牌动画
    playBgCCardAnimation:function(vecCard,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag){
        var that=this;
        this.sszBgCompCardspine.setAnimation(0,'bipai',false);
        this.sszBgCompCardspine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            that.sszBgCompCardAnimaNode.active = false;

            that.OnUserKaiPaiByOrder(vecCard,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag);
        });

        this.sszBgCompCardAnimaNode.active = true;
        cc.vv.audioMgr.playSFX("ssz/openface/fantasy");
        this.playSexSFX(this.userList[0]._sex,"start_compare");
        cc.vv.log3.info("animation" + this.sszBgCompCardspine.animation)
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

        
        /*
         //特殊效果全屏显示
        var special_effect = this.node.getChildByName('hongbolang_effect');
        var special_effect_main = special_effect.getChildByName('main');
        var special_effect_words = special_effect.getChildByName('words');

        special_effect.active = true;

        //先清除所有上把显示
        special_effect_words.removeAllChildren();

        //文字
        var wordsList = ['hong','bo','lang'];

        //背景放大同时渐入
        var imgName = "spefx_bg_hbl";
        special_effect_main.getComponent(cc.Sprite).spriteFrame = this.SpEffectAtlas.getSpriteFrame(imgName);
        
        special_effect_main.scale = 0.8;
        special_effect_main.opacity = 0;
        special_effect_main.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.2),
                    cc.scaleTo(0.2,1.0)
                ),
                cc.delayTime(0.4 + wordsList.length * 0.3),
                cc.callFunc(function(){
                    special_effect.active = false;
                    
                })
            )
        );
        

        //动态加入文字
        for(var i=0;i<wordsList.length;i++){

            //创建文字节点
            var word = new cc.Node('word');
            word.active = true;
            word.opacity = 0;
            special_effect_words.addChild(word);

            var wordName = "specailWord_red_"+wordsList[i];
            var wordSprite = word.addComponent(cc.Sprite);
            wordSprite.spriteFrame = this.SpEffectAtlas.getSpriteFrame(wordName);

            word.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.scaleTo(0.0,1.5),
                        cc.hide()),
                    cc.delayTime(0.1+ i*0.2),
                    cc.show(),
                    cc.spawn(
                        cc.fadeIn(0.2),
                        cc.scaleTo(0.2,1.0)
                    ),
                 
                )
            )
        }
        */
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
        
        var shot_effect = [{pos:cc.v2(-180,-205),face:[{x:1,y:1,rate:0},   {x:1,y:-1,rate:128}, {x:1,y:-1,rate:165}, {x:1,y:1,rate:40}]},
                           {pos:cc.v2(250,230),  face:[{x:1,y:1,rate:-75}, {x:1,y:1,rate:0},    {x:1,y:-1,rate:-120},{x:1,y:1,rate:-32}]},
                           {pos:cc.v2(554,50),   face:[{x:1,y:1,rate:-38}, {x:1,y:1,rate:12},   {x:1,y:1,rate:0},    {x:1,y:1,rate:-15}]},                           
                           {pos:cc.v2(-565,20), face:[{x:-1,y:1,rate:30}, {x:-1,y:1,rate:-20}, {x:-1,y:1,rate:0},   {x:1,y:1,rate:0}]}];
            
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
        var shotAudioId = 0;
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
            cc.vv.audioMgr.stopSFX(shotAudioId);
        });

        this.sszShotspine.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
            if(this.userBullet[wViewChairID_t][0].active == false){
                shotAudioId = cc.vv.audioMgr.playSFX("ssz/openface/daqiang2");
            }
            //显示抢眼
            if('slot1' == event.data.name){
                this.userBullet[wViewChairID_t][0].active = true;    
            }else if('slot2' == event.data.name){
                this.userBullet[wViewChairID_t][1].active = true;
            }else if('slot3' == event.data.name){
                this.userBullet[wViewChairID_t][2].active = true;
            }
            
            //cc.vv.audioMgr.playSFX("ssz/openface/daqiang3");            
        });
        
        this.sszShotAnimaNode.active = true;
        //cc.vv.audioMgr.playSFX("ssz/openface/bullets");
        
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
        cc.vv.log3.info("deal name:" + name)
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
        else if (name == 'param') {
            var room_id = data.roomid;//房间ID

            // //1传统 3 345倍 10 疯狂10倍 15 疯狂15倍
            // this._yabei = data.yabei;

            //0 不带王 1 带王
            this.wang = data.wang;

            //是否有特殊牌 
            //1：有 0：无
            this.paixin = data.paixin;

            //玩家人数
            this.players = data.ren;

            //房主ID
            this.creator = data.creator;

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
            //
            this.initCardOldPos()
        }
        else if (name == "stage"){
            var stage = data.stage;
            var deal_time = data.deal_time;

            this.OnSubStage(stage,deal_time,data);
        }
        else if(name == 'ready'){
            var uid  = data.userid;
            var seat = data.seatid;
            this.m_vecIsReady[data.seatid] = 1;

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
            var vecPai = data.pai;
            this.m_nRound = data.round;
            this.m_nMaxRound = data.max_round;

            this.baipaiHand = vecPai;

            this.sszReadyspine.clearTrack(0);
            this.sszReadyAnimaNode.active = false;
            this._kaipai = false;
            this.showSelfCard = false;
            this.baipaiUIReady = false;
            this.sortPaiReady  = false;
            var that = this;

            for(var i = 0; i<this.players;i++){   
                var wViewChairID = this.SwitchViewChairID(i);                    
                this.userList[wViewChairID].setWinCoinFixed(null);
                this.userList[wViewChairID].setOffline(false);
                if (this.vecUser && this.vecUser[i] && this.vecUser[i].uid > 0){
                    this.vecUser[i].offline = false;
                }                            
            }

            //开始算牌
            this.scheduleOnce(function(){
                that.sszCardList.initData();
                // that.sszCardList.SortCardTypeGroupAi(vecPai,that.paixin);
                if(that.baipaiUIReady){
                    // that.ReInitAiXuanPaiGroup();
                    // that.ReInitCardPut();
                    that.baipaiComponent.initBaiPaiList();
                }
                that.sortPaiReady = true;
            },0);

            this.hidePlayerResultType();
            this.playGameStartAnimation(this.m_vecIsReady,vecPai);
        }
        else if(name  == "kaipai"){
            cc.vv.log3.info("vecPai:hahaha")
            this.byRound = data.round;
            this.m_vecIsKaiPaiReady[data.seatid] = data.ready
            this.setPlayerCardPosToOneType()
            this.OnSubKaiPaiReady(this.byRound,this.m_vecIsKaiPaiReady);
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
            this.byRound = data.round;
            
            //this.OnSubJieSuan(byRound,userScoreList);            
        }
        else if (name == "jiesuan"){
            if(this.kaipaiFlg == true){
                this.readyBtn.active = true;
                return;
            }

            this.showSuanFen = false;
            this.showReportFlg = data.report;

            this.showMyDoneCard(1);
            this.kaipaiFlg = true;
            this.xuanPaiAction(false);

            //玩家的开牌状态 防止断线重连的时候 牌不显示
            for(var i = 0; i< data.list.length; i++){
                if (data.list[i].pai[0] != 0) {
                    this.m_vecIsKaiPaiReady[data.list[i].seatid] = 1
                }
                else{
                    this.m_vecIsKaiPaiReady[data.list[i].seatid] = 0
                }
            }
            this.OnSubKaiPaiReady(this.m_nRound,this.m_vecIsKaiPaiReady);
            
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

                //记录自己的牌
                if(i == this.mChairID){
                    this.vecReadyCard[0] = [].concat(FScard);
                    this.vecReadyCard[1] = [].concat(SDcard);
                    this.vecReadyCard[2] = [].concat(TDcard);
                }
                
                vecDaoCardType.push(userScoreList[i].type);
                vecDaoScore.push(userScoreList[i].dao);
                vecTotalScore.push(userScoreList[i].score);
                vecUserTotalScore.push(userScoreList[i].result_score);

                if(userScoreList[i].quanleida == 1){
                    homeRunTag = true;
                }
            }

            this.vecCard = vecCard;
            this.vecDaoCardType = vecDaoCardType;
            this.vecDaoScore = vecDaoScore;
            this.vecTotalScore = vecTotalScore;
            this.vecUserTotalScore= vecUserTotalScore;
            this.vecShot = vecShot;
            this.homeRunTag = homeRunTag
            //初始化玩家状态数据
            this.refreshPlayerStatus()
            //显示开始比牌动画
            this.playBgCCardAnimation(vecCard,vecDaoCardType,vecDaoScore,vecTotalScore,vecUserTotalScore,vecShot,homeRunTag);
        }
	    else if(name ==  "report"){

            //显示结算时，隐藏所有POPUP(主要处理申请解散后，POPUP不隐藏问题)
            cc.vv.popupMgr.closeAll();

            //结束滴滴声
            cc.vv.audioMgr.stopSFX(this.alarm_id);

            //保存摆牌模式
            // cc.sys.localStorage.setItem("baipaiMode",this._baipaiMode);

            if(this.showSuanFen){
                this.reportBtn.active = true;
                this.readyBtn2.active = false;
                this.readyBtn.active = false;
            }

            this.cbReason = data.reason;
            this.OnSubFinalReport(data);
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




