package se.kits.gakusei.controller;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.model.WordType;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.content.repository.WordTypeRepository;
import se.kits.gakusei.test_tools.TestTools;

import java.util.List;
import java.util.stream.Collectors;

@RunWith(MockitoJUnitRunner.class)
public class NuggetControllerTest {

    @InjectMocks
    private NuggetController nuggetController;

    @Mock
    private WordTypeRepository wordTypeRepository;

    @Mock
    private NuggetRepository nuggetRepository;

    private WordType wordType;
    private List<Nugget> nuggets;
    private List<Nugget> visibleNuggets;

    @Before
    public void setUp() throws Exception {
        nuggetController = new NuggetController(nuggetRepository, wordTypeRepository);
        wordType = new WordType();
        wordType.setType("verb");
        nuggets = TestTools.generateNuggets();
        visibleNuggets = nuggets.stream().filter(n -> !n.isHidden()).collect(Collectors.toList());
    }

    @Test
    public void testFindNuggetsByFilterOfAllWordTypesOK() {
        Mockito.when(nuggetRepository.findAll()).thenReturn(nuggets);
        Mockito.when(nuggetController.cachedNuggetsOfAllWordTypes()).thenReturn(visibleNuggets);

        ResponseEntity<List<Nugget>> re = nuggetController.findNuggetsByFilter("vocabulary");

        assertEquals(visibleNuggets, re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }

    @Test
    public void testFindNuggetsByFilterOfWordType() {
        Mockito.when(wordTypeRepository.findByType(wordType.getType())).thenReturn(wordType);
        Mockito.when(nuggetRepository.findByWordType(wordType)).thenReturn(nuggets);
        Mockito.when(nuggetController.cachedNuggetsOfWordType(wordType.getType())).thenReturn(visibleNuggets);

        ResponseEntity<List<Nugget>> re = nuggetController.findNuggetsByFilter(wordType.getType());

        assertEquals(visibleNuggets, re.getBody());
        assertEquals(HttpStatus.OK, re.getStatusCode());
    }
}
