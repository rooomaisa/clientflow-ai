package com.clientflow.repository;

import com.clientflow.entity.Client;
import com.clientflow.entity.ClientStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    List<Client> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<Client> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ClientStatus status);
}
