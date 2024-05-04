package at.htlleonding.InputSoftware.view;

import at.htlleonding.InputSoftware.model.AppModel;
import at.htlleonding.InputSoftware.model.Input;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.Scene;
import javafx.scene.control.ListView;
import javafx.util.Duration;

public class ViewController {


    @FXML
    public ListView deviceListView;

    private Timeline updateTimeline;

    public void initialize() {
        System.out.println("Started");
    }

    public void createTimeLine(Scene scene) {
        updateTimeline = new Timeline(
                new KeyFrame(Duration.seconds(3), event -> updateList(scene))
        );
        updateTimeline.setCycleCount(Timeline.INDEFINITE);
        updateTimeline.play();
    }

    public void updateList(Scene scene) {
        ObservableList<Input> list = AppModel.getMe(scene).getDeviceList();
        deviceListView.setItems(list);
    }

    public void handlePlayButton(ActionEvent actionEvent) {
    }

    public void handleStartRaceButton(ActionEvent actionEvent) {

    }
}