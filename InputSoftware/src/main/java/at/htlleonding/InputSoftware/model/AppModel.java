package at.htlleonding.InputSoftware.model;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

public class AppModel {
    private static AppModel mMe;

    private ObservableList<Input> mDeviceList;

    private Input mActiveDevice;
    private int mActiveFigureIdx;

    private AppModel() {
        mDeviceList = FXCollections.observableArrayList();
    }

    public static AppModel getMe() {
        if (mMe == null) {
            mMe = new AppModel();
        }
        return mMe;
    }

    public ObservableList<Input> getDeviceList() {
        return mDeviceList;
    }
}
