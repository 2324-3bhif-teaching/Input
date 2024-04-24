package at.htlleonding.InputSoftware;

import at.htlleonding.InputSoftware.model.KeyboardInput;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.input.KeyEvent;
import javafx.stage.Stage;

import java.io.IOException;

public class Main extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(Main.class.getResource("hello-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 500, 500);
        stage.setTitle("InputController");
        stage.setScene(scene);
        stage.show();
        KeyboardInput input1 = new KeyboardInput(scene);
        input1.start();
    }

    public static void main(String[] args) {
        launch();
    }
}