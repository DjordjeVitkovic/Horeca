package horeca.host.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import horeca.host.models.Language;
import horeca.host.models.Person;
import horeca.host.models.WorkExperience;
import horeca.host.repository.PersonRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Value(value = "${com.cloudinary.full.path}")
    private String CONFIG;


    public List<Person> getAll(){
       return personRepository.findAll();
    }

    public Person getOneById(String personId){
        return personRepository.getOne(personId);
    }

    public List<Person> getPersonByOccupation(String occupationId){
        return personRepository.getPersonsByOccupation(occupationId);
    }

    //Pagination for personList
    public List<Person> personPagination(int page){

        Pageable pageable = PageRequest.of(page,2);
        Page<Person> allPersons = personRepository.findAll(pageable);
        return allPersons.toList();
    }

    //Pagination for personList by Occupation
    public List<Person> personPaginationByOccupation(int page, String occupationId){

        Pageable pageable = PageRequest.of(page,2);
        Page<Person> allPersons = personRepository.getAllWithPagination(pageable, occupationId);
        return allPersons.toList();
    }

    //Pagination for personList for Search
    public List<Person> personPaginationSearch(int page, String word){

        Pageable pageable = PageRequest.of(page,2);
        Page<Person> allPersons = personRepository.searchPerson(pageable, word);
        return allPersons.toList();
    }

    public int countAll(){
        return personRepository.countPeopleByPersonId();
    }
    public int countAllByOccupation(String occupationId){
        return personRepository.countPeopleByOccupation(occupationId);
    }
    public int countForSearch(String word){
        return personRepository.countForSearch(word);
    }

    public void deletePerson(String personId) throws Exception {

        Person person = personRepository.getOne(personId);
        if (person.getImageURL() != null) {
            Cloudinary cloudinary = new Cloudinary(CONFIG);
            String public_id = person.getImageURL().substring(60, 80);

            cloudinary.api().deleteResources(new ArrayList<>(
                            Arrays.asList(public_id)),
                    ObjectUtils.emptyMap());
        }
        personRepository.deleteById(personId);
    }
    //Save person with image
    public void savePerson(Person person, MultipartFile multipartFile) throws Exception {

//        if(multipartFile == null){
//            personRepository.save(person);
//            return;
//        }

    	for(Language l: person.getLanguageList()) {
    		l.setPersonId(person);
    	}
    	
    	for(WorkExperience we: person.getWorkExperienceList()) {
    		we.setPersonId(person);
    	}
    	
        if (multipartFile.getSize() == 0) {

            personRepository.save(person);
        } else if (multipartFile.getSize() != 0 && person.getImageURL() != null) {

            Cloudinary cloudinary = new Cloudinary(CONFIG);
            String public_id = person.getImageURL().substring(60, 80);

            cloudinary.api().deleteResources(new ArrayList<>(
                            Arrays.asList(public_id)),
                    ObjectUtils.emptyMap());

            File file = this.convertMultipartFileToFile(multipartFile);

            Map result = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
            String url = (String) result.get("secure_url");

            person.setImageURL(url);
            file.delete();

            personRepository.save(person);

        } else {
            File file = this.convertMultipartFileToFile(multipartFile);

            Cloudinary cloudinary = new Cloudinary(CONFIG);

            Map result = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
            String url = (String) result.get("secure_url");

            person.setImageURL(url);
            file.delete();

            personRepository.save(person);
        }
    }

    //Convert MultipartFile in File
    public File convertMultipartFileToFile(MultipartFile multipartFile) {

        File convFile = new File(multipartFile.getOriginalFilename());
        try {
            convFile.createNewFile();
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(multipartFile.getBytes());
            fos.close();

        } catch (IOException e) {

        }

        return convFile;
    }

}
