package at.htlleonding.InputSoftware.model;

import at.htlleonding.InputSoftware.view.ViewController;
import javafx.scene.Scene;
import net.java.games.input.Controller;
import net.java.games.input.ControllerEnvironment;
import net.java.games.input.Event;
import net.java.games.input.EventQueue;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class GamepadInput implements Input {
    private static final String CONFIG_FILE = "src/main/java/at/htlleonding/InputSoftware/model/configs/gamepad.json";
    private static String mforward_Button = "Taste 7";
    private static String mbackward_Button = "Taste 6";
    private static String msteer_Button = "X-Achse";
    private static GamepadInput mMe;
    private Controller gamepad;
    private WebSocketClient webSocketClient;
    private float mSteer;
    private ScheduledExecutorService scheduler;

    private GamepadInput() {
        try {
            webSocketClient = new WebSocketClient(new URI("ws://localhost:8080")) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("WebSocket connection opened");
                }

                @Override
                public void onMessage(String message) {
                    System.out.println("Message from server: " + message);
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("WebSocket connection closed: " + reason);
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                }
            };
            webSocketClient.connect();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(this::sendMessage, 0, 100, TimeUnit.MILLISECONDS);
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

    private Thread inputThread = new Thread(() -> {
        gamepad.poll();
        EventQueue eventQueue = gamepad.getEventQueue();
        Event event = new Event();

        while (true) {
            gamepad.poll();
            while (eventQueue.getNextEvent(event)) {
                processEvent(event);
            }
        }
    });

    public void start(Scene scene) {
        if (gamepad == null) {
            System.out.println("Gamepad not found. Cannot start.");
            return;
        }

        if (!inputThread.isAlive()) {
            inputThread.setDaemon(true);
            inputThread.start();
        }

        scheduler.scheduleAtFixedRate(this::sendMessage, 0, 250, TimeUnit.MILLISECONDS);
    }

    public void stop() {
        if (inputThread.isAlive()) {
            inputThread.interrupt();
        }

        scheduler.shutdown();
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
            System.out.println(event);
            System.out.println(value);
            if (value == 1.0f) {
                Robot.getMe().setForward(true);
            } else {
                Robot.getMe().setForward(false);
            }
        } else if (componentName.equals(mbackward_Button)) {
            System.out.println(event);
            System.out.println(value);
            if (value == 1.0f) {
                Robot.getMe().setBackward(true);
            } else {
                Robot.getMe().setBackward(false);
            }
        } else if (componentName.equals(msteer_Button)) {
            steer(value);
        }
    }

    private JSONObject createMessage(Robot robot) {
        JSONObject message = new JSONObject();
        message.put("deviceid", ViewController.roboterId);
        message.put("speed", robot.getSpeed());
        message.put("direction", this.calculateDireciton());
        return message;
    }

    public int calculateDireciton() {
        if (Robot.getMe().getDirection() == 0) {
            if (mSteer < -0.1) {
                return (int) (360 + (mSteer * 90));
            } else if (mSteer > 0.1){
                return (int) (0 + mSteer * 90);
            }
        } else {
            if (mSteer < -0.1) {
                return (int) (180 - mSteer * 90);
            } else if (mSteer > 0.1){
                return (int) (180 - mSteer * 90);
            }
        }

        return Robot.getMe().getDirection();
    }

    private void sendMessage() {
        JSONObject message = createMessage(Robot.getMe());

        if (webSocketClient != null && webSocketClient.isOpen()) {
            webSocketClient.send(message.toJSONString());
        }
    }

    private void steer(float value) {
        mSteer = value;
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
