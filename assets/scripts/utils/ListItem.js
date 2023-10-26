const SelectedType = cc.Enum({
    NONE: 0,
    TOGGLE: 1, //单一（单个Node显示/隐藏）
    SWITCH: 2, //切换(单个Sprite切换SpriteFrame)
});

cc.Class({
    editor: {
        disallowMultiple: false,
        menu: '自定义组件/List Item',
        executionOrder: -5001,          //先于List
    },

    extends: cc.Component,

    properties: {
        icon: {
            default: null,
            type: cc.Sprite,
        },
        title: cc.Node,
        selectedMode: {
            default: SelectedType.NONE,
            type: SelectedType,
            tooltip: CC_DEV && '选择模式',
        },
        adaptiveSize: {
            default: false,
            tooltip: CC_DEV && '自适应尺寸（宽或高）',
        },

    },
    onLoad() {

    },
    onDestroy() {

    },
    _registerEvent() {},
    _onSizeChange() {},
});