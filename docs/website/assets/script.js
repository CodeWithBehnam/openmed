// Initialize theme functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "light";

  const updateThemeIcon = (theme) => {
    if (!themeIcon) return;
    if (theme === "dark") {
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    } else {
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    }
  };

  if (savedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.classList.toggle("dark") ? "dark" : "light";
      localStorage.setItem("theme", nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  // Clean visual display with syntax highlighting
  const codeContent = {
    python: `<pre><code><span class="keyword">import</span> <span class="function">openmed</span>

<span class="comment"># Quick analysis with smart model suggestions</span>
<span class="variable">text</span> = <span class="string">"Patient received 5mg warfarin for atrial fibrillation."</span>
<span class="variable">result</span> = <span class="function">openmed.analyze_text</span>(<span class="variable">text</span>)

<span class="comment"># Or use the actual HuggingFace model ID</span>
<span class="comment"># result = openmed.analyze_text(text, model_name="...")</span>

<span class="keyword">print</span>(<span class="string">f"Found {len(result.entities)} entities"</span>)
<span class="keyword">print</span>(<span class="string">f"Entities: {result.entities}"</span>)</code></pre>`,
  };

  // Full code for copying (includes installation and comments)
  const codeText = {
    python: `import openmed

# Quick analysis with smart model suggestions
text = "Patient received 5mg warfarin for atrial fibrillation."
result = openmed.analyze_text(text")

print(f"Found {len(result.entities)} entities")
for entity in result.entities:
    print(f"- {entity.text} ({entity.label}): {entity.confidence:.3f}")`,
  };

  let currentTab = "python";
  const codeContainer = document.getElementById("codeContent");
  const codeTabs = document.querySelectorAll(".code-tab");

  const setCodeContent = (tab) => {
    if (!codeContainer || !codeContent[tab]) {
      return;
    }
    currentTab = tab;
    codeContainer.innerHTML = codeContent[tab];
  };

  window.switchTab = (tab, button) => {
    if (!codeContent[tab]) {
      return;
    }

    codeTabs.forEach((tabButton) => {
      if (tabButton.style.display !== "none") {
        tabButton.classList.remove("active");
        tabButton.classList.add("inactive");
      }
    });

    if (button && button.style.display !== "none") {
      button.classList.add("active");
      button.classList.remove("inactive");
    }

    setCodeContent(tab);
  };

  const showCopyFeedback = (button) => {
    if (!button) {
      return;
    }

    if (button.classList.contains("copy-btn")) {
      const originalTitle = button.getAttribute("title");
      if (originalTitle !== null) {
        button.dataset.originalTitle = originalTitle;
      }
      button.setAttribute("title", "Copied!");
      button.classList.add("copied");
      setTimeout(() => {
        button.classList.remove("copied");
        if (button.dataset.originalTitle) {
          button.setAttribute("title", button.dataset.originalTitle);
          delete button.dataset.originalTitle;
        } else {
          button.removeAttribute("title");
        }
      }, 2000);
      return;
    }

    const original = button.innerHTML;
    button.classList.add("copied");
    button.innerHTML = "Copied";
    setTimeout(() => {
      button.classList.remove("copied");
      button.innerHTML = original;
    }, 2000);
  };

  window.copyCode = async (button) => {
    const codeString = codeText[currentTab];
    if (!codeString) {
      console.warn(`No code snippet registered for tab: ${currentTab}`);
      return;
    }

    try {
      await navigator.clipboard.writeText(codeString);
      showCopyFeedback(button);
    } catch (error) {
      console.error("Failed to copy code snippet", error);
      if (button) {
        button.innerHTML = "Copy failed";
      }
    }
  };

  window.copyInstall = async (button) => {
    const codeString = "uv pip install openmed";

    try {
      await navigator.clipboard.writeText(codeString);
      showCopyFeedback(button);
    } catch (error) {
      console.error("Failed to copy install snippet", error);
      if (button) {
        button.innerHTML = "Copy failed";
      }
    }
  };

  setCodeContent(currentTab);
});
