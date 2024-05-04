package at.htlleonding.InputSoftware.model;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.Scene;

import java.util.ArrayList;

public class AppModel {
    private static AppModel mMe;

    private ObservableList<Input> mDeviceList;
    private ArrayList<Input> mInputDeviceList = new ArrayList<>();

    private Input mActiveDevice;
    private int mActiveFigureIdx;

    private AppModel(Scene scene) {
        mDeviceList = FXCollections.observableArrayList();
        mInputDeviceList.add(new GamepadInput());
        mInputDeviceList.add(new KeyboardInput(scene));
    }

    public static AppModel getMe() {
        return mMe;
    }

    public static AppModel getMe(Scene scene) {
        if (mMe == null) {
            mMe = new AppModel(scene);
        }
        return mMe;
    }

    public ObservableList<Input> getDeviceList() {
        mDeviceList = FXCollections.observableArrayList();
        for (Input device : mInputDeviceList) {
            if (device.checkConnection()) {
                mDeviceList.add(device);
            }
        }

        return mDeviceList;
    }
}
