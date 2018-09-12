package se.kits.gakusei.controller;

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


@RestController
public class AnnouncementController {
    @Autowired
    AnnouncementRepository announcementRepository;

    @RequestMapping(
            value = "api/announcement",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity<Iterable<Announcement>> getAnnouncement() {
        Iterable<Announcement> actualAnnouncements = announcementRepository
                .findAnnouncementByStartDateIsBeforeAndEndDateIsAfter(LocalDateTime.now());
        if (actualAnnouncements != null) {
            return new ResponseEntity<>(actualAnnouncements, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

