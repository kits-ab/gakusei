package se.kits.gakusei.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import se.kits.gakusei.content.model.Kanji;

@Component
public class KanjiHandler {

    public List<Kanji> chooseKanjis(List<Kanji> kanjis, int quantity) {
        List<Kanji> visibleKanjis = kanjis.stream().filter(
            kanji -> !kanji.isHidden()
        ).collect(Collectors.toList());
        Collections.shuffle(visibleKanjis);

        if (visibleKanjis.size() <= quantity) {
            return visibleKanjis;
        }
        return visibleKanjis.subList(0, quantity);
    }

    public List<HashMap<String, Object>> createKanjiQuestions(
        List<Kanji> chosenKanjis
    ) {
        return chosenKanjis.stream().map(
            KanjiHandler::createKanjiQuestion
        ).collect(Collectors.toList());
    }

    public static HashMap<String, Object> createKanjiQuestion(Kanji kanji) {
        HashMap<String, Object> questionMap = new HashMap<>();
        List<String> question = new ArrayList<>();
        question.add(kanji.getSwedish());
        question.add(kanji.getKanji());

        questionMap.put("question", question);
        questionMap.put(
            "correctAlternative",
            Collections.singletonList(
                Collections.singletonList(kanji.getKanji())
            )
        );
        questionMap.put("alternative1", Collections.EMPTY_LIST);
        questionMap.put("alternative2", Collections.EMPTY_LIST);
        questionMap.put("alternative3", Collections.EMPTY_LIST);
        questionMap.put("questionNuggetId", kanji.getId());

        return questionMap;
    }

}

