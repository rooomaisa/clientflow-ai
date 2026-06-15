package com.clientflow.service;

import com.clientflow.dto.MeetingNoteRequest;
import com.clientflow.dto.MeetingNoteResponse;
import com.clientflow.entity.Client;
import com.clientflow.entity.MeetingNote;
import com.clientflow.entity.User;
import com.clientflow.exception.ApiException;
import com.clientflow.repository.AIAnalysisRepository;
import com.clientflow.repository.ClientRepository;
import com.clientflow.repository.MeetingNoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetingNoteService {

    private final MeetingNoteRepository meetingNoteRepository;
    private final ClientRepository clientRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final CurrentUserService currentUserService;
    private final AIProcessingService aiProcessingService;

    public MeetingNoteService(
            MeetingNoteRepository meetingNoteRepository,
            ClientRepository clientRepository,
            AIAnalysisRepository aiAnalysisRepository,
            CurrentUserService currentUserService,
            AIProcessingService aiProcessingService
    ) {
        this.meetingNoteRepository = meetingNoteRepository;
        this.clientRepository = clientRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.currentUserService = currentUserService;
        this.aiProcessingService = aiProcessingService;
    }

    public List<MeetingNoteResponse> getAllForClient(Long clientId) {
        Client client = findOwnedClient(clientId);
        return meetingNoteRepository
                .findByClientIdAndUserIdOrderByMeetingDateDesc(client.getId(), client.getUser().getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MeetingNoteResponse getById(Long id) {
        return toResponse(findOwnedMeeting(id));
    }

    public MeetingNoteResponse createForClient(Long clientId, MeetingNoteRequest request) {
        User user = currentUserService.getCurrentUser();
        Client client = findOwnedClient(clientId);

        MeetingNote meetingNote = new MeetingNote();
        meetingNote.setTitle(request.title());
        meetingNote.setRawNotes(request.rawNotes());
        meetingNote.setMeetingDate(request.meetingDate());
        meetingNote.setClient(client);
        meetingNote.setUser(user);

        return toResponse(meetingNoteRepository.save(meetingNote));
    }

    public MeetingNoteResponse update(Long id, MeetingNoteRequest request) {
        MeetingNote meetingNote = findOwnedMeeting(id);
        meetingNote.setTitle(request.title());
        meetingNote.setRawNotes(request.rawNotes());
        meetingNote.setMeetingDate(request.meetingDate());
        return toResponse(meetingNoteRepository.save(meetingNote));
    }

    public void delete(Long id) {
        MeetingNote meetingNote = findOwnedMeeting(id);
        aiAnalysisRepository.deleteByMeetingNoteId(meetingNote.getId());
        meetingNoteRepository.delete(meetingNote);
    }

    private Client findOwnedClient(Long clientId) {
        User user = currentUserService.getCurrentUser();
        return clientRepository.findByIdAndUserId(clientId, user.getId())
                .orElseThrow(() -> new ApiException(404, "Client not found"));
    }

    private MeetingNote findOwnedMeeting(Long id) {
        User user = currentUserService.getCurrentUser();
        return meetingNoteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(404, "Meeting note not found"));
    }

    private MeetingNoteResponse toResponse(MeetingNote meetingNote) {
        return new MeetingNoteResponse(
                meetingNote.getId(),
                meetingNote.getClient().getId(),
                meetingNote.getTitle(),
                meetingNote.getRawNotes(),
                meetingNote.getMeetingDate(),
                meetingNote.getCreatedAt(),
                meetingNote.getUpdatedAt(),
                aiProcessingService.getAnalysisForMeeting(meetingNote.getId())
        );
    }
}
