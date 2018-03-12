package se.kits.gakusei.util;

public class ParserFailureException extends RuntimeException {

    public ParserFailureException() {}

    public ParserFailureException(String message){
        super(message);
    }
}
