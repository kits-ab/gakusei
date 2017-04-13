package se.kits.gakusei.controller;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;
import se.kits.gakusei.content.model.Nugget;
import se.kits.gakusei.content.repository.FactRepository;
import se.kits.gakusei.content.repository.NuggetRepository;
import se.kits.gakusei.test_tools.TestTools;

import java.util.ArrayList;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class NuggetControllerTest {

    @InjectMocks
    private NuggetController nuggetController;

    @Mock
    private FactRepository factRepository;

    @Mock
    private NuggetRepository nuggetRepository;

    private String wordType;
    private List<String> factTypes;
    private List<Nugget> nuggets;

    @Before
    public void setUp() throws Exception {
        nuggetController = new NuggetController(nuggetRepository, factRepository);
        MockitoAnnotations.initMocks(this);

        wordType = "verb";
        factTypes = new ArrayList<>(Arrays.asList("swedish", "english"));
        nuggets = TestTools.generateNuggets();
    }

    @Test
    public void testFindNuggetByFilterWithFactTypes() {
        Long lengthOfFacts = 2L;

        Mockito.when(nuggetController.cachingGetNuggetsByFilter(wordType, factTypes, lengthOfFacts)).thenReturn(nuggets);

        ResponseEntity<List<Nugget>> re = nuggetController.findNuggetsByFilter(wordType, factTypes);

        assertEquals(nuggets, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }

    @Test
    public void testFindNuggetByFilterWithoutFactTypes() {
        Long lengthOfFacts = 0L;
        List<String> emptyFactTypes = Collections.EMPTY_LIST;

        Mockito.when(factRepository.getAllFactTypes()).thenReturn(factTypes);
        Mockito.when(nuggetController.cachingGetAllFactTypes()).thenReturn(factTypes);
        Mockito.when(nuggetRepository.getNuggetsbyFilter(wordType, factTypes, lengthOfFacts)).thenReturn(nuggets);
        Mockito.when(nuggetController.cachingGetNuggetsByFilter(wordType, factTypes, lengthOfFacts)).thenReturn(nuggets);

        ResponseEntity<List<Nugget>> re = nuggetController.findNuggetsByFilter(wordType, emptyFactTypes);

        assertEquals(nuggets, re.getBody());
        assertEquals(200, re.getStatusCodeValue());
    }
}
