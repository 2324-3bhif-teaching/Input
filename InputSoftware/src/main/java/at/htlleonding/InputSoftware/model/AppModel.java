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

    private AppModel() {
        mDeviceList = FXCollections.observableArrayList();
        mInputDeviceList.add(GamepadInput.getMe());
        mInputDeviceList.add(KeyboardInput.getMe());
    }

    public static AppModel getMe() {
        if (mMe == null) {
            mMe = new AppModel();
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
