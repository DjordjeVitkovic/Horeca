package horeca.host.models;

import java.util.UUID;

public class Education {

    private UUID educationId;

    private String schoolName;

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
