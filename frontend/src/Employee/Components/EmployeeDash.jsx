import { useState,useEffect } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { Bars } from "react-loader-spinner";
import BarChart from "./BarChart";
import "./employeedash.css";
import { Link } from "react-router-dom";

export default function EmployeeDash() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [employeeTickets, setEmployeeTickets] = useState([]);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setModalOpen(false);
  };

  const truncateMessage = (message, limit) => {
    if (message.length > limit) {
      return message.slice(0, limit) + "...";
    }
    return message;
  };

  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const [selectedInterval, setSelectedInterval] = useState("daily");

  const handleIntervalChange = (interval) => {
    setSelectedInterval(interval);
  };

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/ticket?employee=1988"; // Replace with your API URL

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setEmployeeTickets(data["data"]);
        console.log(data["data"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="main">
      <h1 className="text-5xl ml-8 mt-5 font-bold">{greeting} Akshata!</h1>
      <div>
        <div className="Ticketpage">
          <h1 className="text-2xl ml-8 mt-5 font-bold">Live Tickets</h1>
          <div className="container">
            <ul className="cards">
              <div className="ticketsrow flex flex-row ml-8 mt-2 space-x-4">
                {Array.isArray(employeeTickets) &&
                employeeTickets.length > 0 ? (
                  employeeTickets.map((ticket, index) => (
                    <li className="card" key={index}>
                      <div
                        key={ticket.customer_id}
                        className="tickets bg-[#EEEEEE] w-[350px] rounded-lg p-7"
                        onClick={() => openModal(ticket)}
                      >
                        <p className="text-xl mb-3 font-bold">
                          Ticket-#{ticket.ticket_id}
                        </p>
                        <p className="text-xl mb-3">
                          {truncateMessage(ticket.customer_query, 25)}
                        </p>
                        <p
                          className="text-left mb-3 text-lg"
                          style={{ textTransform: "capitalize" }}
                        >
                          Status: <b>{ticket.status}</b>
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Bars
                      height="60"
                      width="60"
                      color="#086CC4"
                      ariaLabel="bars-loading"
                      wrapperStyle={{}}
                      wrapperClass="pl-72 ml-72"
                      visible={true}
                    />
                  </div>
                )}
              </div>
            </ul>
          </div>
          {isModalOpen && selectedTicket && (
            <div className="overlay-modal">
              <div className="modal-content">
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative my-3 max-w-3xl justify-center items-center">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                      <div className="p-5 rounded-t">
                        <div
                          key={selectedTicket.customer_id}
                          className="tickets_overlay bg-gray-200 w-96 p-4 rounded-lg"
                        >
                          <p className="text-xl font-bold">
                            Ticket-#{selectedTicket.ticket_id}
                          </p>
                          <p className="text-lg">
                            <span className="font-bold">Query:</span>
                            {selectedTicket.customer_query}
                          </p>
                          <p
                            className="text-left"
                            style={{ textTransform: "capitalize" }}
                          >
                            <b>Status:</b> {selectedTicket.status}
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <Link
                            to={`/employee/chat/${selectedTicket.ticket_id}/${selectedTicket.customer_id}`}
                          >
                            <div className="bg-[#086CC4] mt-3 mr-40 rounded-full w-10 h-10 flex justify-center items-center">
                              <BiSolidMessage className="text-white" />
                            </div>
                          </Link>
                          <div className="flex items-center ml-auto rounded-b">
                            <button
                              className="text-white rounded bg-[#086CC4] font-bold w-32 h-10 text-medium outline-none focus:outline-none mr-1 mt-2.5 ease-linear transition-all duration-150"
                              type="button"
                              onClick={closeModal}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
              </div>
            </div>
          )}
        </div>

        <div></div>
        <div className="statsAnalysis mt-3">
          <h1 className="text-2xl ml-8 mt-5 font-bold ">
            Statistical Analysis
          </h1>
          <div className="timeline ml-8 mt-5">
            <div className="sm:hidden"></div>
            <ul className="hidden text-sm font-medium text-center text-gray-600 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-700 dark:text-gray-600 border-2">
              <li className="w-24">
                <a
                  href="#barChartSection"
                  className="inline-block w-full rounded-l-lg h-10 p-2 bg-white hover:text-gray-700 hover:bg-gray-200 focus:bg-[#086CC4] focus:text-white focus:outline-none dark:hover:text-white dark:bg-gray-200 dark:hover:bg-[#086CC4]"
                  aria-current="page"
                  onClick={() => handleIntervalChange("daily")}
                >
                  Daily
                </a>
              </li>
              <li className="w-24">
                <a
                  href="#barChartSection"
                  className="inline-block w-full h-10 p-2 bg-white hover:text-gray-700 hover:hover:bg-gray-200 focus:bg-[#086CC4] focus:outline-none dark:hover:text-white dark:bg-gray-200 dark:hover:bg-[#086CC4]"
                  onClick={() => handleIntervalChange("weekly")}
                >
                  Weekly
                </a>
              </li>
              <li className="w-24">
                <a
                  href="#barChartSection"
                  className="inline-block w-full h-10 p-2 bg-white hover:bg-gray-200 focus:outline-none focus:bg-[#086CC4] dark:hover:text-white dark:bg-gray-200 dark:hover-bg-[#086CC4]"
                  onClick={() => handleIntervalChange("monthly")}
                >
                  Monthly
                </a>
              </li>
              <li className="w-24">
                <a
                  href="#barChartSection"
                  className="inline-block w-full h-10 p-2  bg-white hover:bg-gray-200  focus:outline-none focus:bg-[#086CC4] focus:text-white dark:hover:text-white dark:bg-gray-200 dark:hover-bg-[#086CC4]"
                  onClick={() => handleIntervalChange("yearly")}
                >
                  Yearly
                </a>
              </li>
              <li className="w-24">
                <a
                  href="#barChartSection"
                  className="inline-block w-full h-10 p-2 rounded-r-lg bg-white hover:text-gray-600 hover:bg-gray-200 focus:outline-none focus:bg-[#086CC4] focus:text-white dark:hover:text-white dark:bg-gray-200 dark:hover-bg-[#086CC4]"
                  onClick={() => handleIntervalChange("all")}
                >
                  All
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div id="barChartSection" className="mt-10">
          <BarChart selectedInterval={selectedInterval} />
        </div>
      </div>
    </div>
  );
}
