(() => {
  const list = document.querySelector("#soundtrack-list");
  const count = document.querySelector("[data-track-count]");
  const nowTitle = document.querySelector("[data-now-title]");
  const nowSubtitle = document.querySelector("[data-now-subtitle]");

  if (!list || !count || !nowTitle || !nowSubtitle) return;

  let tracks = [];

  const setActiveTrack = (state) => {
    for (const item of list.querySelectorAll(".soundtrack-item")) {
      const isCurrent = item.dataset.trackId === state.id;
      item.classList.toggle("is-current", isCurrent);
      item.classList.toggle("is-playing", isCurrent && state.isPlaying);

      const button = item.querySelector("button");
      const icon = item.querySelector(".track-action-icon");
      button.setAttribute("aria-pressed", isCurrent && state.isPlaying ? "true" : "false");
      button.setAttribute(
        "aria-label",
        isCurrent && state.isPlaying ? `正在播放${state.title}` : `播放${item.dataset.trackTitle}`
      );
      icon.textContent = isCurrent && state.isPlaying ? "Ⅱ" : "▶";
    }

    const activeTrack = tracks.find((track) => track.id === state.id);
    if (activeTrack) {
      nowTitle.textContent = activeTrack.title;
      nowSubtitle.textContent = activeTrack.subtitle;
    }
  };

  const createTrackItem = (track, index) => {
    const item = document.createElement("article");
    item.className = "soundtrack-item";
    item.dataset.trackId = track.id;
    item.dataset.trackTitle = track.title;

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `播放${track.title}`);
    button.setAttribute("aria-pressed", "false");

    const number = document.createElement("span");
    number.className = "track-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const action = document.createElement("span");
    action.className = "track-action";
    action.setAttribute("aria-hidden", "true");
    const icon = document.createElement("i");
    icon.className = "track-action-icon";
    icon.textContent = "▶";
    action.appendChild(icon);

    const copy = document.createElement("span");
    copy.className = "track-copy";
    const title = document.createElement("b");
    title.textContent = track.title;
    const subtitle = document.createElement("small");
    subtitle.textContent = `${track.subtitle} · ${track.scene}`;
    copy.append(title, subtitle);

    const duration = document.createElement("time");
    duration.textContent = track.duration;

    button.append(number, action, copy, duration);
    button.addEventListener("click", () => {
      window.YexipuMusic?.playTrack(track);
    });
    item.appendChild(button);
    return item;
  };

  const loadTracks = async () => {
    try {
      const response = await fetch("./audio/soundtracks.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      tracks = await response.json();
      if (!Array.isArray(tracks) || tracks.length === 0) throw new Error("Empty soundtrack list");

      list.replaceChildren(...tracks.map(createTrackItem));
      count.textContent = `${String(tracks.length).padStart(2, "0")} TRACK${tracks.length === 1 ? "" : "S"}`;
      setActiveTrack(window.YexipuMusic?.getState() ?? { id: tracks[0].id, isPlaying: false });
    } catch {
      list.textContent = "原声目录暂时无法载入，请稍后再试。";
      list.classList.add("has-error");
    }
  };

  document.addEventListener("yexipu:music-state", (event) => setActiveTrack(event.detail));
  loadTracks();
})();
