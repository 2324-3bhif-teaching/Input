package at.htlleonding.InputSoftware.view;

import at.htlleonding.InputSoftware.model.KeyboardInput;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.input.KeyCode;

public class KeyboardView {
    @FXML
    private Button forwardButton, backwardButton, rightButton, leftButton;

    public void initialize() {
        loadButtonBindings();
    }

    private void loadButtonBindings() {
    }

    public void changeKeybinding(ActionEvent actionEvent) {
        Button button = (Button) actionEvent.getSource();

        button.setText("Press a key...");

        button.getScene().setOnKeyPressed(event -> {
            KeyCode pressedKey = event.getCode();
            KeyboardInput keyboardInput = KeyboardInput.getMe();

            if (button == forwardButton) {
                KeyboardInput.getMe().setForwardKeyCode(pressedKey);
            } else if (button == backwardButton) {
                KeyboardInput.getMe().setBackwardKeyCode(pressedKey);
            } else if (button == rightButton) {
                KeyboardInput.getMe().setRightKeyCode(pressedKey);
            } else if (button == leftButton) {
                KeyboardInput.getMe().setLeftKeyCode(pressedKey);
            }

            button.setText(pressedKey.getName());
            keyboardInput.start(button.getScene());
        });
    }
}
