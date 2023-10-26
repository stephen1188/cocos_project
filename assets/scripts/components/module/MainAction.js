// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    touchmove: function (event) {
        var main_Action = this.node.getChildByName("main_Action");
        var mouse_move_action = main_Action.getChildByName("mouse_move_action");
        var touch = event.getTouches(); 
        var delta = touch[0].getDelta();              //获取事件数据: delta
        mouse_move_action.x += delta.x;
        mouse_move_action.y += delta.y;
    },
    touchend: function (event) {
        var main_Action = this.node.getChildByName("main_Action");
        var mouse_move_action = main_Action.getChildByName("mouse_move_action");
        var touch = event.getTouches(); 
        var delta = touch[0].getDelta();              //获取事件数据: delta
        mouse_move_action.x = -550;
        mouse_move_action.y = 750;
    },

    touchstart: function (event) {
        var main_Action = this.node.getChildByName("main_Action");
        var mouse_move_action = main_Action.getChildByName("mouse_move_action");
        var touch = event.getTouches(); 
        var delta = touch[0].getDelta();              //获取事件数据: delta
        var temp = event.getLocation()
        mouse_move_action.x = temp.x - 800;
        mouse_move_action.y = temp.y - 375;
    },

    start () {
        var bg = this.node.getChildByName("bg");
        bg.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
        bg.on(cc.Node.EventType.TOUCH_END, this.touchend, this);
        bg.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
        bg.on(cc.Node.EventType.TOUCH_CANCEL, this.touchend, this);
    },

    
});
