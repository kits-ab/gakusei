package se.kits.gakusei.util;

import org.hibernate.cfg.NotYetImplementedException;

import java.util.*;

public class InflectionUtil {

    private static Map<String, List<String>> inflectionMap = new HashMap<>();

    static {
        inflectionMap.put("asDesireForm", null);
        inflectionMap.put("asPoliteRequestForm", createList("Be om hjälp (artigt)", "gcon_37"));
        inflectionMap.put("asPoliteRefrainRequestForm", null);
        inflectionMap.put("asRepresentativeForm", null);
        inflectionMap.put("asItIsPossibleNegForm", createList("Det är möjligt att... (nekande)", "gcon_23"));
        inflectionMap.put("asCasualRequestForm", createList("Be om hjälp (vardagligt)", "gcon_39"));
        inflectionMap.put("asConcurrentActionForm", createList("Samtidigt utförande", "gcon_13"));
        inflectionMap.put("asAlternativeWishNegForm", createList("[Jag borde ha... ; Jag önskar att jag hade...] (nekande)", "gcon_14"));
        inflectionMap.put("asApologizeForForm", createList("Jag ber om ursäkt för att...", "gcon_44"));
        inflectionMap.put("asDeterminationForm", createList("Intention", "gcon_31"));
        inflectionMap.put("asHaveALookAtForm", createList("Försöka eller prova", "gcon_19"));
        inflectionMap.put("asShortPastNegForm", null);
        inflectionMap.put("asOpinionQuoteForm", null);
        inflectionMap.put("asPoliteVolitionalForm", null);
        inflectionMap.put("asRespectfulAdviceForm", createListNoLink("Respektfullt råd"));
        inflectionMap.put("asApologizeForNegForm", createList("Jag ber om ursäkt för att jag inte...", "gcon_45"));
        inflectionMap.put("asPolitePermissionForm", null);
        inflectionMap.put("asPoliteProhibitionForm", null);
        inflectionMap.put("asItIsPossibleForm", createList("Det är möjligt att...", "gcon_23"));
        inflectionMap.put("asItIsPossiblePastForm", createList("Det är möjligt att... (dåtid)", "gcon_23"));
        inflectionMap.put("asPreparationForm", createList("Förberedande syfte", "gcon_32"));
        inflectionMap.put("asItIsPossiblePastNegForm", createList("Det är möjligt att... (dåtid, nekande)", "gcon_23"));
        inflectionMap.put("asPoliterRequestForm", null);
        inflectionMap.put("asSelfWishCasualForm", null);
        inflectionMap.put("asAppearsPastForm", createList("[Verkar... ; Ser ut som att...] (dåtid)", "gcon_6"));
        inflectionMap.put("asAppearsPastNegForm", createList("[Verkar... ; Ser ut som att...] (dåtid, nekande)", "gcon_6"));
        inflectionMap.put("asPolitePastNegForm", null);
        inflectionMap.put("asMovementPurposeForm", null);
        inflectionMap.put("asAlternativeWishForm", createList("[Jag borde ha... ; Jag önskar att jag hade...]", "gcon_14"));
        inflectionMap.put("asIHearSoudesuForm", createList("[Jag hörde att... ; Det ser ut som att...]", "gcon_17"));
        inflectionMap.put("asPoliteNegForm", null);
        inflectionMap.put("asPolitePastForm", null);
        inflectionMap.put("asStemForm", null);
        inflectionMap.put("asShortForm", null);
        inflectionMap.put("asShortNegForm", createList("Te (nekande)", "gcon_46"));
        inflectionMap.put("asHeardQuoteForm", null);
        inflectionMap.put("asInProgressForm", null);
        inflectionMap.put("asTeForm", null);
        inflectionMap.put("asShortPastForm", null);
        inflectionMap.put("asNounForm", null);
        inflectionMap.put("asDictionaryForm", null);
        inflectionMap.put("asPoliteForm", null);
        inflectionMap.put("asGoodWishForm", createList("Jag hoppas du...", "gcon_40"));
        inflectionMap.put("asSelfWishForm", createList("Jag hoppas själv...", "gcon_41"));
        inflectionMap.put("asNeedNotForm", createList("Du behöver inte...", "gcon_4"));
        inflectionMap.put("asRequestForm", createList("Be om hjälp", "gcon_38"));
        inflectionMap.put("asVolitionalForm", createList("Volitional", "gcon_30"));
        inflectionMap.put("asAppearsForm", createList("[Verkar... ; Ser ut som att...]", "gcon_6"));
        inflectionMap.put("asRegretablyForm", createList("[Göra klart ; Fullfölja ; Oavsiktligt]", "gcon_10"));
        inflectionMap.put("asFinishForm", null);
        inflectionMap.put("asPotentialForm", createList("Potentiell", "gcon_15"));
        inflectionMap.put("asCauseForm", createList("Orsak och verkan", "gcon_12"));
        inflectionMap.put("asAppearsNegForm", createList("[Verkar... ; Ser ut som att...] (nekande)", "gcon_6"));
        inflectionMap.put("asTeNegForm", null);
        inflectionMap.put("asPassiveForm", createListNoLink("Passiv"));
        inflectionMap.put("asEbaNegForm", createListNoLink("Eba (nekande)"));
        inflectionMap.put("asSupposedToForm", null);
        inflectionMap.put("asAdviceForm", createList("Min rekommendation", "gcon_27"));
        inflectionMap.put("asYBeforeXForm", createList("X efter Y", "gcon_7"));
        inflectionMap.put("asYAfterXForm", createList("X före Y", "gcon_8"));
        inflectionMap.put("asEbaForm", createListNoLink("Eba"));
        inflectionMap.put("asIHearTteForm", null);
        inflectionMap.put("asIfThenForm", createList("Om och när", "gcon_3"));
        inflectionMap.put("asIAmGladNegForm", createListNoLink("Det glädjer mig (nekande)"));
        inflectionMap.put("asIAmGladForm", createListNoLink("Det glädjer mig"));
        inflectionMap.put("asIfThenNegForm", createList("Om och när (nekande)", "gcon_3"));
        inflectionMap.put("asThankYouForDoingForm", createListNoLink("Tack för att du..."));
        inflectionMap.put("asSupposedToPastForm", null);
        inflectionMap.put("asSupposedToNegForm", null);
        inflectionMap.put("asSupposedToPastNegForm", null);
        inflectionMap.put("asThankYouForDoingHumbleForm", createListNoLink("Tack för att du... (ödmjuk)"));
    }

    public static List<String> getInflectionNameAndTextLink(String inflectionMethod) {
        List<String> value = inflectionMap.get(inflectionMethod);
        return value != null ? value : Collections.singletonList(inflectionMethod);
    }

    public static ArrayList<String> createList(String form, String linkId){
        return new ArrayList<>(Arrays.asList(form, "/grammar#" + linkId));
    }

    public static List<String> createListNoLink(String form){
        return createList(form, null);
    }

}
