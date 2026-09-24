(() => {
  const STORAGE_KEY = "yexipu-theme-music";

  const control = document.createElement("div");
  control.className = "music-control";
  control.innerHTML = `
    <audio class="theme-audio" src="./audio/yexipu-theme.mp3" autoplay loop preload="metadata"></audio>
    <button class="music-toggle" type="button" aria-label="播放游戏原声" aria-pressed="false" aria-describedby="music-track-name">
      <span class="music-disc" aria-hidden="true"><i></i></span>
      <span class="music-copy">
        <small id="music-track-name">《叶子戏》·《叶戏谱》游戏主题曲</small>
        <b>播放游戏原声</b>
      </span>
      <span class="music-bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
  `;

  document.body.appendChild(control);

  const audio = control.querySelector(".theme-audio");
  const button = control.querySelector(".music-toggle");
  const trackName = control.querySelector("#music-track-name");
  const stateText = control.querySelector(".music-copy b");
  let needsGesture = false;
  let hasError = false;
  let gestureFallbackArmed = false;
  let currentTrack = {
    id: "ye-zi-xi",
    title: "叶子戏",
    subtitle: "游戏主题曲",
    src: "./audio/yexipu-theme.mp3"
  };

  audio.volume = 0.45;

  const updateState = () => {
    const isPlaying = !audio.paused && !audio.ended;
    control.classList.toggle("is-playing", isPlaying);
    button.setAttribute("aria-pressed", isPlaying ? "true" : "false");

    const label = hasError
      ? "游戏原声暂不可用"
      : needsGesture
        ? "点击继续播放"
        : isPlaying
          ? "关闭游戏原声"
          : "播放游戏原声";

    button.setAttribute("aria-label", label);
    stateText.textContent = label;
    button.disabled = hasError;

    document.dispatchEvent(new CustomEvent("yexipu:music-state", {
      detail: {
        id: currentTrack.id,
        title: currentTrack.title,
        src: currentTrack.src,
        isPlaying
      }
    }));
  };

  const disarmGestureFallback = () => {
    if (!gestureFallbackArmed) return;
    document.removeEventListener("click", resumeFromGesture, true);
    document.removeEventListener("keydown", resumeFromGesture, true);
    gestureFallbackArmed = false;
  };

  const resumeFromGesture = async (event) => {
    if (control.contains(event.target) || event.target.closest?.("#soundtrack-list")) return;
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

  const playTrack = async (track) => {
    if (!track?.id || !track?.title || !track?.src) return;

    const isNewTrack = currentTrack.id !== track.id || audio.getAttribute("src") !== track.src;

    if (!isNewTrack && !audio.paused) {
      audio.pause();
      needsGesture = false;
      disarmGestureFallback();
      window.localStorage.setItem(STORAGE_KEY, "off");
      updateState();
      return;
    }

    currentTrack = { ...track };
    trackName.textContent = `《${track.title}》· ${track.subtitle ?? "叶戏谱游戏原声"}`;
    hasError = false;
    button.disabled = false;

    if (isNewTrack) {
      audio.pause();
      audio.src = track.src;
      audio.load();
    }

    await playMusic();
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

  window.YexipuMusic = {
    playTrack,
    getState: () => ({
      id: currentTrack.id,
      title: currentTrack.title,
      src: currentTrack.src,
      isPlaying: !audio.paused && !audio.ended
    })
  };

  if (window.localStorage.getItem(STORAGE_KEY) === "off") {
    updateState();
  } else {
    playMusic();
  }
})();
