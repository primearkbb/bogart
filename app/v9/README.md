# Project Bogart - Interactive Ghost Demo

Version: 2.0

Last Updated: June 21, 2025

## Overview

Project Bogart is a lightweight, zero-dependency, interactive web-based character demo. It features a friendly ghost character, “Bogart,” whose appearance, mood, and animations are dynamically controlled by the user through a simple UI. The project is built with vanilla HTML, CSS, and JavaScript, with a strong focus on mobile-first design, fluid animations, and creating a sense of personality.

The primary goal of this project is to serve as a showcase for engaging, state-driven character animation and interaction on the web.

##Core Features

 * **Dynamic Ghost Persona:** The ghost’s mood, color, size, and animation speed are driven by two core stats: Energy and Spookiness.
 * **Interactive Controls:** A clean, mobile-friendly UI allows users to directly trigger actions (like pulse, spooky) and sounds, or adjust the core stats via sliders in a modal panel.
 * **File-Based Audio System:** A simple and robust audio engine plays pre-recorded sound files, allowing for multiple sounds to overlap without interrupting each other.
 * **Idle “Attract” Mode:** After 3 seconds of user inactivity, the UI fades out and the ghost takes on a life of its own, randomly changing its stats and triggering effects to attract user attention. Any screen tap instantly restores the UI.
 * **Full-Screen Effects:** Visual effects like “Sparkle” are designed to fill the entire viewport for a grand, impactful experience.
 * **Mobile-First Responsive Design:** The layout and controls are optimized for mobile devices. A JavaScript-based viewport solution ensures a stable layout, free of “jank” when mobile browser toolbars appear or hide.

## Project Structure

The project consists of three core files:

 * `index.html`: The main HTML document. It contains the structural elements for the ghost, UI controls, modals, and effect containers.
 * `style.css`: Contains all styling, including base layout, ghost design, keyframe animations, and styles for different states (e.g., idle mode). It makes extensive use of CSS Custom Properties (variables) which are manipulated by JavaScript.
 * `script.js`: The “brain” of the project. It handles state management, event listeners, all user interactions, the audio system, the idle mode logic, and dynamically updates the ghost’s appearance by manipulating CSS variables and classes.

## Setup & Requirements

This is a static web project with no build dependencies. It can be run by simply opening `index.html` in a web browser, preferably from a local web server to handle audio requests correctly.

### Crucial Requirement: Audio Assets

The application relies on a set of external audio files. Before deploying or running, you must create a static folder in the same directory as index.html and place the following audio files inside it. The app will fail to play sounds if these are missing.

```
./
├── index.html
├── style.css
├── script.js
└── static/
    ├── boo.mp3
    ├── chime.mp3
    ├── glitch.mp3
    ├── pulse.mp3
    ├── sparkle.mp3
    ├── whisper.mp3
    └── wind.mp3
```

## Code Deep Dive (`script.js`)

The JavaScript is architected around a central state object and a main `updateAppearance()` function.

### State Management

The entire application is driven by a simple state object:

```javascript
const state = {
    mood: ‘friendly’,
    energy: 5,
    spookiness: 5
};
```

This object is the single source of truth. All visual and behavioral changes are derived from these values.

#### The `updateAppearance()` Function

This is the most important function for controlling the ghost’s look and feel. It is called whenever a core st.

It:

 * Determines the current mood string (e.g., “tired”, “playful”) based on the stats.
 * Calculates new visual values (e.g., color, animation speed, scale).
 * Applies these values directly to the DOM, primarily by setting CSS Custom Properties.


```javascript
function updateAppearance() {
    // ...determines mood...

    // Example: Energy affects animation speed and scale
    const energyRatio = state.energy / 10;
    DOMElements.ghostContainer.style.setProperty(‘—idle-speed’, `${10 - energyRatio * 6}s`);
    DOMElements.ghost.style.setProperty(‘—idle-scale’, `${1 + energyRatio * 0.1}`);

    // Example: Spookiness affects color and eye glow
    const spookyRatio = state.spookiness / 10;
    const color = `hsl(...)`; // color is calculated based on spookyRatio
    DOMElements.bodyColorFill.style.setProperty(‘—ghost-color’, color);
    eye.style.boxShadow = `...`; // glow is calculated based on spookyRatio
}
```

### Action & Sound System

 * Actions (`triggerAction()`): To create a visual effect like pulse or spooky, the `triggerAction()` function adds a temporary CSS class to the ghost’s DOM element. An animationend event listener is used to automatically remove the class once the CSS animation completes, making the action a “one-shot” effect.
 * Audio (`playSound()`): To allow for overlapping sounds, the `playSound()` function creates a new Audio object for every call. This is a simple but effective way to ensure that starting a new sound does not cut off any currently playing sounds.

### Idle “Attract” Mode

This system uses `setTimeout` and `setInterval` to function.

 * `resetIdleTimer()`: Any user interaction (click, touch, slider input) calls this function. It clears any existing timer.
 * If 3 seconds pass without any interaction, the `setTimeout` callback executes, calling `enterIdleMode()`.
 * `enterIdleMode()`: This adds the `.is-idle` class to the main container (which hides the UI via CSS) and starts a `setInterval`.
 * The `setInterval` triggers random events (like changing sliders or firing actions) at sporadic intervals to make the ghost feel alive.
 * `exitIdleMode()`: As soon as a user interacts again, `resetIdleTimer()` is called, which immediately calls `exitIdleMode()` to remove the `.is-idle` class and clear the `setInterval`.

## How to Extend the Project

Extending Bogart is straightforward by design.

### How to Add a New Action

 * Add the Button: In `index.html`, add a new button to the control grid with a unique data-action.

```html
<button class=“control-btn” data-action=“giggle”>😂 Giggle</button>
```

 * Create the CSS Animation: In `style.css`, create the keyframes and the corresponding class that will be added to the `.ghost` element.
 
```css
.ghost.giggle {
    animation: giggle-anim 0.5s ease-in-out;
}
@keyframes giggle-anim {
    /* Your animation frames here */
}
```

 * Hook up the Action: The existing event listener in `script.js` will automatically pick up the new button. The `triggerAction(‘giggle’)` call will work without any further changes.

### How to Add a New Sound

 * Add the Button: In `index.html`, add a new button with a data-sound attribute matching the filename (without extension).
 
```html
<button class=“control-btn” data-sound=“laugh”>Laugh</button>
```

 * Add the Asset: Create the `laugh.mp3` file and place it in the `./static/` folder. 
 * That’s it! The existing `playSound()` function in `script.js` will handle the rest.

### How to Change the Ghost’s Appearance

To make a stat affect a new visual property:

 * Go to the `updateAppearance()` function in `script.js`.
 * Calculate a new value based on `state.energy` or `state.spookiness`.
 * Apply that value to a DOM element’s style or a CSS variable.

For example, to make the mouth get wider with more spookiness:

```javascript
function updateAppearance() {
    // ... existing code ...
    const spookyRatio = state.spookiness / 10;
    DOMElements.mouth.style.width = `${25 + spookyRatio * 15}px`;
}
```

