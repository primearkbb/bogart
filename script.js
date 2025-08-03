document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("celestial-container");
  const versionInfoEl = document.getElementById("version-info");

  // Configuration
  const versions = [
    "latest",
    "preview",
    "v26",
    "v25",
    "v24",
    "v23",
    "v22",
    "v21",
    "v20",
    "v19",
    "v18",
    "v17",
    "v16",
    "v15",
    "v14",
    "v13",
    "v12",
    "v11",
    "v10",
    "v9",
    "v8",
    "v7",
    "v6",
    "v5",
    "v4",
    "v3",
    "v2",
    "v1",
  ];
  const starPadding = 60; // Minimum pixels between stars
  const starElements = [];
  let activeStar = null;

  /**
   * Creates and places all stars, ensuring they don't overlap.
   */
  function createCelestialBodies() {
    const placedPositions = [];

    // Place the 'latest' star in the center first
    if (versions.includes("latest")) {
      const latestPosition = {
        x: container.clientWidth / 2,
        y: container.clientHeight / 2,
      };
      createStar("latest", latestPosition);
      placedPositions.push(latestPosition);
    }

    // Place the rest of the stars
    versions.forEach((version) => {
      if (version === "latest") return;

      let position;
      let attempts = 0;
      do {
        position = getRandomPosition();
        attempts++;
      } while (isColliding(position, placedPositions) && attempts < 100);

      createStar(version, position);
      placedPositions.push(position);
    });
  }

  /**
   * Gets a random position within the viewport bounds.
   * @returns {{x: number, y: number}} Position object.
   */
  function getRandomPosition() {
    return {
      x:
        Math.random() * (container.clientWidth - starPadding * 2) + starPadding,
      y:
        Math.random() * (container.clientHeight - starPadding * 2) +
        starPadding,
    };
  }

  /**
   * Checks if a new position is too close to existing ones.
   * @param {{x: number, y: number}} newPos - The new position to check.
   * @param {Array<{x: number, y: number}>} existingPositions - Array of placed stars.
   * @returns {boolean} - True if there is a collision.
   */
  function isColliding(newPos, existingPositions) {
    return existingPositions.some((existingPos) => {
      const dx = newPos.x - existingPos.x;
      const dy = newPos.y - existingPos.y;
      return Math.sqrt(dx * dx + dy * dy) < starPadding;
    });
  }

  /**
   * Creates a single star DOM element.
   * @param {string} version - The version string.
   * @param {{x: number, y: number}} position - The position to place the star.
   */
  function createStar(version, position) {
    const star = document.createElement("button"); // Use <button> for semantics
    star.className = "star";
    star.classList.add(version);
    star.dataset.version = version;
    star.setAttribute("aria-label", `Version ${version}`);

    if (position) {
      star.style.left = `${position.x}px`;
      star.style.top = `${position.y}px`;
      // Center the larger touch area on the position
      star.style.transform = "translate(-50%, -50%)";
    }

    container.appendChild(star);
    starElements.push(star);
  }

  /**
   * Handles all click/tap events within the container.
   */
  container.addEventListener("click", (e) => {
    const clickedEl = e.target;

    // Check if the clicked element is a star
    if (clickedEl.classList.contains("star")) {
      const version = clickedEl.dataset.version;

      // If this star is already active, launch it
      if (clickedEl === activeStar) {
        window.location.href = `./app/${version}/src/`;
        return;
      }

      // Deactivate any previously active star
      if (activeStar) {
        activeStar.classList.remove("is-active");
      }

      // Activate the new star
      activeStar = clickedEl;
      activeStar.classList.add("is-active");

      // Show version info
      versionInfoEl.textContent = `Version ${version}`;
      versionInfoEl.classList.add("is-visible");
    } else {
      // If clicking the background, deactivate any star
      if (activeStar) {
        activeStar.classList.remove("is-active");
        activeStar = null;
        versionInfoEl.classList.remove("is-visible");
      }
    }
  });

  // Initialize the cosmos
  createCelestialBodies();
});
