package horeca.host.repository;

import horeca.host.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, String> {

    @Query("select p from Person p where p.occupation.occupationId=:occupationId")
    public List<Person> getPersonsByOccupation(UUID occupationId);
}
