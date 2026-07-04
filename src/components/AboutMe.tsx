import { Avatar, Fieldset, ProgressBar, Tab, Tabs, List, Frame} from '@react95/core';
//import { Shdocvw_259, Mcm_3201 } from "@react95/icons";
function AboutMe() {
  return (
    <Tabs defaultActiveTab="Intro">
      <Tab title="Intro">
         <Frame style ={{overflowY: "auto", height: "450px"}}>
        <h3>Hello I am Isabelle Darling!</h3>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <Avatar src="/assets/profile.png" alt="Creator" size="140px" />
        <Avatar src="/assets/art/LionMe.JPG" alt="Creator" size="140px" />
        <Avatar src="/assets/art/ChinaMe.JPG" alt="Creator" size="140px" />
        </div>

        <p>A Georgia Tech Computer Science Undergrad Student with threads in Cybersecurity and InfoInternetworks</p>
        <Fieldset>
          <p>
            I love writing code that has a tangible impact. One of my hobbies is game development in Unity both with a team and solo.
            I began to becoming interested in programming in high school after taking AP Computer Science Principles and AP Computer Science A.
            Since then I took all the computer science classes offered at my high school and have been pursuing a degree in computer science at Georgia Tech.
            I have been programming in a variety of languages and frameworks including Python, Java, C, C#, and JavaScript. I have also worked with HTML, CSS, and Tailwind CSS for web development.
            I also have been working more with react (including react95) which is what this website is made from!
          </p>
        </Fieldset>
        </Frame>
      </Tab>
      <Tab title="Programming Languages">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', overflowY: "auto", height: "400px"}}>

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
        </div>
      </Tab>
      <Tab title="Interests">
        <Fieldset legend="Core Attributes" style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: "auto", height: "400px"}}>
          <p>
            Outside of school I work on game development and I am passionate about art and graphic design. I always enjoy making things that have meaning and function for others and enjoy working in a team.
          </p>
          <Fieldset title='Currently'>
          <h2>Currently!</h2>
          <p> I am currently employed as a Resident Assistant at Georgia Tech. I began my sophomore year with this role and have been enjoying the experience. I work to create a positive living environment for my residents and work on miitgating conflict, running events, and working as a team to make Georgia Tech a better place.</p>
          <p>I am also involved in various extracurricular activities and projects that allow me to apply my skills and contribute to the community.</p>
          <p>I plan to graduate a year early in spring 2026 and pursue a masters degree in computing systems at Georgia Tech.</p>
        </Fieldset>
          <Fieldset legend='Clubs'>
          <List>
            <List.Item>VG Dev (Game Development)</List.Item>
            <List.Item>GreyHat (Cybersecurity)</List.Item>
            <List.Item>Gourd Visual Arts</List.Item>
            <List.Item>Women @ College of Computing</List.Item>
          </List>
        </Fieldset>

        </Fieldset>
      </Tab>
    </Tabs>
  );
}

export default AboutMe;