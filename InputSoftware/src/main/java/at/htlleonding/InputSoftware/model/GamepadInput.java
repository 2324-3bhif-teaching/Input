package at.htlleonding.InputSoftware.model;

import net.java.games.input.Controller;
import net.java.games.input.ControllerEnvironment;
import net.java.games.input.Event;
import net.java.games.input.EventQueue;

public class GamepadInput {
    public static void Start() {
        Controller[] controllers = ControllerEnvironment.getDefaultEnvironment().getControllers();

        Controller gamepad = null;
        for (Controller controller : controllers) {
            if (controller.getType() == Controller.Type.GAMEPAD || controller.getType() == Controller.Type.STICK) {
                gamepad = controller;
                break;
            }
        }

        if (gamepad == null) {
            System.out.println("No gamepad found.");
            return;
        }

        gamepad.poll();
        EventQueue eventQueue = gamepad.getEventQueue();
        Event event = new Event();

        while (true) {
            gamepad.poll();
            while (eventQueue.getNextEvent(event)) {
                StringBuilder output = new StringBuilder("Event: ");
                output.append(event.getComponent().getName());
                output.append(" = ");
                output.append(event.getValue());
                System.out.println(output.toString());
            }

            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}



