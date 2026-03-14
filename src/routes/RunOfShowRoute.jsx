import React, { useEffect, useRef, useState } from "react";

const ADMIN_IDS = new Set([
  "29450a65-8925-4b85-b4ef-c1b0870653cf",
  "0bb97f08-c5bd-43d1-9934-99bbfcae3a21",
]);

function hasAccess(character) {
  if (!character) return false;
  const isAdmin = ADMIN_IDS.has(character.id);
  const isNpc = Boolean(character.excludedFromCount);
  return isAdmin || isNpc;
}

const ACTS = [
  { id: "pregame", label: "Pregame", heading: null },
  { id: "act-one", label: "introduction\u00A0— the grand tournament", heading: "ACT ONE" },
  { id: "act-two", label: "Shrine + Relic Hunting", heading: "ACT TWO" },
  { id: "act-three", label: "Tournament", heading: "ACT THREE" },
  { id: "act-four", label: "Death & Manhunt", heading: "ACT FOUR" },
  { id: "act-five", label: "Finale", heading: "ACT FIVE" },
];

// Shorthand for inline type-caps spans
function C({ children }) {
  return <span className="type-caps">{children}</span>;
}

export function RunOfShowRoute({ character, getPathFromRoute, onNavigate }) {
  const [activeAct, setActiveAct] = useState("pregame");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordGranted, setPasswordGranted] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView();
  }, []);

  useEffect(() => {
    const sections = ACTS.map((a) => document.getElementById(a.id)).filter(Boolean);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveAct(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => observerRef.current.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  if (!hasAccess(character) && !passwordGranted) {
    return (
      <main className="ros-layout ros-access-denied">
        <p className="ros-denied-label type-caps">Run of Show</p>
        <p className="ros-denied-title">Death</p>
        <p className="ros-denied-sub">must claim us all</p>
        <p className="ros-denied-message type-body">This page is restricted.</p>
        <form
          className="ros-denied-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput.trim().toLowerCase() === "candle") {
              setPasswordGranted(true);
            } else {
              setPasswordInput("");
            }
          }}
        >
          <input
            className="ros-denied-input"
            type="password"
            placeholder="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            autoComplete="off"
          />
          <button className="ros-denied-submit type-caps" type="submit">Enter</button>
        </form>
      </main>
    );
  }

  return (
    <main className="ros-layout">
      {/* Desktop sidebar nav */}
      <nav className="ros-nav" aria-label="Run of Show sections">
        <div className="ros-nav-header">
          <p className="ros-nav-meta type-caps">Run of Show</p>
          <p className="ros-nav-title">Death</p>
          <p className="ros-nav-sub">must claim us all</p>
        </div>
        <div className="ros-nav-links">
          {ACTS.filter((a) => a.heading).map((act) => (
            <a
              key={act.id}
              href={`#${act.id}`}
              className={`ros-nav-link${activeAct === act.id ? " is-active" : ""}`}
            >
              {act.heading}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile-only sticky jump bar */}
      <div className="ros-jump-bar">
        <div className="ros-jump-links">
          {ACTS.filter((a) => a.heading).map((act) => (
            <a
              key={act.id}
              href={`#${act.id}`}
              className={`ros-jump-link${activeAct === act.id ? " is-active" : ""}`}
            >
              {act.heading}
            </a>
          ))}
        </div>
      </div>

      <div className="ros-content">
        {/* Mobile-only content header */}
        <div className="ros-content-header">
          <p className="ros-nav-meta type-caps">Run of Show</p>
          <p className="ros-nav-title">Death</p>
          <p className="ros-nav-sub">must claim us all</p>
        </div>

        {/* Pregame */}
        <section id="pregame" className="ros-section">
          <div className="ros-section-header">
            <p className="ros-act-darksame">Pregame</p>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>
            <ul className="ros-list type-body">
              <li>
                <C>Alex</C> + <C>Jordan</C> have a greeter stand to hand out team materials. Everyone gets a:
                <ul>
                  <li>set of combat cards</li>
                  <li>perk cards for their class</li>
                  <li>three soul shards</li>
                  <li>a soul shard chain</li>
                </ul>
              </li>
              <li><C>Kate</C> is giving each team a flower pin with their team colors.</li>
              <li>
                <C>Shrine Keepers</C> get:
                <ul>
                  <li>8 of their relic</li>
                  <li>8 certificates of completion</li>
                  <li>a stack of curses</li>
                  <li>a "lucky dice" for players with dumb luck</li>
                  <li>a list of <C>Lucky</C> players</li>
                </ul>
              </li>
              <li>
                <C>Simi</C> gets:
                <ul>
                  <li>a stack of blessings</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        {/* Act One */}
        <section id="act-one" className="ros-section">
          <div className="ros-section-header">
            <p className="ros-act-darksame">introduction — the grand tournament</p>
            <h2 className="ros-act-heading">ACT ONE</h2>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">Where it happens</p>
            <p className="ros-subsection-value type-body">The Great Hall</p>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>
            <ul className="ros-list type-body">
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-intro" })}
                  onClick={onNavigate({ page: "run-of-show-intro" })}
                  className="ros-script-link"
                >
                  [SCRIPT] Introduction to the game and welcome
                </a>
                <ul>
                  <li>
                    Explain win conditions for the tournament
                    <ul>
                      <li>Explain Relic games</li>
                      <li>Introduce shrine keepers</li>
                      <li>Explain <C>Curses</C> and <C>Blessings</C></li>
                    </ul>
                  </li>
                  <li>
                    Explain <C>Combat</C>
                    <ul>
                      <li><C>Alex</C> and <C>Jordan</C> demonstrate combat</li>
                      <li>Teams practice combat amongst themselves</li>
                      <li>You cannot engage in combat if you are out of shards</li>
                    </ul>
                  </li>
                  <li>Explain Reincarnation mechanics</li>
                </ul>
              </li>
              <li>[SCRIPT] Kickoff the grand tournament</li>
            </ul>
          </div>
        </section>

        {/* Act Two */}
        <section id="act-two" className="ros-section">
          <div className="ros-section-header">
            <p className="ros-act-darksame">Shrine + Relic Hunting</p>
            <h2 className="ros-act-heading">ACT TWO</h2>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">Where it happens</p>
            <p className="ros-subsection-value type-body">Outside / The Venue</p>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">Players</p>
              <ul className="ros-list type-body">
                <li>Players compete in the Shrine games</li>
                <li>Players give soul tokens to each other on Death</li>
                <li>Players give soul tokens to <C>Jess</C> + <C>Kavya</C> to track kills</li>
                <li>Players get new soul tokens from <C>Alex</C> when they run out</li>
                <li>Players can give spent/cured curses to <C>Shrine Keepers</C> or <C>Death's Minions</C></li>
                <li>
                  If a player has at least one soul token, they can play your game
                  <ul>
                    <li>If a player has no soul tokens and attempts to play — <C>Curse</C> them</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">Shrine Keepers</p>
              <ul className="ros-list type-body">
                <li><C>Shrine Keepers</C> hand out <C>Certificates</C> if players complete your games</li>
                <li><C>Shrine Keepers</C> hand out <C>Relics</C> if you solve their relic clue</li>
                <li>
                  <C>Shrine Keepers</C> hand out <C>Curses</C> if your shrine challenge is failed, or if you feel like it. Curse people at will.
                  <ul>
                    <li>If a player has the <C>Feeling Lucky</C> feat, let them roll a dice. On a 3 they are not cursed.</li>
                  </ul>
                </li>
                <li>
                  When a team completes the Rite of Final Passage, <strong><C>Geri</C> + <C>Shane</C></strong> send them to <C>Alex</C> to mark their finishing order in the grand tournament
                  <ul>
                    <li><C>Alex</C> gives that team a <strong><C>Blessed</C></strong> card and updates them in the website</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">Specific Shrines</p>
              <ul className="ros-list type-body">
                <li><C>Jess</C> + <C>Kavya</C> tally how many kills from each team</li>
                <li><C>Simi</C> gives away <C>Blessings</C></li>
                <li><C>Simi</C> gives away <C>Wizard Kills</C></li>
                <li><C>Shane</C> + <C>Geri</C> send teams to <C>Alex</C> after they get all relics to have their rank in the tournament recorded</li>
                <li><C>Alex</C> gives <C>Hollow</C> or <C>Blessed</C> cards</li>
              </ul>
            </div>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">GMs</p>
              <ul className="ros-list type-body">
                <li><C>Simi</C> hands out <C>Blessings</C> if you complete her potion games</li>
                <li><C>Jordan</C> hands out <C>Hint Cards</C> if people are getting stuck</li>
                <li><C>Jordan</C> + <C>Death's Minions</C> enforce curses</li>
                <li>
                  If a player has <strong>more than 6 deaths</strong>, the next time they see <strong><C>Alex</C></strong> she weighs their soul
                  <ul>
                    <li>Give them a <strong><C>Hollow</C></strong> card and update them in the website</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Act Three */}
        <section id="act-three" className="ros-section">
          <div className="ros-section-header">
            <p className="ros-act-darksame">Tournament</p>
            <h2 className="ros-act-heading">ACT THREE</h2>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">Where it happens</p>
            <p className="ros-subsection-value type-body">The Redwoods / The Amphitheater</p>
            <p className="ros-subsection-note type-body">
              <C>Death's Minions</C> tell the <C>Shrine Keepers</C> it's time to kick off Act III. <C>Shrine Keepers</C> stop running your shrine. All NPCs usher players back into the Amphitheater by <C>Nancy</C> + <C>Max</C>'s Shrine. Players sit on the bleachers, roughly with their teams.
            </p>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>
            <ul className="ros-list type-body">
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-tournament" })}
                  onClick={onNavigate({ page: "run-of-show-tournament" })}
                  className="ros-script-link"
                >
                  [SCRIPT] Declare Victors for the tournament
                </a>
              </li>
              <li>
                <C>Win Condition</C>:
                <ul>
                  <li>Teams that got all 5 relics — we have them compete to see who "wins"</li>
                  <li>
                    Players with the highest individual kill counts
                    <ul>
                      <li>We ask who thinks their kill count is high, and we keep going higher until we get the final 3</li>
                    </ul>
                  </li>
                  <li>
                    Teams with the highest kill counts + all 5 relics
                    <ul>
                      <li>We have them pick <C>Champions</C> for each contest</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <C>Tournament Game</C>: We pick 3 mini games for the great tournament, each loosely involved around a stat.
                <ul>
                  <li><C>Pulchritude</C> — <C>Grand Entrance</C> (contestants can pick a song, and have to do a walk around the arena). The crowd cheers, and we have a panel of judges who judge them on the spot</li>
                  <li>
                    <C>Brawn</C> — Arm Wrestling or Sword Fight (fencing rules)
                    <ul>
                      <li>Have <C>Emily</C> run the sound mixer</li>
                    </ul>
                  </li>
                  <li><C>Grit</C> — planking?? first one to make a sound??</li>
                  <li><C>Vigilance</C> — Archery</li>
                  <li><C>Shenanigans</C> — Riddles or Rapping / Rhymes</li>
                  <li><C>Mystery</C> — Jeopardy???</li>
                  <li><C>Dumb Luck</C> — Dice rolls???</li>
                </ul>
              </li>
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-tournament" })}
                  onClick={onNavigate({ page: "run-of-show-tournament" })}
                  className="ros-script-link"
                >
                  [SCRIPT] — Transfer the party back to the Great Hall for the crowning of the <C>Victor</C>
                </a>
              </li>
            </ul>
            <p className="ros-aside type-body">* Note — should we give teams their concord signs?</p>
          </div>

          <div className="ros-subsection ros-callout">
            <p className="ros-subsection-label type-caps">Before the transition to Act Four</p>
            <p className="ros-callout-body type-body">
              <strong><C>Geri</C>, <C>Jess</C>, and <C>Kavya</C></strong> slip out before everyone else and position themselves at the entrance to the Great Hall.
            </p>
            <ul className="ros-list type-body" style={{ marginTop: "8px" }}>
              <li>Player has a <strong><C>Blessed</C></strong> card — send them to the <strong>left</strong></li>
              <li>Player has a <strong><C>Hollow</C></strong> card — send them to the <strong>right</strong></li>
            </ul>
          </div>
        </section>

        {/* Act Four */}
        <section id="act-four" className="ros-section">
          <div className="ros-section-header">
            <p className="ros-act-darksame">Death &amp; Manhunt</p>
            <h2 className="ros-act-heading">ACT FOUR</h2>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">Where it happens</p>
            <p className="ros-subsection-value type-body">The Great Hall</p>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>
            <ul className="ros-list type-body">
              <li>Players can take a break to eat and/or <C>Change Shoes</C></li>
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-crowning" })}
                  onClick={onNavigate({ page: "run-of-show-crowning" })}
                  className="ros-script-link"
                >
                  [SCRIPT] — Call players back for the crowning ceremony
                </a>
                <ul>
                  <li>
                    As the <C>Victor</C> is being crowned we reveal <C>Death</C>
                    <ul>
                      <li><C>Spotlights</C></li>
                      <li><C>Death</C> lays her hand on the champion's shoulder</li>
                      <li>and he becomes the main lieutenant for <C>Death</C>'s army</li>
                    </ul>
                  </li>
                  <li><C>Alex</C> + <C>Jordan</C> explain Manhunt Mechanics
                    <ul>
                      <li><C>Death</C>'s minions must walk</li>
                      <li>Players with a light are immune from being <C>Turned</C></li>
                    </ul>
                  </li>
                  <li><C>Death</C> flips the timer</li>
                  <li><C>Death</C> gives everyone a <C>Ten Second Head Start</C></li>
                  <li>Anyone who is too slow starts getting converted into the undead</li>
                </ul>
              </li>
              <li>
                <C>Win Conditions</C>
                <ul>
                  <li>The players win by gathering a candle from each of the five shrines, and surrounding <C>Death</C></li>
                  <li>Players with a <C>Light</C> — so wizards with a staff, or someone holding a candle — can't be <C>Turned</C></li>
                  <li>
                    Five players holding candles have to surround <C>Death</C>
                    <ul>
                      <li><C>Death</C> extends her hand</li>
                      <li>A sixth player without a candle must kiss it</li>
                      <li>The curse is broken and the players win</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <C>Death Wins</C>:
                <ul>
                  <li>The timer runs out</li>
                  <li>We toll a bell 3 times</li>
                  <li>Everyone comes back for champagne and we toast</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        {/* Act Five */}
        <section id="act-five" className="ros-section">
          <div className="ros-section-header">
            <p className="ros-act-darksame">Finale</p>
            <h2 className="ros-act-heading">ACT FIVE</h2>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>
            <ul className="ros-list type-body">
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-players-win" })}
                  onClick={onNavigate({ page: "run-of-show-players-win" })}
                  className="ros-script-link"
                >
                  [SCRIPT] Players Win
                </a>
              </li>
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-death-wins" })}
                  onClick={onNavigate({ page: "run-of-show-death-wins" })}
                  className="ros-script-link"
                >
                  [SCRIPT] Death Wins
                </a>
              </li>
              <li>Closing prizes????</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
