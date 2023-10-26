/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package scunt.wanshung.thuan;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import android.Manifest;
import android.annotation.TargetApi;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;
import android.webkit.WebView;

import com.amap.api.location.AMapLocationClient;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import java.util.ArrayList;


import scunt.wanshung.thuan.utils.WebViewUtil;

public class AppActivity extends Cocos2dxActivity {
    public static IWXAPI api;
    public static AppActivity appActivity;
    public static Context context;
    public WebView webView;
    public WebViewUtil mWebViewUtil;
    public static String yq_roomid = "";
    public static boolean GameStartd = false;
//    public static final String APP_ID = "这个是微信的appid换成你自己的";
//    public static final String APP_ID = "wx212f955e753aff78";
    public static final String APP_ID = "wxd10ad8e546464feb";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        appActivity = this;
        context = this;
        SDKWrapper.getInstance().init(this);

        WXAPI.Init(this);
        api = WXAPIFactory.createWXAPI(this, APP_ID, true);

        // 将应用的appId注册到微信
        api.registerApp(APP_ID);

        //建议动态监听微信启动广播进行注册到微信
        registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // 将该app注册到微信
                api.registerApp(AppActivity.APP_ID);
            }
        }, new IntentFilter(ConstantsAPI.ACTION_REFRESH_WXAPP));
        AMapLocationClient.updatePrivacyShow(this,true,true);
        AMapLocationClient.updatePrivacyAgree(this,true);
        SDKWrapper.getInstance().init(this);
        //addH5WebView();
        //实始化SDK
        G3Plugin.getInstance().init(this);
        checkStoragePermission();
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//            if (!Settings.System.canWrite(getApplicationContext())) {
//                Intent intent = new Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS, Uri.parse("package:" + getPackageName()));
//                startActivityForResult(intent, 200);
//            }
//        }
    }
    //确保当系统收到第三方回调 去调用gl线程回传游戏的时候，游戏是确切被初始化完成的 可以接收的
    public void handlerIntent() {
        Handler handler = new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {
                if (GameStartd){
                    //收到值就直接调用js
                    load_joinroom();
                }else{
                    //收不到值就继续调用
                    handlerIntent();
                }
            }
        });
    }
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
    }
    //回调js 发送闲聊的邀请房间号
    public static void load_joinroom(){
//        Log.e("执行进来了","准备去执行："+yq_roomid);
        if (yq_roomid==""||yq_roomid=="0"){return;};
        final String roomId = yq_roomid;
        final String openId = yq_roomid;
        final String roomToken = yq_roomid;
        yq_roomid = "";
//        Log.e("改完了是个啥！！！","--"+roomId+"：：：：："+yq_roomid+"--");
        if(roomId!=null&&roomId!=""&&roomId!=""){
            G3Plugin.getActivity().runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    String eval = String.format("cc.vv.g3Plugin.onXianliaoYQ(%d,\"%s\",\"%s\",\"%s\");",1,roomId,openId,roomToken);
                    Cocos2dxJavascriptJavaBridge.evalString(eval);
                }
            });
        }
    }
    @Override
    protected void onPause() {
        if (webView != null) {
            webView.reload();
        }
        super.onPause();
        SDKWrapper.getInstance().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    //设置屏幕横竖屏 横屏SCREEN_ORIENTATION_LANDSCAPE
    public void setScreenOrientation(Boolean islandscaps){
//        if(islandscaps){
//            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
//        }else{
//            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
//        }
    }

    public static void addH5WebView(final String url){

        appActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                appActivity.openH5WebVie(url);
            }
        });
    }

    public void openH5WebVie(String url){
        // webView layout
//        mWebViewUtil = new WebViewUtil();
//        mWebViewUtil.init(this, mFrameLayout, url);
//        webView = mWebViewUtil.webView;
    }
    public static void removeH5WebView(){
        appActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (appActivity.webView != null) {
                    appActivity.setScreenOrientation(true);
                    appActivity.mWebViewUtil.hideBtn();
                    appActivity.webView = null;
                }
            }
        });
    }

    @TargetApi(Build.VERSION_CODES.M)
    public void checkStoragePermission(){
        if (showCheckPermissions()){
            ArrayList<String> str = new ArrayList();
            if( context.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED ){
                str.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }
            if(context.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED){
                str.add(Manifest.permission.RECORD_AUDIO);
            }

            if(str.size() != 0){
                String[] array = new String[str.size()];
                this.requestPermissions( str.toArray(array) , 1 );
            }
        }
    }

    public boolean showCheckPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return true;
        } else {
            return false;
        }
    }
    //** 定位相关*/

}
