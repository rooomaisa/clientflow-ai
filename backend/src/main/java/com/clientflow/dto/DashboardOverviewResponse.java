package com.clientflow.dto;

import java.util.List;

public record DashboardOverviewResponse(
        DashboardStatsResponse stats,
        List<ClientResponse> recentClients,
        List<TaskResponse> recentTasks
) {
}
