package horeca.host.repository;

import horeca.host.models.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, String> {

    @Query("select p from Person p where p.occupation.occupationId=:occupationId")
     List<Person> getPersonsByOccupation(String occupationId);

    @Query("select p from Person p where" + " p.firstName like %?1% OR p.lastName like %?1% OR p.citizenship like %?1% OR p.city like %?1% " +
            "OR p.occupation.occupationName like %?1%")
     List<Person> searchPerson(String word);

    @Query("select count (*) from Person")
     int countPeopleByPersonId();

    @Query("select count (*) from Person where occupation.occupationId = ?1")
    int countPeopleByOccupation(String occupationId);

    @Query("select p from Person p where p.occupation.occupationId = ?1")
    Page<Person> getAllWithPagination(Pageable pageable, String occupationId);

}
