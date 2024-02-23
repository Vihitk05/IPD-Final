"use client";
import {
  BsFillTelephoneFill,
  BsFillCameraVideoFill,
  BsFillEmojiLaughingFill,
} from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { IoSendSharp } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router";
import { Bars } from "react-loader-spinner";

const socket = io("http://localhost:5000"); // Corrected server address

export default function EmpChatWindow() {
  const [c_message, setMessage] = useState("");
  const [messagesArray, setMessagesArray] = useState([]);
  const [ticketStatus, setTicketStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderTotal, setOrderTotal] = useState("");
  const [updateButton, setUpdateButton] = useState(false);
  const [selectedUpdateStatus, setSelectedUpdateStatus] = useState(ticketStatus);
  const [customedetails, setCustomerDetails] = useState([]);
  const { tid, cid } = useParams();
  let colors = {
    resolved: "green",
    delivered: "green",
    assigned: "red",
    pending: "orange",
  };

  const options = ["assigned", "pending", "resolved"];
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const apiUrl1 = "http://127.0.0.1:5000/customer?mobile=9137357003"; // Replace with your API URL
    fetch(apiUrl1)
      .then((response) => response.json())
      .then((data) => {
        console.log(data["data"][0]);
        setCustomerDetails(data["data"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    console.log(tid, cid);
    const apiUrl = "http://127.0.0.1:5000/ticket?ticket=" + tid; // Replace with your API URL
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setTicketStatus(data["data"]["status"]);
        setMessagesArray(data["data"]["messages"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/order?order_id=1099"; // Replace with your API URL

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setOrderDetails(data["data"]["products"]);
        setOrderStatus(data["data"]["status"]);
        setOrderTotal(data["data"]["total"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getCurrentTime = () => {
    let timeStamp = new Date();
    const hours = timeStamp.getHours().toString().padStart(2, "0");
    const minutes = timeStamp.getMinutes().toString().padStart(2, "0");
    const seconds = timeStamp.getSeconds().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}:${seconds}`;
    return currentTime;
  };

  useEffect(() => {
    const handleSocketMessage = (message) => {
      const newMessage = {
        message,
        sender: "customer",
        created_at: getCurrentTime(),
      };
      setMessagesArray([...messagesArray, newMessage]);
    };

    socket.on("message", handleSocketMessage);
    return () => {
      socket.off("message", handleSocketMessage);
    };
  }, [messagesArray]);

  const updateTicketStatus = () => {
    setUpdateButton(true);
    const apiUrl = "http://127.0.0.1:5000/ticket?update=True";
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        ticket_id: tid,
        status: selectedUpdateStatus,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setTicketStatus(json["data"]["status"]);
        setUpdateButton(false);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      message: c_message,
      sender: "agent",
      created_at: getCurrentTime(),
    };
    setMessagesArray([...messagesArray, newMessage]);
    setMessage(""); // Clear the input field
    const apiUrl = "http://127.0.0.1:5000/conversation";
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        ticket_id: tid,
        message: {
          message: c_message,
          sender: "agent",
          created_at: getCurrentTime(),
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setMessagesArray(json["data"]["messages"]);
      });
    socket.emit("send_message", newMessage);
  };

  const selectedStatus = (e) => {
    setSelectedUpdateStatus(e.target.value);
  };
  return (
    <div className="flex flex-row justify-around my-4 ">
      <div className=" bg-[#EEEEEE] h-screen w-[69%] rounded">
        <div className="relative h-[8%]">
          <div className="absolute inset-x-0 rounded-t-lg flex flex-row top-0 h-[100%] bg-[#086CC4]">
            <div id="cust_info" className="w-[85%]">
              <h4 className="text-xl font-bold text-white my-4 mx-4">
                {customedetails["name"]}
              </h4>
            </div>
            <div
              id="conn_icons"
              className="w-[15%] flex flex-row justify-around items-center"
            >
              <BsFillTelephoneFill size={20} style={{ color: "white" }} />
              <BsFillCameraVideoFill size={20} style={{ color: "white" }} />
              <FiMoreVertical size={20} style={{ color: "white" }} />
            </div>
          </div>
        </div>
        <div className="h-[84%] mb-6 overflow-auto">
          {messagesArray.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "agent"
                  ? "flex justify-end mt-2 mr-2"
                  : "flex justify-start mt-2 ml-2"
              }
            >
              <div
                className={
                  msg.sender === "agent"
                    ? "text-right justify-end pt-4 pb-2 px-4 bg-white w-[fit-content] rounded-md message-slide-up"
                    : "text-left justify-start text-white pt-4 pb-2 px-4 w-[fit-content] bg-[#086CC4] rounded-md message-slide-up"
                }
                style={{ maxWidth: "48%", wordWrap: "break-word" }}
              >
                <p className="text-lg font-medium">{msg.message}</p>
                <p className="text-right text-sm font-medium">
                  {msg.created_at}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative h-[6%]">
          <div className="absolute inset-x-0 bottom-0 h-16">
            <form onSubmit={handleSubmit} className="mx-8">
              <div
                id="inputs"
                className="flex flex-row bg-white rounded-md justify-around items-center"
              >
                <div id="element1" className="w-[3%] flex ml-2">
                  <button>
                    <BsFillEmojiLaughingFill size={25} />
                  </button>
                </div>
                <div id="element2" className="w-[3%] flex">
                  <AiOutlinePlus size={25} />
                </div>
                <div id="element3" className="w-[88%]">
                  <input
                    className="w-full appearance-none rounded-[5px] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Write a message..."
                    value={c_message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div id="element4" className="w-[3%] flex">
                  <button type="submit">
                    <IoSendSharp size={25} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="">
        <div className="bg-[#eeeeee] py-4 rounded-lg">
          <h1 className="text-2xl font-bold text-black pb-1 text-center">
            Ticket Information
          </h1>
          <hr className="p-[1px] bg-black" />
          <div className="p-4">
            <p className="text-xl mb-3">
              TicketID: <span className="font-bold">#{tid}</span>
            </p>
            <hr className="p-[1px] bg-[#a7a7a7]" />
            <p className="text-xl mb-2">Order Details:</p>
            {Array.isArray(orderDetails) ? (
              <div>
                <div className="border border-black p-2 mb-4 rounded border-solid">
                  {orderDetails.map((order, index) => (
                    <div key={index}>
                      <p
                        className="flex justify-between"
                        style={{ textTransform: "capitalize" }}
                      >
                        <span>
                          {order.color} {order.name}
                        </span>
                        <span className="font-bold">₹{order.price}</span>
                      </p>
                    </div>
                  ))}
                  <hr className="p-[1px] bg-black" />
                  <p className="text-lg flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold">₹{orderTotal}</span>
                  </p>
                </div>
                <hr className="p-[1px] bg-[#a7a7a7]" />
                <p className="text-xl my-2">
                  Order Status:
                  <span
                    className="font-bold ml-2"
                    style={{
                      textTransform: "capitalize",
                      color: colors[orderStatus],
                    }}
                  >
                    {orderStatus}
                  </span>
                </p>
                <hr className="p-[1px] bg-[#a7a7a7]" />
                <p className="text-xl my-2">
                  Ticket Status:
                  <span
                    className="font-bold ml-2"
                    style={{
                      textTransform: "capitalize",
                      color: colors[ticketStatus],
                    }}
                  >
                    {ticketStatus}
                  </span>
                </p>
                <hr className="p-[1px] bg-[#a7a7a7]" />
                <p className="flex items-center my-2">
                  <span className="text-xl">Update Ticket Status:</span>
                  <select
                    className="ml-4 p-1 rounded border border-black"
                    onChange={selectedStatus}
                    style={{ textTransform: "capitalize" }}
                  >
                    {options.map((option) => (
                      <>
                        {option === ticketStatus ? (
                          <option
                            value={option}
                            style={{ textTransform: "capitalize" }}
                            selected
                            disabled
                          >
                            {option}
                          </option>
                        ) : (
                          <option
                            value={option}
                            style={{ textTransform: "capitalize" }}
                          >
                            {option}
                          </option>
                        )}
                      </>
                    ))}
                  </select>
                  <button
                    className="ml-4 p-2 rounded bg-[#086CC4]"
                    onClick={() => {
                      updateTicketStatus();
                    }}
                    disabled={updateButton} // Disable the button when update is in progress
                  >
                    <RxUpdate
                      size={20}
                      style={{ color: "white" }}
                      className={updateButton ? "animate-spin" : ""} // Add or remove animate-spin class
                    />
                  </button>
                </p>
                <hr className="p-[1px] bg-[#a7a7a7]" />
              </div>
            ) : (
              <Bars
                height="60"
                width="60"
                color="#086CC4"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass="pl-72 ml-72"
                visible={true}
              />
            )}
          </div>
        </div>
        <div className="bg-[#eeeeee] mt-4 py-4 rounded-lg">
          <h1 className="text-2xl font-bold text-black pb-1 text-center">
            Customer Information
          </h1>
          <hr className="p-[1px] bg-black" />
          <div className="my-3 px-3">
            {customedetails["name"] !== "" ? (
              <>
                <p className="text-xl my-2">
                  Name:
                  <span
                    className="font-bold mt-4 ml-2"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {customedetails["name"]}
                  </span>
                </p>
                <hr className="p-[1px] bg-[#a7a7a7]" />
                <p className="text-xl my-2">
                  Email:
                  <span
                    className="font-bold mt-4 ml-2"
                    style={{
                      textTransform: "lowercase",
                    }}
                  >
                    {customedetails["email"]}
                  </span>
                </p>
                <hr className="p-[1px] bg-[#a7a7a7]" />
                <p className="text-xl my-2">
                  Mobile:
                  <span
                    className="font-bold mt-4 ml-2"
                    style={{
                      textTransform: "lowercase",
                    }}
                  >
                    {customedetails["mobile"]}
                  </span>
                </p>
                <hr className="p-[1px] bg-[#a7a7a7]" />
              </>
            ) : (
              <>
                <Bars
                  height="40"
                  width="40"
                  color="#086CC4"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass="ml-[48%]"
                  visible={true}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
