package se.kits.gakusei.controller;

import java.sql.Timestamp;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import se.kits.gakusei.content.model.KanjiDrawing;
import se.kits.gakusei.content.model.UserLesson;
import se.kits.gakusei.content.repository.KanjiDrawingRepository;
import se.kits.gakusei.dto.KanjiDrawingDTO;
import se.kits.gakusei.user.model.User;
import se.kits.gakusei.user.repository.UserRepository;

@RestController
@Api(value="KanjiDrawingController", description="Operations for handling kanji drawings")
public class KanjiDrawingController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KanjiDrawingRepository kanjiDrawingRepository;

    @ApiOperation(value="Adds users kanji drawing, returns ResponseEntity and sets users kanji drawing as a list of coordinates (data) as String", response = ResponseEntity.class)
    @RequestMapping(
        value = "/api/kanji-drawings",
        method = RequestMethod.POST,
        consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
        produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<UserLesson> addKanjiDrawing(
        @RequestBody
        KanjiDrawingDTO kanjiDrawingDTO
    ) {
        KanjiDrawing drawing = new KanjiDrawing();

        User user = userRepository.findByUsername(
            kanjiDrawingDTO.getUsername()
        );
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        drawing.setUser(user);
        drawing.setDifficulty(kanjiDrawingDTO.getDifficulty());
        drawing.setNuggetID(kanjiDrawingDTO.getNuggetid());
        drawing.setImageData(kanjiDrawingDTO.getData());
        drawing.setTimestamp(new Timestamp(kanjiDrawingDTO.getTimestamp()));

        kanjiDrawingRepository.save(drawing);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}

