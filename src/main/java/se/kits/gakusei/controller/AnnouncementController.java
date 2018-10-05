package se.kits.gakusei.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import se.kits.gakusei.content.model.Announcement;
import se.kits.gakusei.content.repository.AnnouncementRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@Api(value="AnnouncementController", description="Operations for handling announcements")
public class AnnouncementController {
    @Autowired
    AnnouncementRepository announcementRepository;

    @ApiOperation(value="get all the announcements", response = ResponseEntity.class)
    @RequestMapping(
            value = "api/announcement",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Announcement>> getAnnouncement() {
        Iterable<Announcement> allAnnouncements = announcementRepository.findAll();


        List<Announcement> ActualAnnouncements= new ArrayList<>();
        LocalDateTime date = LocalDateTime.now();
        for (Announcement a:allAnnouncements) {
            if (date.isAfter(a.getStartDate().toLocalDateTime())
                && date.isBefore(a.getEndDate().toLocalDateTime())){
                ActualAnnouncements.add(a);
            }
        }
        if (ActualAnnouncements != null) {
            return new ResponseEntity<>(ActualAnnouncements, HttpStatus.OK);
        } else if (allAnnouncements != null){
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

