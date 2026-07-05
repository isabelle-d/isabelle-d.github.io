import { List, TaskBar } from "@react95/core";
import {
  Computer3,
  Settings,
  Wordpad,
  Mail,
  Shortcut2
} from "@react95/icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from "react";
import Shutdown from "./Shutdown";
import { useWindowsStore } from "../store/windows";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: "0 10px", alignSelf: "center" }}>
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </div>


  );
}

function WindowBar() {
  const [showShutdown, setShowShutdown] = useState(false);
  const { openWindow } = useWindowsStore();
  return (
    <>
      <TaskBar
        list={
          <List width={"200px"}>
            <List.Item icon={<Mail variant="32x32_4" />}>
              <List width={"200px"}>
                <List.Item icon={<FaGithub size={16} />}>
                  <a href="https://github.com/isabelle-d" target="_blank" style={{ textDecoration: 'none', color: '#222', fontFamily: 'MS Sans Serif' }}>GitHub</a>
                </List.Item>
                <List.Item icon={<FaLinkedin size={16} />}>
                  <a href="https://www.linkedin.com/in/isabelle-b-darling/" target="_blank" style={{ textDecoration: 'none', color: '#222', fontFamily: 'MS Sans Serif' }}>LinkedIn</a>
                </List.Item>
                <List.Item icon={<Mail variant="16x16_4" />}>
                  <a href="mailto:isabelle.darling4@gmail.com" style={{ textDecoration: 'none', color: '#222', fontFamily: 'MS Sans Serif' }}>Gmail</a>
                </List.Item>
              </List>
              Contact
            </List.Item>
            <List.Item icon={<Settings variant="32x32_4" />}>
              Settings
            </List.Item>
            <List.Item
              onClick={() => window.open("https://isabelle-d.github.io/Readable-Website/", "_blank")}
              icon={<Shortcut2 variant="32x32_4" />}
            >
              Swap Website
            </List.Item>
            <List.Item
              onClick={() => openWindow("Resume")}
              icon={<Wordpad variant="32x32_4" />}
            >
              About Me
            </List.Item>
            <List.Divider />
            <List.Item
              onClick={() => setShowShutdown(true)}
              icon={<Computer3 variant="32x32_4" />}
            >
              Shut Down...
            </List.Item>

          </List>
        }
      >
        <Clock />
      </TaskBar>
      {showShutdown && <Shutdown close={() => setShowShutdown(false)} />}
    </>
  );
}

export default WindowBar;
