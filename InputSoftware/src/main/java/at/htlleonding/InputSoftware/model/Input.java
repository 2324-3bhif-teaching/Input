package at.htlleonding.InputSoftware.model;

import javafx.scene.Scene;

public interface Input {
    void start(Scene scene);
    boolean checkConnection();
    boolean loadKeybinds();
}
