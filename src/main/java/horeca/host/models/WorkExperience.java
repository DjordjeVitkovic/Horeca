package horeca.host.models;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.UUID;

@Entity
public class WorkExperience {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID workExperienceId;

    @Column
    @Size(max = 50, message = "Maksimalan broj karaktera je 50.")
    private String companyName;

    @Column
    @Size(max = 20, message = "Maksimalan broj karaktera je 20.")
    private String startDate;

    @Column
    @Size(max = 20, message = "Maksimalan broj karaktera je 20.")
    private String endDate;

    @Column
    @Size(max = 500, message = "Maksimalan broj karaktera je 500.")
    private String description;

    @ManyToOne(cascade = CascadeType.ALL)
    private Person personId;

    public WorkExperience(){

    }

    public WorkExperience(@Size(max = 50, message = "Maksimalan broj karaktera je 50.") String companyName,
                          @Size(max = 20, message = "Maksimalan broj karaktera je 20.") String startDate,
                          @Size(max = 20, message = "Maksimalan broj karaktera je 20.") String endDate,
                          @Size(max = 500, message = "Maksimalan broj karaktera je 500.") String description,
                          Person personId) {
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

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
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
