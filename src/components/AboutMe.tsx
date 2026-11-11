import { useEffect, useRef, useState } from 'react';
import { Avatar, Fieldset, ProgressBar, Tab, Tabs, List, Frame } from '@react95/core';
import { useWindowsStore } from '../store/windows';
import {
  FaPython, FaJava, FaMicrochip, FaHashtag, FaDatabase, FaHtml5, FaCss3Alt,
  FaPaintBrush, FaMobileAlt, FaGitAlt, FaGamepad, FaFlag, FaShieldAlt,
  FaNetworkWired, FaBug, FaLock, FaTerminal,
} from 'react-icons/fa';
import type { ReactNode } from 'react';

// Quick-reference skill badges: each has its own color so they are easy to scan.
type Skill = { name: string; icon: ReactNode; bg: string; fg?: string };

const skillGroups: { label: string; skills: Skill[] }[] = [
  {
    label: 'Languages',
    skills: [
      { name: 'Python', icon: <FaPython />, bg: '#3776ab' },
      { name: 'Java', icon: <FaJava />, bg: '#d9534f' },
      { name: 'C', icon: <FaMicrochip />, bg: '#555e8a' },
      { name: 'C#', icon: <FaHashtag />, bg: '#6a1b9a' },
      { name: 'SQL', icon: <FaDatabase />, bg: '#00758f' },
    ],
  },
  {
    label: 'Web & Mobile',
    skills: [
      { name: 'HTML', icon: <FaHtml5 />, bg: '#e44d26' },
      { name: 'CSS', icon: <FaCss3Alt />, bg: '#264de4' },
      { name: 'Tailwind', icon: <FaPaintBrush />, bg: '#0e9aa7' },
      { name: 'React Native', icon: <FaMobileAlt />, bg: '#087ea4' },
    ],
  },
  {
    label: 'Tools & Engines',
    skills: [
      { name: 'Git', icon: <FaGitAlt />, bg: '#f05032' },
      { name: 'Unity', icon: <FaGamepad />, bg: '#333333' },
    ],
  },
  {
    label: 'Cybersecurity',
    skills: [
      { name: 'CTFs', icon: <FaFlag />, bg: '#b71c1c' },
      { name: 'Network Security', icon: <FaNetworkWired />, bg: '#1b5e20' },
      { name: 'Web Security (SQLi, XSS, CSRF)', icon: <FaBug />, bg: '#e65100' },
      { name: 'Buffer Overflows & ROP', icon: <FaShieldAlt />, bg: '#4a148c' },
      { name: 'Applied Cryptography', icon: <FaLock />, bg: '#006064' },
      { name: 'GDB', icon: <FaTerminal />, bg: '#37474f' },
    ],
  },
];

function SkillBadges() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {skillGroups.map((group) => (
        <div key={group.label} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          <span style={{ minWidth: '110px', fontSize: '0.85rem', fontWeight: 'bold' }}>{group.label}</span>
          {group.skills.map((s) => (
            <span
              key={s.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                background: s.bg,
                color: s.fg ?? '#fff',
                border: '1px solid #000',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
              }}
            >
              {s.icon}
              {s.name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function AboutMe() {
  const { openWindow } = useWindowsStore();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [paneH, setPaneH] = useState(400);

  // Measure the window's content area so the tab panes always fill it,
  // including when the window is resized by dragging the corner.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const tabStrip = el.querySelector('[role="tablist"]') as HTMLElement | null;
      const stripH = tabStrip ? tabStrip.offsetHeight : 40;
      setPaneH(Math.max(150, el.clientHeight - stripH - 24));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pane = {
    overflowY: "auto",
    height: `${paneH}px`,
    boxSizing: "border-box",
  } as const;

  return (
    <div ref={wrapRef} style={{ height: "100%", width: "100%" }}>
    <Tabs defaultActiveTab="Intro">
      <Tab title="Intro">
        <Frame style={pane}>
          <h3>Hi, I’m Isabelle Darling.</h3>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
            <Avatar src="assets/art/LionMe.JPG" alt="Creator" size="260px" />
            <Avatar src="assets/art/chinaMe.JPG" alt="Creator" size="260px" />
          </div>

          <p>
            A third year Computer Science student at Georgia Tech with threads in <b>Cybersecurity</b> and <b>Information Internetworks</b>.
            I am an aspiring cybersecurity and software engineer looking to contribute to technical teams, and I am currently
            looking for a <b>Summer 2027 internship</b>!
          </p>

          <Fieldset legend="Cybersecurity & Networks">
            <p>
              I work at the intersection of cybersecurity and networks. I've built network pipeline applications and worked through
              hands on technical labs and CTFs, both in my classes and through the GT Greyhat club.
              I began to become interested in programming in high school after taking AP Computer Science Principles and
              AP Computer Science A. Since then I took all the computer science classes offered at my high school and have been
              pursuing a degree in computer science at Georgia Tech.
            </p>
          </Fieldset>

          <Fieldset legend="Game Development & Leadership">
            <p>
              I love to work on game development, both independently and on teams, and I love writing code that has a tangible impact.
              I am currently the <b>art lead for Merks @ Werk</b> with VGDev, a club where students work together to make a full game within
              a semester. I am also a <b>student lead for Current Crisis</b>, where I oversee a close team of around <b>15 students</b> on the core
              programming team. This has made me proficient in C#, Unity, Godot, Git and team management.
              You can see more in the projects section of this website:{' '}
              <a href="#projects" onClick={(e) => { e.preventDefault(); openWindow("Projects"); }}>click here to open Projects</a>.
            </p>
          </Fieldset>

          <Fieldset legend="Resident Assistant">
            <p>
              In my spare time I work as a Resident Assistant, where I help first year students adapt to college. I previously worked at
              Woodruff with over <b>400 residents</b> and currently work in Glenn & Hopkins with a combined total of <b>500 residents</b>.
              I work to create a positive living environment, mitigate conflict, run events, and work as a team to make Georgia Tech a better place.
            </p>
          </Fieldset>

          <Fieldset legend="Main Skills">
            <SkillBadges />
            <p>
              I have been programming in a variety of languages and frameworks, and I've been working more with React
              (including react95), which is what this website is made from!
            </p>
          </Fieldset>

          <Fieldset legend="Clubs">
            <List>
              <List.Item>VG Dev (Game Development)</List.Item>
              <List.Item>GreyHat (Cybersecurity)</List.Item>
              <List.Item>Gourd Visual Arts</List.Item>
              <List.Item>Women @ College of Computing</List.Item>
            </List>
          </Fieldset>
        </Frame>
      </Tab>

      <Tab title="Programming Languages">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', ...pane }}>
          <Fieldset legend="Core Languages & Frameworks">
            <ul>
              <li className="resume-skills">Python</li>
              <ProgressBar percent={98} width="200px" />
              <li className="resume-skills">Java</li>
              <ProgressBar percent={95} width="200px" />
              <li className="resume-skills">SQL</li>
              <ProgressBar percent={95} width="200px" />
              <li className="resume-skills">C</li>
              <ProgressBar percent={70} width="200px" />
              <li className="resume-skills">C#</li>
              <ProgressBar percent={80} width="200px" />
              <li className="resume-skills">JavaScript</li>
              <ProgressBar percent={50} width="200px" />
            </ul>
          </Fieldset>

          <Fieldset legend="Styling & UI Craft">
            <ul>
              <li className="resume-skills">HTML5 & CSS</li>
              <ProgressBar percent={70} width="200px" />
              <li className="resume-skills">Tailwind CSS</li>
              <ProgressBar percent={70} width="200px" />
              <li className="resume-skills">React</li>
              <ProgressBar percent={70} width="200px" />
            </ul>
          </Fieldset>

          <Fieldset legend="Development & Operations">
            <ul>
              <li className="resume-skills">Git & GitHub</li>
              <ProgressBar percent={100} width="200px" />
              <li className="resume-skills">Android Studio</li>
              <ProgressBar percent={88} width="200px" />
              <li className="resume-skills">Docker</li>
              <ProgressBar percent={80} width="200px" />
            </ul>
          </Fieldset>

          <Fieldset legend="Other">
            <ul>
              <li className="resume-skills">Agile Framework</li>
              <li className="resume-skills">Jira</li>
              <li className="resume-skills">Unity</li>
              <li className="resume-skills">Procreate</li>
            </ul>
          </Fieldset>

          <Fieldset legend="Relevant Coursework">
            <ul>
              <li className="resume-skills">Data Structures and Algorithms CS2340</li>
              <li className="resume-skills">Algorithms CS3510</li>
              <li className="resume-skills">Intro to Artificial Intelligence CS3600</li>
              <li className="resume-skills">Intro to Object-Oriented Programming CS1331</li>
              <li className="resume-skills">Databases CS4400</li>
              <li className="resume-skills">Objects and Design CS2340</li>
              <li className="resume-skills">Computer Organization and Programming CS2110</li>
              <li className="resume-skills">Systems and Networks CS2200</li>
            </ul>
          </Fieldset>

          <Fieldset legend="Skills Quick Reference" style={{ width: '100%' }}>
            <SkillBadges />
          </Fieldset>
        </div>
      </Tab>
    </Tabs>
    </div>
  );
}

export default AboutMe;