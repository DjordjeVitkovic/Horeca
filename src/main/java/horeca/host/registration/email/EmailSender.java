package horeca.host.registration.email;

public interface EmailSender {
    void send(String to, String email);
}
