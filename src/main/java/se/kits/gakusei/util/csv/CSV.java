package se.kits.gakusei.util.csv;

import com.univocity.parsers.common.processor.RowListProcessor;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import se.kits.gakusei.util.ParserFailureException;

public class CSV {

    /**
     * Parse a CSV file and return a map with its headers and rows.
     *
     * @param csvInput
     * @param expectedNbrOfHeaders
     * @return Map
     */
    public static Map<String, List<String[]>> parse(
        InputStream csvInput,
        int expectedNbrOfHeaders
    ) {
        CsvParserSettings settings = new CsvParserSettings();
        RowListProcessor rowProcessor = new RowListProcessor();

        settings.setLineSeparatorDetectionEnabled(true);
        settings.setRowProcessor(rowProcessor);
        settings.setHeaderExtractionEnabled(true);

        CsvParser parser = new CsvParser(settings);

        Map<String, List<String[]>> result = new HashMap<
            String,
            List<String[]>
        >();
        parser.parse(csvInput, "UTF-8");

        List<String[]> headerList = new ArrayList<String[]>();
        String[] headers = rowProcessor.getHeaders();
        if (headers.length != expectedNbrOfHeaders) {
            throw new ParserFailureException(
                "Unexpected number of headers" + "\nExpected " + Integer.toString(
                    expectedNbrOfHeaders
                ) + " but got " + Integer.toString(headers.length)
            );
        }
        List<String[]> rows = rowProcessor.getRows();
        headerList.add(headers);

        result.put("HEADERS", headerList);
        result.put("ROWS", rows);

        return result;
    }

}

