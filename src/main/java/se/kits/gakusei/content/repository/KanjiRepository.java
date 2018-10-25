package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Kanji;

import java.util.List;

public interface KanjiRepository
    extends CrudRepository<Kanji, String> {

    List<Kanji> findAll();

    @Query(value = "SELECT kanjis.* FROM contentschema.kanjis, progresstrackinglist \n" +
            "WHERE kanjis.id = progresstrackinglist.nugget_id AND latest_result = FALSE\n" +
            "AND user_ref = :user AND nugget_type_ref = 3;", nativeQuery = true)
    List<Kanji> findIncorrectAnsweredKanji(
            @Param("user") String userName
    );
}