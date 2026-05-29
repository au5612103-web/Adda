/* ═══════════════════════════════════════════════════════════════
   ADDASMRITI ULTRA — PART 2 ADDITIONS
   Injected after </body> via separate <script> tag
   Contains: Story Generator · Adda Room · Audio Engine ·
             Keyboard Shortcuts · Search · Onboarding · PWA utils
═══════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────
   1. GENERATIVE STORY STUDIO (AI-powered, Claude API)
──────────────────────────────────────────────────────────── */
window.StoryStudio = {
  async generate(theme, style, persona) {
    const stylePrompts = {
      tagore: `Write in the lyrical, humanist style of Rabindranath Tagore. Use nature metaphors (rain, river, trees). 
               Weave Bengali phrases naturally. End with a haunting image. 2-3 paragraphs.`,
      ray:    `Write like Satyajit Ray's prose — precise, cinematic, observational. 
               Describe a scene as if through a camera lens. Characters are vivid and ordinary. 2-3 paragraphs.`,
      oral:   `Write as an elder telling a story from memory — conversational, wandering, 
               mixing Bengali and English, starting mid-memory. Warm and personal. 2-3 paragraphs.`,
      haiku:  `Write a sequence of 5 haiku-inspired Bengali verses about this theme. 
               Each should capture a single sensory moment from Kolkata. Brief, piercing.`,
    };
    const systemPrompt = `You are a master Bengali-English literary AI. ${stylePrompts[style] || stylePrompts.oral}
Theme: "${theme}". Set it in Kolkata — specific streets, seasons, smells, sounds.
${persona ? `Voice: inspired by the memories of ${persona}.` : ''}
DO NOT use generic phrases. Be specific: name actual Kolkata locations, real cultural details.
End your response with a single line in Bengali script that captures the essence.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        messages: [{ role: 'user', content: `Write a story about: ${theme}` }],
        system: systemPrompt,
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || 'Story generation failed. Please try again.';
  }
};

/* ────────────────────────────────────────────────────────────
   2. AMBIENT AUDIO ENGINE
──────────────────────────────────────────────────────────── */
window.AudioEngine = (function() {
  let ctx = null, nodes = {}, active = false;

  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { return; }
  }

  function createAmbienceLayer(freq, vol, type = 'sine') {
    if (!ctx) return null;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    return { osc, gain, filter };
  }

  return {
    start() {
      init();
      if (!ctx || active) return;
      active = true;
      nodes.low  = createAmbienceLayer(55, 0.012, 'sine');
      nodes.mid  = createAmbienceLayer(110, 0.008, 'sine');
      nodes.high = createAmbienceLayer(220, 0.004, 'triangle');
      toast('🎵 Ambient soundscape active');
    },
    stop() {
      Object.values(nodes).forEach(n => { try { n.osc.stop(); } catch(e) {} });
      nodes = {}; active = false;
      toast('🔇 Soundscape off');
    },
    toggle() { active ? this.stop() : this.start(); },
    isActive() { return active; }
  };
})();

/* ────────────────────────────────────────────────────────────
   3. GLOBAL KEYBOARD SHORTCUTS
──────────────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const map = {
    '1': 'home', '2': 'record', '3': 'companion',
    '4': 'memory', '5': 'ar', '6': 'impact',
  };
  if (map[e.key]) { go(map[e.key]); return; }
  if (e.key === 'Escape') {
    document.getElementById('arModal').style.display = 'none';
    document.getElementById('onboardingOverlay')?.remove();
    document.getElementById('storyModal')?.remove();
    document.getElementById('addaModal')?.remove();
  }
  if (e.key === 'm' || e.key === 'M') AudioEngine.toggle();
  if (e.key === '?') showKeyboardHelp();
});

function showKeyboardHelp() {
  const existing = document.getElementById('kbHelp');
  if (existing) { existing.remove(); return; }
  const d = document.createElement('div');
  d.id = 'kbHelp';
  d.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);
    padding:2rem 2.5rem;z-index:9999;min-width:340px;box-shadow:0 24px 80px rgba(0,0,0,.8)`;
  d.innerHTML = `
    <div style="font-family:var(--ff-display);font-size:1.4rem;font-weight:700;margin-bottom:1.2rem;color:var(--gold)">⌨️ Keyboard Shortcuts</div>
    ${[['1–6','Navigate screens'],['M','Toggle ambient music'],['Esc','Close modals'],['?','Show/hide this help'],['Enter','Send chat message']].map(([k,v])=>`
    <div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid var(--border);font-size:.85rem">
      <code style="background:var(--ink3);padding:.15rem .5rem;border-radius:4px;color:var(--gold);font-size:.8rem">${k}</code>
      <span style="color:var(--text2)">${v}</span>
    </div>`).join('')}
    <button onclick="document.getElementById('kbHelp').remove()" style="margin-top:1.2rem;background:var(--gold);color:var(--ink);border:none;padding:.5rem 1.4rem;border-radius:50px;font-weight:700;cursor:none;width:100%">Close</button>
  `;
  document.body.appendChild(d);
}

/* ────────────────────────────────────────────────────────────
   4. STORY GENERATOR MODAL (full screen AI studio)
──────────────────────────────────────────────────────────── */
function openStoryStudio() {
  const existing = document.getElementById('storyModal');
  if (existing) { existing.remove(); return; }
  const d = document.createElement('div');
  d.id = 'storyModal';
  d.style.cssText = `position:fixed;inset:0;background:rgba(4,2,10,.96);z-index:9990;
    display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);
    animation:riseIn .3s ease both;`;
  d.innerHTML = `
    <div style="background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);
      width:min(820px,94vw);max-height:88vh;overflow-y:auto;padding:2.5rem;position:relative;">
      <button onclick="document.getElementById('storyModal').remove()" style="position:absolute;top:1rem;right:1rem;background:var(--ink3);border:1px solid var(--border);color:var(--text3);width:32px;height:32px;border-radius:50%;cursor:none;font-size:.9rem">✕</button>
      <div style="font-family:var(--ff-display);font-size:2rem;font-weight:700;margin-bottom:.4rem">
        ✍️ Generative Story <em style="color:var(--gold)">Studio</em>
      </div>
      <p style="color:var(--text3);font-size:.88rem;margin-bottom:2rem">AI composes new stories in the literary tradition of Tagore & Ray — from your preserved memories.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
        <div>
          <label style="font-size:.75rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:.5rem">Theme / Memory Seed</label>
          <textarea id="storyTheme" style="width:100%;background:var(--ink);border:1px solid var(--border);border-radius:var(--r2);padding:1rem;color:var(--text);font-family:var(--ff-body);font-size:.88rem;resize:vertical;min-height:100px;outline:none" placeholder="e.g. A monsoon evening in Shyambazar, 1962. The smell of chai and old books…"></textarea>
        </div>
        <div>
          <label style="font-size:.75rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:.5rem">Literary Style</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem" id="styleGrid">
            ${[['tagore','✦ Tagore','Lyrical & humanist'],['ray','🎬 Satyajit Ray','Cinematic & precise'],['oral','🗣 Oral Tradition','Conversational elder'],['haiku','🌸 Verse Sequence','5 haiku moments']].map(([v,l,s])=>`
            <div onclick="selectStyle(this,'${v}')" data-style="${v}" style="background:var(--ink);border:1px solid var(--border);border-radius:var(--r2);padding:.8rem;cursor:none;transition:all .2s">
              <div style="font-weight:700;font-size:.85rem;margin-bottom:.2rem">${l}</div>
              <div style="font-size:.72rem;color:var(--text3)">${s}</div>
            </div>`).join('')}
          </div>
          <label style="font-size:.75rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:1rem;margin-bottom:.5rem">Voice Persona (optional)</label>
          <select id="storyPersona" style="width:100%;background:var(--ink);border:1px solid var(--border);border-radius:var(--r2);padding:.6rem .9rem;color:var(--text);font-family:var(--ff-body);font-size:.85rem;outline:none">
            <option value="">No specific persona</option>
            <option value="Ramesh Chatterjee">Ramesh Dada (Shyambazar)</option>
            <option value="Kamala Devi">Kamala Dadi (Ballygunge)</option>
            <option value="Subir Bose">Subir Da (College Street)</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1.5rem">
        ${['A monsoon evening on Rabindra Sarani','The last tram leaving Esplanade','An old man feeding pigeons at Maidan','Coffee House at midnight in 1972','A grandmother cooking for Durga Puja'].map(s=>`<button onclick="document.getElementById('storyTheme').value='${s}'" style="background:var(--ink3);border:1px solid var(--border);color:var(--text3);padding:.35rem .85rem;border-radius:50px;font-size:.75rem;cursor:none;transition:all .2s">${s}</button>`).join('')}
      </div>
      <button id="genStoryBtn" onclick="runStoryGen()" style="background:linear-gradient(135deg,var(--gold),var(--ember));color:var(--ink);border:none;padding:.9rem 2.5rem;border-radius:50px;font-family:var(--ff-body);font-weight:700;font-size:.95rem;cursor:none;width:100%;margin-bottom:1.5rem">
        ✍️ Generate Story with Claude AI
      </button>
      <div id="storyOutput" style="display:none;background:var(--ink);border:1px solid var(--border);border-radius:var(--r);padding:2rem">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
          <div style="font-family:var(--ff-display);font-size:1.1rem;font-weight:700;color:var(--gold)" id="storyStyleLabel"></div>
          <div style="display:flex;gap:.5rem">
            <button onclick="copyStory()" style="background:var(--ink3);border:1px solid var(--border);color:var(--text3);padding:.35rem .8rem;border-radius:50px;font-size:.75rem;cursor:none">📋 Copy</button>
            <button onclick="saveStory()" style="background:var(--gold);border:none;color:var(--ink);padding:.35rem .8rem;border-radius:50px;font-size:.75rem;font-weight:700;cursor:none">💾 Save to Archive</button>
          </div>
        </div>
        <div id="storyText" style="font-family:var(--ff-bn);font-size:.95rem;line-height:2;color:var(--text2);white-space:pre-wrap"></div>
      </div>
    </div>`;
  document.body.appendChild(d);
  // default style selection
  selectStyle(d.querySelector('[data-style="tagore"]'), 'tagore');
}

let selectedStyle = 'tagore';
function selectStyle(el, val) {
  document.querySelectorAll('#styleGrid > div').forEach(d => {
    d.style.borderColor = 'var(--border)';
    d.style.background = 'var(--ink)';
  });
  el.style.borderColor = 'var(--gold)';
  el.style.background = 'var(--goldglow)';
  selectedStyle = val;
}

async function runStoryGen() {
  const theme = document.getElementById('storyTheme')?.value?.trim();
  if (!theme) { toast('💡 Enter a theme first!'); return; }
  const btn = document.getElementById('genStoryBtn');
  btn.textContent = '⏳ Claude is composing…';
  btn.style.opacity = '.7';
  btn.disabled = true;
  const persona = document.getElementById('storyPersona')?.value;
  const out = document.getElementById('storyOutput');
  const textEl = document.getElementById('storyText');
  const labelEl = document.getElementById('storyStyleLabel');
  out.style.display = 'none';
  try {
    const story = await StoryStudio.generate(theme, selectedStyle, persona);
    out.style.display = 'block';
    const styleNames = { tagore:'✦ Tagore Style', ray:'🎬 Ray Style', oral:'🗣 Oral Tradition', haiku:'🌸 Verse Sequence' };
    labelEl.textContent = styleNames[selectedStyle] || 'Generated Story';
    // Typewriter effect
    textEl.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      if (i < story.length) { textEl.textContent += story[i]; i++; out.scrollTop = out.scrollHeight; }
      else clearInterval(iv);
    }, 12);
    toast('✍️ Story generated!');
  } catch(e) {
    textEl.textContent = 'Story generation failed. Check your connection and try again.';
    out.style.display = 'block';
  }
  btn.textContent = '✍️ Generate Another Story';
  btn.style.opacity = '1';
  btn.disabled = false;
}

function copyStory() {
  const text = document.getElementById('storyText')?.textContent;
  if (text) { navigator.clipboard?.writeText(text); toast('📋 Copied to clipboard!'); }
}
function saveStory() { toast('💾 Story saved to your archive!'); }

/* ────────────────────────────────────────────────────────────
   5. VIRTUAL ADDA ROOM
──────────────────────────────────────────────────────────── */
function openAddaRoom() {
  const existing = document.getElementById('addaModal');
  if (existing) { existing.remove(); return; }
  const d = document.createElement('div');
  d.id = 'addaModal';
  d.style.cssText = `position:fixed;inset:0;background:rgba(4,2,10,.97);z-index:9990;
    display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);`;
  d.innerHTML = `
    <div style="background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);
      width:min(960px,96vw);max-height:90vh;overflow:hidden;position:relative;display:flex;flex-direction:column">
      <div style="padding:1.5rem 2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <div>
          <div style="font-family:var(--ff-display);font-size:1.5rem;font-weight:700">🏠 Virtual <em style="color:var(--gold)">Adda Room</em></div>
          <div style="font-size:.75rem;color:var(--jade2)">● 4 participants · Kolkata Para Room #7</div>
        </div>
        <button onclick="document.getElementById('addaModal').remove()" style="background:var(--ink3);border:1px solid var(--border);color:var(--text3);width:32px;height:32px;border-radius:50%;cursor:none">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 320px;flex:1;overflow:hidden">
        <div style="display:flex;flex-direction:column;overflow:hidden">
          <!-- Participants -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;padding:1.5rem;border-bottom:1px solid var(--border)">
            ${[
              {e:'👨‍💻',n:'You',loc:'Delhi (joined)',c:'var(--jade)'},
              {e:'👴',n:'Ramesh Dada',loc:'AI Companion',c:'var(--gold)'},
              {e:'👩',n:'Priya',loc:'London',c:'var(--lav2)'},
              {e:'👨',n:'Arjun',loc:'Kolkata',c:'var(--ember2)'},
            ].map(p=>`<div style="background:var(--ink3);border:1px solid var(--border);border-radius:var(--r2);padding:1rem;text-align:center">
              <div style="font-size:2rem;margin-bottom:.4rem">${p.e}</div>
              <div style="font-weight:700;font-size:.85rem;color:${p.c}">${p.n}</div>
              <div style="font-size:.68rem;color:var(--text3)">${p.loc}</div>
              <div style="width:8px;height:8px;border-radius:50%;background:var(--jade);margin:.5rem auto 0;box-shadow:0 0 6px var(--jade)"></div>
            </div>`).join('')}
          </div>
          <!-- Adda chat -->
          <div style="flex:1;overflow-y:auto;padding:1rem 1.5rem;display:flex;flex-direction:column;gap:.8rem" id="addaChat">
            <div style="background:var(--ink3);border-radius:var(--r2);padding:.6rem 1rem;font-size:.72rem;color:var(--text3);text-align:center">Priya started the adda: "Dada, tell us about Durga Puja in your time…"</div>
            <div style="display:flex;gap:.7rem"><div style="font-size:1.3rem">👴</div><div style="background:var(--ink3);border:1px solid var(--border);border-radius:var(--r);padding:.8rem 1.1rem;font-size:.85rem;line-height:1.7;max-width:75%">Arre, Durga Puja! <span style="font-family:var(--ff-bn)">সেই ১৯৬৫ সালের কথা মনে আছে...</span> We stayed up all night. The dhak drums, the smell of dhoop… come, I will tell you everything.</div></div>
            <div style="display:flex;gap:.7rem;flex-direction:row-reverse"><div style="font-size:1.3rem">👩</div><div style="background:var(--goldglow);border:1px solid var(--border2);border-radius:var(--r);padding:.8rem 1.1rem;font-size:.85rem;line-height:1.7;max-width:75%;text-align:right">My grandmother told me about those pandals! She was from North Kolkata too…</div></div>
            <div style="display:flex;gap:.7rem"><div style="font-size:1.3rem">👨</div><div style="background:var(--ink3);border:1px solid var(--border);border-radius:var(--r);padding:.8rem 1.1rem;font-size:.85rem;line-height:1.7;max-width:75%">Dada, what about the prasad? I heard the luchi-alur tarkari was legendary!</div></div>
          </div>
          <!-- Adda input -->
          <div style="padding:1rem 1.5rem;border-top:1px solid var(--border);display:flex;gap:.6rem;flex-shrink:0">
            <input id="addaInput" style="flex:1;background:var(--ink);border:1px solid var(--border);border-radius:var(--r2);padding:.65rem 1.1rem;color:var(--text);font-family:var(--ff-body);font-size:.88rem;outline:none" placeholder="Join the adda…" onkeydown="if(event.key==='Enter')sendAddaMsg()">
            <button onclick="sendAddaMsg()" style="background:var(--gold);color:var(--ink);border:none;padding:.65rem 1.4rem;border-radius:var(--r2);font-family:var(--ff-body);font-weight:700;cursor:none">Send</button>
          </div>
        </div>
        <!-- Right panel -->
        <div style="background:var(--ink3);border-left:1px solid var(--border);overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem">
          <div>
            <div style="font-size:.72rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.8rem">🏘️ Active Rooms</div>
            ${[
              {name:'Shyambazar Para',members:7,topic:'1962 Tram Stories'},
              {name:'Ballygunge Adda',members:4,topic:'Tagore Poetry'},
              {name:'Coffee House',members:12,topic:'Film Discussion'},
              {name:'Durga Puja Nights',members:9,topic:'Festival Memories'},
            ].map(r=>`<div style="background:var(--ink2);border:1px solid var(--border);border-radius:var(--r2);padding:.8rem;margin-bottom:.5rem;cursor:none">
              <div style="font-weight:700;font-size:.82rem;margin-bottom:.2rem">${r.name}</div>
              <div style="font-size:.7rem;color:var(--text3)">${r.members} members · ${r.topic}</div>
              <div style="font-size:.68rem;color:var(--jade2);margin-top:.3rem">● Live</div>
            </div>`).join('')}
          </div>
          <div>
            <div style="font-size:.72rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.8rem">🎙️ Now Playing</div>
            <div style="background:var(--ink2);border:1px solid var(--border);border-radius:var(--r2);padding:.8rem">
              <div style="font-size:.8rem;font-weight:700;margin-bottom:.3rem">Ramesh Dada narrating…</div>
              <div style="font-size:.72rem;color:var(--text3);font-family:var(--ff-bn)">"সেই পুজোর রাতে আমরা পাঁচজন…"</div>
              <div style="height:3px;background:var(--ink);border-radius:2px;margin-top:.7rem;overflow:hidden">
                <div style="width:45%;height:100%;background:var(--gold);border-radius:2px;animation:shimmer 2s linear infinite"></div>
              </div>
            </div>
          </div>
          <button onclick="toast('🎙️ Voice mode coming soon — use text for now!')" style="background:var(--goldglow);border:1px solid var(--border2);color:var(--gold);padding:.6rem;border-radius:var(--r2);font-size:.78rem;font-weight:700;cursor:none;text-align:center">🎤 Join Voice Circle</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(d);
}

function sendAddaMsg() {
  const inp = document.getElementById('addaInput');
  if (!inp || !inp.value.trim()) return;
  const chat = document.getElementById('addaChat');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:.7rem;flex-direction:row-reverse;animation:riseIn .25s ease both';
  div.innerHTML = `<div style="font-size:1.3rem">👨‍💻</div><div style="background:var(--goldglow);border:1px solid var(--border2);border-radius:var(--r);padding:.8rem 1.1rem;font-size:.85rem;line-height:1.7;max-width:75%;text-align:right">${inp.value}</div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  const msg = inp.value;
  inp.value = '';
  // Simulated AI reply
  setTimeout(async () => {
    const thinkDiv = document.createElement('div');
    thinkDiv.style.cssText = 'display:flex;gap:.7rem';
    thinkDiv.innerHTML = `<div style="font-size:1.3rem">👴</div><div style="background:var(--ink3);border:1px solid var(--border);border-radius:var(--r);padding:.9rem 1.2rem;font-size:.85rem">
      <div style="display:flex;gap:.35rem"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>`;
    chat.appendChild(thinkDiv);
    chat.scrollTop = chat.scrollHeight;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: `You are Ramesh Dada in a virtual adda (group conversation). Reply warmly, briefly (2-3 sentences max), in Bengali-English mix. Reference Kolkata culture. Be conversational, like in a group chat.`,
          messages: [{ role: 'user', content: msg }]
        })
      });
      const data = await res.json();
      thinkDiv.querySelector('div:last-child').innerHTML = `<span style="line-height:1.7">${data.content?.[0]?.text || 'Hah, bolo bolo!'}</span>`;
    } catch(e) {
      thinkDiv.querySelector('div:last-child').innerHTML = `<span style="line-height:1.7">Arre, ki bolo! (Tell me more…)</span>`;
    }
  }, 1200);
}

/* ────────────────────────────────────────────────────────────
   6. ONBOARDING TOUR
──────────────────────────────────────────────────────────── */
function startOnboarding() {
  const steps = [
    { target: '#s-home .hero-h1', title: '🏛️ Welcome to AddaSmriti', desc: 'The world\'s first AI-powered oral heritage preservation platform for Kolkata. Let\'s take a quick tour.' },
    { target: '.nav-cta', title: '🎙️ Record Memories', desc: 'Click "Record Now" to open the Voice Studio — capture stories from elders in Bengali, English, or mixed.' },
    { target: '.nl:nth-child(3)', title: '🤖 AI Companion', desc: 'Talk to digital recreations of real Kolkata elders — powered by Claude AI with Bengali NLP.' },
    { target: '.nl:nth-child(4)', title: '✦ Memory Constellation', desc: 'Explore a 3D network of stories, people, places and events — all connected across decades.' },
    { target: '.nl:nth-child(5)', title: '🔮 AR Time Portal', desc: 'Experience Kolkata through different eras — 1940 to 2024 — with story pins anchored to real locations.' },
  ];
  let step = 0;
  function showStep(i) {
    document.getElementById('onboardingOverlay')?.remove();
    if (i >= steps.length) { toast('✅ Tour complete! Press ? for keyboard shortcuts.'); return; }
    const s = steps[i];
    const d = document.createElement('div');
    d.id = 'onboardingOverlay';
    d.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
      background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);
      padding:1.5rem 2rem;z-index:9995;min-width:360px;max-width:480px;
      box-shadow:0 24px 80px rgba(0,0,0,.8);animation:riseIn .3s ease both`;
    d.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.8rem">
        <div style="font-weight:700;font-size:1rem;color:var(--gold)">${s.title}</div>
        <div style="font-size:.72rem;color:var(--text3)">${i+1} / ${steps.length}</div>
      </div>
      <p style="font-size:.85rem;color:var(--text2);line-height:1.6;margin-bottom:1.2rem">${s.desc}</p>
      <div style="height:3px;background:var(--ink3);border-radius:2px;margin-bottom:1.2rem;overflow:hidden">
        <div style="width:${((i+1)/steps.length*100)}%;height:100%;background:var(--gold);border-radius:2px;transition:width .4s ease"></div>
      </div>
      <div style="display:flex;gap:.6rem">
        <button onclick="document.getElementById('onboardingOverlay').remove()" style="flex:1;background:var(--ink3);border:1px solid var(--border);color:var(--text3);padding:.6rem;border-radius:50px;font-size:.8rem;cursor:none">Skip Tour</button>
        <button onclick="showStep(${i+1})" style="flex:2;background:var(--gold);color:var(--ink);border:none;padding:.6rem;border-radius:50px;font-weight:700;font-size:.88rem;cursor:none">${i===steps.length-1?'✅ Finish':'Next →'}</button>
      </div>`;
    document.body.appendChild(d);
  }
  showStep(step);
}

/* ────────────────────────────────────────────────────────────
   7. FLOATING ACTION BUTTONS (bottom-right dock)
──────────────────────────────────────────────────────────── */
function createFABDock() {
  const dock = document.createElement('div');
  dock.style.cssText = `position:fixed;bottom:2rem;right:2rem;display:flex;flex-direction:column;gap:.6rem;z-index:500;align-items:flex-end`;
  const fabs = [
    { icon:'✍️', label:'Story Studio',  action:'openStoryStudio()' },
    { icon:'🏠', label:'Adda Room',     action:'openAddaRoom()' },
    { icon:'🎵', label:'Ambient Sound', action:'AudioEngine.toggle()' },
    { icon:'⌨️', label:'Shortcuts',     action:'showKeyboardHelp()' },
    { icon:'🗺️', label:'Start Tour',   action:'startOnboarding()' },
  ];
  let expanded = false;
  const mainBtn = document.createElement('button');
  mainBtn.style.cssText = `width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--ember));border:none;font-size:1.3rem;cursor:none;box-shadow:0 6px 28px rgba(201,168,76,.4);transition:all .25s;z-index:2;position:relative`;
  mainBtn.textContent = '✦';
  mainBtn.onclick = () => {
    expanded = !expanded;
    mainBtn.style.transform = expanded ? 'rotate(45deg)' : 'rotate(0deg)';
    fabItems.style.display = expanded ? 'flex' : 'none';
  };
  const fabItems = document.createElement('div');
  fabItems.style.cssText = `display:none;flex-direction:column;gap:.5rem;align-items:flex-end`;
  fabs.forEach(f => {
    const row = document.createElement('div');
    row.style.cssText = `display:flex;align-items:center;gap:.7rem;animation:riseIn .2s ease both`;
    const lbl = document.createElement('div');
    lbl.style.cssText = `background:var(--ink2);border:1px solid var(--border);color:var(--text2);
      font-size:.75rem;font-weight:600;padding:.3rem .8rem;border-radius:50px;white-space:nowrap`;
    lbl.textContent = f.label;
    const btn = document.createElement('button');
    btn.style.cssText = `width:42px;height:42px;border-radius:50%;background:var(--ink2);border:1px solid var(--border2);
      font-size:1.05rem;cursor:none;transition:all .2s;`;
    btn.textContent = f.icon;
    btn.setAttribute('onclick', f.action);
    btn.addEventListener('mouseenter', () => { btn.style.background = 'var(--goldglow)'; btn.style.borderColor = 'var(--gold)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'var(--ink2)'; btn.style.borderColor = 'var(--border2)'; });
    row.appendChild(lbl);
    row.appendChild(btn);
    fabItems.appendChild(row);
  });
  dock.appendChild(fabItems);
  dock.appendChild(mainBtn);
  document.body.appendChild(dock);
}

/* ────────────────────────────────────────────────────────────
   8. GLOBAL SEARCH OVERLAY
──────────────────────────────────────────────────────────── */
function openSearch() {
  const existing = document.getElementById('searchOverlay');
  if (existing) { existing.remove(); return; }
  const d = document.createElement('div');
  d.id = 'searchOverlay';
  d.style.cssText = `position:fixed;inset:0;background:rgba(4,2,10,.9);z-index:9980;
    display:flex;flex-direction:column;align-items:center;padding-top:12vh;backdrop-filter:blur(12px)`;
  d.innerHTML = `
    <div style="width:min(640px,90vw);animation:riseIn .25s ease both">
      <div style="display:flex;align-items:center;gap:.8rem;background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r);padding:.9rem 1.3rem;margin-bottom:1.5rem">
        <span style="font-size:1.1rem">🔍</span>
        <input id="globalSearch" autofocus style="flex:1;background:none;border:none;color:var(--text);font-family:var(--ff-body);font-size:1.05rem;outline:none" placeholder="Search stories, people, places, years…" oninput="runSearch(this.value)">
        <button onclick="document.getElementById('searchOverlay').remove()" style="background:none;border:none;color:var(--text3);font-size:.9rem;cursor:none">✕</button>
      </div>
      <div id="searchResults" style="display:flex;flex-direction:column;gap:.5rem"></div>
      <div style="margin-top:1.5rem;font-size:.72rem;color:var(--text4);text-align:center">Press Esc to close · Try "Shyambazar", "1965", "tram", "Tagore"</div>
    </div>`;
  document.body.appendChild(d);
  setTimeout(() => document.getElementById('globalSearch')?.focus(), 100);
}

const SEARCH_INDEX = [
  { type:'Story', icon:'🎙️', title:'Ramesh Dada — Tram Route #7', meta:'Shyambazar · 1962 · 4m23s', action:"go('companion')" },
  { type:'Story', icon:'🎙️', title:'Kamala Dadi — Gulmohar Tree', meta:'Ballygunge · 1960s · 7m02s', action:"go('companion')" },
  { type:'Story', icon:'🎙️', title:'Subir Da — Coffee House Nights', meta:'College Street · 1968 · 5m44s', action:"go('companion')" },
  { type:'Place',  icon:'📍', title:'Shyambazar Five-Point', meta:'North Kolkata · 47 stories', action:"go('ar')" },
  { type:'Place',  icon:'📍', title:'Howrah Bridge', meta:'Landmark · 12 stories · AR view', action:"go('ar')" },
  { type:'Place',  icon:'📍', title:'Coffee House, College Street', meta:'Cultural hub · 34 stories', action:"go('memory')" },
  { type:'Event',  icon:'🎉', title:'Durga Puja 1965', meta:'North Kolkata · 18 stories', action:"go('memory')" },
  { type:'Cultural',icon:'🚊',title:'Tram Culture of Kolkata', meta:'1940–1995 · 19 stories', action:"go('memory')" },
  { type:'Person', icon:'👴', title:'Ramesh Chatterjee, 82', meta:'AI Companion · 47 stories', action:"go('companion')" },
  { type:'Screen', icon:'✍️', title:'Story Generator Studio', meta:'AI-powered Tagore/Ray styles', action:"openStoryStudio()" },
  { type:'Screen', icon:'🌌', title:'Memory Constellation', meta:'3D interactive story network', action:"go('memory')" },
  { type:'Screen', icon:'🔮', title:'AR Time Portal', meta:'1940–2024 Kolkata', action:"go('ar')" },
];
function runSearch(q) {
  const el = document.getElementById('searchResults');
  if (!q) { el.innerHTML = ''; return; }
  const hits = SEARCH_INDEX.filter(r =>
    r.title.toLowerCase().includes(q.toLowerCase()) ||
    r.meta.toLowerCase().includes(q.toLowerCase()) ||
    r.type.toLowerCase().includes(q.toLowerCase())
  );
  el.innerHTML = hits.slice(0, 8).map(r => `
    <div onclick="${r.action};document.getElementById('searchOverlay').remove()"
      style="display:flex;align-items:center;gap:1rem;background:var(--ink2);border:1px solid var(--border);
      border-radius:var(--r2);padding:1rem 1.2rem;cursor:none;transition:all .2s"
      onmouseenter="this.style.borderColor='var(--border2)';this.style.background='var(--ink3)'"
      onmouseleave="this.style.borderColor='var(--border)';this.style.background='var(--ink2)'">
      <div style="font-size:1.4rem">${r.icon}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.88rem">${r.title}</div>
        <div style="font-size:.72rem;color:var(--text3)">${r.meta}</div>
      </div>
      <div style="font-size:.68rem;font-weight:700;color:var(--gold);background:var(--goldglow);border:1px solid var(--border2);padding:.15rem .5rem;border-radius:50px">${r.type}</div>
    </div>`).join('');
  if (!hits.length) el.innerHTML = `<div style="text-align:center;color:var(--text3);font-size:.85rem;padding:2rem">No results for "${q}"</div>`;
}
// Ctrl+K / Cmd+K to open search
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

/* ────────────────────────────────────────────────────────────
   9. INJECT EXTRA NAV ITEMS + SEARCH BUTTON
──────────────────────────────────────────────────────────── */
function injectNavExtras() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  // Search icon
  const sbtn = document.createElement('button');
  sbtn.style.cssText = `background:var(--ink3);border:1px solid var(--border);color:var(--text3);
    width:36px;height:36px;border-radius:var(--r2);cursor:none;font-size:.9rem;
    display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0`;
  sbtn.textContent = '🔍';
  sbtn.title = 'Search (⌘K)';
  sbtn.onclick = openSearch;
  sbtn.addEventListener('mouseenter', () => { sbtn.style.borderColor = 'var(--gold)'; sbtn.style.color = 'var(--gold)'; });
  sbtn.addEventListener('mouseleave', () => { sbtn.style.borderColor = 'var(--border)'; sbtn.style.color = 'var(--text3)'; });
  nav.appendChild(sbtn);
}

/* ────────────────────────────────────────────────────────────
   10. LIVE METRICS TICKER (top bar mini)
──────────────────────────────────────────────────────────── */
function injectLiveTicker() {
  const ticker = document.createElement('div');
  ticker.style.cssText = `position:fixed;top:var(--nav);left:0;right:0;height:28px;
    background:rgba(201,168,76,.06);border-bottom:1px solid var(--border);
    display:flex;align-items:center;overflow:hidden;z-index:990;`;
  ticker.innerHTML = `
    <div style="background:var(--gold);color:var(--ink);font-size:.6rem;font-weight:800;
      letter-spacing:.1em;padding:0 .8rem;height:100%;display:flex;align-items:center;flex-shrink:0">LIVE</div>
    <div style="font-size:.7rem;color:var(--text3);white-space:nowrap;overflow:hidden;
      animation:tickerScroll 25s linear infinite;padding-left:1.5rem" id="liveTicker">
      🎙️ New story recorded: Shyambazar · 2m ago &nbsp;|&nbsp;
      💬 842 AI conversations today &nbsp;|&nbsp;
      ✦ Memory Constellation: 284 nodes, 1,247 connections &nbsp;|&nbsp;
      🌏 New city added: Varanasi archive in progress &nbsp;|&nbsp;
      🎉 Durga Puja 2026 archive: 847 stories collected &nbsp;|&nbsp;
      🎙️ New story recorded: Shyambazar · 2m ago &nbsp;|&nbsp;
      💬 842 AI conversations today &nbsp;|&nbsp;
    </div>`;
  document.body.appendChild(ticker);
  // Push all screens down
  document.querySelectorAll('.screen').forEach(s => {
    s.style.paddingTop = `calc(var(--nav) + 28px)`;
  });
}

/* ────────────────────────────────────────────────────────────
   11. THEME / COLOUR MODES
──────────────────────────────────────────────────────────── */
const THEMES = {
  dark: { '--ink':'#080610','--gold':'#c9a84c','--text':'#f2ead8' },
  sepia:{ '--ink':'#12090a','--gold':'#c9844c','--text':'#f5e8d0' },
  slate:{ '--ink':'#060c12','--gold':'#5aaccc','--text':'#daeaf5' },
};
function setTheme(t) {
  const theme = THEMES[t];
  if (!theme) return;
  Object.entries(theme).forEach(([k,v]) => document.documentElement.style.setProperty(k, v));
  toast(`🎨 Theme: ${t}`);
}

/* ────────────────────────────────────────────────────────────
   12. PROGRESSIVE LOADING INDICATOR
──────────────────────────────────────────────────────────── */
function showPageLoader(msg = 'Loading…') {
  const d = document.createElement('div');
  d.id = 'pageLoader';
  d.style.cssText = `position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);
    background:var(--ink2);border:1px solid var(--border);border-radius:50px;
    padding:.6rem 1.4rem;font-size:.78rem;color:var(--text2);z-index:9800;
    display:flex;align-items:center;gap:.7rem;box-shadow:0 8px 32px rgba(0,0,0,.6)`;
  d.innerHTML = `<div class="td"></div><div class="td" style="animation-delay:.1s"></div><div class="td" style="animation-delay:.2s"></div> ${msg}`;
  document.body.appendChild(d);
  return () => d.remove();
}

/* ────────────────────────────────────────────────────────────
   13. SHIMMER LOADING SKELETONS
──────────────────────────────────────────────────────────── */
function shimmerCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .skeleton {
      background: linear-gradient(90deg, var(--ink2) 25%, var(--ink3) 50%, var(--ink2) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--r2);
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }`;
  document.head.appendChild(style);
}

/* ────────────────────────────────────────────────────────────
   14. MICRO-INTERACTIONS — hover sound effects (visual)
──────────────────────────────────────────────────────────── */
function initMicroInteractions() {
  // Ripple effect on button clicks
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, .bc, .sc, .persona');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `position:absolute;border-radius:50%;
      background:rgba(201,168,76,.2);pointer-events:none;
      width:4px;height:4px;transform:scale(0);
      left:${e.clientX - rect.left - 2}px;
      top:${e.clientY - rect.top - 2}px;
      animation:ripple .5s ease forwards;`;
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { transform: scale(80); opacity: 0; } }`;
  document.head.appendChild(style);
}

/* ────────────────────────────────────────────────────────────
   15. INJECT STORY STUDIO + ADDA ROOM BUTTONS INTO HOME
──────────────────────────────────────────────────────────── */
function injectHomeButtons() {
  const wall = document.querySelector('.story-wall .sw-header');
  if (!wall) return;
  const btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:.6rem;margin-top:.5rem';
  btns.innerHTML = `
    <button onclick="openStoryStudio()" style="background:linear-gradient(135deg,var(--gold),var(--ember));color:var(--ink);border:none;padding:.55rem 1.3rem;border-radius:50px;font-family:var(--ff-body);font-weight:700;font-size:.8rem;cursor:none;display:flex;align-items:center;gap:.5rem">✍️ Story Studio</button>
    <button onclick="openAddaRoom()" style="background:var(--ink2);border:1px solid var(--border2);color:var(--text);padding:.55rem 1.3rem;border-radius:50px;font-family:var(--ff-body);font-weight:600;font-size:.8rem;cursor:none;display:flex;align-items:center;gap:.5rem">🏠 Adda Room</button>`;
  wall.appendChild(btns);
}

/* ────────────────────────────────────────────────────────────
   16. AUTO-INIT ALL PART 2 FEATURES
──────────────────────────────────────────────────────────── */
(function initPart2() {
  shimmerCSS();
  // Wait for main initAll to finish
  const waitForBody = setInterval(() => {
    if (!document.getElementById('loading') || document.getElementById('loading').style.display === 'none') {
      clearInterval(waitForBody);
      setTimeout(() => {
        createFABDock();
        injectNavExtras();
        injectLiveTicker();
        injectHomeButtons();
        initMicroInteractions();
      }, 800);
    }
  }, 200);
})();
