package at.htlleonding.InputSoftware.model;

public class Robot {
    private boolean forward = false;
    private boolean backward = false;
    private boolean right = false;
    private boolean left = false;
    private static Robot mInstance;

    private Robot() {

    }

    public static Robot getMe() {
        if (mInstance == null) {
            mInstance = new Robot();
        }

        return mInstance;
    }

    public void setForward(boolean forward) {
        this.forward = forward;
    }

    public void setBackward(boolean backward) {
        this.backward = backward;
    }

    public void setRight(boolean right) {
        this.right = right;
    }

    public void setLeft(boolean left) {
        this.left = left;
    }

    public int getDirection() {
        if (forward && left) {
            return 315;
        } else if (forward && right) {
            return 45;
        } else if (backward && left) {
            return 225;
        } else if (backward && right) {
            return 135;
        } else if (forward) {
            return 0;
        } else if (backward) {
            return 180;
        } else if (left) {
            return 270;
        } else if (right) {
            return 90;
        } else {
            return 0;
        }
    }

    public int getSpeed() {
        if (this.forward || this.left || this.right || this.backward) {
            return 260;
        }

        return 0;
    }
}
