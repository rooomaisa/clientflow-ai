package com.clientflow.service;

import com.clientflow.dto.TaskRequest;
import com.clientflow.dto.TaskResponse;
import com.clientflow.entity.Client;
import com.clientflow.entity.MeetingNote;
import com.clientflow.entity.Task;
import com.clientflow.entity.TaskPriority;
import com.clientflow.entity.TaskStatus;
import com.clientflow.entity.User;
import com.clientflow.exception.ApiException;
import com.clientflow.repository.ClientRepository;
import com.clientflow.repository.MeetingNoteRepository;
import com.clientflow.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ClientRepository clientRepository;
    private final MeetingNoteRepository meetingNoteRepository;
    private final CurrentUserService currentUserService;

    public TaskService(
            TaskRepository taskRepository,
            ClientRepository clientRepository,
            MeetingNoteRepository meetingNoteRepository,
            CurrentUserService currentUserService
    ) {
        this.taskRepository = taskRepository;
        this.clientRepository = clientRepository;
        this.meetingNoteRepository = meetingNoteRepository;
        this.currentUserService = currentUserService;
    }

    public List<TaskResponse> getAllForCurrentUser(TaskStatus status, TaskPriority priority) {
        User user = currentUserService.getCurrentUser();
        return taskRepository.findForUser(user.getId(), status, priority).stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse createForCurrentUser(TaskRequest request) {
        User user = currentUserService.getCurrentUser();
        Task task = new Task();
        applyRequest(task, request, user);
        task.setUser(user);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateForCurrentUser(Long id, TaskRequest request) {
        Task task = findOwnedTask(id);
        applyRequest(task, request, task.getUser());
        return toResponse(taskRepository.save(task));
    }

    public void deleteForCurrentUser(Long id) {
        Task task = findOwnedTask(id);
        taskRepository.delete(task);
    }

    private Task findOwnedTask(Long id) {
        User user = currentUserService.getCurrentUser();
        return taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(404, "Task not found"));
    }

    private void applyRequest(Task task, TaskRequest request, User user) {
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status() != null ? request.status() : TaskStatus.TODO);
        task.setPriority(request.priority() != null ? request.priority() : TaskPriority.MEDIUM);
        task.setClient(resolveClient(request.clientId(), user.getId()));
        task.setMeetingNote(resolveMeetingNote(request.meetingNoteId(), user.getId()));
    }

    private Client resolveClient(Long clientId, Long userId) {
        if (clientId == null) {
            return null;
        }
        return clientRepository.findByIdAndUserId(clientId, userId)
                .orElseThrow(() -> new ApiException(404, "Client not found"));
    }

    private MeetingNote resolveMeetingNote(Long meetingNoteId, Long userId) {
        if (meetingNoteId == null) {
            return null;
        }
        return meetingNoteRepository.findByIdAndUserId(meetingNoteId, userId)
                .orElseThrow(() -> new ApiException(404, "Meeting note not found"));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getClient() != null ? task.getClient().getId() : null,
                task.getMeetingNote() != null ? task.getMeetingNote().getId() : null,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
