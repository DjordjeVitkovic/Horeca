package horeca.host.services;

import horeca.host.models.Person;
import horeca.host.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    public List<Person> getAll(){
       return personRepository.findAll();
    }

    public Person getOneById(String personId){
        return personRepository.getOne(personId);
    }

    public void savePerson(){

    }



}
