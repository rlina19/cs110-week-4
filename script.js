const storyMap = {
  "chapter-1": {
    title: "The first clue has appeared",
    text: "The rotten food inside the fridge is the core of its power. Every moldy bite intensifies the reach of the corruption.",
    objective: "The rotten core is spreading. Mr. Clean must investigate the source.",
    progress: "34%"
  },
  "chapter-2": {
    title: "The weapon is hidden in plain sight",
    text: "Mr. Clean discovers that only the Arm & Hammer can break the curse, because the toxin fears pure cleaning strength and a crushing final strike.",
    objective: "Mr. Clean searches the ruins for the legendary Arm & Hammer.",
    progress: "68%"
  },
  "chapter-3": {
    title: "The clean sweep begins",
    text: "He races through the nightmare, gathering resolve and preparing a final blow that will restore peace to the kitchen and beyond.",
    objective: "The final battle begins. One strike can save the world from the rot.",
    progress: "100%"
  }
};

const choiceMap = {
  investigate: {
    text: "Mr. Clean follows the smell of decay and realizes the rotten food is the engine of the fridge.",
    title: "Current objective"
  },
  weapon: {
    text: "He uncovers the legend of the Arm & Hammer and knows the battle can only be won with that weapon.",
    title: "Weapon found"
  },
  battle: {
    text: "The final clash has begun. The fridge’s rot will fall only to a clean, crushing strike from Mr. Clean.",
    title: "Battle ready"
  }
};

const revealTitle = document.getElementById("storyRevealTitle");
const revealText = document.getElementById("storyRevealText");
const questTitle = document.getElementById("questTitle");
const storyStatus = document.getElementById("storyStatus");
const storyProgress = document.getElementById("storyProgress");
const decisionText = document.getElementById("decisionText");

const updateStoryState = (chapterName) => {
  if (!storyMap[chapterName]) return;

  const data = storyMap[chapterName];

  if (storyStatus) storyStatus.textContent = data.objective;
  if (storyProgress) storyProgress.style.width = data.progress;
  if (questTitle) questTitle.textContent = data.title;

  const activeChoiceButton = document.querySelector(".decision-button.active");
  if (activeChoiceButton) {
    const choiceKey = activeChoiceButton.dataset.choice;
    if (choiceMap[choiceKey]) {
      if (decisionText) decisionText.textContent = choiceMap[choiceKey].text;
      if (questTitle) questTitle.textContent = choiceMap[choiceKey].title;
    }
  }
};

if (revealTitle && revealText) {
  const triggerButtons = document.querySelectorAll(".chapter-trigger, .snippet");
  triggerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.story;
      if (!key || !storyMap[key]) return;

      revealTitle.textContent = storyMap[key].title;
      revealText.textContent = storyMap[key].text;

      document.querySelectorAll(".snippet").forEach((card) => {
        card.style.borderColor = "rgba(255, 255, 255, 0.08)";
      });

      const selectedCard = document.querySelector(`.snippet[data-story="${key}"]`);
      if (selectedCard) {
        selectedCard.style.borderColor = "rgba(140, 229, 216, 0.8)";
      }
    });
  });
}

const storyButtons = document.querySelectorAll(".story-button");
const storyPanels = document.querySelectorAll(".story-panel");

storyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panelName = button.dataset.story;

    storyButtons.forEach((item) => item.classList.toggle("active", item === button));
    storyPanels.forEach((panel) =>
      panel.classList.toggle("active", panel.dataset.story === panelName)
    );

    updateStoryState(panelName);
  });
});

const decisionButtons = document.querySelectorAll(".decision-button");
decisionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    decisionButtons.forEach((item) => item.classList.toggle("active", item === button));

    const choice = button.dataset.choice;
    if (choiceMap[choice] && decisionText) {
      decisionText.textContent = choiceMap[choice].text;
      if (questTitle) questTitle.textContent = choiceMap[choice].title;
    }
  });
});

updateStoryState("chapter-1");
