package horeca.host.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.UUID;

@Entity
public class Education {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String educationId;

    @Column
    @Size(max = 100, message = "Maksimalan broj karaktera je 100.")
    private String schoolName;

    @Column
    @Size(max = 100, message = "Maksimalan broj karaktera je 100.")
    private String course;

    public Education(@Size(max = 100, message = "Maksimalan broj karaktera je 100.") String schoolName,
                     @Size(max = 100, message = "Maksimalan broj karaktera je 100.") String course) {
        this.schoolName = schoolName;
        this.course = course;
    }

    public Education() {

    }

    public String getEducationId() {
        return educationId;
    }

    public void setEducationId(String educationId) {
        this.educationId = educationId;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}