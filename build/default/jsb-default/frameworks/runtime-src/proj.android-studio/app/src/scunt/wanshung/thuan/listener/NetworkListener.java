package scunt.wanshung.thuan.listener;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.telephony.SignalStrength;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import scunt.wanshung.thuan.G3Plugin;
import static android.net.ConnectivityManager.TYPE_WIFI;

/**
 * Created by Administrator on 2018/5/16 0016.
 */


public class NetworkListener {

    private final String NETWORK_STATE_CHANGE = "android.net.conn.CONNECTIVITY_CHANGE";

    int last_dbm = -99;
    int last_rssi = -99;

    public void init(){

        //监听手机信息
        MyPhoneStateListener MyListener   = new MyPhoneStateListener();
        TelephonyManager Tel = ( TelephonyManager )G3Plugin.getActivity().getSystemService(Context.TELEPHONY_SERVICE);
        Tel.listen(MyListener ,PhoneStateListener.LISTEN_SIGNAL_STRENGTHS);

        MyReceiver mMyReceiver = new MyReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(NETWORK_STATE_CHANGE);
        filter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);
        filter.addAction(WifiManager.RSSI_CHANGED_ACTION);
        G3Plugin.getActivity().registerReceiver(mMyReceiver, filter);
    }

    private class MyPhoneStateListener extends PhoneStateListener
    {

      /* Get the Signal strength from the provider, each tiome there is an update  从得到的信号强度,每个tiome供应商有更新*/

        @Override
        public void onSignalStrengthsChanged(SignalStrength signalStrength) {
            super.onSignalStrengthsChanged(signalStrength);

            ConnectivityManager connMgr = (ConnectivityManager) G3Plugin.getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
            if(networkInfo.getType() == TYPE_WIFI && networkInfo.isConnected())return;

//            1.大于-97时候，等级为SIGNAL_STRENGTH_GREAT，即为4
//            2.大于-105时候，等级为SIGNAL_STRENGTH_GOOD，即为3
//            3.大于-110时候，等级为SIGNAL_STRENGTH_MODERATE，即为2
//            4.大于-120时候，等级为SIGNAL_STRENGTH_POOR，即为1
//            5.大于-140时候，等级为SIGNAL_STRENGTH_NONE_OR_UNKNOWN，即为0
//            6.大于-44时候，等级为-1

            int level = -1;
            int a = signalStrength.getCdmaDbm();
            int b = signalStrength.getEvdoDbm();
            int dbm = a;

            if(dbm >= -97){
                level = 4;
            }else if(dbm >= -105 && dbm <-97){
                level = 3;
            }else if(dbm >= -110 && dbm <-105){
                level = 2;
            }else if(dbm >= -120 && dbm <-110){
                level = 1;
            }else if(dbm >= -140 && dbm <-120){
                level = 0;
            }

            final int to = level;

            if(last_dbm == to)return;
            last_dbm = to;

            G3Plugin.getActivity().runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    String eval = String.format("cc.vv.g3Plugin.onNetworkResult(%d,%d);",1,to);
                    Cocos2dxJavascriptJavaBridge.evalString(eval);
                }
            });
        }
    };

    private class MyReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            switch (action){
                case WifiManager.WIFI_STATE_CHANGED_ACTION:
                case WifiManager.RSSI_CHANGED_ACTION:{

                    ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
                    NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();

                    if(networkInfo == null)return;

                    //只监听WIFI变化
                    if(networkInfo.getType() == TYPE_WIFI){

                        int level = 0;
                        int rssi = 0;
                        if(networkInfo.isConnected()){
                            WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
                            final WifiInfo info = wifiManager.getConnectionInfo();
                            rssi = info.getRssi();
                        }

                        //得到的值是一个0到-100的区间值，是一个int型数据，其中0到-50表示信号最好，-50到-70表示信号偏差，小于-70表示最差，有可能连接不上或者掉线。

                        if(rssi >= -30){
                            level=4;
                        }else if(rssi >= -50 && rssi <- 30){
                            level =3;
                        }else if(rssi >= -70 && rssi < -50){
                            level =2;
                        }else if(rssi >= -90 && rssi <-70){
                            level =1;
                        }

                        final int to = level;

                        if(last_rssi == to)return;
                        last_rssi = to;

                        G3Plugin.getActivity().runOnGLThread(new Runnable() {
                            @Override
                            public void run() {
                                String eval = String.format("cc.vv.g3Plugin.onNetworkResult(%d,%d);",0,to);
                                Cocos2dxJavascriptJavaBridge.evalString(eval);
                            }
                        });
                    }
                }
                break;
            }
        }
    }
}
