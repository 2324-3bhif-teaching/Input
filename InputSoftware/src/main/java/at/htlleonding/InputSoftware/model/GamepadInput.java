package at.htlleonding.InputSoftware.model;

import at.htlleonding.InputSoftware.model.Input;
import javafx.scene.Scene;
import net.java.games.input.Controller;
import net.java.games.input.ControllerEnvironment;
import net.java.games.input.Event;
import net.java.games.input.EventQueue;

public class GamepadInput implements Input {
    private static GamepadInput mMe;
    private Controller gamepad;

    private GamepadInput() {

    }

    public static GamepadInput getMe() {
        if (mMe == null) {
            mMe = new GamepadInput();
        }
        return mMe;
    }


    public void start(Scene scene) {
        if (gamepad == null) {
            System.out.println("Gamepad not found. Cannot start.");
            return;
        }

        gamepad.poll();
        EventQueue eventQueue = gamepad.getEventQueue();
        Event event = new Event();

        while (true) {
            gamepad.poll();
            while (eventQueue.getNextEvent(event)) {
                processEvent(event);
            }
        }
    }

    @Override
    public boolean checkConnection() {
        Controller[] controllers = ControllerEnvironment.getDefaultEnvironment().getControllers();
        gamepad = null;

        for (Controller controller : controllers) {
            if (controller.getType() == Controller.Type.GAMEPAD || controller.getType() == Controller.Type.STICK) {
                gamepad = controller;
                break;
            }
        }

        return gamepad != null;
    }

    @Override
    public boolean loadKeybinds() {
        return false;
    }

    private void processEvent(Event event) {
        String componentName = event.getComponent().getName();
        float value = event.getValue();

        switch (componentName) {
            case "Taste 7":
                if (value == 1.0f) {
                    goForward();
                }
                break;
            case "Taste 6":
                if (value == 1.0f) {
                    goBackward();
                }
                break;
            case "X-Achse":
                steer(value);
                break;
        }
    }

    private void goForward() {
        System.out.println("Moving forward");
    }

    private void goBackward() {
        System.out.println("Moving backward");
    }

    private void steer(float value) {
        if (value < -0.2) {
            System.out.println("Steering left with value:" + value);
        } else if (value > 0.2) {
            System.out.println("Steering right with value:" + value);
        } else {
            System.out.println("Neutral steering with value:" + value);
        }
    }

    @Override
    public String toString() {
        return "Gamepad";
    }
}
