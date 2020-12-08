package horeca.host.services;

import horeca.host.models.Occupation;
import horeca.host.repository.OccupationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OccupationService {

    @Autowired
    private OccupationRepository occupationRepository;

    public void saveOccupation(Occupation occupation){
        occupationRepository.save(occupation);
    }

    public List<Occupation> getAll(){
        return occupationRepository.findAll();
    }

    public Occupation getOneById(String occupationId){
        return occupationRepository.getOne(occupationId);
    }

}
