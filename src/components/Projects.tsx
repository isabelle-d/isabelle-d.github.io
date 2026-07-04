import { Fieldset, Tab, Tabs, Button, Video } from '@react95/core';


function Projects(){
    const goToLink = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    }
       return(
        <Tabs defaultActiveTab="App Development">
        <Tab title = 'App Development'>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', overflowY: "auto", height: "400px"}}>
            <h2> Spendwise App</h2>
            <p>This was a semester long team project to create a budgeting and expense management app with a custom chatbot and collaborative features. Git and Github was used for version control and jira was used for project management. Used a sprint planning approach to manage development cycles.</p>
            <p>Our team’s goal was to create an easy way for users to manage budgets and expenses, interact with a custom chatbot, and collaborate through shared savings groups.</p>
            <Button onClick={() => goToLink("https://github.com/isabelle-d/isabelle-d.github.spendwise.io")} style={{backgroundColor: 'lightblue' }}>Repo</Button>
            <Video src = "/assets/Sprint 4 demo.mp4" style = {{height: "100%", width:"100%"}}
            videoProps={{controls: true,muted: false, autoPlay: false}}></Video>
            </div>
            </Tab>
        <Tab title = "Distributed Systems & Infrastructure">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', overflowY: "auto",overflowX: "auto", height: "400px", width: "100%"}}>
                <h2>Distributed Systems & Infrastructure</h2>
                <p>I've worked on a variety of distributed systems and infrastructure projects through personal projects and classes at Georgia Tech
                    This includes a web crawler and searcher, a memcached system, and a distributed page rank alogirhtm along with complex analysis for each included in each linked repository
                </p>
                <Fieldset>
                    <h3>Web Crawler and Searcher</h3>
                    <p>A web crawler and searcher built with Apache Nutch and Solr. Repo includes extensive documentation, analysis. Main addition was python file for data processing.</p>
                    <Button onClick={() => goToLink("https://github.com/isabelle-d/Apache-Nutch-Solr-Index-and-Search")} style={{backgroundColor: 'lightblue' }}>Repo</Button>
                </Fieldset>
                <Fieldset>
                    <h3>Memcached System</h3>
                    <p>A memcached system built for handling high-volume data caching. Repo includes implementation details and performance analysis. </p>
                    <Button onClick={() => goToLink("https://github.com/isabelle-d/Memcached-Testing")} style={{backgroundColor: 'lightblue' }}>Repo</Button>
                </Fieldset>
                <Fieldset>
                    <h3>Distributed Page Rank Algorithm</h3>
                    <p>A distributed page rank algorithm built with Apache Spark. Repo includes implementation details and performance analysis. Main addition was python file for injecting data and also analysis scripts.</p>
                    <Button onClick={() => goToLink("https://github.com/isabelle-d/Apache-Spark-Page-Rank")} style={{backgroundColor: 'lightblue' }}>Repo</Button>
                </Fieldset>
        </div>
        </Tab>
        <Tab title = "Game Development">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', overflowY: "auto", height: "400px"}}>
                <h2>Game Development</h2>
            <p>I've worked on a variety of 2D games through the VG Dev club at Georgia Tech. Programming with C#, Game Engine Unity,
                task management with jira and tagia, and 2D asset development via procreate and built in Unity Tools.  </p>
                    <Fieldset title = "Current Crisis" style= {{}}>
                    <h3>Current Crisis</h3>
                    <p>A Vertical Integration Project focused on gaming to educate people about the dangers of fire on electric power grids.
                        Worked on graphics and UI programming through unity using C#. Collabortated with a team of over 40 people to bring to schools, summer camps, and events.</p>
                         <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                            2D pixel art using <b>Aesprite</b>, Integration of UI via Unity, 3D modeling via <b>Magica Voxel</b>
                 </p>
                    <img src="/assets/currentCrisis.png" style = {{height: "auto", width:"100%"}}></img>
                    <Button onClick={() => goToLink("https://currentcrisis.net/overview")} style={{backgroundColor: 'lightblue' }}>Website</Button>
                    </Fieldset>

                    <div style={{ backgroundColor: '#d3d7dc', padding: '15px', marginTop: '-10px' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>Hypermania</h3>
                    <p style={{ margin: '0 0 5px 0' }}>
                    Hypermania is a Spring 2026 traditional anime 1v1 fighting game with rhythm game elements.
                    Created the main menu graphics and UI assets and worked through unity with dynamic effects based on cursor position.
                </p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    2D graphics and UI, C#, Unity
                     </p>
                    </div>
                    <Fieldset title = "Hypermania">
                        <img src="/assets/hypermania.png" style = {{height: "auto", width:"100%"}}></img>
                        <Button onClick={() => goToLink("https://github.com/raybbian/Hypermania")} style={{backgroundColor: 'lightblue' }}>Repo</Button>
                    </Fieldset>

                    <div style={{ backgroundColor: '#d3d7dc', padding: '15px', marginTop: '-10px' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>Forsaken</h3>
                    <p style={{ margin: '0 0 5px 0' }}>
                    For/Saken is a Spring 2026 2D side-scrolling Action RPG. Worked on the main menu graphics through unity with atmospheric light and UI jitter effects. Managed via Git with custom 2D sprite rendering.
                </p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    2D UI and design, Unity, C# functionality via Unity Timelines and UI tools.
                 </p>
                </div>
                    <Fieldset title = "For / Saken">
                        <img src="/assets/For_saken.png" style = {{height: "auto", width:"100%"}}></img>
                        <Button onClick={() => goToLink("https://github.com/Grace-Shao/Forsaken/tree/main")} style={{backgroundColor: 'lightblue' }}>Repo</Button>
                    </Fieldset>

                    <div style={{ backgroundColor: '#d3d7dc', padding: '15px',  marginTop: '-10px' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>Back to Bassics</h3>
                    <p style={{ margin: '0 0 5px 0' }}>
                    Back to Bassics is a Fall 2024 rhythm game mixing 2D and 3D elements. Created multiple sprites and incorportaed them into the game.
                </p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    2D sprite design (in 3D game), unity
                 </p>
                </div>
                    <Fieldset title = "Back To Bassics">
                        <img src="/assets/backTobassics.png" style = {{height: "auto", width:"100%"}}></img>
                        <Button onClick={() => goToLink("https://github.com/Maurdeer/Back-to-Bassics")} style={{backgroundColor: 'lightblue' }}>Repo</Button>
                    </Fieldset>
                </div>
        </Tab>
        <Tab title = "Other Projects">
            <div style ={{overflowY: "auto", height: "400px"}}>
            <Fieldset title ="Tournament AI Model (Top 20%)">
                <h3>Tournament AI Model (Top 20%)</h3>
                <p>Used ML model for a ai tournament. Started with a min max algorithm with alpha beta pruning and added elements of monte carlo tree search. </p>
                <img src="/assets/aitournament.png" style = {{height: "auto", width:"100%"}}></img>
                <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    ML Algorithms, Python, Pytorch, Neural Nets, Bayesian Prediction
                 </p>
                <Button onClick={() => goToLink("https://github.com/isabelle-d/ByteFight2025")} style={{backgroundColor: 'lightblue' }}>Repo</Button>

            </Fieldset>
            <Fieldset title = "Maintence Analysis with Python">
                <h3>Maintenance Analysis with Python</h3>
                <p>Used a dataset of maintenance records to predict the probability of a machine breaking down as well as statistics about percentage or each type of maintence request, which buildings are the most problematic and more</p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: 'darkblue' }}>
                    Python, Pandas, Matplotlib, Data Analysis, Data Visualization
                 </p>
                <p>Repo coming soon</p>

            </Fieldset>
            </div>
        </Tab>
        </Tabs>
    )
}
export default Projects;