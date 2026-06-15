package com.clientflow.controller;

import com.clientflow.dto.MeetingNoteRequest;
import com.clientflow.dto.MeetingNoteResponse;
import com.clientflow.service.MeetingNoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clients/{clientId}/meetings")
public class ClientMeetingController {

    private final MeetingNoteService meetingNoteService;

    public ClientMeetingController(MeetingNoteService meetingNoteService) {
        this.meetingNoteService = meetingNoteService;
    }

    @GetMapping
    public List<MeetingNoteResponse> getMeetingsForClient(@PathVariable Long clientId) {
        return meetingNoteService.getAllForClient(clientId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MeetingNoteResponse createMeetingForClient(
            @PathVariable Long clientId,
            @Valid @RequestBody MeetingNoteRequest request
    ) {
        return meetingNoteService.createForClient(clientId, request);
    }
}
