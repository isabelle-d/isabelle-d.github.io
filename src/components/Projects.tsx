import { useEffect, useRef, useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import { Fieldset, Tab, Tabs, Button, Video } from '@react95/core';

// Largest size any game screenshot is allowed to display at.
const MAX_IMG_W = 520;
const MAX_IMG_H = 300;

// Windows 95 bevels: raised for panels, sunken for text/picture wells.
const bevelOut = {
    borderTop: '2px solid #ffffff',
    borderLeft: '2px solid #ffffff',
    borderRight: '2px solid #404040',
    borderBottom: '2px solid #404040',
} as const;
const bevelIn = {
    borderTop: '2px solid #808080',
    borderLeft: '2px solid #808080',
    borderRight: '2px solid #ffffff',
    borderBottom: '2px solid #ffffff',
} as const;

type GameCardProps = {
    title: string;
    blurb: ReactNode;
    skills: ReactNode;
    links: { label: string; url: string }[];
    image?: string;
    onOpen: (url: string) => void;
};

// One game = one mini Windows 95 window: title bar, readable text well,
// buttons, then a size-capped picture underneath.
function GameCard({ title, blurb, skills, links, image, onOpen }: GameCardProps) {
    return (
        <div style={{ background: '#c0c0c0', ...bevelOut, boxShadow: '1px 1px 0 #000', padding: '3px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{
                background: 'linear-gradient(90deg, #000080, #1084d0)',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '15px',
                padding: '3px 8px',
            }}>
                {title}
            </div>

            <div style={{ padding: '10px' }}>
                <div style={{ background: '#ffffff', color: '#000000', ...bevelIn, padding: '10px 12px', lineHeight: 1.5, fontSize: '14px' }}>
                    <p style={{ margin: '0 0 8px 0' }}>{blurb}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#000080' }}>
                        <b>Skills:</b> {skills}
                    </p>
                </div>

                {links.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '10px 0' }}>
                        {links.map((l) => (
                            <Button key={l.label} onClick={() => onOpen(l.url)}>{l.label}</Button>
                        ))}
                    </div>
                )}

                {image && (
                    <div style={{
                        ...bevelIn,
                        background: '#000000',
                        padding: '4px',
                        display: 'flex',
                        justifyContent: 'center',
                        maxWidth: `${MAX_IMG_W + 12}px`,
                        boxSizing: 'border-box',
                        marginTop: links.length > 0 ? 0 : '10px',
                    }}>
                        <img
                            src={image}
                            alt={title}
                            style={{
                                display: 'block',
                                width: 'auto',
                                height: 'auto',
                                maxWidth: `${MAX_IMG_W}px`,
                                maxHeight: `${MAX_IMG_H}px`,
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function Projects() {
    const goToLink = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    }

    const wrapRef = useRef<HTMLDivElement>(null);
    const [paneH, setPaneH] = useState(400);

    // Measure the window's content area so every tab pane fills it and
    // scrolls inside it, including after the window is resized.
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
        overflowX: "hidden",
        padding: "0 40px", // left/right margins; raise or lower to taste
        height: `${paneH}px`,
        boxSizing: "border-box",
    } as const;

    return (
        <div ref={wrapRef} style={{ height: "100%", width: "100%" }}>
        <Tabs defaultActiveTab="Distributed Systems & Infrastructure">
        <Tab title="Distributed Systems & Infrastructure">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', ...pane }}>
                <h2>Distributed Systems & Infrastructure</h2>
                <p>I've worked on a variety of distributed systems and infrastructure projects through personal projects and classes at Georgia Tech
                    This includes a web crawler and searcher, a memcached system, and a distributed page rank alogirhtm along with complex analysis for each included in each linked repository
                </p>
                <Fieldset>
                    <h3>Web Crawler and Searcher</h3>
                    <p>A web crawler and searcher built with Apache Nutch and Solr. Repo includes extensive documentation, analysis. Main addition was python file for data processing.</p>
                    <Button onClick={() => goToLink("https://github.com/isabelle-d/Apache-Nutch-Solr-Index-and-Search")} style={{ backgroundColor: 'lightblue' }}>Repo</Button>
                </Fieldset>
                <Fieldset>
                    <h3>Memcached System</h3>
                    <p>A memcached system built for handling high-volume data caching. Repo includes implementation details and performance analysis. </p>
                    <Button onClick={() => goToLink("https://github.com/isabelle-d/Memcached-Testing")} style={{ backgroundColor: 'lightblue' }}>Repo</Button>
                </Fieldset>
                <Fieldset>
                    <h3>Distributed Page Rank Algorithm</h3>
                    <p>A distributed page rank algorithm built with Apache Spark. Repo includes implementation details and performance analysis. Main addition was python file for injecting data and also analysis scripts.</p>
                    <Button onClick={() => goToLink("https://github.com/isabelle-d/Apache-Spark-Page-Rank")} style={{ backgroundColor: 'lightblue' }}>Repo</Button>
                </Fieldset>
            </div>
        </Tab>

        <Tab title="Systems & Networking">
            <div style={pane}>
                <h2>Systems & Networking</h2>
                <p>
                    Five projects from CS 2200 (Computer Systems and Networks), Spring 2026, taking a machine from
                    the circuit level up to the network. The repos aren't public because they're graded coursework,
                    so each one is described below.
                </p>

                <Fieldset>
                    <h3>Reliable Transport Protocol (Networking)</h3>
                    <p>Built a custom transport layer, RTP, on top of a simulated network. It splits messages into packets and reassembles them,
                        uses a checksum to detect corrupted data, and recovers with stop-and-wait using ACKs, NACKs and retransmission.
                        Sender and receiver threads run concurrently with locking on the shared state, and the code is free of memory leaks.
                        A client sends ROT13-encrypted messages to a server, which replies with the decrypted text.</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>C, pthreads, network protocols, checksums</p>
                </Fieldset>

                <Fieldset>
                    <h3>Process Scheduling</h3>
                    <p>Wrote the CPU scheduler for a multiprocessor OS simulator that uses one pthread per CPU.
                        Implemented FCFS, Round Robin, Preemptive Priority and Shortest Remaining Time First, with mutexes and
                        condition variables protecting the ready queue and avoiding race conditions. Analyzed the scheduling stats,
                        including the priority inversion problem.</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>C, pthreads, mutexes, condition variables, GDB, Valgrind</p>
                </Fieldset>

                <Fieldset>
                    <h3>Virtual Memory</h3>
                    <p>Implemented core parts of a virtual memory simulator: virtual address splitting, page table and process setup,
                        the page fault handler, context switching and process cleanup.
                        Wrote the Second Chance (clock sweep) and Approximate LRU frame eviction algorithms,
                        and computed Average Memory Access Time.</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>C, paging, page replacement, AMAT, GDB</p>
                </Fieldset>

                <Fieldset>
                    <h3>Interrupts (LC-5200a)</h3>
                    <p>Upgraded the processor from Project 1 so programs can be interrupted. Added the interrupt macrostate and
                        new instructions (EI, DI, IN, RETI), wired up a timer device and a distance tracker, and wrote the assembly
                        for the interrupt vector table and handlers that drive them.</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>CircuitSim, microcode, assembly, interrupt handling</p>
                </Fieldset>

                <Fieldset>
                    <h3>LC-5200 Datapath</h3>
                    <p>Designed and built a working 32-bit processor in CircuitSim: an ALU, register file, sign extender and
                        fetch logic, plus a microcoded control unit implemented as a finite state machine.
                        Finished by running a provided exponentiation program on the machine.</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>CircuitSim, digital logic, microcode, ISA design</p>
                </Fieldset>
            </div>
        </Tab>

        <Tab title="Cybersecurity">
            <div style={pane}>
                <h2>Cybersecurity</h2>
                <p>
                    Three projects from CS 3235 (Computer Security). All attacks were developed and tested in
                    environments the course provided, with permission. The repos are private under the course
                    Honor Code, so each project is summarized below.
                </p>

                <Fieldset>
                    <h3>Application Security: Control-Flow Hijacking</h3>
                    <p>Wrote exploits for eight vulnerable C programs inside a locked-down VM, using only GDB and Python.
                        Techniques ranged from overwriting stack variables and return addresses to injecting shellcode, overflows
                        through an unchecked integer count, and indirect return-address overwrites.
                        Later targets added defenses: bypassing DEP, handling a randomized stack position, and building a
                        return-oriented programming (ROP) chain that calls setuid and execve to open a root shell.</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>C, x86_64 assembly, GDB, buffer overflows, shellcode, ROP, Python</p>
                </Fieldset>

                <Fieldset>
                    <h3>Applied Cryptography Attacks</h3>
                    <p>Attacked vulnerable uses of cryptography against a course-provided server.
                        Forged an API token with a SHA-256 length extension attack, generated MD5 collisions to create two programs with
                        the same hash but different behavior, decrypted messages with a CBC padding oracle without the key, and
                        forged RSA signatures by exploiting weak PKCS#1 v1.5 padding checks with e=3 (Bleichenbacher's attack).</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>Python, SHA-256, MD5, AES-CBC, RSA, HTTP</p>
                </Fieldset>

                <Fieldset>
                    <h3>Web Security: SQLi, XSS and CSRF</h3>
                    <p>Attacked a deliberately insecure university website built for the course. With SQL injection I
                        extracted the database schema and tables, took over an account, added a new one, and got past a login form that
                        escaped input and hashed passwords. With cross-site scripting I stole viewers' data, got around a
                        filter, and built a self-spreading worm. With cross-site request forgery I changed another user's grade and
                        got around a CSRF token defense.</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>SQL, SQLite, JavaScript, HTML, Python, browser dev tools</p>
                </Fieldset>
            </div>
        </Tab>

        <Tab title='App Development'>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', ...pane }}>
            <h2> Spendwise App</h2>
            <p>This was a semester long team project to create a budgeting and expense management app with a custom chatbot and collaborative features. Git and Github was used for version control and jira was used for project management. Used a sprint planning approach to manage development cycles.</p>
            <p>Our team’s goal was to create an easy way for users to manage budgets and expenses, interact with a custom chatbot, and collaborate through shared savings groups.</p>
            <Button onClick={() => goToLink("https://github.com/isabelle-d/isabelle-d.github.spendwise.io")} style={{ backgroundColor: 'lightblue' }}>Repo</Button>
            <Video src="/assets/Sprint 4 demo.mp4" style={{ height: "auto", width: "100%" }}
            videoProps={{
                controls: true,
                muted: false,
                autoPlay: false,
                // Start 2 seconds in. Set once when the video's metadata loads.
                onLoadedMetadata: (e: SyntheticEvent<HTMLVideoElement>) => {
                    e.currentTarget.currentTime = 2;
                },
            }}></Video>
            <Fieldset style={{ width: "100%" }}>
                <h3>Equity Voice</h3>
                <p>A hackathon project built in 24 hours. Equity Voice is a dashboard that shows employers possible gender and racial pay gaps,
                    and gives them a sandbox to test fixes. You can upload almost any reasonably formatted data and AI parses and analyzes it,
                    so the data doesn't have to match a fixed template. The sandbox lets employers try adjustments and see how the gaps change.</p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    AI, React, SQLite, JavaScript, HTML
                </p>
                <img src="assets/equityvoice.png" style={{ height: "auto", width: "100%" }}></img>

                <Button onClick={() => goToLink("https://equityvoice-2-0.vercel.app/")} style={{ backgroundColor: 'lightblue' }}>Website</Button>
                <Button onClick={() => goToLink("https://github.com/Rainameow/equityvoice-2.0")} style={{ backgroundColor: 'lightblue' }}>Repo</Button>
            </Fieldset>
            </div>
        </Tab>

        <Tab title="Game Development">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', ...pane }}>
                <div>
                    <h2 style={{ margin: '0 0 8px 0' }}>Game Development</h2>
                    <p style={{ margin: 0, lineHeight: 1.5 }}>I've worked on a variety of 2D games through the VG Dev club at Georgia Tech. Programming with C#, Game Engine Unity,
                    task management with jira and tagia, and 2D asset development via procreate and built in Unity Tools.  </p>
                </div>

                <GameCard
                    title="Current Crisis"
                    onOpen={goToLink}
                    blurb={<>A Vertical Integration Project focused on gaming to educate people about the dangers of fire on electric power grids.
                        Worked on graphics and UI programming through unity using C#. Collabortated with a team of over 40 people to bring to schools, summer camps, and events.</>}
                    skills={<>2D pixel art using <b>Aesprite</b>, Integration of UI via Unity, 3D modeling via <b>Magica Voxel</b></>}
                    links={[{ label: 'Website', url: 'https://currentcrisis.net/overview' }]}
                    image="/assets/currentCrisis.png"
                />

                <GameCard
                    title="Merks @ Werk"
                    onOpen={goToLink}
                    blurb={<>Merks @ Werk is a 2D pixel art shoot 'em up based on the arcade game Bosconian. I am the Art Lead on a team of <b>40+</b> students
                        building a fully fledged game over a single <b>~15 week</b> semester.</>}
                    skills="Art lead, 2D pixel art, team of 40+"
                    links={[{ label: 'Repo', url: 'https://github.com/ncaz/Merks-at-Werk' }]}
                    image="assets/art/game assets/merks.png"
                />

                <GameCard
                    title="Hypermania"
                    onOpen={goToLink}
                    blurb="Hypermania is a Spring 2026 traditional anime 1v1 fighting game with rhythm game elements.
                        Created the main menu graphics and UI assets and worked through unity with dynamic effects based on cursor position."
                    skills="2D graphics and UI, C#, Unity"
                    links={[{ label: 'Repo', url: 'https://github.com/raybbian/Hypermania' }]}
                    image="/assets/hypermania.png"
                />

                <GameCard
                    title="For / Saken"
                    onOpen={goToLink}
                    blurb="For/Saken is a Spring 2026 2D side-scrolling Action RPG. Worked on the main menu graphics through unity with atmospheric light and UI jitter effects. Managed via Git with custom 2D sprite rendering."
                    skills="2D UI and design, Unity, C# functionality via Unity Timelines and UI tools."
                    links={[{ label: 'Repo', url: 'https://github.com/Grace-Shao/Forsaken/tree/main' }]}
                    image="/assets/For_saken.png"
                />

                <GameCard
                    title="Back to Bassics"
                    onOpen={goToLink}
                    blurb="Back to Bassics is a Fall 2024 rhythm game mixing 2D and 3D elements. Created multiple sprites and incorportaed them into the game."
                    skills="2D sprite design (in 3D game), unity"
                    links={[{ label: 'Repo', url: 'https://github.com/Maurdeer/Back-to-Bassics' }]}
                    image="/assets/backTobassics.png"
                />
            </div>
        </Tab>

        <Tab title="Other Projects">
            <div style={pane}>
            <Fieldset title="Tournament AI Model (Top 20%)">
                <h3>Tournament AI Model (Top 20%)</h3>
                <p>Used ML model for a ai tournament. Started with a min max algorithm with alpha beta pruning and added elements of monte carlo tree search. </p>
                <img src="/assets/aitournament.png" style={{ height: "auto", width: "100%" }}></img>
                <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    ML Algorithms, Python, Pytorch, Neural Nets, Bayesian Prediction
                </p>
                <Button onClick={() => goToLink("https://github.com/isabelle-d/ByteFight2025")} style={{ backgroundColor: 'lightblue' }}>Repo</Button>
            </Fieldset>
            <Fieldset title="Maintence Analysis with Python">
                <h3>Maintenance Analysis with Python</h3>
                <p>Used a dataset of maintenance records to predict the probability of a machine breaking down as well as statistics about percentage or each type of maintence request, which buildings are the most problematic and more</p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    Python, Pandas, Matplotlib, Data Analysis, Data Visualization
                </p>
                <Button onClick={() => goToLink("https://github.com/isabelle-d/maintenance-report-processor.git")} style={{ backgroundColor: 'lightblue' }}>Repo</Button>
            </Fieldset>
            </div>
        </Tab>

        </Tabs>
        </div>
    )
}
export default Projects;