import { Avatar, Checkbox, Fieldset, ProgressBar, Tab, Tabs, Button, Video, Frame } from '@react95/core';
function Art(){
    return(
        <Tabs defaultActiveTab="Personal">
            <Tab title = "Game Assets">
                <Frame title = "Sprites">
                <Fieldset title = "Sprites"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr",gap: "10px"}}>
                <img src="src/assets/art/Spite1.PNG" style = {{height: "auto", width: "80%"}}></img>
                <img src="src/assets/art/Sprite2.PNG" style = {{height: "auto", width: "80%"}}></img>
                <img src="src/assets/art/forsakenmenu.PNG" style = {{height: "auto", width: "80%"}}></img>
                <img src="src/assets/art/hypermaniamenu.PNG" style = {{height: "auto", width: "80%"}}></img>

                </Fieldset>
             </Frame>
            </Tab>
            <Tab title = "Personal">
            <Frame >
                <div title = "Ap art portfolio" style={{ display: "grid", gridTemplateColumns: "1fr 1fr",gap: "10px"}}>
            <img src="src/assets/art/Flicks.jpg" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/Art1.jpg" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/Art2.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/art3.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/art4.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/art5.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/art6.jpg" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/art7.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/art8.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="src/assets/art/art9.png" style = {{height: "auto", width: "80%"}}></img>
            </div>
            </Frame>
            </Tab>

                </Tabs>

    )
}
export default Art;