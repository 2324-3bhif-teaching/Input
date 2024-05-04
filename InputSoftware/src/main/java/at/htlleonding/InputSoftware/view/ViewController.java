package at.htlleonding.InputSoftware.view;

import at.htlleonding.InputSoftware.model.AppModel;
import at.htlleonding.InputSoftware.model.Input;
import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.Timeline;
import javafx.animation.TranslateTransition;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.Scene;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;
import javafx.util.Duration;

public class ViewController {


    @FXML
    public ListView deviceListView;
    @FXML
    public TextField roboterIdField;

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
        if (roboterIdField.isVisible()) {
            Input selectedItem = (Input) deviceListView.getSelectionModel().getSelectedItem();
            selectedItem.start();
            return;
        }

        roboterIdField.setVisible(true);
        Timeline timeline = new Timeline();
        KeyValue kv = new KeyValue(roboterIdField.maxWidthProperty(), 190);
        KeyFrame kf = new KeyFrame(Duration.millis(500), kv);
        timeline.getKeyFrames().add(kf);
        timeline.play();
    }

    public void handleStartRaceButton(ActionEvent actionEvent) {

    }
}