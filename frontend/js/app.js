const PLANET_DATA = {
  mercury: {
    name: "Mercury / Merkurius",
    size: "4,879 km",
    distance: "57.9 million km from the Sun",
    fact: "Mercury has the shortest year of any planet, completing one orbit in 88 Earth days.",
  },
  venus: {
    name: "Venus",
    size: "12,104 km",
    distance: "108.2 million km from the Sun",
    fact: "Venus rotates very slowly and in the opposite direction from most planets.",
  },
  earth: {
    name: "Earth / Bumi",
    size: "12,742 km",
    distance: "149.6 million km from the Sun",
    fact: "Earth is the only known planet with liquid surface water and life.",
  },
  mars: {
    name: "Mars",
    size: "6,779 km",
    distance: "227.9 million km from the Sun",
    fact: "Mars is home to Olympus Mons, the largest volcano known in the Solar System.",
  },
  jupiter: {
    name: "Jupiter",
    size: "139,820 km",
    distance: "778.5 million km from the Sun",
    fact: "Jupiter is so large that more than 1,300 Earths could fit inside it.",
  },
  saturn: {
    name: "Saturn",
    size: "116,460 km",
    distance: "1.43 billion km from the Sun",
    fact: "Saturn's bright rings are made mostly of ice particles, rock, and dust.",
  },
  uranus: {
    name: "Uranus",
    size: "50,724 km",
    distance: "2.87 billion km from the Sun",
    fact: "Uranus rotates on its side, making its seasons extremely long.",
  },
};

const targetEntities = document.querySelectorAll(".planet-target");
const infoPanel = document.querySelector("#info-panel");
const trackingStatus = document.querySelector("#tracking-status");
const planetName = document.querySelector("#planet-name");
const planetSize = document.querySelector("#planet-size");
const planetDistance = document.querySelector("#planet-distance");
const planetFact = document.querySelector("#planet-fact");
const planetModels = document.querySelectorAll(".planet-model");

const activeTargets = new Set();
let selectedPlanet = "mercury";

function getViewportScaleMultiplier() {
  const viewportWidth = Math.min(
    window.innerWidth || 1024,
    window.screen?.width || window.innerWidth || 1024,
  );

  if (viewportWidth <= 360) {
    return 2.2;
  }

  if (viewportWidth <= 430) {
    return 2.3;
  }

  if (viewportWidth <= 600) {
    return 2.4;
  }

  if (viewportWidth <= 820) {
    return 2.5;
  }

  return 2.6;
}

function updatePlanetModelScales() {
  const scaleMultiplier = getViewportScaleMultiplier();

  planetModels.forEach((model) => {
    const baseScale = Number(model.dataset.baseScale || 0.36);
    const responsiveScale = (baseScale * scaleMultiplier).toFixed(3);
    model.setAttribute(
      "scale",
      `${responsiveScale} ${responsiveScale} ${responsiveScale}`,
    );
  });
}

function renderPlanetInfo(planetKey) {
  const planet = PLANET_DATA[planetKey];

  if (!planet) {
    return;
  }

  selectedPlanet = planetKey;
  planetName.textContent = planet.name;
  planetSize.textContent = planet.size;
  planetDistance.textContent = planet.distance;
  planetFact.textContent = planet.fact;
}

function showPlanetTarget() {
  const planet = PLANET_DATA[selectedPlanet];
  trackingStatus.textContent = `${planet.name} target detected`;
  trackingStatus.classList.add("is-active");
  renderPlanetInfo(selectedPlanet);
  infoPanel.classList.add("is-visible");
}

function hidePlanetTarget() {
  trackingStatus.textContent = "Scan a planet image";
  trackingStatus.classList.remove("is-active");
  infoPanel.classList.remove("is-visible");
}

targetEntities.forEach((targetEntity) => {
  targetEntity.addEventListener("targetFound", () => {
    const planetKey = targetEntity.dataset.planet;
    activeTargets.add(planetKey);
    renderPlanetInfo(planetKey);
    showPlanetTarget();
    updatePlanetModelScales();
  });

  targetEntity.addEventListener("targetLost", () => {
    activeTargets.delete(targetEntity.dataset.planet);

    if (activeTargets.size === 0) {
      hidePlanetTarget();
      return;
    }

    const [nextPlanet] = activeTargets;
    renderPlanetInfo(nextPlanet);
    showPlanetTarget();
  });
});

renderPlanetInfo(selectedPlanet);
updatePlanetModelScales();

window.addEventListener("resize", updatePlanetModelScales);
window.addEventListener("orientationchange", () => {
  window.setTimeout(updatePlanetModelScales, 250);
});
