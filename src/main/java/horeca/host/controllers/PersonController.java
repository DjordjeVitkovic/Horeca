package horeca.host.controllers;

import horeca.host.models.Person;
import horeca.host.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/person")
public class PersonController {

    @Autowired
    private PersonService personService;

    //Get all Persons from database
    @GetMapping("/")
    public String getAll(Model model){
        model.addAttribute("personList", personService.getAll());
        return "admin/person-list";
    }

    @RequestMapping("/delete")
    public String deletePerson(@RequestParam("personId") String personId) throws Exception {
        personService.deletePerson(personId);
        return "redirect:/person/";
    }


}
