package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.model.WordType;

public interface NuggetRepository
    extends CrudRepository<Nugget, String> {

    List<Nugget> findAll();

    List<Nugget> findByWordType(WordType wordType);

    @Query(value = "SELECT Nuggets.* FROM contentschema.nuggets, progresstrackinglist \n" +
            "WHERE nuggets.id = progresstrackinglist.nugget_id AND latest_result = FALSE\n" +
            "AND user_ref = :user AND nugget_type_ref = 2;", nativeQuery = true)
    List<Nugget> findIncorrectAnsweredVocab(@Param("user") String userName);

}

