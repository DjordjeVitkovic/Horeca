package horeca.host;

import horeca.host.models.User;
import horeca.host.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class DbInit implements CommandLineRunner {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public DbInit(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        //Delete all
        this.userRepository.deleteAll();


        User dan = new User("Dan", "Danovic", "dan", passwordEncoder.encode("dan123"), "dan@gamil.com", "USER", "", UUID.randomUUID().toString());
        User admin = new User("Admin", "Adminic", "admin", passwordEncoder.encode("admin123"), "admin@gamail.com", "ADMIN", "ACCESS_TEST1,ACCESS_TEST2", UUID.randomUUID().toString());
        User manager = new User("Manager", "Manageric", "manager", passwordEncoder.encode("manager123"), "manager@gmail.com", "MANAGER", "ACCESS_TEST1", UUID.randomUUID().toString());

        List<User> users = Arrays.asList(dan, admin, manager);

        this.userRepository.saveAll(users);

    }
}
