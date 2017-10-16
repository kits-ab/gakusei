package se.kits.gakusei.util.csv;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CSVQuizToDatabase {

    private String file;
    private final int EXPECTED_NUMBER_OF_HEADERS = 5;

    public CSVQuizToDatabase(String file){
        this.file = file;
    }

    public List<CSVQuizNugget> parse() throws Exception {

        Map<String, List<String []>> csv = CSV.parse(file, EXPECTED_NUMBER_OF_HEADERS);
        List<CSVQuizNugget> csvQuizNuggets = createCSVQuizNuggets(csv.get("ROWS"));
        return csvQuizNuggets;

    }

    private List<CSVQuizNugget> createCSVQuizNuggets(List<String[]> rows){

        List<CSVQuizNugget> csvQuizNuggets = new ArrayList<>();

        for(String[] stringList : rows){
            CSVQuizNugget csvQuizNugget = new CSVQuizNugget(stringList);
            csvQuizNuggets.add(csvQuizNugget);
        }

        return csvQuizNuggets;
    }
}
