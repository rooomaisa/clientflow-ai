package com.clientflow.service;

import com.clientflow.dto.ClientResponse;
import com.clientflow.dto.DashboardOverviewResponse;
import com.clientflow.dto.DashboardStatsResponse;
import com.clientflow.dto.TaskResponse;
import com.clientflow.entity.ClientStatus;
import com.clientflow.entity.TaskStatus;
import com.clientflow.entity.User;
import com.clientflow.repository.AIAnalysisRepository;
import com.clientflow.repository.ClientRepository;
import com.clientflow.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final TaskRepository taskRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final CurrentUserService currentUserService;
    private final ClientService clientService;
    private final TaskService taskService;

    public DashboardService(
            ClientRepository clientRepository,
            TaskRepository taskRepository,
            AIAnalysisRepository aiAnalysisRepository,
            CurrentUserService currentUserService,
            ClientService clientService,
            TaskService taskService
    ) {
        this.clientRepository = clientRepository;
        this.taskRepository = taskRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.currentUserService = currentUserService;
        this.clientService = clientService;
        this.taskService = taskService;
    }

    public DashboardStatsResponse getStatsForCurrentUser() {
        User user = currentUserService.getCurrentUser();

        return new DashboardStatsResponse(
                clientRepository.countByUserId(user.getId()),
                clientRepository.countByUserIdAndStatus(user.getId(), ClientStatus.ACTIVE),
                taskRepository.countByUserIdAndStatusIn(
                        user.getId(),
                        List.of(TaskStatus.TODO, TaskStatus.IN_PROGRESS)
                ),
                aiAnalysisRepository.countByUserId(user.getId())
        );
    }

    public DashboardOverviewResponse getOverviewForCurrentUser() {
        DashboardStatsResponse stats = getStatsForCurrentUser();

        List<ClientResponse> recentClients = clientService.getAllForCurrentUser().stream()
                .limit(5)
                .toList();

        List<TaskResponse> recentTasks = taskService.getAllForCurrentUser(null, null).stream()
                .limit(5)
                .toList();

        return new DashboardOverviewResponse(stats, recentClients, recentTasks);
    }
}
