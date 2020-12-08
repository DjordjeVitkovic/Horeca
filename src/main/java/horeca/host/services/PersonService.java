package horeca.host.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import horeca.host.models.Person;
import horeca.host.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    public void deletePerson(String personId){
        personRepository.deleteById(personId);
    }

    //Save person with image
    public void savePerson(Person person, MultipartFile multipartFile) throws Exception {

        if(multipartFile == null){
            personRepository.save(person);
            return;
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

            personRepository.save(person);

        } else {
            File file = this.convertMultipartFileToFile(multipartFile);

            Cloudinary cloudinary = new Cloudinary(CONFIG);

            Map result = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
            String url = (String) result.get("secure_url");

            person.setImageURL(url);

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
