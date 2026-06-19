package com.clientflow.config;

import com.clientflow.entity.AIAnalysis;
import com.clientflow.entity.Client;
import com.clientflow.entity.ClientStatus;
import com.clientflow.entity.MeetingNote;
import com.clientflow.entity.Task;
import com.clientflow.entity.TaskPriority;
import com.clientflow.entity.TaskStatus;
import com.clientflow.entity.User;
import com.clientflow.repository.AIAnalysisRepository;
import com.clientflow.repository.ClientRepository;
import com.clientflow.repository.MeetingNoteRepository;
import com.clientflow.repository.TaskRepository;
import com.clientflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@ConditionalOnProperty(name = "app.demo.seed-enabled", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    public static final String DEMO_EMAIL = "demo@clientflow.ai";
    public static final String DEMO_PASSWORD = "DemoClientFlow2025!";
    public static final String DEMO_NAME = "Demo User";

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final MeetingNoteRepository meetingNoteRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(
            UserRepository userRepository,
            ClientRepository clientRepository,
            MeetingNoteRepository meetingNoteRepository,
            AIAnalysisRepository aiAnalysisRepository,
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.meetingNoteRepository = meetingNoteRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(DEMO_EMAIL)) {
            log.info("Demo account already exists — skipping seed");
            return;
        }

        User user = new User();
        user.setName(DEMO_NAME);
        user.setEmail(DEMO_EMAIL);
        user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
        user = userRepository.save(user);

        Client client = new Client();
        client.setName("Sarah Chen");
        client.setCompanyName("Acme Consulting");
        client.setEmail("sarah@acmeconsulting.example");
        client.setPhone("+31 6 12345678");
        client.setNotes("Website redesign retainer — Q1 launch target.");
        client.setStatus(ClientStatus.ACTIVE);
        client.setUser(user);
        client = clientRepository.save(client);

        MeetingNote processedMeeting = new MeetingNote();
        processedMeeting.setTitle("Q1 Strategy Kickoff");
        processedMeeting.setMeetingDate(LocalDate.now().minusDays(3));
        processedMeeting.setRawNotes("""
                Met with Sarah from Acme Consulting about their Q1 website redesign.

                - Timeline: launch by March 15
                - Budget approved for 3-month retainer
                - Weekly check-ins on Fridays
                - Sarah will send brand guidelines by end of week
                - Need to follow up on hosting migration quote
                - Homepage wireframes due next Tuesday
                """);
        processedMeeting.setClient(client);
        processedMeeting.setUser(user);
        processedMeeting = meetingNoteRepository.save(processedMeeting);

        AIAnalysis analysis = new AIAnalysis();
        analysis.setSummary(
                "Acme Consulting approved a Q1 website redesign with a March 15 launch target. "
                        + "A 3-month retainer is confirmed with weekly Friday check-ins. "
                        + "Sarah will share brand guidelines; hosting migration and wireframes are next steps."
        );
        analysis.setKeyPoints("""
                ["March 15 launch target for website redesign","3-month retainer approved","Weekly Friday check-ins agreed","Brand guidelines coming from Sarah","Hosting migration quote needed","Homepage wireframes due next Tuesday"]
                """.trim());
        analysis.setActionItems("""
                ["Send hosting migration quote to Sarah","Schedule recurring Friday check-in","Review brand guidelines when received","Prepare homepage wireframes for next Tuesday"]
                """.trim());
        analysis.setFollowUpEmail("""
                Hi Sarah,

                Great speaking with you today about the Q1 website redesign. To recap: we're targeting a March 15 launch on the approved 3-month retainer, with weekly Friday check-ins.

                I'll send the hosting migration quote shortly and will review your brand guidelines as soon as they arrive. I'll also have homepage wireframes ready for our discussion next Tuesday.

                Best regards
                """.trim());
        analysis.setSentiment("POSITIVE");
        analysis.setPriority(TaskPriority.HIGH);
        analysis.setMeetingNote(processedMeeting);
        analysis.setUser(user);
        aiAnalysisRepository.save(analysis);

        createTask(user, client, processedMeeting, "Send hosting migration quote to Sarah", TaskPriority.HIGH);
        createTask(user, client, processedMeeting, "Schedule recurring Friday check-in", TaskPriority.MEDIUM);
        createTask(user, client, processedMeeting, "Prepare homepage wireframes for next Tuesday", TaskPriority.HIGH);

        MeetingNote unprocessedMeeting = new MeetingNote();
        unprocessedMeeting.setTitle("Discovery Call — Try AI");
        unprocessedMeeting.setMeetingDate(LocalDate.now().minusDays(1));
        unprocessedMeeting.setRawNotes("""
                Quick discovery call with Sarah about analytics setup.

                - Wants Google Analytics 4 connected before launch
                - Asked for a simple monthly traffic report
                - Interested in heatmaps for the homepage
                - Budget discussion deferred to next meeting
                """);
        unprocessedMeeting.setClient(client);
        unprocessedMeeting.setUser(user);
        meetingNoteRepository.save(unprocessedMeeting);

        log.info("Demo account seeded: {} / {}", DEMO_EMAIL, DEMO_PASSWORD);
    }

    private void createTask(User user, Client client, MeetingNote meeting, String title, TaskPriority priority) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription("Suggested from AI analysis");
        task.setStatus(TaskStatus.TODO);
        task.setPriority(priority);
        task.setUser(user);
        task.setClient(client);
        task.setMeetingNote(meeting);
        taskRepository.save(task);
    }
}
