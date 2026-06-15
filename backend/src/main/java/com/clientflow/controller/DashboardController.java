package com.clientflow.controller;

import com.clientflow.dto.DashboardOverviewResponse;
import com.clientflow.dto.DashboardStatsResponse;
import com.clientflow.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardStatsResponse getStats() {
        return dashboardService.getStatsForCurrentUser();
    }

    @GetMapping("/overview")
    public DashboardOverviewResponse getOverview() {
        return dashboardService.getOverviewForCurrentUser();
    }
}
