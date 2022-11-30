import React from "react";

const Send = () => {
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
                <span style={{ fontWeight: "bold" }}>ID: </span>
                <input
                  type="text"
                  id="receiver-id"
                  title="Input the ID from receive.html"
                />
                <button id="connect-button">Connect</button>
              </td>
              <td>
                <input
                  type="text"
                  id="sendMessageBox"
                  placeholder="Enter a message..."
                  autofocus="true"
                />
                <button type="button" id="sendButton">
                  Send
                </button>
                <button type="button" id="clearMsgsButton">
                  Clear Msgs (Local)
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div id="status" className="status" />
              </td>
              <td>
                <div className="message" id="message" />
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
