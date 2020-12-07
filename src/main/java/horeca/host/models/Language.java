package horeca.host.models;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Language {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID languageId;

    @Column
    private String languageName;

    @Column
    private String languageLevel;

    @ManyToOne(cascade = CascadeType.ALL)
    private Person personId;

    public Language(String languageName, String languageLevel, Person personId) {
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
