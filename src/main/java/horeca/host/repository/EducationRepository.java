package horeca.host.repository;

import horeca.host.models.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EducationRepository extends JpaRepository<Education, String> {
}
