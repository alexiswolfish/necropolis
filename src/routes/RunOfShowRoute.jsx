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

export function RunOfShowRoute({ character, getPathFromRoute, onNavigate }) {
  const [activeAct, setActiveAct] = useState("pregame");
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

  if (!hasAccess(character)) {
    return (
      <main className="ros-layout ros-access-denied">
        <p className="ros-denied-label type-caps">Run of Show</p>
        <p className="ros-denied-title">Death</p>
        <p className="ros-denied-sub">must claim us all</p>
        <p className="ros-denied-message type-body">This page is restricted.</p>
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

      {/* Mobile-only sticky jump bar — direct child of ros-layout so it has full page height as its sticky container */}
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
        {/* Mobile-only content header — scrolls with the page */}
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
                Alex + Jordan have a greeter stand to hand out team materials. Everyone gets a:
                <ul>
                  <li>set of combat cards</li>
                  <li>perk cards for their class</li>
                  <li>three soul shards</li>
                  <li>a soul shard chain</li>
                </ul>
              </li>
              <li>KATE is giving each team a flower pin with their team colors.</li>
              <li>
                SHRINE KEEPERS get:
                <ul>
                  <li>8 of their relic</li>
                  <li>8 certificates of completion</li>
                  <li>a stack of curses</li>
                  <li>a "lucky dice" for players with dumb luck</li>
                  <li>a list of "LUCKY" players</li>
                </ul>
              </li>
              <li>
                SIMI gets:
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
                      <li>Explain Curses and Blessings</li>
                    </ul>
                  </li>
                  <li>
                    Explain COMBAT
                    <ul>
                      <li>Alex and Jordan demonstrate combat</li>
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
            <p className="ros-subsection-value type-body">OUTSIDE / The Venue</p>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">Players</p>
              <ul className="ros-list type-body">
                <li>Players compete in the Shrine games</li>
                <li>Players give soul tokens to each other on Death</li>
                <li>Players give soul tokens to JESS + KAVYA to track kills</li>
                <li>Players get NEW soul tokens from Alex when they run out</li>
                <li>Players can give spent/cured curses to SHRINE KEEPERS or DEATH'S MINIONS</li>
                <li>
                  If a player has at least ONE soul token, they can play your game
                  <ul>
                    <li>If a player has no soul tokens and attempts to play — CURSE them</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">Shrine Keepers</p>
              <ul className="ros-list type-body">
                <li>Shrine Keepers hand out CERTIFICATES if players complete your games</li>
                <li>Shrine Keepers hand out RELICS if you solve their relic clue</li>
                <li>
                  Shrine Keepers hand out CURSES if your shrine challenge is failed, or if you feel like it. Curse people at will.
                  <ul>
                    <li>If a player has the "FEELING LUCKY" feat, let them roll a dice. On a 3 they are not cursed.</li>
                  </ul>
                </li>
                <li>
                  When a TEAM completes the Rite of Final Passage, <strong>Geri + Shane</strong> send them to Alex to mark their finishing order in the grand tournament
                  <ul>
                    <li>Alex gives that team a <strong>BLESSED</strong> card and updates them in the website</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">Specific Shrines</p>
              <ul className="ros-list type-body">
                <li>Jess + Kavya tally how many kills from each team</li>
                <li>Simi gives away BLESSINGS</li>
                <li>Simi gives away WIZARD KILLS</li>
                <li>Shane + Geri send teams to Alex after they get all relics to have their rank in the tournament recorded</li>
                <li>Alex gives HOLLOW or BLESSED cards</li>
              </ul>
            </div>

            <div className="ros-list-group">
              <p className="ros-list-group-label type-caps">GMs</p>
              <ul className="ros-list type-body">
                <li>SIMI hands out BLESSINGS if you complete her potion games</li>
                <li>JORDAN hands out HINT CARDS if people are getting stuck</li>
                <li>JORDAN + DEATH'S MINIONS enforce curses</li>
                <li>
                  If a player has <strong>more than 6 deaths</strong>, the next time they see <strong>Alex</strong> she weighs their soul
                  <ul>
                    <li>Give them a <strong>HOLLOW</strong> card and update them in the website</li>
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
            <p className="ros-subsection-value type-body">THE REDWOODS / THE AMPHITHEATER</p>
            <p className="ros-subsection-note type-body">
              Death's Minions tell the Shrine Keepers it's time to kick off Act III. Shrine Keepers stop running your shrine. All NPCs usher players back into the AMPHITHEATER by Nancy + Max's Shrine. Players sit on the bleachers, roughly with their teams.
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
                  [SCRIPT] Declare VICTORS for the tournament
                </a>
              </li>
              <li>
                WIN CONDITION:
                <ul>
                  <li>TEAMS that got all 5 relics — we have them compete to see who "wins"</li>
                  <li>
                    Players with the highest individual kill counts
                    <ul>
                      <li>We ask who thinks their kill count is high, and we keep going higher until we get the final 3</li>
                    </ul>
                  </li>
                  <li>
                    Teams with the highest kill counts + all 5 relics
                    <ul>
                      <li>We have them pick "CHAMPIONS" for each contest</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                TOURNAMENT GAME: We pick 3 mini games for the great tournament, each loosely involved around a stat.
                <ul>
                  <li>PULCHRITUDE — GRAND ENTRANCE (contestants can pick a song, and have to do a walk around the arena). The crowd cheers, and we have a panel of judges who judge them on the spot</li>
                  <li>
                    BRAWN — Arm Wrestling OR Sword Fight (fencing rules)
                    <ul>
                      <li>Have Emily run the sound mixer</li>
                    </ul>
                  </li>
                  <li>GRIT — planking?? first one to make a sound??</li>
                  <li>VIGILANCE — Archery</li>
                  <li>SHENANIGANS — Riddles or RAPPING / RHYMES</li>
                  <li>MYSTERY — Jeopardy???</li>
                  <li>DUMB LUCK — Dice rolls???</li>
                </ul>
              </li>
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-tournament" })}
                  onClick={onNavigate({ page: "run-of-show-tournament" })}
                  className="ros-script-link"
                >
                  [SCRIPT] — Transfer the party back to the Great Hall for the "CROWNING" of the VICTOR
                </a>
              </li>
            </ul>
            <p className="ros-aside type-body">* Note — should we give teams their concord signs?</p>
          </div>

          <div className="ros-subsection ros-callout">
            <p className="ros-subsection-label type-caps">Before the transition to Act Four</p>
            <p className="ros-callout-body type-body">
              <strong>Geri, Jess, and Kavya</strong> slip out before everyone else and position themselves at the entrance to the Great Hall.
            </p>
            <ul className="ros-list type-body" style={{ marginTop: "8px" }}>
              <li>Player has a <strong>BLESSED</strong> card — send them to the <strong>left</strong></li>
              <li>Player has a <strong>HOLLOW</strong> card — send them to the <strong>right</strong></li>
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
            <p className="ros-subsection-value type-body">THE GREAT HALL</p>
          </div>
          <div className="ros-subsection">
            <p className="ros-subsection-label type-caps">What must be done</p>
            <ul className="ros-list type-body">
              <li>Players can take a break to Eat and/or CHANGE SHOES</li>
              <li>
                <a
                  href={getPathFromRoute({ page: "run-of-show-crowning" })}
                  onClick={onNavigate({ page: "run-of-show-crowning" })}
                  className="ros-script-link"
                >
                  [SCRIPT] — Call players back for the CROWNING ceremony
                </a>
                <ul>
                  <li>
                    As the VICTOR is being crowned we reveal DEATH
                    <ul>
                      <li>SPOTLIGHTS</li>
                      <li>Death lays her hand on the champion's shoulder</li>
                      <li>and he becomes the main lieutenant for DEATH's army</li>
                    </ul>
                  </li>
                  <li>Alex + Jordan explain Manhunt Mechanics
                    <ul>
                      <li>Death's minions must walk</li>
                      <li>Players with a light are immune from being turned</li>
                    </ul>
                  </li>
                  <li>Death flips the timer</li>
                  <li>Death gives everyone a TEN SECOND HEAD START</li>
                  <li>Anyone who is too slow starts getting converted into the undead</li>
                </ul>
              </li>
              <li>
                WIN CONDITIONS
                <ul>
                  <li>The players win by gathering a candle from each of the five shrines, and surrounding Death</li>
                  <li>Players with a LIGHT — so wizards with a staff, or someone holding a candle — can't be TURNED</li>
                  <li>
                    Five players holding candles have to surround DEATH
                    <ul>
                      <li>DEATH EXTENDS HER HAND</li>
                      <li>A sixth player without a candle must kiss it</li>
                      <li>THE CURSE IS BROKEN AND THE PLAYERS WIN</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                DEATH WINS:
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
