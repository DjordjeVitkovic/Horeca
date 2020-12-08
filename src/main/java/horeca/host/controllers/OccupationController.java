package horeca.host.controllers;


import horeca.host.models.Occupation;
import horeca.host.services.OccupationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/occupation")
public class OccupationController {

    @Autowired
    private OccupationService occupationService;

    @PostMapping("/")
    public void saveOccupation(@ModelAttribute Occupation occupation){
        occupationService.saveOccupation(occupation);
    }


}
