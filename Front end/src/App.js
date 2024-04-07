import "./index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faPenToSquare,
  faCheckSquare,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import userImg from "./Images/userIMG.jpg";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(null);
  const [devicesVisible, setDevicesVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/countries/");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleDeviceVisibility = (index) => {
    if (selectedCountryIndex === index && devicesVisible) {
      setSelectedCountryIndex(null);
      setDevicesVisible(false);
    } else {
      setSelectedCountryIndex(index);
      setDevicesVisible(true);
    }
  };

  return (
    <div className="mx-auto flex items-center flex-col h-screen py-5 overflow-auto">
      <h1 className="mb-4 text-mycolor text-4xl font-extrabold leading-none tracking-tight">
        Managing Locations & Devices
      </h1>
      <div className="flex flex-col lg:w-3/4 md:w-full md:px-10 phone:px-10 justify-between items-center ">
        <div className="overflow-x-auto  w-full">
          <table className="mt-20 min-w-full table-auto ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
              <tr>
                <th scope="col" className="px-4 py-2 text-center">
                  No
                </th>
                <th scope="col" className="px-4 py-2 text-center">
                  Name
                </th>
                <th scope="col" className="px-4 py-2 text-center">
                  Address
                </th>
                <th scope="col" className="px-4 py-2 text-center">
                  Phone
                </th>
                <th scope="col" className="px-4 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country, index) => (
                <React.Fragment key={index}>
                  <tr className="text-sm text-center bg-customPurple">
                    <td className="h-16 w-auto">{index + 1}</td>
                    <td className="h-16 w-auto">{country.name}</td>
                    <td className="h-16 w-auto">{country.address}</td>
                    <td className="h-16 w-auto">{country.phone}</td>
                    <td className="h-16 w-auto">
                      <div className="flex items-center justify-center">
                        <button
                          className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
                          onClick={() => toggleDeviceVisibility(index)}
                        >
                          <FontAwesomeIcon
                            icon={
                              selectedCountryIndex === index && devicesVisible
                                ? faEyeSlash
                                : faEye
                            }
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {devicesVisible && selectedCountryIndex === index && (
                    <tr className=" text-center">
                      <td colSpan="5">
                        <div className="flex justify-center">
                          <table className="my-7 w-3/4  table-auto">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                <th scope="col" className="px-4 py-2">
                                  No
                                </th>
                                <th scope="col" className="px-4 py-2">
                                  Serial Number
                                </th>
                                <th scope="col" className="px-4 py-2">
                                  Image
                                </th>
                                <th scope="col" className="px-4 py-2">
                                  Type
                                </th>
                                <th scope="col" className="px-4 py-2">
                                  Status
                                </th>
                                <th scope="col" className="px-4 py-2">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {country.devices.map((device, deviceIndex) => (
                                <tr
                                  key={deviceIndex}
                                  className={`text-sm ${
                                    deviceIndex % 2 === 0
                                      ? "bg-customPurple"
                                      : "bg-white"
                                  }`}
                                >
                                  <td>{deviceIndex + 1}</td>
                                  <td>{device.serialNumber}</td>
                                  <td className="w-auto flex justify-center items-center">
                                    <img
                                      src={userImg}
                                      className="h-24 w-24 my-5"
                                      alt=""
                                    />
                                  </td>
                                  <td>{device.type}</td>
                                  <td>
                                    <div className="flex items-center justify-center">
                                      <div
                                        className={`h-6 w-6 rounded-full ${
                                          device.status === "active"
                                            ? "bg-customGreen"
                                            : "bg-red-500"
                                        }`}
                                      ></div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center justify-center">
                                      {selectedRowIndex === index ? (
                                        <>
                                          <div className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer">
                                            <p>
                                              <FontAwesomeIcon
                                                icon={faCheckSquare}
                                              />
                                            </p>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer">
                                            <p>
                                              <FontAwesomeIcon icon={faTrash} />
                                            </p>
                                          </div>
                                          <div className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer">
                                            <p>
                                              <FontAwesomeIcon
                                                icon={faPenToSquare}
                                              />
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
