package horeca.host.models;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class Occupation {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID occupationId;

    @Column
    private String occupationName;

    public Occupation(String occupationName) {
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
