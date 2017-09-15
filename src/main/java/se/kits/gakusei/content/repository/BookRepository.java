package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;
import se.kits.gakusei.content.model.Book;

public interface BookRepository extends CrudRepository<Book, Long> {

    Book findByTitle(String title);

}
