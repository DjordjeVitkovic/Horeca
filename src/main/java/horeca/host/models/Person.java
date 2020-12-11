package horeca.host.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

@Entity
public class Person {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String  personId;
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
    @Size(max = 200, message = "Maksimalan broj karaktera je 200!")
    private String about;
    @Column
    @Size(max = 200, message = "Maksimalan broj karaktera je 200!")
    private String hobby;

    @Valid
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "educationId")
    private Education education;

    @Valid
    @ManyToOne(cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "occupationId")
    private Occupation occupation;

    @Valid
    @OneToMany(mappedBy = "personId", cascade = CascadeType.ALL)
    private List<WorkExperience> workExperienceList;

    @Valid
    @OneToMany(mappedBy = "personId", cascade = CascadeType.ALL)
    private List<Language> languageList;

    public Person(@NotEmpty(message = "Morate popuniti polje!")
    			  @NotEmpty(message = "Morate popuniti polje!") @Size(max = 20, message = "Maksimalan broj karaktera je 20!") String firstName,
                  @NotEmpty(message = "Morate popuniti polje!") @Size(max = 20, message = "Maksimalan broj karaktera je 20!") String lastName,
                  @NotEmpty(message = "Morate popuniti polje!") @Size(max = 80, message = "Maksimalan broj karaktera je 80!") String email,
                  String imageURL,
                  @NotEmpty(message = "Morate popuniti polje!") @Size(max = 15, message = "Maksimalan broj karaktera je 15!") String dateOfBirth,
                  @NotEmpty(message = "Morate popuniti polje!") @Size(max = 20, message = "Maksimalan broj karaktera je 20!") String citizenship,
                  @NotEmpty(message = "Morate popuniti polje!") @Size(max = 20, message = "Maksimalan broj karaktera je 20!") String city,
                  @NotEmpty(message = "Morate popuniti polje!") @Size(max = 20, message = "Maksimalan broj karaktera je 20!") String phoneNumber,
                  @Size(max = 200, message = "Maksimalan broj karaktera je 500!") String about,
                  @Size(max = 200, message = "Maksimalan broj karaktera je 500!") String hobby,
                  @Valid Education education,
                  @Valid Occupation occupation,
                  @Valid List<WorkExperience> workExperienceList,
                  @Valid List<Language> languageList) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.imageURL = imageURL;
        this.dateOfBirth = dateOfBirth;
        this.citizenship = citizenship;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.about = about;
        this.hobby = hobby;
        this.education = education;
        this.occupation = occupation;
        this.workExperienceList = workExperienceList;
        this.languageList = languageList;
    }

    public Person() {

    }

    public String  getPersonId() {
        return personId;
    }

    public void setPersonId(String  personId) {
        this.personId = personId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getCitizenship() {
        return citizenship;
    }

    public void setCitizenship(String citizenship) {
        this.citizenship = citizenship;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getHobby() {
        return hobby;
    }

    public void setHobby(String hobby) {
        this.hobby = hobby;
    }

    public Education getEducation() {
        return education;
    }

    public void setEducation(Education education) {
        this.education = education;
    }

    public Occupation getOccupation() {
        return occupation;
    }

    public void setOccupation(Occupation occupation) {
        this.occupation = occupation;
    }

    public List<WorkExperience> getWorkExperienceList() {
        return workExperienceList;
    }

    public void setWorkExperienceList(List<WorkExperience> workExperienceList) {
        this.workExperienceList = workExperienceList;
    }

    public List<Language> getLanguageList() {
        return languageList;
    }

    public void setLanguageList(List<Language> languageList) {
        this.languageList = languageList;
    }
}
