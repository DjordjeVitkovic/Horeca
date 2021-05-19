package horeca.host.repository;

import horeca.host.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface UserRepository extends JpaRepository<User, String> {

    User findByUsername(String username);

    User findByUserId(String userId);

    User findByToken(String token);

    boolean existsByEmail(String email);

}
