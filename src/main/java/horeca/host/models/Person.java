package horeca.host.models;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public class Person {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID personId;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 20, message = "Maksimalan broj karaktera je 20!")
    private String firstName;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 20, message = "Maksimalan broj karaktera je 20!")
    private String lastName;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 80, message = "Maksimalan broj karaktera je 80!")
    private String email;
    @Column
    private String imageURL;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 15, message = "Maksimalan broj karaktera je 15!")
    private String dateOfBirth;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 20, message = "Maksimalan broj karaktera je 20!")
    private String citizenship;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 20, message = "Maksimalan broj karaktera je 20!")
    private String city;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 20, message = "Maksimalan broj karaktera je 20!")
    private String phoneNumber;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 500, message = "Maksimalan broj karaktera je 500!")
    private String about;
    @Column
    @NotEmpty(message = "Morate popuniti polje!")
    @Size(max = 500, message = "Maksimalan broj karaktera je 500!")
    private String hobby;

    private Education education;

    private Occupation occupation;

    private List<WorkExpirience> workExpirienceList;

    private List<Language> languageList;
}
