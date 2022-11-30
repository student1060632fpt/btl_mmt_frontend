import React, { useEffect, useState } from "react";
import Peer from "peerjs";

const Send = () => {
  let lastPeerId = null;
  let peer = null; // own peer object
  let conn = null;
  const [value, setValue] = useState({
    recvIdInput: "",
    status: "",
    randomText: "aaaa",
    sendMessageBox: "",
    message: null,
  });

  function initialize() {
    // Create own peer object with connection to shared PeerJS server
    //thay vì null có thể để thành id mình mún
    peer = new Peer(null, {
      debug: 2,
    });
    console.log({peer});

    peer.on("open", function (id) {
      // Workaround for peer.reconnect deleting previous id
      if (peer?.id === null) {
        console.log("Received null id from peer open");
        peer.id = lastPeerId;
      } else {
        lastPeerId = peer?.id;
      }

      console.log("ID: " + peer?.id);
    });
    peer.on("connection", function (c) {
      // Disallow incoming connections
      c.on("open", function () {
        c.send("Sender does not accept incoming connections");
        setTimeout(function () {
          c.close();
        }, 500);
      });
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
   * Create the connection between the two Peers.
   *
   * Sets up callbacks that handle any events related to the
   * connection and data received on it.
   */
  function join(e) {
    e.preventDefault();
    // Close old connection
    if (conn ) {
      conn.close();
    }
    // Create connection to destination peer specified in the input field
    console.log( "conn",conn, "peer",peer );
    conn = peer?.connect(value.recvIdInput, {
      reliable: true,
    });

    conn?.on("open", function () {
      setValue((prev) => ({ ...prev, status: "Connected to: " + conn.peer }));
      console.log("Connected to: " + conn.peer);

      // Check URL params for comamnds that should be sent immediately
      let command = getUrlParam("command");
      if (command) conn.send(command);
    });
    // Handle incoming data (messages only since this is the signal sender)
    conn?.on("data", function (data) {
      addMessage('<span className="peerMsg">Peer:</span> ' + data);
    });
    conn?.on("close", function () {
      setValue((prev) => ({ ...prev, status: "Connection closed" }));
    });
  }

  function getUrlParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regexS = "[\\?&]" + name + "=([^&#]*)";
    let regex = new RegExp(regexS);
    let results = regex.exec(window.location.href);
    if (results == null) return null;
    else return results[1];
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
    let message = <> <br/><span className="msg-time"> {h}:{m}:{s}</span> - {msg} {value.message}<br/></>;
    setValue((prev) => ({ ...prev, message }));
  }

  function clearMessages() {
    setValue((prev) => ({ ...prev, message:"" }));
    addMessage("Msgs cleared");
  }

  const onSubmit = () => {
    if (conn && conn.open) {
      let msg = value.sendMessageBox;
      setValue((prev) => ({ ...prev, sendMessageBox: "" }));
      conn.send(msg);
      console.log("Sent: " + msg);
      addMessage('<span class="selfMsg">Self: </span> ' + msg);
    } else {
      console.log("Connection is closed");
    }
  };

  const handleChangeIdInput = (event) => {
    setValue((prev) => ({ ...prev, recvIdInput: event.target.value }));
  };

  useEffect(() => {
    initialize();
  }, [value]);
  return (
    <div>
      <div>
        <h1>Peer-to-Peer Cue System --- Sender</h1>
        <table className="control">
          <tbody>
            <tr>
              <td className="title">Status:</td>
              <td className="title">Messages:</td>
            </tr>
            <tr>
              <td>
                <form onSubmit={join}>
                  <span style={{ fontWeight: "bold" }}>ID: </span>
                  <input
                    type="text"
                    name="receiver-id"
                    id="receiver-id"
                    value={value.recvIdInput}
                    onChange={handleChangeIdInput}
                    title="Input the ID from receive.html"
                  />
                  <button id="connect-button" onClick={join}>
                    Connect
                  </button>
                </form>
              </td>
              <td>
                <form onSubmit={onSubmit}></form>
                <input
                  type="text"
                  id="sendMessageBox"
                  placeholder="Enter a message..."
                  autoFocus
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
              </td>
            </tr>
            <tr>
              <td>
                <div id="status" className="status" />
              </td>
              <td>
                <div className="message" id="message">
                  {value.message}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  type="button"
                  className="control-button"
                  id="resetButton"
                >
                  Reset
                </button>
              </td>
              <td>
                <button type="button" className="control-button" id="goButton">
                  Go
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  type="button"
                  className="control-button"
                  id="fadeButton"
                >
                  Fade
                </button>
              </td>
              <td>
                <button type="button" className="control-button" id="offButton">
                  Off
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Send;
