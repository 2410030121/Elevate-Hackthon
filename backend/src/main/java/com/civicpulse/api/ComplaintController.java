package com.civicpulse.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository repository;

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping("/complaints")
    public Collection<Complaint> all() {
        return repository.findAll();
    }

    @GetMapping("/complaints/stream")
    public SseEmitter stream() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // infinite timeout
        emitters.add(emitter);
        
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));
        
        return emitter;
    }

    private void broadcast(Complaint complaint) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("complaint").data(complaint));
            } catch (Exception e) {
                emitter.completeWithError(e);
                emitters.remove(emitter);
            }
        }
    }

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> create(@RequestBody Complaint c) {
        c.id = "CP-" + (1043 + repository.count());
        if (c.status == null) c.status = "Submitted";
        repository.save(c);
        broadcast(c);
        return ResponseEntity.ok(c);
    }

    @PatchMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> status(@PathVariable String id, @RequestParam String value) {
        Optional<Complaint> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Complaint c = opt.get();
        c.status = value;
        repository.save(c);
        broadcast(c);
        return ResponseEntity.ok(c);
    }

    @GetMapping("/health")
    public Map<String,Object> health() {
        return Map.of("service","CivicPulse API","status","UP","timestamp",new Date().toString());
    }
}
