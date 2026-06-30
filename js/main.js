// ===== ТАЙМЕР ОБРАТНОГО ОТСЧЁТА =====
const weddingDate = new Date("2026-11-07T15:30:00").getTime();

function updateTimer() {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const newDays = String(days).padStart(2, "0");
  const newHours = String(hours).padStart(2, "0");
  const newMinutes = String(minutes).padStart(2, "0");
  const newSeconds = String(seconds).padStart(2, "0");

  if (secondsEl.textContent !== newSeconds) {
    secondsEl.classList.add("flip");
    setTimeout(() => secondsEl.classList.remove("flip"), 150);
  }

  daysEl.textContent = newDays;
  hoursEl.textContent = newHours;
  minutesEl.textContent = newMinutes;
  secondsEl.textContent = newSeconds;
}

updateTimer();
setInterval(updateTimer, 1000);

// ===== SCROLL REVEAL =====
const sections = document.querySelectorAll("section");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  },
);

sections.forEach((section) => {
  if (!section.classList.contains("hero")) {
    revealObserver.observe(section);
  }
});

// ===== НАВИГАЦИЯ ТОЧКАМИ =====
const navDots = document.querySelectorAll(".nav-dot");

navDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const sectionIds = ["hero", "countdown", "invitation", "venue", "details"];

// Навигация (ваш существующий код)
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navDots.forEach((dot) => {
          dot.classList.toggle("active", dot.dataset.target === id);
        });
      }
    });
  },
  { threshold: 0.4 },
);

const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      } else {
        entry.target.classList.remove("animate");
      }
    });
  },
  { threshold: 0.2 },
);

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    navObserver.observe(el);
    animObserver.observe(el);
  }
});
