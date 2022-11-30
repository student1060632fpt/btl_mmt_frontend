import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import { makeid } from "../js/randomText";
const Receive = () => {
  let lastPeerId = null;
  let peer = null; // Own peer object
  let conn = null;
  const [value, setValue] = useState({
    recvId: "",
    status: "",
    randomText: "aaaa",
    sendMessageBox: "",
    message: null,
  });
  function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
      debug: 2,
    });
    console.log({ peer });
    peer.on("open", function (id) {
      // Workaround for peer.reconnect deleting previous id
      if (peer.id === null) {
        console.log("Received null id from peer open");
        peer.id = lastPeerId;
      } else {
        lastPeerId = peer.id;
      }
      setValue((prev) => ({
        ...prev,
        recvId: peer.id,
        status: "Awaiting connection...",
      }));
    });
    peer.on("connection", function (c) {
      // Allow only a single connection
      if (conn && conn?.open) {
        c.on("open", function () {
          c.send("Already connected to another client");
          setTimeout(function () {
            c.close();
          }, 500);
        });
        return;
      }

      conn = c;
      console.log({ conn });
      console.log("Connected to: " + conn.peer);
      setValue((prev) => ({ ...prev, status: "Connected" }));
      ready();
    });
    peer.on("disconnected", function () {
      setValue((prev) => ({
        ...prev,
        status: "Connection lost. Please reconnect",
      }));
      console.log("Connection lost. Please reconnect");
      // Workaround for peer.reconnect deleting previous id
      peer.id = lastPeerId;
      peer._lastServerId = lastPeerId;
      peer.reconnect();
    });
    peer.on("close", function () {
      conn = null;
      setValue((prev) => ({
        ...prev,
        status: "Connection destroyed. Please refresh",
      }));
      console.log("Connection destroyed");
    });
    peer.on("error", function (err) {
      console.log(err);
      alert("" + err);
    });
  }

  /**
   * Triggered once a connection has been achieved.
   * Defines callbacks to handle incoming data and connection events.
   */
  function ready() {
    conn.on("data", function (data) {
      console.log("Data recieved");
      let cueString = '<span className="cueMsg">Cue: </span>';
      switch (data) {
        case "Go":
          go();
          addMessage(cueString + data);
          break;
        case "Fade":
          fade();
          addMessage(cueString + data);
          break;
        case "Off":
          off();
          addMessage(cueString + data);
          break;
        case "Reset":
          reset();
          addMessage(cueString + data);
          break;
        default:
          addMessage('<span className="peerMsg">Peer: </span>' + data);
          break;
      }
    });
    conn.on("close", function () {
      setValue((prev) => ({
        ...prev,
        status: "Connection reset<br>Awaiting connection...",
      }));
      conn = null;
    });
  }

  function go() {
    return;
  }

  function fade() {
    return;
  }

  function off() {
    return;
  }

  function reset() {
    return;
  }

  function addMessage(msg) {
    let now = new Date();
    let h = now.getHours();
    let m = addZero(now.getMinutes());
    let s = addZero(now.getSeconds());

    if (h > 12) h -= 12;
    else if (h === 0) h = 12;

    function addZero(t) {
      if (t < 10) t = "0" + t;
      return t;
    }

    let message = (
      <>
        {" "}
        <br />
        <span className="msg-time">
          {" "}
          {h}:{m}:{s}
        </span>{" "}
        - {msg} {value.message}
        <br />
      </>
    );
    setValue((prev) => ({ ...prev, message }));
  }

  function clearMessages() {
    setValue((prev) => ({ ...prev, message: "" }));
    addMessage("Msgs cleared");
  }

  useEffect(() => {
    initialize();
  }, [value]);

  const onSubmit = () => {
    console.log({ conn, a: conn?.open });
    if (conn && conn?.open) {
      let msg = value.sendMessageBox;
      setValue((prev) => ({ ...prev, sendMessageBox: "" }));
      conn.send(msg);
      console.log("Sent: " + msg);
      addMessage('<span class="selfMsg">Self: </span>' + msg);
    } else {
      console.log("Connection is closed");
    }
  };

  const randomMess = () => {
    const randomText = makeid(5);
    setValue((prev) => ({ ...prev, sendMessageBox: randomText, randomText }));
  };

  const handleChangeMessageBox = (event) =>
    setValue((prev) => ({ ...prev, sendMessageBox: event.target.value }));
  return (
    <div>
      <table className="display">
        <tbody>
          <tr>
            <td className="title">Status:</td>
            <td className="title">Messages:</td>
          </tr>
          <tr>
            <td>
              <div
                id="receiver-id"
                style={{ fontWeight: "bold" }}
                title="Copy this ID to the input on send.html."
              >
                ID: {value.recvId}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(value.recvId)}
              >
                copy
              </button>
            </td>
            <td>
              <button onClick={randomMess}>make random</button>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  id="sendMessageBox"
                  placeholder="Enter a message..."
                  autoFocus
                  value={value.sendMessageBox}
                  onChange={handleChangeMessageBox}
                />
                <button type="button" onClick={onSubmit} id="sendButton">
                  Send
                </button>
                <button
                  type="button"
                  id="clearMsgsButton"
                  onClick={clearMessages}
                >
                  Clear Msgs (Local)
                </button>
              </form>
            </td>
          </tr>
          <tr>
            <td>
              <div id="status" className="status" /> {value.status}
            </td>
            <td>
              <div className="message" id="message">
                {value?.message}
              </div>
            </td>
          </tr>
          <tr>
            <td className="display-box standby" id="standby">
              <h2>Standby</h2>
            </td>
            <td className="display-box hidden" id="go">
              <h2>Go</h2>
            </td>
          </tr>
          <tr>
            <td className="display-box hidden" id="fade">
              <h2>Fade</h2>
            </td>
            <td className="display-box hidden" id="off">
              <h2>All Off</h2>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Receive;
