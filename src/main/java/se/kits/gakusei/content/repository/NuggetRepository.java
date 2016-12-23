package se.kits.gakusei.content.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import se.kits.gakusei.content.model.Nugget;

import java.util.List;

public interface NuggetRepository extends CrudRepository<Nugget, Long>{
    @Query("select t from Nugget t where t.id in " +
            "(select n.id from Nugget n inner join n.facts f " +
            "where n.type = :wordType and f.type in (:firstLangType, :secondLangType)" +
            "group by n.id having count(n.id) > 1)")
    List<Nugget> getNuggetsWithWordType(@Param("wordType") String wordType,
                                        @Param("firstLangType") String firstLangType,
                                        @Param("secondLangType") String secondLangType);

    @Query("select t from Nugget t where t.id in " +
            "(select n.id from Nugget n inner join n.facts f " +
            "where f.type in (:firstLangType, :secondLangType)" +
            "group by n.id having count(n.id) > 1)")
    List<Nugget> getNuggetsWithoutWordType(@Param("firstLangType") String firstLangType,
                                           @Param("secondLangType") String secondLangType);

    @Query("select t from Nugget t where t.id in " +
            "(select n.id from Nugget n inner join n.facts f " +
            "where n.type LIKE :wordType and f.type in (:firstLangType, :secondLangType, :thirdLangType, :fourthLangType)" +
            "group by n.id having count(n.id) >= :words)")
    List<Nugget> getNuggetsbyFilter(@Param("wordType") String wordType,
                                     @Param("firstLangType") String firstLangType,
                                     @Param("secondLangType") String secondLangType,
                                     @Param("thirdLangType") String thirdLangType,
                                     @Param("fourthLangType") String fourthLangType,
                                     @Param("words") Long words);
}
