package at.htlleonding.InputSoftware.model;

import javafx.scene.Scene;
import net.java.games.input.Controller;
import net.java.games.input.ControllerEnvironment;
import net.java.games.input.Event;
import net.java.games.input.EventQueue;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class GamepadInput implements Input {
    private static final String CONFIG_FILE = "src/main/java/at/htlleonding/InputSoftware/model/configs/gamepad.json";
    private static String mforward_Button = "Taste 7";
    private static String mbackward_Button = "Taste 6";
    private static String msteer_Button = "X-Achse";
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

    public Controller getGamepad() {
        return gamepad;
    }

    public void start(Scene scene) {
        if (gamepad == null) {
            System.out.println("Gamepad not found. Cannot start.");
            return;
        }

        // Start a new thread for handling input
        Thread inputThread = new Thread(() -> {
            gamepad.poll();
            EventQueue eventQueue = gamepad.getEventQueue();
            Event event = new Event();
            System.out.println("started");

            while (true) {
                gamepad.poll();
                while (eventQueue.getNextEvent(event)) {
                    processEvent(event);
                }
            }
        });

        inputThread.setDaemon(true);
        System.out.println("started...");
        inputThread.start();
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

    private void saveKeybinds() {
        JSONObject keybinds = new JSONObject();
        keybinds.put("forward", mforward_Button.toString());
        keybinds.put("backward", mbackward_Button.toString());
        keybinds.put("steer", msteer_Button.toString());

        try {
            File configFile = new File(CONFIG_FILE);

            if (!configFile.exists()) {
                configFile.getParentFile().mkdirs();
                configFile.createNewFile();
            }

            try (FileWriter file = new FileWriter(configFile)) {
                file.write(keybinds.toJSONString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public boolean loadKeybinds() {
        JSONParser parser = new JSONParser();

        try (FileReader reader = new FileReader(CONFIG_FILE)) {
            JSONObject keybinds = (JSONObject) parser.parse(reader);
            mforward_Button = String.valueOf(keybinds.get("forward"));
            mbackward_Button = String.valueOf(keybinds.get("backward"));
            msteer_Button = String.valueOf(keybinds.get("steer"));
            return true;
        } catch (IOException | org.json.simple.parser.ParseException e) {
            return false;
        }
    }


    private void processEvent(Event event) {
        String componentName = event.getComponent().getName();
        float value = event.getValue();

        if (componentName.equals(mforward_Button)) {
            if (value == 1.0f) {
                goForward();
            }
        } else if (componentName.equals(mbackward_Button)) {
            if (value == 1.0f) {
                goBackward();
            }
        } else if (componentName.equals(msteer_Button)) {
            steer(value);
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

    public void setKeybind(String action, String binding) {
        switch (action.toLowerCase()) {
            case "forward":
                mforward_Button = binding;
                break;
            case "backward":
                mbackward_Button = binding;
                break;
            case "steer":
                msteer_Button = binding;
                break;
            default:
                break;
        }
        saveKeybinds();
    }

    public String getKeybind(String action) {
        switch (action.toLowerCase()) {
            case "forward":
                return mforward_Button;
            case "backward":
                return mbackward_Button;
            case "steer":
                return msteer_Button;
            default:
                return "";
        }
    }

}
