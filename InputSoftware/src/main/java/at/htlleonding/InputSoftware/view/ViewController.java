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

import java.io.Console;
import java.io.IOException;

public class ViewController {


    @FXML
    public ListView deviceListView;
    @FXML
    public TextField roboterIdField;

    private Timeline updateTimeline;

    public void initialize() {
        System.out.println("Started");
    }

    public void createTimeLine() {
        updateTimeline = new Timeline(
                new KeyFrame(Duration.seconds(3), event -> updateList())
        );
        updateTimeline.setCycleCount(Timeline.INDEFINITE);
        updateTimeline.play();
    }

    public void updateList() {
        ObservableList<Input> list = AppModel.getMe().getDeviceList();
        deviceListView.setItems(list);
    }

    public void handlePlayButton(ActionEvent actionEvent) throws IOException {
        if (roboterIdField.isVisible()) {
            Input selectedItem = (Input) deviceListView.getSelectionModel().getSelectedItem();

            System.out.println(selectedItem.toString());
            if (selectedItem.toString().equals("Keyboard")) {
                Scene scene = AppView.getMe().showView("Keyboard", "KeyboardView.fxml");
                selectedItem.start(scene);
            } else if (selectedItem.toString().equals("Gamepad")) {
                Scene scene = AppView.getMe().showView("Gamepad", "GamepadView.fxml");
                selectedItem.start(scene);
            }

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