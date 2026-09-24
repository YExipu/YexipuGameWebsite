(() => {
  const STORAGE_KEY = "yexipu-theme-music";

  const control = document.createElement("div");
  control.className = "music-control";
  control.innerHTML = `
    <audio class="theme-audio" src="./audio/yexipu-theme.mp3" autoplay loop preload="metadata"></audio>
    <button class="music-toggle" type="button" aria-label="播放主题曲" aria-pressed="false" aria-describedby="music-track-name">
      <span class="music-disc" aria-hidden="true"><i></i></span>
      <span class="music-copy">
        <small id="music-track-name">《闹天宫》·《叶戏谱》主题曲</small>
        <b>播放主题曲</b>
      </span>
      <span class="music-bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
  `;

  document.body.appendChild(control);

  const audio = control.querySelector(".theme-audio");
  const button = control.querySelector(".music-toggle");
  const stateText = control.querySelector(".music-copy b");
  let needsGesture = false;
  let hasError = false;
  let gestureFallbackArmed = false;

  audio.volume = 0.45;

  const updateState = () => {
    const isPlaying = !audio.paused && !audio.ended;
    control.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-pressed", isPlaying ? "true" : "false");

    const label = hasError
      ? "主题曲暂不可用"
      : needsGesture
        ? "点击继续播放"
        : isPlaying
          ? "关闭主题曲"
          : "播放主题曲";

    button.setAttribute("aria-label", label);
    stateText.textContent = label;
    button.disabled = hasError;
  };

  const disarmGestureFallback = () => {
    if (!gestureFallbackArmed) return;
    document.removeEventListener("click", resumeFromGesture, true);
    document.removeEventListener("keydown", resumeFromGesture, true);
    gestureFallbackArmed = false;
  };

  const resumeFromGesture = async (event) => {
    if (control.contains(event.target)) return;
    if (!needsGesture || hasError || window.localStorage.getItem(STORAGE_KEY) === "off") return;

    disarmGestureFallback();
    await playMusic();
  };

  const armGestureFallback = () => {
    if (gestureFallbackArmed) return;
    document.addEventListener("click", resumeFromGesture, true);
    document.addEventListener("keydown", resumeFromGesture, true);
    gestureFallbackArmed = true;
  };

  const playMusic = async () => {
    try {
      await audio.play();
      needsGesture = false;
      disarmGestureFallback();
      window.localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      needsGesture = true;
      armGestureFallback();
    }
    updateState();
  };

  button.addEventListener("click", async () => {
    if (hasError) return;

    if (!audio.paused) {
      audio.pause();
      needsGesture = false;
      disarmGestureFallback();
      window.localStorage.setItem(STORAGE_KEY, "off");
      updateState();
      return;
    }

    await playMusic();
  });

  audio.addEventListener("play", updateState);
  audio.addEventListener("pause", updateState);
  audio.addEventListener("error", () => {
    hasError = true;
    updateState();
  });

  if (window.localStorage.getItem(STORAGE_KEY) === "off") {
    updateState();
  } else {
    playMusic();
  }
})();
