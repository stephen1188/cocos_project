package scunt.wanshung.thuan;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Vibrator;
import android.text.ClipboardManager;
import android.util.Log;
import android.view.WindowManager;

//import com.mob.MobSDK;

//import org.xianliao.im.sdk.constants.SGConstants;
//import org.xianliao.im.sdk.modelmsg.SGGameObject;
//import org.xianliao.im.sdk.modelmsg.SGImageObject;
//import org.xianliao.im.sdk.modelmsg.SGLinkObject;
//import org.xianliao.im.sdk.modelmsg.SGMediaMessage;
//import org.xianliao.im.sdk.modelmsg.SGTextObject;
//import org.xianliao.im.sdk.modelmsg.SendMessageToSG;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import scunt.wanshung.thuan.listener.NetworkListener;
import scunt.wanshung.thuan.listener.PowerListener;
import scunt.wanshung.thuan.location.GaodeMapLocation;
//import cc.futuregame.plugin.mob.MobAuthorize;
//import cc.futuregame.plugin.mob.MobShare;

/**
 * Created by Magicin on 2017/6/18.
 */

public class G3Plugin {

    private static G3Plugin mInstace = null;
    private static AppActivity mActivity = null;
    protected static boolean mInit = false;

    /**
     * 单例化
     * @return
     */
    public static G3Plugin getInstance() {
        if (null == mInstace){
            mInstace = new G3Plugin();
        }
        return mInstace;
    }

    /**
     * 返回 Activity
     * @return Activity
     */
    public static AppActivity getActivity(){
        return G3Plugin.mActivity;
    }
    //震动
    public static void vibrate(int vibrate){
        Vibrator vibrator = (Vibrator)G3Plugin.getActivity().getSystemService(G3Plugin.getActivity().VIBRATOR_SERVICE);
        vibrator.vibrate(vibrate);
    }
    /**
     * 预先请求一次，弹出授权
     */
    public static void init(){


        if(mInit)return;
        mInit = true;

        //强制横屏
//        G3Plugin.mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);// 横屏

        G3Plugin.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {

                //SHARESDK
//                MobSDK.init(G3Plugin.getActivity());

                //电量监听
                new PowerListener().init();

                //网络信息监听
                new NetworkListener().init();

                //屏幕常亮
                G3Plugin.getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
    }

    /**
     * 保存截屏图片
     * @param path
     * @param img
     * @param weidth
     * @param heidth
     * @param weidth2
     * @param heidth2
     */
    public static void saveBitmap(String path,String img,int weidth,int heidth,int weidth2,int heidth2) {

        Bitmap bmp = BitmapFactory.decodeFile(path + img);
        Bitmap thumbBmp1 = Bitmap.createScaledBitmap(bmp, weidth, heidth, true);
        Bitmap thumbBmp2 = Bitmap.createScaledBitmap(bmp, weidth2, heidth2, true);

        G3Plugin.saveBitmap(path + "result_share_1.jpg",thumbBmp1);
        G3Plugin.saveBitmap(path + "result_share_2.jpg",thumbBmp2);

    }

    //保存图片
    private static void saveBitmap(String filepath,Bitmap bitmap) {

        File file = new File(filepath);//将要保存图片的路径
        Log.d("111111111",filepath);

        try {
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, bos);
            bos.flush();
            bos.close();
            Log.d("111111111","ok");
        } catch (Exception e) {
            e.printStackTrace();
            Log.d("111111111",e.toString());
        }
    }

    /**
     * 开始定位
     * @return
     */
    public static void location(){
        GaodeMapLocation.getInstance().location();
    }

    /**
     * 复制内容到剪贴板
     * @param text
     */
    public static void copy(String text){
        // 从API11开始android推荐使用android.content.ClipboardManager
        // 为了兼容低版本我们这里使用旧版的android.text.ClipboardManager，虽然提示deprecated，但不影响使用。
        ClipboardManager cm = (ClipboardManager) G3Plugin.getActivity().getSystemService(Context.CLIPBOARD_SERVICE);
        // 将文本内容放到系统剪贴板里。
        cm.setText(text);
    }

    /**
     * 获取内存中的房间号
     * @return
     */
    public static  String getRoomid(){
        return "";
    }

    /**
     * JAVA层初始化
     * @param activity
     */
    public void init(AppActivity activity) {
        G3Plugin.mActivity = activity;
    }
}
