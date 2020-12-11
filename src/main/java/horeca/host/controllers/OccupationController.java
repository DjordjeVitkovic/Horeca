package horeca.host.controllers;


import horeca.host.models.Occupation;
import horeca.host.services.OccupationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/occupation")
public class OccupationController {

    @Autowired
    private OccupationService occupationService;

    @GetMapping("/form")
    public String getForm(@RequestParam(required = false) String occupationId, Model model){

        if(occupationId != null){
            model.addAttribute("occupationList", occupationService.getAll());
            model.addAttribute("occupation", occupationService.getOneById(occupationId));
        }else{
            model.addAttribute("occupationList", occupationService.getAll());
            model.addAttribute("occupation", new Occupation());
        }
        return "admin/occupation-form";
    }

    @PostMapping("/save")
    public String saveOccupation(@ModelAttribute Occupation occupation){
        occupationService.saveOccupation(occupation);
        return "redirect:/occupation/";
    }

    @GetMapping("/")
    public String getAll(Model model){
        model.addAttribute("occupationList", occupationService.getAll());
        return "admin/occupation-list";
    }

    @RequestMapping("/delete")
    public String deleteById(@RequestParam("occupationId") String occupationId){
        occupationService.deleteOccupationById(occupationId);
        return "redirect:/occupation/";
    }

}
