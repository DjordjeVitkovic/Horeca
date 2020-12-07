package horeca.host.models;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.UUID;

@Entity
public class Language {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID languageId;

    @Column
    @Size(max = 30, message = "Maksimalan broj karaktera je 30.")
    private String languageName;

    @Column
    @Size(max = 30, message = "Maksimalan broj karaktera je 30.")
    private String languageLevel;

    @ManyToOne(cascade = CascadeType.ALL)
    private Person personId;

    public Language(@Size(max = 30, message = "Maksimalan broj karaktera je 30.") String languageName,
                    @Size(max = 30, message = "Maksimalan broj karaktera je 30.") String languageLevel,
                    Person personId) {
        this.languageName = languageName;
        this.languageLevel = languageLevel;
        this.personId = personId;
    }

    public Language() {

    }

    public UUID getLanguageId() {
        return languageId;
    }

    public void setLanguageId(UUID languageId) {
        this.languageId = languageId;
    }

    public String getLanguageName() {
        return languageName;
    }

    public void setLanguageName(String languageName) {
        this.languageName = languageName;
    }

    public String getLanguageLevel() {
        return languageLevel;
    }

    public void setLanguageLevel(String languageLevel) {
        this.languageLevel = languageLevel;
    }

    public Person getPersonId() {
        return personId;
    }

    public void setPersonId(Person personId) {
        this.personId = personId;
    }
}
