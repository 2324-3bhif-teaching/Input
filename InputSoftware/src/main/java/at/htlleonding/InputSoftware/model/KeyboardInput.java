package at.htlleonding.InputSoftware.model;

import at.htlleonding.InputSoftware.view.ViewController;
import javafx.scene.Scene;
import javafx.scene.input.KeyCode;
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

public class KeyboardInput implements Input {
    private static final String CONFIG_FILE = "src/main/java/at/htlleonding/InputSoftware/model/configs/keyboard.json";
    private static KeyboardInput mMe;
    private KeyCode mForwardKeyCode = KeyCode.W;
    private KeyCode mBackwardKeyCode = KeyCode.S;
    private KeyCode mRightKeyCode = KeyCode.D;
    private KeyCode mLeftKeyCode = KeyCode.A;
    private WebSocketClient webSocketClient;

    private void saveKeybinds() {
        JSONObject keybinds = new JSONObject();
        keybinds.put("forward", mForwardKeyCode.getName());
        keybinds.put("backward", mBackwardKeyCode.getName());
        keybinds.put("left", mLeftKeyCode.getName());
        keybinds.put("right", mRightKeyCode.getName());

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
            mForwardKeyCode = KeyCode.valueOf((String) keybinds.get("forward"));
            mBackwardKeyCode = KeyCode.valueOf((String) keybinds.get("backward"));
            mLeftKeyCode = KeyCode.valueOf((String) keybinds.get("left"));
            mRightKeyCode = KeyCode.valueOf((String) keybinds.get("right"));
            return true;
        } catch (IOException | org.json.simple.parser.ParseException e) {
            return false;
        }
    }

    public void setForwardKeyCode(KeyCode forwardKeyCode) {
        mForwardKeyCode = forwardKeyCode;
        saveKeybinds();
    }

    public void setBackwardKeyCode(KeyCode backwardKeyCode) {
        mBackwardKeyCode = backwardKeyCode;
        saveKeybinds();
    }

    public void setRightKeyCode(KeyCode rightKeyCode) {
        mRightKeyCode = rightKeyCode;
        saveKeybinds();
    }

    public void setLeftKeyCode(KeyCode leftKeyCode) {
        mLeftKeyCode = leftKeyCode;
        saveKeybinds();
    }

    public KeyCode getForwardKeyCode() {
        return mForwardKeyCode;
    }

    public KeyCode getBackwardKeyCode() {
        return mBackwardKeyCode;
    }

    public KeyCode getRightKeyCode() {
        return mRightKeyCode;
    }

    public KeyCode getLeftKeyCode() {
        return mLeftKeyCode;
    }

    private KeyboardInput() {
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
            handleKeyPress(keyCode);
        });

        scene.setOnKeyReleased(event -> {
            KeyCode keyCode = event.getCode();
            handleKeyRelease(keyCode);
        });
    }

    private void handleKeyPress(KeyCode keyCode) {
        if (keyCode == mForwardKeyCode) {
            changeMovementState("forward", true);
        } else if (keyCode == mBackwardKeyCode) {
            changeMovementState("backward", true);
        } else if (keyCode == mLeftKeyCode) {
            changeMovementState("left", true);
        } else if (keyCode == mRightKeyCode) {
            changeMovementState("right", true);
        }
    }

    private void handleKeyRelease(KeyCode keyCode) {
        if (keyCode == mForwardKeyCode) {
            changeMovementState("forward", false);
        } else if (keyCode == mBackwardKeyCode) {
            changeMovementState("backward", false);
        } else if (keyCode == mLeftKeyCode) {
            changeMovementState("left", false);
        } else if (keyCode == mRightKeyCode) {
            changeMovementState("right", false);
        }
    }

    private void changeMovementState(String direction, boolean isPressed) {
        Robot robot = Robot.getMe();
        switch (direction) {
            case "forward":
                robot.setForward(isPressed);
                break;
            case "backward":
                robot.setBackward(isPressed);
                break;
            case "left":
                robot.setLeft(isPressed);
                break;
            case "right":
                robot.setRight(isPressed);
                break;
        }
        sendMessage(createMessage(robot));
    }

    private JSONObject createMessage(Robot robot) {
        JSONObject message = new JSONObject();
        message.put("deviceid", ViewController.roboterId);
        message.put("speed", robot.getSpeed());
        message.put("direction", robot.getDirection());
        return message;
    }

    private void sendMessage(JSONObject message) {
        if (webSocketClient != null && webSocketClient.isOpen()) {
            webSocketClient.send(message.toJSONString());
        }
    }

    @Override
    public boolean checkConnection() {
        return webSocketClient != null && webSocketClient.isOpen();
    }

    @Override
    public String toString() {
        return "Keyboard";
    }
}
