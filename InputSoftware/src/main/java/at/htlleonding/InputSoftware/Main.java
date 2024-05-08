package at.htlleonding.InputSoftware;

import at.htlleonding.InputSoftware.view.AppView;
import at.htlleonding.InputSoftware.view.ViewController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class Main extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        AppView.getMe().initialize(stage);

        FXMLLoader loader = new FXMLLoader(getClass().getResource("MainView.fxml"));
        Scene scene = new Scene(loader.load());
        stage.setScene(scene);
        stage.show();

        ViewController controller = loader.getController();
        controller.createTimeLine();
    }

    public static void main(String[] args) {
        launch();
    }
}