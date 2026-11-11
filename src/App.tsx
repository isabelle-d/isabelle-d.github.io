import type { ReactElement } from "react";
import { useState } from "react";
import WindowBar from "./components/WindowBar.tsx";
import DesktopIcon from "./components/DesktopIcon.tsx";
import Contact from "./components/Contact.tsx";
import Projects from "./components/Projects.tsx";
import { Amovie2, Wordpad, Mail, FileText, Progman24, Mailnews20, Shortcut2, Computer3 } from "@react95/icons";
import AboutMe from "./components/AboutMe.tsx";
import Art from "./components/Art.tsx";
import Resume from "./components/Resume.tsx";
import Doom from "./components/Doom.tsx";
import Credits from "./components/Credits.tsx";
import Wall from "./components/Wall.tsx";
import BadApple from "./components/BadApple.tsx";
import doomIcon from "./assets/Doom_1.png";
import './index.css';

import '@react95/core/themes/win95.css';

const WINDOW_NAMES = [
  "About Me",
  "Contact",
  "Projects",
  "Art Gallery",
  "Resume",
  "Doom",
  "Credits",
  "Guestbook",
];

const DESKTOP_ICON_SOURCES: (string | ReactElement)[] = [
  <Wordpad variant="32x32_4" />,
  <Mail variant="32x32_4" />,
  <FileText variant="32x32_4" />,
  <Progman24 variant="32x32_4" />,
  <Mailnews20 variant="32x32_4" />,
  doomIcon,
  <Amovie2 variant="32x32_4" />,
  <Computer3 variant="32x32_4" />,
  <Shortcut2 variant="32x32_4" />,
];

function App() {
  const [pixelMode, setPixelMode] = useState(false);

  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <img
        src="/assets/screensaver.jpg"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
          position: "fixed",
          top: 0,
          left: 0,
        }}
      />

      <div
        className="fixed"
        data-desktop-icons="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          alignContent: "flex-start",
          opacity: pixelMode ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: pixelMode ? "none" : "auto",
        }}
      >
        <DesktopIcon openOnLoad width={900} height={650} icon={<Wordpad variant="32x32_4" />} name="About Me">
          <AboutMe />
        </DesktopIcon>
        <DesktopIcon width={550} height={450} icon={<Mail variant="32x32_4" />} name="Contact">
          <Contact />
        </DesktopIcon>
        <DesktopIcon width={1200} height={700} icon={<FileText variant="32x32_4" />} name="Projects">
          <Projects />
        </DesktopIcon>
        <DesktopIcon width={800} height={600} icon={<Progman24 variant="32x32_4" />} name="Art Gallery">
          <Art />
        </DesktopIcon>
        <DesktopIcon width={800} height={650} icon={<Mailnews20 variant="32x32_4" />} name="Resume">
          <Resume />
        </DesktopIcon>
        <DesktopIcon width={900} height={650} icon={doomIcon} name="Doom">
          <Doom />
        </DesktopIcon>
        <DesktopIcon width={800} height={600} icon={<Amovie2 variant="32x32_4" />} name="Credits">
          <Credits />
        </DesktopIcon>
        <DesktopIcon width={800} height={600} icon={<Computer3 variant="32x32_4" />} name="Guestbook">
          <Wall />
        </DesktopIcon>
        <div style={{ flexBasis: "100%", width: 0, height: 0 }} />
        <div
          onClick={() => window.open("https://isabelle-d.github.io/Readable-Website/", "_blank")}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            width: '135px',
            textAlign: 'center',
          }}
        >
          <Shortcut2 variant="32x32_4" />
          <span style={{ color: 'white', marginTop: '4px' }}>Website</span>
        </div>
        <BadApple
          windowNames={WINDOW_NAMES}
          desktopIcons={DESKTOP_ICON_SOURCES}
          onPlayingChange={setPixelMode}
        />
      </div>
      <WindowBar />
    </div>
  );
}

export default App;

/*Things to fix
2.Shutdown menu/start up menu?
3. Contact visibility
5.Bad Apple
6.More art
- fieldset resize stuff
-swap website
*/