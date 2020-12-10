package horeca.host.controllers;

import horeca.host.models.Occupation;
import horeca.host.models.Person;
import horeca.host.services.OccupationService;
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
    @Autowired
    private OccupationService occupationService;

    //Get all Persons from database
//    @GetMapping("/")
//    public String getAll(Model model){
//
//        model.addAttribute("personList", personService.getAll());
//        model.addAttribute("occupationList", occupationService.getAll());
//        return "admin/person-list";
//    }

    //Get all Persons by Occupation id
    @GetMapping("/occupation")
    public String getByOccupation(@RequestParam("occupationId") String occupationId, Model model){

        model.addAttribute("occupationList", occupationService.getAll());
        model.addAttribute("personList", personService.getPersonByOccupation(occupationId));
        return "admin/person-list";
    }

    @GetMapping("/search")
    public String searchPerson(@RequestParam ("word") String word, Model model){

        model.addAttribute("occupationList", occupationService.getAll());
        model.addAttribute("personList", personService.searchPerson(word));

        return "admin/person-list";
    }

    @RequestMapping("/delete")
    public String deletePerson(@RequestParam("personId") String personId) throws Exception {

        personService.deletePerson(personId);
        return "redirect:/person/";
    }

    @GetMapping({"/", ""})
    public String pagination(@RequestParam(defaultValue = "0") int page, @RequestParam(required = false) String type, Model model){

        int count = personService.countAll();
        int math = (count + 2 - 1) / 2;
        int[] niz = new int[math];

        if(type == null){
            model.addAttribute("personList",personService.personPagination(page));
            model.addAttribute("occupationList", occupationService.getAll());
            model.addAttribute("page", page);
            model.addAttribute("count", count);
            model.addAttribute("math", math);
            model.addAttribute("niz", niz);
            return "admin/person-list";

        }
        if (type.equalsIgnoreCase("left")) {
            page--;
            model.addAttribute("personList",personService.personPagination(page));
        } else if (type.equalsIgnoreCase("right")) {
            page++;
            model.addAttribute("personList",personService.personPagination(page));
        }
        model.addAttribute("page", page);
        model.addAttribute("count", count);
        model.addAttribute("math", math);
        model.addAttribute("niz", niz);
        model.addAttribute("occupationList", occupationService.getAll());

        return "admin/person-list";

    }



}
