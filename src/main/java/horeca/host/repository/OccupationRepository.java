package horeca.host.repository;

import horeca.host.models.Occupation;
import horeca.host.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OccupationRepository extends JpaRepository<Occupation, String> {
}
