var DDZConst = cc.Class({
    extends: cc.Component,
    statics: {
        player2:[
            {x:-620,y:-40,distance:50,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-88,y:-248,scale:1.0},voice:{x:112,y:22,scalex:-1,scaley:1},shake:{x:46,y:67}}},
            {x:620,y:143,distance:50,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:239,y:-72,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1},shake:{x:-46,y:67}}},
            //{x:-620,y:143,distance:50,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-404,y:-72,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1},shake:{x:46,y:67}}},
        ],

        player3:[
            {x:-620,y:-40,distance:50,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-88,y:-248,scale:1.0},voice:{x:112,y:22,scalex:-1,scaley:1},shake:{x:46,y:67}}},
            {x:620,y:143,distance:50,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:239,y:-72,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1},shake:{x:-46,y:67}}},
            {x:-620,y:143,distance:50,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-404,y:-72,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1},shake:{x:46,y:67}}},
        ],
       
        chat_path:"pdk",
        quick_chat:[
            {id:0,info:"快点吧，我等的花儿都谢了"},
            {id:1,info:"大家好，我们交个朋友吧"},
            {id:2,info:"打牌这么慢像个老太婆一样"},
            {id:3,info:"急什么，让我想想"},
            {id:4,info:"快出快出，别耽误我玩牌"},
            {id:5,info:"你就是传说中的赌神吗"},
            {id:6,info:"我只想安静的做个宝宝"},
            {id:7,info:"运气真好，牌这么烂也赢了"},
            {id:8,info:"这把我赢定了"}, 
            {id:9,info:"这么打牌，我也是醉了"},
            {id:10,info:"这牌出的必须给你点赞"},
            {id:11,info:"都不要跑，玩把大的"},
            {id:12,info:"谁怕谁，玩到底"},
            {id:13,info:"哎，输光了，回家拿钱去"},
            {id:14,info:"哥有钱，你们玩的过我吗"}
        ],
        default_bg:"public/table/game_bg_ddz"
    },
});
