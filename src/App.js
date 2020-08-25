import React, { Suspense } from 'react';
import './App.css';

import schema from './config/schema.svg';
import {getOtherLine} from './getOtherLine.js';

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
    const message = JSON.parse(evt.data);
    console.log(message);

    if (message.lines != null )
    {
      for (let item of message.lines)
      {
        changeLine(item);
      }
    }
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

//Обработка входящего запроса на изменение линии
function changeLine(id)
{
  let doc = document.getElementById('svgObject').contentDocument;
  let svgUrl = getOtherLine(id, doc);

  if (svgUrl.url == 0) return;


  let newElement = document.createElement('div');
  newElement.setAttribute("id", "div" + id);
  newElement.setAttribute("style", 'opacity:0');

  newElement.innerHTML = `<object id="svgObject2" data=${svgUrl.url} type="image/svg+xml" width="1" height="1"> \
  Your browser doesnt support SVG \
  </object>`;

  let parent = document.getElementById("divSVG").parentNode;

  parent.appendChild(newElement);

  if (svgUrl.url != 0) {
    document.getElementById("svgObject2").addEventListener("load", function () {
      setTimeout(() => {
        let doc2 = document.getElementById('svgObject2').contentDocument;
        replaceLine(id, svgUrl.id, doc2);
      }, 1000);
    });

  } else {
    document.getElementById("div" + id).remove();
  }
}

//Непосредственная замена линии
function replaceLine(id, oldID, doc2)
{
  let doc = document.getElementById('svgObject').contentDocument;

  let selection = doc2.querySelector('g');

  //console.log(`oldID1: ${oldID}`);
  //console.log(`id1: ${id}`)
  //console.log(`selection: ${selection}`);

  if (!selection) return;

  let newElement = selection;
  let oldElement = doc.getElementById(oldID);

  if (oldElement == null) {
    document.getElementById("div" + id).remove();
    return;
  };

  //newElement.setAttribute("transform", oldElement.getAttribute("transform"));
  newElement.setAttribute("id", newElement.getAttribute("id"));

  let parentDiv = oldElement.parentNode;

  parentDiv.replaceChild(newElement, oldElement);
  document.getElementById("div" + id).remove();
}
export default Main;
