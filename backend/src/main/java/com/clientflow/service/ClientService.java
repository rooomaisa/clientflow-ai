package com.clientflow.service;

import com.clientflow.dto.ClientRequest;
import com.clientflow.dto.ClientResponse;
import com.clientflow.entity.Client;
import com.clientflow.entity.ClientStatus;
import com.clientflow.entity.User;
import com.clientflow.exception.ApiException;
import com.clientflow.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final CurrentUserService currentUserService;

    public ClientService(ClientRepository clientRepository, CurrentUserService currentUserService) {
        this.clientRepository = clientRepository;
        this.currentUserService = currentUserService;
    }

    public List<ClientResponse> getAllForCurrentUser() {
        User user = currentUserService.getCurrentUser();
        return clientRepository.findByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ClientResponse getByIdForCurrentUser(Long id) {
        Client client = findOwnedClient(id);
        return toResponse(client);
    }

    public ClientResponse createForCurrentUser(ClientRequest request) {
        User user = currentUserService.getCurrentUser();

        Client client = new Client();
        applyRequest(client, request);
        client.setUser(user);

        return toResponse(clientRepository.save(client));
    }

    public ClientResponse updateForCurrentUser(Long id, ClientRequest request) {
        Client client = findOwnedClient(id);
        applyRequest(client, request);
        return toResponse(clientRepository.save(client));
    }

    public void deleteForCurrentUser(Long id) {
        Client client = findOwnedClient(id);
        clientRepository.delete(client);
    }

    private Client findOwnedClient(Long id) {
        User user = currentUserService.getCurrentUser();
        return clientRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(404, "Client not found"));
    }

    private void applyRequest(Client client, ClientRequest request) {
        client.setName(request.name());
        client.setCompanyName(blankToNull(request.companyName()));
        client.setEmail(blankToNull(request.email()));
        client.setPhone(blankToNull(request.phone()));
        client.setNotes(blankToNull(request.notes()));
        if (request.status() != null) {
            client.setStatus(request.status());
        } else if (client.getStatus() == null) {
            client.setStatus(ClientStatus.NEW);
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private ClientResponse toResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getName(),
                client.getCompanyName(),
                client.getEmail(),
                client.getPhone(),
                client.getNotes(),
                client.getStatus(),
                client.getCreatedAt(),
                client.getUpdatedAt()
        );
    }
}
