package horeca.host.controllers;

import horeca.host.models.User;
import horeca.host.repository.UserRepository;
import horeca.host.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/save")
    public String save (@RequestBody User user){

        user.setActive(1);
        user.setPermissions("ALL");
        user.setRoles("ROLE_ADMIN");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return "User successfully added!";
    }

}
