# 3D Devil Imp Avatar

An autonomous 3D animated devil imp character designed for kiosk displays. The imp has advanced AI behaviors, multiple personality modes, and treats the viewport as a barrier it's aware of but cannot break through.

## Project Structure

```
src/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All CSS styling
├── js/
│   ├── config.js       # Application configuration constants
│   ├── audio-manager.js # Audio synthesis and management
│   ├── character-builder.js # 3D character model construction
│   ├── ai-controller.js # AI behavior and personality system
│   ├── devil-imp.js    # Main application class
│   └── main.js         # Application entry point
└── README.md           # This file
```

## Features

### AI Personality System
- **5 distinct moods**: mischievous, angry, playful, menacing, curious
- **4 activity states**: observing, prowling, performing, viewport_interaction
- **Dynamic mood transitions** with weighted probability based on current state
- **Autonomous behavior** - no user input required

### Character Features
- **Fully 3D animated character** with head, body, horns, glowing eyes, limbs, and tail
- **Particle fire effects** surrounding the character
- **Mood-responsive animations** (angry = more intense movement)
- **Speech bubble system** with mood-specific dialogue
- **Realistic blinking** with random timing

### Viewport Awareness
- **Boundary detection** - character knows the limits of its "prison"
- **Viewport interaction mode** - periodically approaches edges and "attacks" the barrier
- **Autonomous exploration** within the confined space
- **No mouse dependency** - perfect for kiosk deployment

### Audio System
- **Procedural audio synthesis** using Web Audio API
- **Multiple sound types**: demonic entry, cackles, attack sounds
- **Mood-responsive audio timing**
- **User activation required** (click to enable sound)

### Visual Effects
- **Gothic styling** with custom fonts and dark themes
- **Atmospheric lighting** that changes based on mood
- **Particle fire system** with realistic physics
- **Fog effects** for enhanced atmosphere
- **CSS animations** for UI elements

## Configuration

All application settings are centralized in `js/config.js`:

- **Rendering settings** (antialiasing, engine options)
- **Scene parameters** (colors, fog, lighting)
- **Character dimensions** and material properties
- **AI behavior timers** and probability weights
- **Audio synthesis parameters**
- **Animation speeds** and intensities

## Usage

1. Open `index.html` in a web browser
2. Wait for the imp to be summoned (2 second delay)
3. Click anywhere to enable audio
4. Watch the autonomous imp behavior

Perfect for:
- Kiosk displays
- Interactive installations
- Digital signage
- Entertainment systems

## Technical Details

- **Framework**: Babylon.js for 3D rendering
- **Audio**: Web Audio API for procedural sound synthesis
- **Architecture**: Modular ES6 classes
- **Dependencies**: Only Babylon.js (loaded from CDN)
- **Browser Support**: Modern browsers with WebGL support

## Development

The code is organized into logical modules:

- `config.js` - Centralized configuration
- `audio-manager.js` - Audio synthesis and playback
- `character-builder.js` - 3D model construction
- `ai-controller.js` - Behavior logic and state management
- `devil-imp.js` - Main orchestration class
- `main.js` - Application bootstrap

Each module has a single responsibility and clear interfaces, making the code maintainable and extensible.