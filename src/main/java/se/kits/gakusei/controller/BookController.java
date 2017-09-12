package se.kits.gakusei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import se.kits.gakusei.content.model.Book;
import se.kits.gakusei.content.repository.BookRepository;


@RestController
public class BookController {

    @Autowired
    BookRepository bookRepository;

    @RequestMapping(
            value = "api/books",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Book>> getAllBooks(){
        Iterable<Book> allBooks = bookRepository.findAll();
        if(allBooks != null) {
            return new ResponseEntity<>(allBooks, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(
            value = "api/books/{bookId}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Book> getBookById(@PathVariable(value = "bookId") Long bookId){
        Book book = bookRepository.findOne(bookId);

        if(book != null){
            return new ResponseEntity<>(book, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(
            value = "api/books/{bookTitle}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Book> getBookByTitle(@PathVariable(value = "bookTitle") String bookTitle){
        Book book = bookRepository.findByTitle(bookTitle);
        if(book != null){
            return new ResponseEntity<>(book, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}
