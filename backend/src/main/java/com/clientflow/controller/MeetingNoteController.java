package com.clientflow.controller;

import com.clientflow.dto.MeetingNoteRequest;
import com.clientflow.dto.MeetingNoteResponse;
import com.clientflow.service.MeetingNoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/meetings")
public class MeetingNoteController {

    private final MeetingNoteService meetingNoteService;

    public MeetingNoteController(MeetingNoteService meetingNoteService) {
        this.meetingNoteService = meetingNoteService;
    }

    @GetMapping("/{id}")
    public MeetingNoteResponse getMeeting(@PathVariable Long id) {
        return meetingNoteService.getById(id);
    }

    @PutMapping("/{id}")
    public MeetingNoteResponse updateMeeting(@PathVariable Long id, @Valid @RequestBody MeetingNoteRequest request) {
        return meetingNoteService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMeeting(@PathVariable Long id) {
        meetingNoteService.delete(id);
    }
}
