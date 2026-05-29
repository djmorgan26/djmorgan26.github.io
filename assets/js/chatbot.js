/* ============================================================
   Ask David: chat widget (vanilla JS, no deps)
   Talks to the Cloudflare Worker set in #chatbot-root[data-endpoint].
   If the endpoint is missing/placeholder, the widget never appears.
   ============================================================ */
(function () {
  "use strict";

  var root = document.getElementById("chatbot-root");
  if (!root) return;
  var ENDPOINT = (root.getAttribute("data-endpoint") || "").trim();
  // No endpoint configured yet -> hide entirely so the site never breaks.
  if (!ENDPOINT || ENDPOINT.indexOf("REPLACE") !== -1) return;

  var GREETING =
    "Hi, I'm Ask David, an AI guide to David Morgan. Ask me about his work, his projects, what he's looking for, or how to get in touch.";
  var CHIPS = [
    "What does David work on?",
    "Tell me about the quantum starter kit",
    "What roles is he looking for?",
    "How do I reach him?",
  ];

  // ---- icons ----
  var ICON_CHAT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var ICON_TRASH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
  var ICON_SEND =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  // ---- DOM scaffolding ----
  root.innerHTML =
    '<button class="cb-launcher" type="button" aria-label="Open chat, ask about David">' +
    '<span class="cb-launcher-label">Ask about David</span>' +
    '<span class="cb-launcher-btn">' + ICON_CHAT + "</span>" +
    "</button>" +
    '<section class="cb-panel" role="dialog" aria-modal="false" aria-label="Ask David chat" aria-hidden="true">' +
    '<header class="cb-header">' +
    '<span class="cb-avatar">D</span>' +
    '<span class="cb-htext"><span class="cb-title">Ask David</span><span class="cb-status">AI guide · usually instant</span></span>' +
    '<span class="cb-header-actions">' +
    '<button class="cb-icon-btn cb-clear" type="button" aria-label="Clear conversation" title="Clear conversation">' + ICON_TRASH + "</button>" +
    '<button class="cb-icon-btn cb-close" type="button" aria-label="Close chat" title="Close">' + ICON_CLOSE + "</button>" +
    "</span>" +
    "</header>" +
    '<div class="cb-messages" aria-live="polite"></div>' +
    '<div class="cb-chips"></div>' +
    '<form class="cb-composer">' +
    '<textarea class="cb-input" rows="1" placeholder="Ask about David…" aria-label="Type your question"></textarea>' +
    '<button class="cb-send" type="submit" aria-label="Send">' + ICON_SEND + "</button>" +
    "</form>" +
    '<p class="cb-footer-note">AI can be imperfect; for anything important, <a href="mailto:davidjmorgan26@gmail.com">email David</a>.</p>' +
    "</section>";

  var launcher = root.querySelector(".cb-launcher");
  var panel = root.querySelector(".cb-panel");
  var msgsEl = root.querySelector(".cb-messages");
  var chipsEl = root.querySelector(".cb-chips");
  var form = root.querySelector(".cb-composer");
  var input = root.querySelector(".cb-input");
  var sendBtn = root.querySelector(".cb-send");
  var closeBtn = root.querySelector(".cb-close");
  var clearBtn = root.querySelector(".cb-clear");

  // ---- conversation state (this tab/session only) ----
  var messages = loadMsgs(); // [{role, content}]
  var busy = false;

  function loadMsgs() {
    try {
      var raw = sessionStorage.getItem("cb_msgs");
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }
  function persist() {
    try {
      sessionStorage.setItem("cb_msgs", JSON.stringify(messages));
    } catch (e) {}
  }

  // ---- safe rendering helpers ----
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function safeUrl(u) {
    u = String(u || "").trim();
    if (u.charAt(0) === "/" || u.charAt(0) === "#") return u;
    if (/^mailto:/i.test(u)) return u;
    if (/^https?:\/\//i.test(u)) return u;
    return null;
  }
  function extAttr(url) {
    // External links open in a new tab; site-relative + mailto stay in place.
    return /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
  }
  function mdInline(text) {
    var out = esc(text);
    // [label](url)
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, label, url) {
      var s = safeUrl(url);
      return s ? '<a href="' + s + '"' + extAttr(s) + ">" + label + "</a>" : label;
    });
    // **bold**
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return out;
  }
  function renderTextBlocks(raw) {
    var blocks = raw.split(/\n{2,}/);
    var html = "";
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var lines = block.split("\n");
      var bulletLines = lines.filter(function (l) {
        return /^\s*[-*]\s+/.test(l);
      });
      if (bulletLines.length && bulletLines.length === lines.filter(function (l) { return l.trim(); }).length) {
        html += "<ul>" + bulletLines.map(function (l) {
          return "<li>" + mdInline(l.replace(/^\s*[-*]\s+/, "")) + "</li>";
        }).join("") + "</ul>";
      } else if (block.trim()) {
        html += "<p>" + mdInline(block).replace(/\n/g, "<br>") + "</p>";
      }
    }
    return html;
  }
  // Renders bot text + [[button:Label|url]] / [[card:Title|desc|url]] markers.
  // Trailing markers (nothing but whitespace and other markers after) become
  // buttons/cards below the message. Markers mid-sentence become inline links,
  // so a model mistake never leaves a broken fragment like "you can email him at."
  function renderBot(raw) {
    var display = String(raw);
    // Hide an incomplete trailing marker mid-stream so "[[butt" never flashes.
    var lastOpen = display.lastIndexOf("[[");
    if (lastOpen !== -1 && display.indexOf("]]", lastOpen) === -1) {
      display = display.slice(0, lastOpen);
    }
    // Strip Markdown chrome the model sometimes adds even when told not to:
    // - heading lines (### Foo)
    // - solo bold pseudo-headings on their own line (**Foo:**)
    // These render badly in a chat bubble; just drop them, the prose between still works.
    display = display
      .replace(/^[ \t]*#{1,6}[ \t]+.*$/gm, "")
      .replace(/^[ \t]*\*\*[^*\n]+\*\*[ \t]*:?[ \t]*$/gm, "")
      .replace(/\n{3,}/g, "\n\n");
    var cards = [];
    var buttons = [];
    var markerRe = /\[\[(button|card):([^\]]+)\]\]/g;

    // First pass: find every marker and decide button-vs-inline.
    var found = [];
    var m;
    while ((m = markerRe.exec(display))) {
      found.push({ start: m.index, end: markerRe.lastIndex, type: m[1], body: m[2] });
    }
    // A marker is "terminal" if everything after it is whitespace OR another marker.
    var terminalRe = /^(\s*\[\[(?:button|card):[^\]]+\]\]\s*)*$/;
    for (var i = 0; i < found.length; i++) {
      found[i].terminal = terminalRe.test(display.slice(found[i].end));
    }

    // Build the prose: walk through display, emitting markdown-ish text for
    // non-terminal markers (so they stay in the sentence) and dropping
    // terminal ones (they will render below as buttons/cards).
    var prose = "";
    var cursor = 0;
    for (var j = 0; j < found.length; j++) {
      var f = found[j];
      prose += display.slice(cursor, f.start);
      cursor = f.end;
      if (f.terminal) {
        if (f.type === "button") {
          var bp = f.body.split("|");
          if (bp.length >= 2) {
            var bu = safeUrl(bp[1]);
            if (bu) buttons.push({ label: bp[0].trim(), url: bu });
          }
        } else if (f.type === "card") {
          var cp = f.body.split("|");
          if (cp.length >= 3) {
            var cu = safeUrl(cp[2]);
            if (cu) cards.push({ title: cp[0].trim(), desc: cp[1].trim(), url: cu });
          }
        }
        // Drop the marker from the prose; it renders below.
      } else {
        // Inline: keep the sentence whole by emitting a markdown-style link.
        var parts = f.body.split("|");
        if (f.type === "button" && parts.length >= 2) {
          var bu2 = safeUrl(parts[1]);
          if (bu2) prose += "[" + parts[0].trim() + "](" + bu2 + ")";
        } else if (f.type === "card" && parts.length >= 3) {
          var cu2 = safeUrl(parts[2]);
          if (cu2) prose += "[" + parts[0].trim() + "](" + cu2 + ")";
        }
      }
    }
    prose += display.slice(cursor);

    var textOnly = prose
      .replace(/[ \t]+([.,!?;:])/g, "$1")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
    var html = textOnly ? renderTextBlocks(textOnly) : "";
    for (var c = 0; c < cards.length; c++) {
      html +=
        '<a class="cb-card" href="' + cards[c].url + '"' + extAttr(cards[c].url) + ">" +
        '<span class="cb-card-title">' + esc(cards[c].title) + "</span>" +
        '<span class="cb-card-desc">' + esc(cards[c].desc) + "</span></a>";
    }
    if (buttons.length) {
      html += '<div class="cb-actions">';
      for (var b = 0; b < buttons.length; b++) {
        html += '<a class="cb-action-btn" href="' + buttons[b].url + '"' + extAttr(buttons[b].url) + ">" + esc(buttons[b].label) + "</a>";
      }
      html += "</div>";
    }
    return html;
  }

  // ---- message DOM ----
  function addBubble(role, html) {
    var el = document.createElement("div");
    el.className = "cb-msg " + (role === "user" ? "user" : "bot");
    el.innerHTML = html;
    msgsEl.appendChild(el);
    scrollDown();
    return el;
  }
  function scrollDown() {
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function renderChips() {
    chipsEl.innerHTML = "";
    if (messages.length > 0) return; // only show on a fresh conversation
    CHIPS.forEach(function (q, i) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "cb-chip";
      chip.textContent = q;
      chip.style.animationDelay = i * 0.05 + "s";
      var fire = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        // disable so a double-tap can't fire it twice
        for (var k = 0; k < chipsEl.children.length; k++) chipsEl.children[k].disabled = true;
        send(q);
      };
      chip.addEventListener("click", fire);
      chipsEl.appendChild(chip);
    });
  }

  function paintHistory() {
    msgsEl.innerHTML = "";
    addBubble("bot", renderBot(GREETING));
    messages.forEach(function (m) {
      addBubble(m.role, m.role === "user" ? esc(m.content) : renderBot(m.content));
    });
    renderChips();
  }

  // ---- send / stream ----
  function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;

    chipsEl.innerHTML = "";
    addBubble("user", esc(text));
    messages.push({ role: "user", content: text });
    persist();
    input.value = "";
    autoGrow();

    busy = true;
    sendBtn.disabled = true;
    var bubble = addBubble("bot", '<div class="cb-typing"><span></span><span></span><span></span></div>');

    var full = "";
    var rafPending = false;
    function flush() {
      rafPending = false;
      bubble.innerHTML = renderBot(full);
      scrollDown();
    }
    function schedule() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(flush);
    }

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    })
      .then(function (res) {
        var ct = res.headers.get("Content-Type") || "";
        if (!res.ok || ct.indexOf("text/event-stream") === -1) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (j) {
              var msg =
                j.message ||
                "Sorry, I couldn't reach the model just now. Try again in a moment, or email David at davidjmorgan26@gmail.com.";
              bubble.innerHTML = renderBot(msg);
              finish(msg);
            });
        }
        var reader = res.body.getReader();
        var dec = new TextDecoder();
        var buf = "";
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) {
              flush();
              finish(full || "…");
              return;
            }
            buf += dec.decode(r.value, { stream: true });
            var lines = buf.split("\n");
            buf = lines.pop();
            for (var i = 0; i < lines.length; i++) {
              var line = lines[i].trim();
              if (line.indexOf("data:") !== 0) continue;
              var data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              try {
                var j = JSON.parse(data);
                if (typeof j.response === "string") {
                  full += j.response;
                  schedule();
                }
              } catch (e) {}
            }
            return pump();
          });
        }
        return pump();
      })
      .catch(function () {
        bubble.innerHTML = renderBot(
          "Sorry, something went wrong reaching the assistant. Please try again, or email David at davidjmorgan26@gmail.com."
        );
        endBusy();
      });

    function finish(text) {
      messages.push({ role: "assistant", content: text });
      persist();
      endBusy();
    }
    function endBusy() {
      busy = false;
      sendBtn.disabled = false;
    }
  }

  // ---- open / close ----
  function open() {
    root.classList.add("cb-open");
    panel.setAttribute("aria-hidden", "false");
    try {
      localStorage.setItem("cb_open", "1");
    } catch (e) {}
    setTimeout(function () {
      input.focus();
      scrollDown();
    }, 60);
  }
  function close() {
    root.classList.remove("cb-open");
    panel.setAttribute("aria-hidden", "true");
    try {
      localStorage.setItem("cb_open", "0");
    } catch (e) {}
    launcher.querySelector(".cb-launcher-btn").focus();
  }
  function clearChat() {
    messages = [];
    persist();
    paintHistory();
    input.focus();
  }

  // ---- composer behaviour ----
  function autoGrow() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 110) + "px";
  }

  launcher.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  clearBtn.addEventListener("click", clearChat);
  // Close the panel when the user clicks any link inside the chat that
  // causes navigation (action buttons, cards, the footer email link, etc.),
  // so the destination page isn't covered by the auto-restored panel.
  // Exceptions: in-page anchors (#...) and target="_blank" links.
  panel.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#") return;
    if (a.target === "_blank") return;
    close();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    send(input.value);
  });
  input.addEventListener("input", autoGrow);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input.value);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("cb-open")) close();
  });

  // ---- init ----
  paintHistory();
  try {
    if (localStorage.getItem("cb_open") === "1") open();
  } catch (e) {}
})();
