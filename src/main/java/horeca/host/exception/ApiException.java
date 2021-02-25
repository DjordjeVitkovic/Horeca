package horeca.host.exception;

public class ApiException {

    public int code;
    public String message;
    public long time;

    public ApiException() {
    }

    public ApiException(int code, String message, long time) {
        this.code = code;
        this.message = message;
        this.time = time;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }
}
