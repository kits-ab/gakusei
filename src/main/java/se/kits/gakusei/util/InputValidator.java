package se.kits.gakusei.util;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class InputValidator {

    private final Set<String> wordTypes =
            new HashSet<>(Arrays.asList("noun", "verb", "adjective", "adverb"));

    private final Set<String> factTypes =
            new HashSet<>(Arrays.asList("english", "reading", "writing", "kanji"));

    public String validateNuggetType(String type) {
        return wordTypes.contains(type) ? type : "";
    }

    public final List<String> validateNuggetTypes(List<String> types) {
        return types.stream().map(type -> wordTypes.contains(type) ? type : "").collect(Collectors.toList());
    }

    public final List<String> validateFactTypes(List<String> types) {
        return types.stream().map(type -> factTypes.contains(type) ? type : "").collect(Collectors.toList());
    }

    public Set<String> getWordTypes() {
        return wordTypes;
    }

    public Set<String> getFactTypes() {
        return factTypes;
    }
}
