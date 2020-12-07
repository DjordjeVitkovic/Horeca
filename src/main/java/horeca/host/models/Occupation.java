package horeca.host.models;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.UUID;

@Entity
public class Occupation {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID occupationId;

    @Column
    @Size(max = 30, message = "Maksimalan broj karaktera je 30.")
    private String occupationName;

    public Occupation(@Size(max = 30, message = "Maksimalan broj karaktera je 30.") String occupationName) {
        this.occupationName = occupationName;
    }

    public Occupation() {

    }

    public UUID getOccupationId() {
        return occupationId;
    }

    public void setOccupationId(UUID occupationId) {
        this.occupationId = occupationId;
    }

    public String getOccupationName() {
        return occupationName;
    }

    public void setOccupationName(String occupationName) {
        this.occupationName = occupationName;
    }
}
