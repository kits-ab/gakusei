package se.kits.gakusei.content.repository;

import org.springframework.data.repository.CrudRepository;

import se.kits.gakusei.content.model.WordType;

public interface WordTypeRepository
    extends CrudRepository<WordType, Long> {

    WordType findByType(String type);

}

