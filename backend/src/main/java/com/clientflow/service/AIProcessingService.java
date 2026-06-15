package com.clientflow.service;

import com.clientflow.dto.AIAnalysisResponse;
import com.clientflow.dto.OpenAIAnalysisResult;
import com.clientflow.entity.AIAnalysis;
import com.clientflow.entity.Client;
import com.clientflow.entity.MeetingNote;
import com.clientflow.entity.Task;
import com.clientflow.entity.TaskPriority;
import com.clientflow.entity.TaskStatus;
import com.clientflow.entity.User;
import com.clientflow.exception.ApiException;
import com.clientflow.repository.AIAnalysisRepository;
import com.clientflow.repository.MeetingNoteRepository;
import com.clientflow.repository.TaskRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class AIProcessingService {

    private final MeetingNoteRepository meetingNoteRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final TaskRepository taskRepository;
    private final CurrentUserService currentUserService;
    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper;

    public AIProcessingService(
            MeetingNoteRepository meetingNoteRepository,
            AIAnalysisRepository aiAnalysisRepository,
            TaskRepository taskRepository,
            CurrentUserService currentUserService,
            OpenAIService openAIService,
            ObjectMapper objectMapper
    ) {
        this.meetingNoteRepository = meetingNoteRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.taskRepository = taskRepository;
        this.currentUserService = currentUserService;
        this.openAIService = openAIService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AIAnalysisResponse processMeeting(Long meetingId) {
        User user = currentUserService.getCurrentUser();
        MeetingNote meetingNote = meetingNoteRepository.findByIdAndUserId(meetingId, user.getId())
                .orElseThrow(() -> new ApiException(404, "Meeting note not found"));

        Client client = meetingNote.getClient();
        OpenAIAnalysisResult result = openAIService.analyzeMeetingNotes(
                meetingNote.getRawNotes(),
                client.getName(),
                client.getCompanyName()
        );

        aiAnalysisRepository.deleteByMeetingNoteId(meetingNote.getId());
        taskRepository.deleteByMeetingNoteIdAndUserId(meetingNote.getId(), user.getId());

        AIAnalysis analysis = new AIAnalysis();
        analysis.setSummary(result.summary());
        analysis.setKeyPoints(toJson(result.keyPoints()));
        analysis.setActionItems(toJson(result.actionItems()));
        analysis.setFollowUpEmail(result.followUpEmail());
        analysis.setSentiment(result.sentiment());
        analysis.setPriority(parsePriority(result.priority()));
        analysis.setMeetingNote(meetingNote);
        analysis.setUser(user);

        AIAnalysis savedAnalysis = aiAnalysisRepository.save(analysis);
        createTasksFromActionItems(result.actionItems(), user, client, meetingNote, savedAnalysis.getPriority());

        return toResponse(savedAnalysis);
    }

    public AIAnalysisResponse getAnalysisForMeeting(Long meetingId) {
        User user = currentUserService.getCurrentUser();
        meetingNoteRepository.findByIdAndUserId(meetingId, user.getId())
                .orElseThrow(() -> new ApiException(404, "Meeting note not found"));

        AIAnalysis analysis = aiAnalysisRepository.findByMeetingNoteId(meetingId)
                .orElse(null);

        return analysis != null ? toResponse(analysis) : null;
    }

    private void createTasksFromActionItems(
            List<String> actionItems,
            User user,
            Client client,
            MeetingNote meetingNote,
            TaskPriority priority
    ) {
        if (actionItems == null) {
            return;
        }

        for (String actionItem : actionItems) {
            if (actionItem == null || actionItem.isBlank()) {
                continue;
            }

            Task task = new Task();
            task.setTitle(actionItem.trim());
            task.setDescription("Suggested from AI analysis");
            task.setStatus(TaskStatus.TODO);
            task.setPriority(priority);
            task.setUser(user);
            task.setClient(client);
            task.setMeetingNote(meetingNote);
            taskRepository.save(task);
        }
    }

    private TaskPriority parsePriority(String priority) {
        if (priority == null) {
            return TaskPriority.MEDIUM;
        }
        try {
            return TaskPriority.valueOf(priority.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return TaskPriority.MEDIUM;
        }
    }

    private String toJson(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values != null ? values : Collections.emptyList());
        } catch (JsonProcessingException ex) {
            throw new ApiException(500, "Failed to store AI output");
        }
    }

    private List<String> fromJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException ex) {
            return Collections.emptyList();
        }
    }

    AIAnalysisResponse toResponse(AIAnalysis analysis) {
        return new AIAnalysisResponse(
                analysis.getId(),
                analysis.getMeetingNote().getId(),
                analysis.getSummary(),
                fromJson(analysis.getKeyPoints()),
                fromJson(analysis.getActionItems()),
                analysis.getFollowUpEmail(),
                analysis.getSentiment(),
                analysis.getPriority(),
                analysis.getCreatedAt()
        );
    }
}
