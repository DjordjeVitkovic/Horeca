package horeca.host.services;

import horeca.host.exception.NotFoundException;
import horeca.host.models.User;
import horeca.host.registration.EmailValidator;
import horeca.host.registration.UserDto;
import horeca.host.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailValidator emailValidator;

    @Transactional
    public User registerNewUserAccount(UserDto userDto)
            throws NotFoundException {

        if (emailExist(userDto.getEmail())) {
            throw new NotFoundException(
                    "There is an account with that email address: "
                            +  userDto.getEmail());
        }
        if(!userDto.getPassword().equalsIgnoreCase(userDto.getMatchingPassword())){
            throw new NotFoundException(
                    "Passwords are not same, please try again.");
        }
        if(!emailValidator.isValid(userDto.getEmail())){
            throw new NotFoundException(
                    "Email: " + userDto.getEmail() + " is not valid format, use: "
                            +  " example@example.com");
        }
        // the rest of the registration operation
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getEmail());
        user.setActive(1);
        user.setRoles("USER");
        return userRepository.save(user);
    }
    private boolean emailExist(String email) {
        return userRepository.existsByEmail(email);
    }

}
