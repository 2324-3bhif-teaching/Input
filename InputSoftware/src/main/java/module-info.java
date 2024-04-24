module at.helleonding.inputsoftware {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires org.kordamp.bootstrapfx.core;
    requires jinput;

    opens at.htlleonding.inputsoftware to javafx.fxml;
    exports at.htlleonding.inputsoftware;
}