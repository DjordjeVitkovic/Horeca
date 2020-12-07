package horeca.host.models;

import java.util.UUID;

public class Language {

    private UUID languageId;

    private String languageName;

    private String languageLevel;

    public Language(String languageName, String languageLevel) {
        this.languageName = languageName;
        this.languageLevel = languageLevel;
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
}
