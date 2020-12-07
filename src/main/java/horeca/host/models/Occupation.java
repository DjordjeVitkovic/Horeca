package horeca.host.models;

import java.util.UUID;

public class Occupation {

    private UUID occupationId;

    private String occupationName;

    public Occupation(String occupationName) {
        this.occupationName = occupationName;
    }


}
