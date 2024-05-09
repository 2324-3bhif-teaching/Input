package at.htlleonding.InputSoftware.view;

import at.htlleonding.InputSoftware.model.GamepadInput;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import net.java.games.input.Controller;
import net.java.games.input.Event;
import net.java.games.input.EventQueue;

import java.util.Objects;

public class GamePadView {
    @FXML
    private Button forwardButton, backwardButton;
    public void initialize() {
        loadButtonBindings();
    }

    private void loadButtonBindings() {
        GamepadInput.getMe().loadKeybinds();
        forwardButton.setText(GamepadInput.getMe().getKeybind("forward"));
        backwardButton.setText(GamepadInput.getMe().getKeybind("backward"));
    }

    public void changeKeybinding(ActionEvent actionEvent) {
        Button button = (Button) actionEvent.getSource();

        button.setText("Press a key...");

        GamepadInput.getMe().stop();
        String pressedButton = lastPressedButton();
        button.setText(pressedButton);

        if (button == forwardButton) {
            GamepadInput.getMe().setKeybind("forward", pressedButton);
        }
        else if (button == backwardButton) {
            GamepadInput.getMe().setKeybind("backward", pressedButton);
        }

        GamepadInput.getMe().start(null);
    }

    public String lastPressedButton() {
        Controller gamepad = GamepadInput.getMe().getGamepad();

            gamepad.poll();
            EventQueue eventQueue = gamepad.getEventQueue();
            Event event = new Event();

            while (true) {
                gamepad.poll();
                while (eventQueue.getNextEvent(event)) {
                    String button = event.getComponent().getName();
                    if (!Objects.equals(button, "X-Achse") && !Objects.equals(button, "Y-Achse")) {
                        return event.getComponent().getName();
                    }
                }
            }
    }
}
