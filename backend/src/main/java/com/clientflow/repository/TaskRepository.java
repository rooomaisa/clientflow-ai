package com.clientflow.repository;

import com.clientflow.entity.Task;
import com.clientflow.entity.TaskPriority;
import com.clientflow.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("""
            SELECT t FROM Task t
            WHERE t.user.id = :userId
            AND (:status IS NULL OR t.status = :status)
            AND (:priority IS NULL OR t.priority = :priority)
            ORDER BY t.updatedAt DESC
            """)
    List<Task> findForUser(
            @Param("userId") Long userId,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority
    );

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    void deleteByMeetingNoteIdAndUserId(Long meetingNoteId, Long userId);
}
