# Project Bogart - Technical Specification V2 - OUTDATED

## Project Purpose

Create an engaging interactive Halloween ghost that delights trick-or-treaters through AI-powered conversation, dynamic visual states, and contextual responses. The system prioritizes entertainment value and reliable magic over technical complexity, designed to be captivating even during conversation failures.

## Core Experience Flow

1. **Ambient Mode**: Ghost displays engaging idle behaviors with environmental responses
1. **Detection**: Motion triggers animated greeting and conversation initiation
1. **Conversation**: AI engages with natural dialogue, updating visual state dynamically
1. **Visual Context**: Costume/emotion analysis enhances AI responses (best effort)
1. **Graceful Degradation**: System remains entertaining even if conversation systems fail
1. **Session Recording**: All interactions captured for later review

## Technical Architecture

### **Deployment Model: Local Network Compute + Display Client**

- **Compute Server**: MacBook M4 Pro handles all AI processing, state management, and coordination
- **Display Client**: Raspberry Pi 5 renders ghost, captures media, handles basic interactions
- **Communication**: Direct local network WebSocket connection (sub-20ms latency)
- **Fallback**: Pi operates in standalone mode with pre-programmed behaviors if compute server unavailable

### **MacBook M4 Pro (Compute Server)**

**Core Services:**

- **EVI Manager**: Direct WebSocket connection to Hume EVI
- **State Controller**: SQLite-based state management with AI tool integration
- **Visual Analyzer**: Claude 3.5 Sonnet for costume/context analysis (cached)
- **Asset Server**: Serves ghost animations, audio, and state configurations
- **Session Recorder**: Coordinates and stores all interaction media

**State Management:**

```javascript
// AI-controllable configuration stored in SQLite
{
  mood: “friendly” | “spooky” | “playful” | “excited” | “mysterious”,
  energy_level: 1-10,
  animation_style: “gentle” | “dramatic” | “bouncy” | “eerie”,
  effect_intensity: 1-5,
  ambient_audio: “whispers” | “wind” | “silence” | “music_box”,
  speaking_voice: “warm” | “spooky” | “childlike” | “theatrical”,
  interaction_mode: “active” | “shy” | “bold” | “curious”
}
```

### **Raspberry Pi 5 (Display Client)**

**Responsibilities:**

- **Ghost Renderer**: Real-time SVG/Canvas animation based on received state
- **Media Capture**: Camera and microphone recording
- **Audio Output**: Dual-channel speaker management
- **Motion Detection**: Basic person detection trigger
- **Local Fallback**: Pre-programmed ghost behaviors for offline operation

**Performance Targets:**

- **State Updates**: <50ms from server command to visual change
- **Audio Latency**: <100ms for conversation audio
- **Fallback Activation**: <2s when server unavailable
- **Frame Rate**: Consistent 60fps ghost animation

## Ghost State & Behavior System

### **State-Driven Design**

Instead of combinatorial complexity, the ghost operates on a simple configuration that the AI can modify:

```javascript
// AI updates state via tools, client renders accordingly
updateGhostState({
  mood: “spooky”,
  energy_level: 8,
  animation_style: “dramatic”,
  speaking_voice: “theatrical”
})
```

### **Asset Architecture**

```
/ghost-assets
├── base-ghost.svg (modular SVG with animation layers)
├── animations/
│   ├── gentle/ (low energy movements)
│   ├── dramatic/ (high energy movements)
│   └── bouncy/ (playful movements)
├── effects/
│   ├── glow/ (warmth effects)
│   ├── flicker/ (spooky effects)
│   └── sparkle/ (magical effects)
└── audio/
    ├── ambient/ (background atmosphere)
    ├── reactions/ (gasps, laughs, whispers)
    └── voice-filters/ (real-time voice modulation)
```

### **AI Tool Integration**

```javascript
// EVI tools for state control
const tools = [
  {
    name: “update_ghost_mood”,
    description: “Change ghost’s emotional presentation”,
    parameters: { mood: “string”, energy_level: “number” }
  },
  {
    name: “trigger_ghost_effect”, 
    description: “Add visual effect for emphasis”,
    parameters: { effect: “string”, duration: “number” }
  },
  {
    name: “request_visual_context”,
    description: “Get info about visitors from camera”,
    parameters: { priority: “high|normal|low” }
  }
]
```

## Experience Design Philosophy

### **Engaging Without Conversation**

**Ambient Behaviors (No visitors):**

- Gentle breathing animation
- Occasional environmental responses (wind, distant sounds)
- Subtle mood shifts every 2-3 minutes
- Random “curiosity” animations looking around

**Triggered Behaviors (Motion detected):**

- Animated greeting sequence (wave, bow, surprise)
- Attempts conversation but gracefully handles failures
- Visual reactions to movement and sounds
- “Personality quirks” independent of AI responses

**Conversation Enhancement:**

- AI updates visual state to match conversational tone
- Real-time costume recognition influences responses
- Emotional voice modulation based on detected visitor mood
- State persists briefly for follow-up interactions

### **Failure Modes & Graceful Degradation**

```
Conversation Failed → Pre-recorded personality responses
Visual Analysis Failed → Generic friendly responses  
Server Disconnected → Pi fallback mode with preset behaviors
Audio Issues → Text display with visual emphasis
All Systems Failed → Basic motion-triggered animations
```

## Implementation Phases

### **Phase 1: Core Infrastructure (Week 1)**

- MacBook server with basic state management
- Pi client with ghost rendering
- Local WebSocket communication
- SQLite state storage

**Deliverable**: Ghost displays and responds to state changes from server

### **Phase 2: Conversation Integration (Week 2)**

- EVI WebSocket connection on server
- Basic conversation with visual state updates
- Audio streaming to Pi speakers
- Simple motion detection trigger

**Deliverable**: Ghost can have basic conversations with visual reactions

### **Phase 3: Visual Context & Polish (Week 3)**

- Camera integration and visual analysis
- Enhanced ghost behaviors and animations
- Session recording and media management
- Failure mode handling and graceful degradation

**Deliverable**: Production-ready Halloween installation

## Hardware Configuration

### **MacBook M4 Pro Setup**

- **Role**: Primary compute server
- **Services**: EVI, Claude API, state management, asset serving
- **Network**: Ethernet connection for stability
- **Storage**: Local SSD for assets and recordings

### **Raspberry Pi 5 Setup**

- **Role**: Display client and media capture
- **Camera**: Pi Camera Module 3 for visual context
- **Audio**: USB audio interface with dual speakers
- **Display**: HDMI output for ghost projection/display
- **Storage**: 64GB SD card (recordings sync to MacBook)
- **Network**: Wired Ethernet to MacBook network

### **Network Architecture**

```
Internet → MacBook M4 Pro ←→ Local Network ←→ Raspberry Pi 5
           (EVI, Claude APIs)    (WebSocket)     (Display Client)
```

## File Structure

```
/project-bogart
├── /server (MacBook M4 Pro)
│   ├── /src
│   │   ├── evi-manager.js
│   │   ├── state-controller.js
│   │   ├── visual-analyzer.js
│   │   └── websocket-server.js
│   ├── /assets (SQLite + media files)
│   └── /recordings (session captures)
├── /client (Raspberry Pi 5) 
│   ├── /src
│   │   ├── ghost-renderer.js
│   │   ├── websocket-client.js
│   │   ├── motion-detector.js
│   │   └── fallback-behaviors.js
│   └── /assets (local ghost assets)
└── /shared
    ├── state-schema.js
    └── communication-protocol.js
```

This architecture delivers a magical, reliable Halloween experience that prioritizes delight over complexity while maintaining the extensibility and AI-driven interactivity you envisioned.​​​​​​​​​​​​​​​​