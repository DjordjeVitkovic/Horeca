package horeca.host.controllers;

import horeca.host.models.LoginViewModel;
import horeca.host.models.Occupation;
import horeca.host.models.Person;
import horeca.host.security.JwtUtil;
import horeca.host.security.UserPrincipalDetailsService;
import horeca.host.services.OccupationService;
import horeca.host.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Controller
@RequestMapping("")
public class FrontController {

    @Autowired
    private PersonService personService;

    @Autowired
    private OccupationService occupationService;

    @GetMapping({"", "/", "/index"})
    public String getIndex(Model model) {

        Person person = new Person();
        List<Occupation> occupationList = occupationService.getAll();

        model.addAttribute("person", person);
        model.addAttribute("occupationList", occupationList);

        return "index";
    }

    @PostMapping("/person-save")
    private String savePerson(@ModelAttribute Person person,
                              @RequestParam(name = "file") MultipartFile multipartFile,
                              Model model)
            throws Exception {

        if (multipartFile == null) {
            return "redirect:";
        }

        personService.savePerson(person, multipartFile);

        byte[] encodeBase64 = org.apache.tomcat.util.codec.binary.Base64.encodeBase64(multipartFile.getBytes());
        String base64Encoded = new String(encodeBase64, StandardCharsets.UTF_8);

        model.addAttribute("personImage", base64Encoded);

        return "create-pdf";
    }

    @GetMapping("login")
    public String login() {
        return "login";
    }

    @GetMapping("/logoutHandler")
    public String logout(HttpServletRequest request, HttpServletResponse response) {

        Cookie cookie = new Cookie("token", null);
        cookie.setMaxAge(0);

        //add cookie to response
        response.addCookie(cookie);

        return "redirect:index";
    }

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserPrincipalDetailsService userPrincipalDetailsService;
    @Autowired
    private JwtUtil jwtTokenUtil;

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public String createAuthenticationToken(@ModelAttribute LoginViewModel loginViewModel,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(required = false) String type,
                                            Model model,
                                            HttpServletResponse response
    ) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginViewModel.getUsername(), loginViewModel.getPassword()));
        } catch (BadCredentialsException e) {
            model.addAttribute("error", e.getMessage());
            return "login";
        }
        final UserDetails userDetails = userPrincipalDetailsService.loadUserByUsername(loginViewModel.getUsername());
        final String jwt = jwtTokenUtil.generateToken(userDetails);

        Cookie cookie = new Cookie("token", jwt);
        response.addCookie(cookie);

        return "redirect:/person";
    }

}
