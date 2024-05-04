package at.htlleonding.InputSoftware.view;

import at.htlleonding.InputSoftware.model.Input;
import at.htlleonding.InputSoftware.model.KeyboardInput;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ListView;

public class ViewController {


    @FXML
    public ListView deviceListView;

    private ObservableList<Input> devices = FXCollections.observableArrayList();;

    public void initialize() {
        System.out.println("Started");
        deviceListView.setItems(devices);
    }

    public void handlePlayButton(ActionEvent actionEvent) {
    }

    public void handleStartRaceButton(ActionEvent actionEvent) {

    }
}