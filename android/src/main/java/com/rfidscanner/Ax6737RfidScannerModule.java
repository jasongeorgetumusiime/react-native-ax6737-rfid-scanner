// Ax6737RfidScannerModule.java

package com.rfidscanner;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import android.view.KeyEvent;
import androidx.annotation.NonNull;

import com.BRMicro.Tools;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.handheld.uhfr.UHFRManager;
import com.uhf.api.cls.Reader;

import java.util.ArrayList;
import java.util.List;
import com.facebook.react.bridge.Callback;

public class Ax6737RfidScannerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private final ReactApplicationContext reactContext;
    private static UHFRManager uhfrManager;
    private boolean isMulti = false;
    private int allCount = 0;
    private long startTime = 0;
    private boolean keyUpFlag = true;

    private boolean keyControl = true;
    private boolean isRunning = false;
    private boolean isStart = false;
    private String epc;

    private List<String> scannedTags = new ArrayList<String>();

    public Ax6737RfidScannerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.rfid.FUN_KEY");
        this.reactContext.registerReceiver(receiver, filter);
        this.reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "Ax6737RfidScanner";
    }

    @ReactMethod
    public void ping(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("PONG --> Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }

    @ReactMethod
    public void clearTags() {
        scannedTags.clear();
    }

    private void sendEvent(String eventName, WritableArray array) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,
                array);
    }

    private void sendEvent(String eventName, String status) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,
                status);
    }

    public static WritableArray convertArrayToWritableArray(String[] tag) {
        WritableArray array = new WritableNativeArray();
        for (String tagId : tag) {
            array.pushString(tagId);
        }
        return array;
    }

    private Runnable inventoryTask = new Runnable() {
        @Override
        public void run() {
            while (isRunning) {
                if (isStart) {
                    List<Reader.TAGINFO> list1;
                    if (isMulti) {
                        list1 = uhfrManager.tagInventoryRealTime();
                    } else {
                        list1 = uhfrManager.tagInventoryByTimer((short) 50);
                    }

                    if (list1 != null && list1.size() > 0) {
                        for (Reader.TAGINFO tfs : list1) {
                            byte[] epcdata = tfs.EpcId;
                            epc = Tools.Bytes2HexString(epcdata, epcdata.length);
                            int rssi = tfs.RSSI;
                            Log.d("ISSH", epc);
                            scannedTags.add(epc);
                            String[] tagData = { epc, String.valueOf(rssi) };
                            sendEvent("UHF_TAG", Ax6737RfidScannerModule.convertArrayToWritableArray(tagData));
                        }
                    }
                }
            }
        }
    };

    private void runInventory() {
        // Log.d("ISSH", "Run Inventory");
        // Toast.makeText(reactContext, "Run Inventory", Toast.LENGTH_SHORT).show();
        if (keyControl) {
            keyControl = false;
            if (!isStart) {
                uhfrManager.setCancleInventoryFilter();
                isRunning = true;
                if (isMulti) {
                    uhfrManager.setFastMode();
                    uhfrManager.asyncStartReading();
                } else {
                    uhfrManager.setCancleFastMode();
                }
                new Thread(inventoryTask).start();
                isStart = true;
            } else {
                if (isMulti) {
                    uhfrManager.asyncStopReading();
                } else {
                    uhfrManager.stopTagInventory();
                }

                try {
                    Thread.sleep(100);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                isRunning = false;
                isStart = false;
            }

            keyControl = true;
        }
    }

    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            int keyCode = intent.getIntExtra("keyCode", 0);
            if (keyCode == 0) {// H941
                keyCode = intent.getIntExtra("keycode", 0);
            }
            boolean keyDown = intent.getBooleanExtra("keydown", false);

            if (keyUpFlag && keyDown && System.currentTimeMillis() - startTime > 0) {
                keyUpFlag = false;
                startTime = System.currentTimeMillis();
                if ((keyCode == KeyEvent.KEYCODE_F1 || keyCode == KeyEvent.KEYCODE_F2 || keyCode == KeyEvent.KEYCODE_F3
                        || keyCode == KeyEvent.KEYCODE_F4 || keyCode == KeyEvent.KEYCODE_F5)) {
                    runInventory();
                }
                return;
            } else if (keyDown) {
                startTime = System.currentTimeMillis();
            } else {
                keyUpFlag = true;
            }
        }
    };

    @Override
    public void onHostResume() {
        uhfrManager = UHFRManager.getInstance();
        if (uhfrManager != null) {
            uhfrManager.setPower(33, 33);
            uhfrManager.setRegion(Reader.Region_Conf.RG_EU3);
            // Log.d("ISSSH", "THIS IS WORKING");
            sendEvent("UHF_POWER", "SUCCESS:POWER_ON");
        }
    }

    @Override
    public void onHostPause() {
        if (isStart) {
            runInventory();
        }
    }

    @Override
    public void onHostDestroy() {
        reactContext.unregisterReceiver(receiver);
        if (uhfrManager != null) {
            uhfrManager.close();
            uhfrManager = null;
        }
    }
}
