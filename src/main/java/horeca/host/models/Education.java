package horeca.host.models;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Education {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID educationId;

    @Column
    private String schoolName;

    @Column
    private String course;

    public Education(String schoolName, String course) {
        this.schoolName = schoolName;
        this.course = course;
    }

    public UUID getEducationId() {
        return educationId;
    }

    public void setEducationId(UUID educationId) {
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
