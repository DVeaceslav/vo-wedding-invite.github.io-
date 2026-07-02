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

const sectionIds = [
  "hero",
  "invitation",
  "countdown",
  "venue",
  "details",
  "rsvp",
];

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

// ===== ПОДТВЕРЖДЕНИЕ ПРИСУТСТВИЯ (RSVP) =====
// Данные отправляются в Google Форму. Ответы попадают в ту же таблицу,
// что и при прямом заполнении формы.
const RSVP_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSeyxwketTwCuAO14ZFeY7gr5jo5Sx2Wdt0wMUULy82j35tS4A/formResponse";

const RSVP_ENTRIES = {
  name: "entry.772079551",
  attendance: "entry.1225112730",
  comment: "entry.1770989343",
};

const rsvpForm = document.getElementById("rsvp-form");

if (rsvpForm) {
  const status = document.getElementById("rsvp-status");
  const submitBtn = rsvpForm.querySelector(".rsvp-submit");

  const fieldOf = (input) => input.closest(".rsvp-field");

  const clearErrors = () => {
    rsvpForm
      .querySelectorAll(".rsvp-field.invalid")
      .forEach((f) => f.classList.remove("invalid"));
  };

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    status.textContent = "";
    status.className = "rsvp-status";

    const nameInput = rsvpForm.elements["name"];
    const attendance = rsvpForm.elements["attendance"];
    const commentInput = rsvpForm.elements["comment"];

    const name = nameInput.value.trim();
    const attendanceValue = attendance.value;
    let valid = true;

    if (!name) {
      fieldOf(nameInput).classList.add("invalid");
      valid = false;
    }
    if (!attendanceValue) {
      fieldOf(attendance[0]).classList.add("invalid");
      valid = false;
    }

    if (!valid) {
      status.textContent = "Пожалуйста, заполните обязательные поля.";
      status.classList.add("error");
      return;
    }

    const data = new FormData();
    data.append(RSVP_ENTRIES.name, name);
    data.append(RSVP_ENTRIES.attendance, attendanceValue);
    data.append(RSVP_ENTRIES.comment, commentInput.value.trim());

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем…";

    // Google Формы не отдают CORS-заголовки, поэтому используем no-cors.
    // Ответ будет непрозрачным (opaque), но запись пройдёт успешно.
    fetch(RSVP_ACTION, {
      method: "POST",
      mode: "no-cors",
      body: data,
    })
      .then(() => {
        rsvpForm.classList.add("sent");
        const isYes = attendanceValue.startsWith("Да");
        status.textContent = isYes
          ? "Спасибо! Будем рады видеть вас на нашем празднике."
          : "Спасибо за ответ! Будем скучать по вам.";
        status.classList.add("success");
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить";
        status.textContent =
          "Не удалось отправить. Проверьте соединение и попробуйте ещё раз.";
        status.classList.add("error");
      });
  });

  rsvpForm.addEventListener("input", (e) => {
    const field = e.target.closest(".rsvp-field");
    if (field) field.classList.remove("invalid");
  });
}
