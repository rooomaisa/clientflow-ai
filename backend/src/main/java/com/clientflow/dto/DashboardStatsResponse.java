package com.clientflow.dto;

public record DashboardStatsResponse(
        long totalClients,
        long activeClients,
        long openTasks,
        long aiProcessedCount
) {
}
