package at.htlleonding.InputSoftware.view;

import at.htlleonding.InputSoftware.Main;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class AppView {
    private static AppView mMe;

    private Stage mMainStage;
    private Scene mMainScene;

    private AppView() {

    }

    public static AppView getMe() {
        if (mMe == null) {
            mMe = new AppView();
        }
        return mMe;
    }
    public void initialize(Stage mainStage) {
        mMainStage = mainStage;
    }
    public Scene showView(String title, String fxml)  throws IOException {
        FXMLLoader loader = new FXMLLoader(Main.class.getResource(fxml));
        mMainScene = new Scene(loader.load(), 500, 500);
        mMainStage.setTitle(title);
        mMainStage.setScene(mMainScene);
        mMainStage.show();
        return mMainScene;
    }
}
