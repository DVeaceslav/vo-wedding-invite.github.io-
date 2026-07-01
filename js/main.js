// ===== ТАЙМЕР ОБРАТНОГО ОТСЧЁТА =====
// Время указано в часовом поясе Кишинёва (UTC+2)
const weddingDate = new Date("2026-11-07T15:30:00+02:00").getTime();

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

  setValue("days", days);
  setValue("hours", hours);
  setValue("minutes", minutes);
  setValue("seconds", seconds);
}

function setValue(id, value) {
  const el = document.getElementById(id);
  const next = String(value).padStart(2, "0");
  if (el.textContent !== next) {
    el.textContent = next;
    el.classList.add("flip");
    setTimeout(() => el.classList.remove("flip"), 150);
  }
}

updateTimer();
setInterval(updateTimer, 1000);

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

const sectionIds = ["hero", "invitation", "countdown", "venue", "details"];

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
        animObserver.unobserve(entry.target);
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
