package com.clientflow.repository;

import com.clientflow.entity.MeetingNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MeetingNoteRepository extends JpaRepository<MeetingNote, Long> {

    List<MeetingNote> findByClientIdAndUserIdOrderByMeetingDateDesc(Long clientId, Long userId);

    Optional<MeetingNote> findByIdAndUserId(Long id, Long userId);
}
