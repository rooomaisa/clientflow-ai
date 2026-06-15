package com.clientflow.repository;

import com.clientflow.entity.AIAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {

    Optional<AIAnalysis> findByMeetingNoteId(Long meetingNoteId);

    void deleteByMeetingNoteId(Long meetingNoteId);

    long countByUserId(Long userId);
}
