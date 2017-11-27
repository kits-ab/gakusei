package se.kits.gakusei.util;

import org.hibernate.cfg.NotYetImplementedException;

import java.util.*;

public class InflectionUtil {

    private static Map<String, List<String>> inflectionMap = new HashMap<>();

    static {
        inflectionMap.put("asDesireForm", null);
        inflectionMap.put("asPoliteRequestForm", createList("Be om hjälp form (artigt)", "gcon_37"));
        inflectionMap.put("asPoliteRefrainRequestForm", null);
        inflectionMap.put("asRepresentativeForm", null);
        inflectionMap.put("asItIsPossibleNegForm", createList("Det är möjligt att... form (nekande)", "gcon_23"));
        inflectionMap.put("asCasualRequestForm", createList("Be om hjälp form (vardagligt)", "gcon_39"));
        inflectionMap.put("asConcurrentActionForm", createList("Samtidigt utförande form", "gcon_13"));
        inflectionMap.put("asAlternativeWishNegForm", createList("[Jag borde ha... ; Jag önskar att jag hade...]-form (nekande)", "gcon_14"));
        inflectionMap.put("asApologizeForForm", createList("Jag ber om ursäkt för att... form", "gcon_44"));
        inflectionMap.put("asDeterminationForm", createList("Intention form", "gcon_31"));
        inflectionMap.put("asHaveALookAtForm", createList("Försöka eller prova form", "gcon_19"));
        inflectionMap.put("asShortPastNegForm", null);
        inflectionMap.put("asOpinionQuoteForm", null);
        inflectionMap.put("asPoliteVolitionalForm", null);
        inflectionMap.put("asRespectfulAdviceForm", createListNoLink("Respektfullt råd-form"));
        inflectionMap.put("asApologizeForNegForm", createList("Jag ber om ursäkt för att jag inte... form", "gcon_45"));
        inflectionMap.put("asPolitePermissionForm", null);
        inflectionMap.put("asPoliteProhibitionForm", null);
        inflectionMap.put("asItIsPossibleForm", createList("Det är möjligt att... form", "gcon_23"));
        inflectionMap.put("asItIsPossiblePastForm", createList("Det är möjligt att... form (dåtid)", "gcon_23"));
        inflectionMap.put("asPreparationForm", createList("Förberedande syfte-form", "gcon_32"));
        inflectionMap.put("asItIsPossiblePastNegForm", createList("Det är möjligt att... form (dåtid, nekande)", "gcon_23"));
        inflectionMap.put("asPoliterRequestForm", null);
        inflectionMap.put("asSelfWishCasualForm", null);
        inflectionMap.put("asAppearsPastForm", createList("[Verkar... ; Ser ut som att...]-form (dåtid)", "gcon_6"));
        inflectionMap.put("asAppearsPastNegForm", createList("[Verkar... ; Ser ut som att...]-form (dåtid, nekande)", "gcon_6"));
        inflectionMap.put("asPolitePastNegForm", null);
        inflectionMap.put("asMovementPurposeForm", null);
        inflectionMap.put("asAlternativeWishForm", createList("[Jag borde ha... ; Jag önskar att jag hade...]-form", "gcon_14"));
        inflectionMap.put("asIHearSoudesuForm", createList("[Jag hörde att... ; Det ser ut som att...]-form", "gcon_17"));
        inflectionMap.put("asPoliteNegForm", null);
        inflectionMap.put("asPolitePastForm", null);
        inflectionMap.put("asStemForm", null);
        inflectionMap.put("asShortForm", null);
        inflectionMap.put("asShortNegForm", createList("Te-form (nekande)", "gcon_46"));
        inflectionMap.put("asHeardQuoteForm", null);
        inflectionMap.put("asInProgressForm", null);
        inflectionMap.put("asTeForm", null);
        inflectionMap.put("asShortPastForm", null);
        inflectionMap.put("asNounForm", null);
        inflectionMap.put("asDictionaryForm", null);
        inflectionMap.put("asPoliteForm", null);
        inflectionMap.put("asGoodWishForm", createList("Jag hoppas du form", "gcon_40"));
        inflectionMap.put("asSelfWishForm", createList("Jag hoppas själv... form", "gcon_41"));
        inflectionMap.put("asNeedNotForm", createList("Du behöver inte... form", "gcon_4"));
        inflectionMap.put("asRequestForm", createList("Be om hjälp-form", "gcon_38"));
        inflectionMap.put("asVolitionalForm", createList("Volitional form", "gcon_30"));
        inflectionMap.put("asAppearsForm", createList("[Verkar... ; Ser ut som att...]-form", "gcon_6"));
        inflectionMap.put("asRegretablyForm", createList("[Göra klart ; Fullfölja ; Oavsiktligt]-form", "gcon_10"));
        inflectionMap.put("asFinishForm", null);
        inflectionMap.put("asPotentialForm", createList("Potentiell form", "gcon_15"));
        inflectionMap.put("asCauseForm", createList("Orsak och verkan form", "gcon_12"));
        inflectionMap.put("asAppearsNegForm", createList("[Verkar... ; Ser ut som att...]-form (nekande)", "gcon_6"));
        inflectionMap.put("asTeNegForm", null);
        inflectionMap.put("asPassiveForm", createListNoLink("Passiv form"));
        inflectionMap.put("asEbaNegForm", createListNoLink("Eba-form (nekande)"));
        inflectionMap.put("asSupposedToForm", null);
        inflectionMap.put("asAdviceForm", createList("Min rekommendation-form", "gcon_27"));
        inflectionMap.put("asYBeforeXForm", createList("X efter Y form", "gcon_7"));
        inflectionMap.put("asYAfterXForm", createList("X före Y form", "gcon_8"));
        inflectionMap.put("asEbaForm", createListNoLink("Eba-form"));
        inflectionMap.put("asIHearTteForm", null);
        inflectionMap.put("asIfThenForm", createList("Om och när form", "gcon_3"));
        inflectionMap.put("asIAmGladNegForm", createListNoLink("Det glädjer mig-form (nekande)"));
        inflectionMap.put("asIAmGladForm", createListNoLink("Det glädjer mig-form"));
        inflectionMap.put("asIfThenNegForm", createList("Om och när form (nekande)", "gcon_3"));
        inflectionMap.put("asThankYouForDoingForm", createListNoLink("Tack för att du... form"));
        inflectionMap.put("asSupposedToPastForm", null);
        inflectionMap.put("asSupposedToNegForm", null);
        inflectionMap.put("asSupposedToPastNegForm", null);
        inflectionMap.put("asThankYouForDoingHumbleForm", createListNoLink("Tack för att du... form (ödmjuk)"));
    }

    public static List<String> getInflectionNameAndTextLink(String inflectionMethod) {
        throw new NotYetImplementedException();
    }

    public static String getInflectionName(String inflectionMethod) {
        throw new NotYetImplementedException();
    }

    public static String getInflectionMethodTextLink(String inflectionMethod) {
        throw new NotYetImplementedException();

    }

    public static ArrayList<String> createList(String form, String linkId){
        return new ArrayList<>(Arrays.asList(form, "/grammar#" + linkId));
    }

    public static List<String> createListNoLink(String form){
        return Collections.singletonList(form);
    }

}
