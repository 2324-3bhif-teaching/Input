package at.htlleonding.InputSoftware;

import at.htlleonding.InputSoftware.view.ViewController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class Main extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(Main.class.getResource("MainView.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 500, 500);
        stage.setTitle("InputController");
        stage.setScene(scene);
        stage.show();

        ViewController controller = fxmlLoader.getController();
        controller.createTimeLine(scene);
    }

    public static void main(String[] args) {
        launch();
    }
}