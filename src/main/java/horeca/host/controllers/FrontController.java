package horeca.host.controllers;

import horeca.host.models.Occupation;
import horeca.host.models.Person;
import horeca.host.services.OccupationService;
import horeca.host.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
                               @RequestParam(name = "file") MultipartFile multipartFile)
            throws Exception {

        if(multipartFile == null){
            return "redirect:";
        }
        personService.savePerson(person, multipartFile);

        return "success";
    }
}
