package horeca.host.controllers;

import horeca.host.models.Occupation;
import horeca.host.models.Person;
import horeca.host.services.OccupationService;
import horeca.host.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Controller
@RequestMapping("")
public class FrontController {

    @Autowired
    private PersonService personService;

    @Autowired
    private OccupationService occupationService;



    @GetMapping({"","/"})
    public String getIndex(Model model){

        Person person = new Person();
        List<Occupation> occupationList = occupationService.getAll();

        model.addAttribute("person", person);
        model.addAttribute("occupationList", occupationList);

        return "index";
    }

    @PostMapping("/person-save")
    private String savePerson(@ModelAttribute Person person,
                               @RequestParam(name = "file") MultipartFile multipartFile, Model model)
            throws Exception {

        if(multipartFile == null){
            return "redirect:";
        }
        personService.savePerson(person, multipartFile);
        
        
		byte[] encodeBase64 = org.apache.tomcat.util.codec.binary.Base64.encodeBase64(multipartFile.getBytes());
		String base64Encoded = new String(encodeBase64, StandardCharsets.UTF_8);
        
        
        model.addAttribute("personImage", base64Encoded);

        return "create-pdf";
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
