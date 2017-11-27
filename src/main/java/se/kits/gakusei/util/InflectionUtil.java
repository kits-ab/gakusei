package se.kits.gakusei.util;

import org.hibernate.cfg.NotYetImplementedException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InflectionUtil {

    private static Map<String, List<String>> inflectionMap = new HashMap<>();

    static {
        inflectionMap.put("asDesireForm", null);
        inflectionMap.put("asPoliteRequestForm", null);
        inflectionMap.put("asPoliteRefrainRequestForm", null);
        inflectionMap.put("asRepresentativeForm", null);
        inflectionMap.put("asItIsPossibleNegForm", null);
        inflectionMap.put("asCasualRequestForm", null);
        inflectionMap.put("asConcurrentActionForm", null);
        inflectionMap.put("asAlternativeWishNegForm", null);
        inflectionMap.put("asApologizeForForm", null);
        inflectionMap.put("asDeterminationForm", null);
        inflectionMap.put("asHaveALookAtForm", null);
        inflectionMap.put("asShortPastNegForm", null);
        inflectionMap.put("asOpinionQuoteForm", null);
        inflectionMap.put("asPoliteVolitionalForm", null);
        inflectionMap.put("asRespectfulAdviceForm", null);
        inflectionMap.put("asApologizeForNegForm", null);
        inflectionMap.put("asPolitePermissionForm", null);
        inflectionMap.put("asPoliteProhibitionForm", null);
        inflectionMap.put("asItIsPossibleForm", null);
        inflectionMap.put("asItIsPossiblePastForm", null);
        inflectionMap.put("asPreparationForm", null);
        inflectionMap.put("asItIsPossiblePastNegForm", null);
        inflectionMap.put("asPoliterRequestForm", null);
        inflectionMap.put("asSelfWishCasualForm", null);
        inflectionMap.put("asAppearsPastForm", null);
        inflectionMap.put("asAppearsPastNegForm", null);
        inflectionMap.put("asPolitePastNegForm", null);
        inflectionMap.put("asMovementPurposeForm", null);
        inflectionMap.put("asAlternativeWishForm", null);
        inflectionMap.put("asIHearSoudesuForm", null);
        inflectionMap.put("asPoliteNegForm", null);
        inflectionMap.put("asPolitePastForm", null);
        inflectionMap.put("asStemForm", null);
        inflectionMap.put("asShortForm", null);
        inflectionMap.put("asShortNegForm", null);
        inflectionMap.put("asHeardQuoteForm", null);
        inflectionMap.put("asInProgressForm", null);
        inflectionMap.put("asTeForm", null);
        inflectionMap.put("asShortPastForm", null);
        inflectionMap.put("asNounForm", null);
        inflectionMap.put("asDictionaryForm", null);
        inflectionMap.put("asPoliteForm", null);
        inflectionMap.put("asGoodWishForm", null);
        inflectionMap.put("asSelfWishForm", null);
        inflectionMap.put("asNeedNotForm", null);
        inflectionMap.put("asRequestForm", null);
        inflectionMap.put("asVolitionalForm", null);
        inflectionMap.put("asAppearsForm", null);
        inflectionMap.put("asRegretablyForm", null);
        inflectionMap.put("asFinishForm", null);
        inflectionMap.put("asPotentialForm", null);
        inflectionMap.put("asCauseForm", null);
        inflectionMap.put("asAppearsNegForm", null);
        inflectionMap.put("asTeNegForm", null);
        inflectionMap.put("asPassiveForm", null);
        inflectionMap.put("asEbaNegForm", null);
        inflectionMap.put("asSupposedToForm", null);
        inflectionMap.put("asAdviceForm", null);
        inflectionMap.put("asYBeforeXForm", null);
        inflectionMap.put("asYAfterXForm", null);
        inflectionMap.put("asEbaForm", null);
        inflectionMap.put("asIHearTteForm", null);
        inflectionMap.put("asIfThenForm", null);
        inflectionMap.put("asIAmGladNegForm", null);
        inflectionMap.put("asIAmGladForm", null);
        inflectionMap.put("asIfThenNegForm", null);
        inflectionMap.put("asThankYouForDoingForm", null);
        inflectionMap.put("asSupposedToPastForm", null);
        inflectionMap.put("asSupposedToNegForm", null);
        inflectionMap.put("asSupposedToPastNegForm", null);
        inflectionMap.put("asThankYouForDoingHumbleForm", null);
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

}
