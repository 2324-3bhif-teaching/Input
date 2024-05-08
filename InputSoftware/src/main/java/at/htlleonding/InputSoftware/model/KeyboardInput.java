package at.htlleonding.InputSoftware.model;

import javafx.scene.Scene;
import javafx.scene.input.KeyCode;

public class KeyboardInput implements Input {
    private static KeyboardInput mMe;
    private KeyCode mForwardKeyCode = KeyCode.W;
    private KeyCode mBackwardKeyCode = KeyCode.S;
    private KeyCode mRightKeyCode = KeyCode.D;
    private KeyCode mLeftKeyCode = KeyCode.A;

    public void setForwardKeyCode(KeyCode forwardKeyCode) {
        mForwardKeyCode = forwardKeyCode;
    }

    public void setBackwardKeyCode(KeyCode backwardKeyCode) {
        mBackwardKeyCode = backwardKeyCode;
    }

    public void setRightKeyCode(KeyCode rightKeyCode) {
        mRightKeyCode = rightKeyCode;
    }

    public void setLeftKeyCode(KeyCode leftKeyCode) {
        mLeftKeyCode = leftKeyCode;
    }

    private KeyboardInput() {

    }

    public static KeyboardInput getMe() {
        if (mMe == null) {
            mMe = new KeyboardInput();
        }
        return mMe;
    }

    public void start(Scene scene) {
        scene.setOnKeyPressed(event -> {
            KeyCode keyCode = event.getCode();
            if (keyCode == mForwardKeyCode) {
                goForward();
            } else if (keyCode == mBackwardKeyCode) {
                goBackward();
            } else if (keyCode == mLeftKeyCode) {
                steerLeft();
            } else if (keyCode == mRightKeyCode) {
                steerRight();
            }
        });

        scene.setOnKeyReleased(event -> {
            KeyCode keyCode = event.getCode();
            if (keyCode == mForwardKeyCode || keyCode == mBackwardKeyCode) {
                stopMoving();
            } else if (keyCode == mLeftKeyCode || keyCode == mRightKeyCode) {
                stopSteering();
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