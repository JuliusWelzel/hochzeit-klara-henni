// Countdown bis zum Hochzeitstag: 05.11.2027 (MEZ, UTC+1)
(function () {
  var target = new Date("2027-11-05T00:00:00+01:00").getTime();
  var el = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs")
  };
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    var s = Math.floor(diff / 1000);
    el.d.textContent = Math.floor(s / 86400);
    el.h.textContent = pad(Math.floor((s % 86400) / 3600));
    el.m.textContent = pad(Math.floor((s % 3600) / 60));
    el.s.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);
})();
