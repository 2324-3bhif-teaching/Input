package at.htlleonding.InputSoftware.model;

import at.htlleonding.InputSoftware.model.Input;
import javafx.scene.Scene;
import javafx.scene.input.KeyCode;

public class KeyboardInput implements Input {

    public KeyboardInput() {

    }

    public void start(Scene scene) {
        scene.setOnKeyPressed(event -> {
            KeyCode keyCode = event.getCode();
            switch (keyCode) {
                case W:
                    goForward();
                    break;
                case S:
                    goBackward();
                    break;
                case A:
                    steerLeft();
                    break;
                case D:
                    steerRight();
                    break;
            }
        });

        scene.setOnKeyReleased(event -> {
            KeyCode keyCode = event.getCode();
            switch (keyCode) {
                case W:
                case S:
                    stopMoving();
                    break;
                case A:
                case D:
                    stopSteering();
                    break;
            }
        });
    }

    @Override
    public boolean checkConnection() {
        return true;
    }

    private void goForward() {
        System.out.println("Moving forward");
    }

    private void goBackward() {
        System.out.println("Moving backward");
    }

    private void steerLeft() {
        System.out.println("Steering left");
    }

    private void steerRight() {
        System.out.println("Steering right");
    }

    private void stopMoving() {
        System.out.println("Stopping movement");
    }

    private void stopSteering() {
        System.out.println("Stopping steering");
    }

    @Override
    public String toString() {
        return "Keyboard";
    }
}
