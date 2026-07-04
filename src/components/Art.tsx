import {  Fieldset,  Tab, Tabs,  Frame } from '@react95/core';

function Art(){
    return(
        <Tabs defaultActiveTab="Personal">
            <Tab title = "Game Assets">
                <Frame title = "Sprites">
                <Fieldset title = "Sprites"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr",gap: "10px"}}>
                <img src="assets/art/Sprite1.PNG" style = {{height: "auto", width: "80%"}}></img>
                <img src="assets/art/sprite2.PNG" style = {{height: "auto", width: "80%"}}></img>
                <img src="assets/art/for.PNG" style = {{height: "auto", width: "80%"}}></img>
                <img src="assets/art/hypermaniaMenu.PNG" style = {{height: "auto", width: "80%"}}></img>

                </Fieldset>
             </Frame>
            </Tab>
            <Tab title = "Personal">
            <Frame >
                <div title = "Ap art portfolio" style={{ display: "grid", gridTemplateColumns: "1fr 1fr",gap: "10px"}}>
            <img src="/assets/art/Flicks.jpg" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/Art2.PNG" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/Art1.JPG" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/art3.PNG" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/Art4.PNG" style = {{height: "auto", width: "80%"}}></img>
            <img src="assets/art/art5.PNG" style = {{height: "auto", width: "80%"}}></img>
            <img src="assets/art/Art6.jpg" style = {{height: "auto", width: "80%"}}></img>
            <img src="assets/art/art7.PNG" style = {{height: "auto", width: "80%"}}></img>
            <img src="assets/art/art8.PNG" style = {{height: "auto", width: "80%"}}></img>
            <img src="assets/art/art9.PNG" style = {{height: "auto", width: "80%"}}></img>
            </div>
            </Frame>
            </Tab>

                </Tabs>

    )
}
export default Art;
