package horeca.host.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("")
public class FrontController {

    @GetMapping({"","/"})
    public String getIndex(){

        return "index";
    }
}
