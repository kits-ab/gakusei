package se.kits.gakusei.content.model;


import org.junit.Assert;
import org.junit.Test;

public class FactTest {

    @Test
    public void testGetFactType() {
        Fact fact = new Fact();
        String typeString = "test";
        fact.setType(typeString);
        Assert.assertEquals("Test getType in Fact", fact.getType(), "test");
    }
}
