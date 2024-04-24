module at.helleonding.inputsoftware {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires org.kordamp.bootstrapfx.core;

    opens at.helleonding.inputsoftware to javafx.fxml;
    exports at.helleonding.inputsoftware;
}