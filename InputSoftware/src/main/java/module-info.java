module at.helleonding.movingclock {
    requires javafx.controls;
    requires javafx.fxml;
    requires java.desktop;
    requires jinput;
    requires json.simple;
    requires Java.WebSocket;


    opens at.htlleonding.InputSoftware to javafx.fxml;
    exports at.htlleonding.InputSoftware;
    exports at.htlleonding.InputSoftware.view;
    opens at.htlleonding.InputSoftware.view to javafx.fxml;
}