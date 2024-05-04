package at.htlleonding.InputSoftware.model;

import javafx.scene.Scene;

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import javax.swing.JFrame;

public class KeyboardInput implements Input{
    private Scene mScene;

    public KeyboardInput(Scene scene) {
        mScene = scene;
    }

    public void start() {
        mScene.setOnKeyPressed(event -> {
            System.out.println("Key Pressed: " + event.getCode());
        });
    }
}




