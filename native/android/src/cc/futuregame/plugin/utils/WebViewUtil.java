package cc.futuregame.plugin.utils;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.xcl.chessroom.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.cocos2dx.lib.ResizeLayout;

import java.io.File;

public class WebViewUtil {
    public WebView webView;
    public LinearLayout layout_parent;
    private ResizeLayout frameLayout;
    private Context context;
    private WebSettings webSettings;
    private String TAG = "WebViewUtil";
    private int screenWidth;
    private int screenHeight;

    public void init(Context mContext, ResizeLayout mFrameLayout, String url) {
        ((AppActivity) mContext).setScreenOrientation(false);
        context = mContext;
        frameLayout = mFrameLayout;
        getScreeWH();
        findViews(mContext, mFrameLayout);
        initWebView(url);
    }

    /**
     * 查找界面view
     */
    private void findViews(final Context context, ResizeLayout mFrameLayout) {
        webView = new WebView(context);
        ViewGroup.LayoutParams edittext_layout_params = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);
        webView.setLayoutParams(edittext_layout_params);
        mFrameLayout.addView(webView);

        RelativeLayout.LayoutParams move_layout_params = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        move_layout_params.leftMargin = 150;
        moveImageButton moveBtn = new moveImageButton(context);
        moveBtn.setBackgroundResource(R.mipmap.move);
        moveBtn.setLayoutParams(move_layout_params);

        RelativeLayout.LayoutParams clone_layout_params = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
        ImageButton cloneBtn = new ImageButton(context);
        cloneBtn.setBackgroundResource(R.mipmap.clone);
        cloneBtn.setLayoutParams(clone_layout_params);
        cloneBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ((AppActivity) context).runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("if(cc.vv.moreGame){cc.vv.moreGame.hideWebView();}");
                    }
                });
            }
        });

        LinearLayout.LayoutParams parent_layout_params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
        layout_parent = new LinearLayout(context);
        layout_parent.setPadding(50,50,0,0);
        layout_parent.setOrientation(LinearLayout.HORIZONTAL);
        layout_parent.setLayoutParams(parent_layout_params);
        layout_parent.addView(moveBtn);
        layout_parent.addView(cloneBtn);

        mFrameLayout.addView(layout_parent);
    }

    /**
     * 初始化webview参数
     */
    private void initWebView(String url) {
        initWebSetting(url);
        loadUrl(url);
    }

    /**
     * 加载地址
     */
    private void loadUrl(String url) {
        webView.loadUrl(url);
    }

    /**
     * 设置WebSetting
     */
    private void initWebSetting(String url) {
        webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());
        final String useragent = webSettings.getUserAgentString();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                webSettings.setUserAgentString(useragent);
                try {
                    if (url.startsWith("weixin://") || url.startsWith("alipays://") ||
                            url.startsWith("mailto://") || url.startsWith("tel://") || url.startsWith("mqqwpa://") || url.startsWith("wtloginmqq://")) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        context.startActivity(intent);
                        return true;
                    }else{
                        if (!url.startsWith("http:") && !url.startsWith("https:")) {
                            webSettings.setUserAgentString(useragent);
                            Intent intent = new Intent();
                            intent.setAction(Intent.ACTION_VIEW);
                            intent.setData(Uri.parse(url));
                            context.startActivity(intent);
                            return true;
                        } else {
                            if(url.startsWith("https://graph.qq.com/")) {
                                //qq登录
                                webSettings.setUserAgentString("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0");
                                webView.loadUrl(url);
                            }
                        }
                    }
                } catch (Exception e) { //防止crash (如果手机上没有安装处理某个scheme开头的url的APP, 会导致crash)
                    e.printStackTrace();
                    if (url.startsWith("alipay")) {
                        Toast.makeText(view.getContext(), "请确认是否安装支付宝", Toast.LENGTH_SHORT).show();
                    } else if (url.startsWith("weixin")) {
                        Toast.makeText(view.getContext(), "请确认是否安装微信", Toast.LENGTH_SHORT).show();
                    } else if (url.startsWith("mqqwpa")) {
                        Toast.makeText(view.getContext(), "请确认是否安装QQ", Toast.LENGTH_SHORT).show();
                    } else if (url.startsWith("wtloginmqq")) {
                        Toast.makeText(view.getContext(), "请确认是否安装QQ", Toast.LENGTH_SHORT).show();
                    }
                    return false;
                }
                return super.shouldOverrideUrlLoading(view, url);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                cloneBgMusic();
            }
        });
        //如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
        webSettings.setJavaScriptEnabled(true);

        //缩放操作
        webSettings.setSupportZoom(true);  //支持缩放，默认为true。是下面那个的前提。
        webSettings.setBuiltInZoomControls(true); //设置内置的缩放控件。若上面是false，则该WebView不可缩放，这个不管设置什么都不能缩放。
        webSettings.setDomStorageEnabled(true);
        webSettings.supportMultipleWindows();  //多窗口
        webSettings.setNeedInitialFocus(true);
        //设置自适应屏幕，两者合用
//        webSettings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN); //支持内容重新布局
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setPluginState(WebSettings.PluginState.ON);
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);

        // 设置缓冲大小，我设的是8M
        webSettings.setAppCacheMaxSize(1024 * 1024 * 8);
        String appCachePath = context.getApplicationContext().getDir("cache", Context.MODE_PRIVATE).getPath();
        Log.i(TAG, "cacheDirPath= " + appCachePath);
        webSettings.setAppCachePath(appCachePath);
        webSettings.setDatabasePath(appCachePath);
        //开启web缓存功能
        webSettings.setAppCacheEnabled(true);
        webSettings.setAllowFileAccess(true);

        //其他细节操作
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT); //webview中缓存 默认
        webSettings.setAllowFileAccess(true); //设置可以访问文件
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true); //支持通过JS打开新窗口
        webSettings.setLoadsImagesAutomatically(true); //支持自动加载图片
        webSettings.setDefaultTextEncodingName("utf-8");//设置编码格式

        //自动播放音乐
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            webSettings.setMediaPlaybackRequiresUserGesture(false);
        }
    }

    public void hideBtn(){
        clearWebViewCache();
        loadUrl("");
        frameLayout.removeView(layout_parent);
        frameLayout.removeView(webView);
    }

    class moveImageButton extends ImageButton {
        private int moveX;
        private int moveY;
        public moveImageButton(Context context) {
            super(context);
        }

        @TargetApi(Build.VERSION_CODES.HONEYCOMB)
        @Override
        public boolean onTouchEvent(MotionEvent event) {
            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    moveX = (int) event.getRawX();
                    moveY = (int) event.getRawY();
                    break;
                case MotionEvent.ACTION_MOVE:
                    int dx = (int) event.getRawX() - moveX;
                    int dy = (int) event.getRawY() - moveY;
                    moveX = (int) event.getRawX();
                    moveY = (int) event.getRawY();

                    int left = layout_parent.getPaddingLeft() + dx;
                    int top = layout_parent.getPaddingTop() + dy;
                    int right = layout_parent.getPaddingRight();
                    int bottom = layout_parent.getPaddingBottom();

                    if(left < this.getWidth() / 2){
                        left = this.getWidth() / 2;
                    }
                    if(left > screenWidth - this.getWidth() / 2 - 100){
                        left = screenWidth - this.getWidth() / 2 - 100;
                    }

                    if(top > screenHeight - this.getHeight() / 2 - 50) {
                        top = screenHeight - this.getHeight() / 2 - 50;
                    }

                    if(top < this.getHeight() / 2 + 50){
                        top = this.getHeight() / 2 + 50;
                    }
                    layout_parent.setPadding(left,top,right,bottom);
                    break;
            }
            return true;
        }
    }

    /**
     * 清除WebView缓存
     */
    public void clearWebViewCache() {
        String appCachePath = context.getApplicationContext().getDir("cache", Context.MODE_PRIVATE).getPath();
        try{
            context.deleteFile(appCachePath);
        }catch (IllegalArgumentException e){
            e.printStackTrace();
        }
    }

    /**
     * 关闭原游戏的背景音乐
     */
    public void cloneBgMusic(){
        ((AppActivity) context).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("if(cc.vv.moreGame){ cc.vv.moreGame.showWebView();}");
            }
        });
    }

    public void getScreeWH(){
        WindowManager wm = (WindowManager)context.getSystemService(Context.WINDOW_SERVICE);
        screenWidth = wm.getDefaultDisplay().getWidth();
        screenHeight = wm.getDefaultDisplay().getHeight();
    }
}
