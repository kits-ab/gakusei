package se.kits.gakusei.util.csv;

import com.univocity.parsers.common.processor.RowListProcessor;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;
import se.kits.gakusei.util.ParserFailureException;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class CSV {

    /**
     * Parse a CSV file and return a map with its headers and rows.
     *
     * @param filePath
     * @param expectedNbrOfHeaders
     * @return Map
     */
    public static Map<String, List<String[]>> parse(String filePath, int expectedNbrOfHeaders) {

        CsvParserSettings settings = new CsvParserSettings();
        RowListProcessor rowProcessor = new RowListProcessor();

        settings.setLineSeparatorDetectionEnabled(true);
        settings.setRowProcessor(rowProcessor);
        settings.setHeaderExtractionEnabled(true);

        CsvParser parser = new CsvParser(settings);

        Map<String, List<String[]>> result = new HashMap<String, List<String[]>>();

        try {
            parser.parse(new FileReader(filePath));
        } catch(IOException e) {
            throw new ParserFailureException("CSV file could not be parsed \n" + e.toString());
        }

        List<String[]> headerList = new ArrayList<String[]>();

        String[] headers = rowProcessor.getHeaders();
        if (headers.length != expectedNbrOfHeaders) {
            throw new ParserFailureException("Unexpected number of headers" +
                    "\nExpected " + Integer.toString(expectedNbrOfHeaders) +
                    " but got " + Integer.toString(headers.length));
        }

        List<String[]> rows = rowProcessor.getRows();

        headerList.add(headers);

        result.put("HEADERS", headerList);
        result.put("ROWS", rows);

        return result;

    }

}
