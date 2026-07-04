
import WindowBar from "./components/WindowBar.tsx";
import DesktopIcon from "./components/DesktopIcon.tsx";
import Contact from "./components/Contact.tsx";
import Projects from "./components/Projects.tsx"
import { Amovie2, Inetcpl1313, Joy102, Wordpad, Mail, FileText, Shortcut2, Progman24, Mailnews20} from "@react95/icons";
import { Video } from "@react95/core";
import AboutMe from "./components/AboutMe.tsx";
import Art from "./components/Art.tsx";
import Resume from "./components/Resume.tsx";
import Doom from "./components/Doom.tsx";
import doomIcon from "./assets/Doom_1.png";

function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh",position:"relative" }}>
      <img src="src/assets/screensaver.jpg" style={{width: "100vw", height: "100vh", objectFit: "cover",
         zIndex: -1, position: "fixed", top: 0,left: 0,}}/>

      <div className="fixed">
        <DesktopIcon width={600} icon={<Wordpad variant="32x32_4"/>} name="About Me">
          <AboutMe/>
        </DesktopIcon>
        <DesktopIcon width={400} icon={<Mail variant="32x32_4"/>} name="Contact">
          <Contact/>
        </DesktopIcon>
        <DesktopIcon width={600} icon={<FileText variant="32x32_4"/>} name="Projects">
          <Projects/>
        </DesktopIcon>
        <DesktopIcon width={400} icon={<Shortcut2 variant="32x32_4"/>} name="Swap Website">
          <Art/>
        </DesktopIcon>
        <DesktopIcon width={500} icon={<Progman24 variant="32x32_4"/>} name="Art Gallery">
          <Art/>
        </DesktopIcon>
        <DesktopIcon width={500} icon={< Mailnews20 variant="32x32_4"/>} name="Resume">
          <Resume/>
        </DesktopIcon>
        <DesktopIcon width={600} icon= {doomIcon} name="Doom">
          <Doom/>
        </DesktopIcon>
      </div>
      <WindowBar />

    </div>
  );
}

export default App;


/*Things to fix
2.Shutdown menu/start up menu?
3. Contact visibility
4.Doom
5.Bad Apple
6.More art
*/