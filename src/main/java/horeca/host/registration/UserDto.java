package horeca.host.registration;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class UserDto {

    @NotNull
    @NotEmpty(message = "Field can't be empty.")
    private String firstName;

    @NotNull
    @NotEmpty(message = "Field can't be empty.")
    private String lastName;

    @NotNull
    @NotEmpty(message = "Field can't be empty.")
    private String password;

    private String matchingPassword;

    @NotNull
    @NotEmpty(message = "Field can't be empty.")
    private String email;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMatchingPassword() {
        return matchingPassword;
    }

    public void setMatchingPassword(String matchingPassword) {
        this.matchingPassword = matchingPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
