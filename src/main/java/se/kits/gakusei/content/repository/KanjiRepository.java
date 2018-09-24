package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;

import se.kits.gakusei.content.model.Kanji;

import java.util.List;

public interface KanjiRepository
    extends CrudRepository<Kanji, String> {

    List<Kanji> findAll();
}