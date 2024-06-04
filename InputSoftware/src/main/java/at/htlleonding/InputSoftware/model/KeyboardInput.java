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

    private void sendMessage(JSONObject message) {
        if (webSocketClient != null && webSocketClient.isOpen()) {
            webSocketClient.send(message.toJSONString());
        }
    }

    private void goForward() {
        System.out.println("Moving forward");
        JSONObject message = new JSONObject();
        message.put("deviceId", ViewController.roboterId); // Replace with your actual device ID
        message.put("inputDeviceId", null);
        message.put("direction", "front");
        sendMessage(message);
    }

    private void goBackward() {
        System.out.println("Moving backward");
        JSONObject message = new JSONObject();
        message.put("deviceId", ViewController.roboterId); // Replace with your actual device ID
        message.put("inputDeviceId", null);
        message.put("direction", "back");
        sendMessage(message);
    }

    private void steerLeft() {
        System.out.println("Steering left");
        JSONObject message = new JSONObject();
        message.put("deviceId", ViewController.roboterId); // Replace with your actual device ID
        message.put("inputDeviceId", null);
        message.put("direction", "left");
        sendMessage(message);
    }

    private void steerRight() {
        System.out.println("Steering right");
        JSONObject message = new JSONObject();
        message.put("deviceId", ViewController.roboterId);
        message.put("inputDeviceId", null);
        message.put("direction", "right");
        sendMessage(message);
    }

    private void stopMoving() {
        System.out.println("Stopping movement");
        JSONObject message = new JSONObject();
        message.put("deviceId", ViewController.roboterId);
        message.put("inputDeviceId", null);
        message.put("direction", "stop");
        sendMessage(message);
    }

    private void stopSteering() {
        System.out.println("Stopping steering");
        JSONObject message = new JSONObject();
        message.put("deviceId", ViewController.roboterId);
        message.put("inputDeviceId", null);
        message.put("direction", "stop");
        sendMessage(message);
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
