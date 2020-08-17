import React, { Suspense } from 'react';
import './App.css';

import schema from './config/schema.svg';

let isWs = false;
const ws = new WebSocket('ws://localhost:7777');

class Main extends React.Component 
{
  render()
  {

    document.onreadystatechange = async () => {
      
      if (!isWs) connectWs();

      // window.onunload = function() {
      //   ws.send(JSON.stringify({type: "pressedButton", id: "1kn00-016.1"}))
      // }

      let doc = document.getElementById('svgObject').contentDocument;
      let elements = doc.querySelectorAll("g");

        for (let elem of elements) {
          let desc = elem.querySelector("desc");

          if (desc != null) {
            if (desc.innerHTML == "button") {
              desc.parentNode.style.cursor = "pointer";
              
              if (elem.id == "g20117") continue;

              console.log(elem);
              
              elem.addEventListener('click', (e) => {
                let id = e.target.parentNode.parentNode.getAttribute("id");

                clickHandling(id);

                ws.send(JSON.stringify({type: "pressedButton", id: id}))
              });

            }
          }
        }
    }
    
    return (
      <div id="divSVG">
        <Suspense fallback={<div>Загрузка...</div>}>
          <object id="svgObject" data={schema} type="image/svg+xml" width="98.7%" height="85%" style={{ border: "1px solid black", backgroundColor: "white", marginLeft: "15px", marginTop: "10px" }}>
              Your browser doesn't support SVG
          </object>
        </Suspense>
      </div>
    );
  }
}

function connectWs()
{
  isWs = true;

  ws.onopen = () => {
    console.log("connected ws");
  }

  ws.onmessage = evt => {
    console.log(evt.data);
  }

  ws.onclose = () => {
    console.log('disconnected');
  }
}

function clickHandling(id)
{
  switch(id)
  { 
    //TP44
    case "1kn00-004.1":
      {
        window.open("http://localhost:3044");

        setTimeout(() =>
        {
          let lol = window.open("about:blank", "_self");
          lol.close();
        });
        break;
      }
    //Выход
    case "1kn00-016.1":
      {
        // window.opener = null;
        window.open("", "_self");
        window.close();
        break;
      }
  }
}
export default Main;
