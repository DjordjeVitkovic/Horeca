package horeca.host.models;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class WorkExperience {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID workExperienceId;

    @Column
    private String companyName;

    @Column
    private int startDate;

    @Column
    private int endDate;

    @Column
    private String description;

    @ManyToOne(cascade = CascadeType.ALL)
    private Person personId;

    public WorkExperience(){

    }
    public WorkExperience(String companyName, int startDate, int endDate, String description, Person personId) {
        this.companyName = companyName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.personId = personId;
    }

    public UUID getWorkExperienceId() {
        return workExperienceId;
    }

    public void setWorkExperienceId(UUID workExperienceId) {
        this.workExperienceId = workExperienceId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public int getStartDate() {
        return startDate;
    }

    public void setStartDate(int startDate) {
        this.startDate = startDate;
    }

    public int getEndDate() {
        return endDate;
    }

    public void setEndDate(int endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Person getPersonId() {
        return personId;
    }

    public void setPersonId(Person personId) {
        this.personId = personId;
    }
}
