package horeca.host.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.UUID;

@Entity
public class Occupation {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String  occupationId;

    @Column
    @Size(max = 30, message = "Maksimalan broj karaktera je 30.")
    private String occupationName;

    public Occupation(@Size(max = 30, message = "Maksimalan broj karaktera je 30.") String occupationName) {
        this.occupationName = occupationName;
    }

    public Occupation() {

    }

    public String  getOccupationId() {
        return occupationId;
    }

    public void setOccupationId(String  occupationId) {
        this.occupationId = occupationId;
    }

    public String getOccupationName() {
        return occupationName;
    }

    public void setOccupationName(String occupationName) {
        this.occupationName = occupationName;
    }
}
