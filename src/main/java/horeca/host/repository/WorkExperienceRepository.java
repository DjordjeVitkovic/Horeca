package horeca.host.repository;

import horeca.host.models.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, String> {
}
