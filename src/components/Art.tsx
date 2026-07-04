import {  Fieldset,  Tab, Tabs,  Frame } from '@react95/core';
// @ts-ignore
import Sprite1 from '/assets/art/Spite1.PNG';
// @ts-ignore
import Sprite2 from '/assets/art/Spite1.PNG';
function Art(){
    return(
        <Tabs defaultActiveTab="Personal">
            <Tab title = "Game Assets">
                <Frame title = "Sprites">
                <Fieldset title = "Sprites"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr",gap: "10px"}}>
                <img src={Sprite1} style = {{height: "auto", width: "80%"}}></img>
                <img src={Sprite2} style = {{height: "auto", width: "80%"}}></img>
                <img src="/assets/art/forsakenmenu.PNG" style = {{height: "auto", width: "80%"}}></img>
                <img src="/assets/art/hypermaniamenu.PNG" style = {{height: "auto", width: "80%"}}></img>

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
            <img src="/assets/art/art4.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/art5.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/art6.jpg" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/art7.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/art8.png" style = {{height: "auto", width: "80%"}}></img>
            <img src="/assets/art/art9.png" style = {{height: "auto", width: "80%"}}></img>
            </div>
            </Frame>
            </Tab>

                </Tabs>

    )
}
export default Art;
