import './App.css'
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
// import { SearchAddon } from 'xterm-addon-search';
// import { AttachAddon } from 'xterm-addon-attach';
import {useEffect} from "react";
import IconAccessibility from '~icons/carbon/accessibility'
import IconBtn from "./components/IconBtn";

document.body.addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
        return false;
    },
    { passive: false }
);

const term = new Terminal({
    cursorBlink: true,
    cursorStyle: 'block',
    fontSize: 14,
    fontWeight: 'normal',
    fontWeightBold: 'bold',
    lineHeight: 1,
    theme: {
        background: '#141729',
        foreground: '#01CC74'
    },
});
const fitAddon = new FitAddon();
term.loadAddon(new WebLinksAddon());
term.loadAddon(fitAddon);
// terminal.loadAddon(new SearchAddon());
const sock = new WebSocket('ws://192.168.31.38:8080/websocket');

sock.addEventListener('open', () => {
    sock.send(
        JSON.stringify([
            "set_size",
            term.rows,
            term.cols,
            // window.innerHeight,
            // window.innerWidth
        ]))
});

sock.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data[0] == "stdout") {
        term.write(data[1]);
    } else if (data[0] == "stderr") {
        term.write(data[1]);
    } else if (data[0] == "set_size") {
        term.resize(data[1], data[2]);
    }
})

term.onData(function(data) {
    sock.send(JSON.stringify(["stdin", data]));
})

sock.addEventListener('close', function() {
    console.log('close')
    term.writeln("");
    term.writeln("Connection closed.");
});

window.onresize = function() {
    fitAddon.fit()
    sock.send(
        JSON.stringify([
            "set_size",
            term.rows,
            term.cols,
            // window.innerHeight,
            // window.innerWidth
        ]))
};

function App() {
    useEffect(() => {
        term.open(document.getElementById('terminal')!);
        fitAddon.fit()
    }, []);
  return (
      <div className="h-full flex flex-col">
          <div id="terminal" className="flex-1"></div>
          <div className="flex h-12 bg-gray-700 space-x-2 p-2">
              <IconBtn icon={<IconAccessibility className="icon-style" />  } onTap={() => console.log('click')}></IconBtn>
              <IconBtn icon={<IconAccessibility className="icon-style" />}></IconBtn>
              <IconBtn icon={<IconAccessibility className="icon-style" />}></IconBtn>
              <IconBtn icon={<IconAccessibility className="icon-style" />}></IconBtn>
          </div>
      </div>
  )
}

export default App
