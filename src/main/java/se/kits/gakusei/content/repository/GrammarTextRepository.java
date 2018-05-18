package se.kits.gakusei.content.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import se.kits.gakusei.content.model.GrammarText;

public interface GrammarTextRepository
    extends CrudRepository<GrammarText, String> {

    List<GrammarText> findByInflectionMethod(String inflectionMethod);

}

