function updateTimeSpent(skillBox, skillName) {
  const totalKey = `${skillName}-total-minutes`;
  const storedMinutes = parseInt(localStorage.getItem(totalKey) || "0", 10);

  const timeDisplay = skillBox.querySelector(".time-spent");
  timeDisplay.textContent = `Totalt: ${storedMinutes} minutter`;
}

const skills = [
  "Skudd venstre fot",
  "Skudd høyre fot",
  "Kortpasninger venstre",
  "Kortpasninger høyre",
  "Slå innlegg",
  "Dribleløype",
  "Langpasninger",
  "1 mot 1 på liten bane",
  "Triksing",
  "Teknikk",
  "Avslutte innlegg"
];

function getSkillLevel(skillName) {
  return parseInt(localStorage.getItem(`${skillName}-level`) || "3");
}

function setSkillLevel(skillName, level) {
  localStorage.setItem(`${skillName}-level`, level);
}

function renderSkills() {
  const container = document.getElementById("skills-container");
  container.innerHTML = "";

  skills.forEach((skillName) => {
    const skillBox = document.createElement("div");
    skillBox.className = "skill-box";
    
    const timeText = document.createElement("p");
    timeText.className = "time-spent";
    timeText.textContent = "Totalt: 0 minutter";

    const title = document.createElement("h3");
    title.textContent = skillName;
    skillBox.appendChild(title);

    const boxWrapper = document.createElement("div");
    const currentLevel = getSkillLevel(skillName);
    const numBoxes = currentLevel;
    let boxes = [];

    for (let i = 0; i < numBoxes; i++) {
      const btn = document.createElement("button");
      btn.className = "skill-button";
      btn.dataset.skill = skillName;
      btn.dataset.index = i;

      const key = `${skillName}-box-${i}`;
      const isChecked = localStorage.getItem(key) === "true";

      if (isChecked) {
        btn.classList.add("active");
        btn.disabled = true;
      }

      btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) return;

        btn.classList.add("active");
        btn.disabled = true;
       // Oppdater total tid i localStorage
        const totalKey = `${skillName}-total-minutes`;
        const oldTotal = parseInt(localStorage.getItem(totalKey) || "0", 10);
        localStorage.setItem(totalKey, oldTotal + 10);
        updateTotalTime(); 

        updateTimeSpent(skillBox, skillName);
        localStorage.setItem(key, "true");

        const allFilled = Array.from(
          document.querySelectorAll(`[data-skill="${skillName}"]`)
        ).every((b) => b.classList.contains("active"));

        if (allFilled) {
          updateXP(1);
          setTimeout(() => {
            let nextLevel = currentLevel;
            if (currentLevel === 3) nextLevel = 4;
            else if (currentLevel === 4) nextLevel = 5;

            setSkillLevel(skillName, nextLevel);

            for (let j = 0; j < numBoxes; j++) {
              const clearKey = `${skillName}-box-${j}`;
              localStorage.removeItem(clearKey);
            }

            renderSkills();
          }, 1000);
        }
      });

      boxes.push(btn);
      boxWrapper.appendChild(btn);
    }

    skillBox.appendChild(timeText);
    updateTimeSpent(skillBox, skillName);

    skillBox.appendChild(boxWrapper);
    container.appendChild(skillBox);
  });
  updateTotalTime(); 
}

function updateXP(amount) {
    const currentXP = parseInt(localStorage.getItem("xp") || "0", 10);
    const newXP = currentXP + amount;
    const oldLevel = calculateLevel(currentXP);
    const newLevel = calculateLevel(newXP);
  
    localStorage.setItem("xp", newXP);
    updateXPBar();
  
    if (newLevel > oldLevel) {
      showLevelUpEffect(newLevel);
    }
  }

  function showLevelUpEffect(level) {
    const overlay = document.createElement("div");
    overlay.className = "level-up-overlay";
  
    const ball = document.createElement("div");
    ball.className = "golden-ball";
    ball.textContent = level;
  
    overlay.appendChild(ball);
    document.body.appendChild(overlay);
  
    setTimeout(() => {
      overlay.remove();
    }, 2000);
  }

function calculateLevel(xp) {
  let level = 1;
  while ((level * (level - 1)) / 2 <= xp) {
    level++;
  }
  return level - 1;
}

function getTitle(level) {
    if (level >= 21) return "Brian Kristengård";
    if (level >= 19) return "Galaksespiller";
    if (level >= 17) return "Ikon";
    if (level >= 15) return "Stjernespiller";
    if (level >= 13) return "Skjevikas stolthet";
    if (level >= 11) return "Magiker";
    if (level >= 9) return "Treningsmaskin";
    if (level >= 8) return "Lokal juvel";
    if (level >= 6) return "Talent";
    if (level >= 4) return "Ballberører";
    return "Miniputt";
  }

  function getTitleColor(level) {
    if (level >= 21) return "#ffd700";      // Gull
    if (level >= 19) return "#ff6ec7";      // Rosa-lilla
    if (level >= 17) return "#1e90ff";      // Blå
    if (level >= 15) return "#8a2be2";      // Lilla
    if (level >= 13) return "#20b2aa";      // Turkis
    if (level >= 11) return "#2e8b57";      // Grønn
    if (level >= 9)  return "#cd7f32";      // Bronse
    if (level >= 8)  return "#c0c0c0";      // Sølv
    if (level >= 6)  return "#a0522d";      // Brun
    if (level >= 4)  return "#808080";      // Grå
    return "#dcdcdc";                       // Lys grå
}

function updateXPBar() {
  const xp = parseInt(localStorage.getItem("xp") || "0", 10);
  const level = calculateLevel(xp);
  const xpToNext = level + 1;
  const xpThisLevel = xp - (level * (level - 1)) / 2;
  const xpPercent = (xpThisLevel / xpToNext) * 100;
  const brianImg = document.getElementById("brian-img");
if (brianImg) {
  if (level >= 21) {
    brianImg.src = "brian_level21.png";
  } else if (level >= 16) {
    brianImg.src = "brian_level16.png";
  } else if (level >= 11) {
    brianImg.src = "brian_level11.png";
  } else if (level >= 6) {
    brianImg.src = "brian_level6.png";
  } else {
    brianImg.src = "Brian_bilde.png";
  }
}

  document.getElementById("level").textContent = level;
  document.getElementById("xpText").textContent = `${xpThisLevel} / ${xpToNext} XP`;
  document.getElementById("xpFill").style.width = `${xpPercent}%`;
  document.getElementById("titleBox").textContent = getTitle(level);
  document.getElementById("titleBox").style.backgroundColor = getTitleColor(level);
}

document.getElementById("resetButton").addEventListener("click", () => {
  if (confirm("Vil du nullstille alt?")) {
    localStorage.clear();
    location.reload();
  }
});

window.addEventListener("load", () => {
  renderSkills();
  updateXPBar();
  renderBonusTasks();
});

const bonusTasks = [
    { name: "Slå Adrian i crossbar challenge", xp: 5 },
    { name: "Ta ny trikserekord", xp: 5 },
    { name: "Mål på trening", xp: 2 },
    { name: "Assist på trening", xp: 1 },
    { name: "Mål i kamp", xp: 5 },
    { name: "Assist i kamp", xp: 3 }
  ];
  
  function renderBonusTasks() {
    const container = document.getElementById("bonus-container");
    container.innerHTML = "";
  
    bonusTasks.forEach((task, index) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "bonus-task";
  
      const label = document.createElement("span");
      label.textContent = task.name;
  
      const button = document.createElement("button");
      button.className = "bonus-btn";
      button.textContent = "Fullført";
  
      const countKey = `bonus-${task.name}-count`;
      const currentCount = parseInt(localStorage.getItem(countKey) || "0", 10);
  
      const counter = document.createElement("span");
      counter.className = "bonus-count";
      counter.textContent = ` (${currentCount} ganger)`;
  
      button.addEventListener("click", () => {
        const newCount = currentCount + 1;
        localStorage.setItem(countKey, newCount);
        updateXP(task.xp);
        triggerXPAnimation(task.xp);
        renderBonusTasks(); // oppdater visning
      });
  
      taskDiv.appendChild(label);
      taskDiv.appendChild(counter);
      taskDiv.appendChild(button);
      container.appendChild(taskDiv);
    });
  }
  
  function triggerXPAnimation(xpAmount) {
    const anim = document.createElement("div");
    anim.className = "xp-animation";
    anim.textContent = `+${xpAmount} XP!`;
  
    document.body.appendChild(anim);
  
    setTimeout(() => {
      anim.remove();
    }, 1500);
  }

  function updateTotalTime() {
    let total = 0;
    skills.forEach(skill => {
      const key = `${skill}-total-minutes`;
      total += parseInt(localStorage.getItem(key) || "0", 10);
    });
  
    const display = document.getElementById("total-time");
    if (display) {
      display.textContent = `Total treningstid: ${total} minutter`;
    }
  }