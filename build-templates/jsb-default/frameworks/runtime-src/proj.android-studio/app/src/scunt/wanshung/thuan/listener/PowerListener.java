package scunt.wanshung.thuan.listener;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import scunt.wanshung.thuan.G3Plugin;

/**
 * Created by Administrator on 2018/5/16 0016.
 */
public class PowerListener {

    public  void init(){
        G3Plugin.getActivity().registerReceiver(mBatInfoReveiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    // 创建BroadcastReceiver
    private BroadcastReceiver mBatInfoReveiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            String action = intent.getAction();
            // 如果捕捉到action是ACRION_BATTERY_CHANGED
            // 就运行onBatteryInfoReveiver()
            if (intent.ACTION_BATTERY_CHANGED.equals(action)) {
                final int intLevel = intent.getIntExtra("level", 0);
                final int intScale = intent.getIntExtra("scale", 100);
                final int power = (int)((float)intLevel / (float)intScale * 100);

                G3Plugin.getActivity().runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        String eval = String.format("cc.vv.g3Plugin.onPowerResult(%d);",power);
                        Cocos2dxJavascriptJavaBridge.evalString(eval);
                    }
                });
            }
        }
    };
}
