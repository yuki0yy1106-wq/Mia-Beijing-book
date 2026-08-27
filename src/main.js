import { mountApp } from "./app.js";

// 调试热区：在网址后加 ?debug（如 http://localhost:8000/?debug）
if (new URLSearchParams(location.search).has("debug")) {
  document.body.classList.add("debug-hotspots");
}

const root = document.getElementById("app");
mountApp(root);
