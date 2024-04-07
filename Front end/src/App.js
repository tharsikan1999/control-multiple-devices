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

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [deviceFormData, setDeviceFormData] = useState({
    serialNumber: "",
    image: "",
    type: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:3000/countries/", formData);
      fetchData();
      setFormData({
        name: "",
        address: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  // delete country

  const handleDelete = async (index) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this country?"
    );
    if (confirmation) {
      try {
        await axios.delete(
          `http://localhost:3000/countries/${countries[index]._id}`
        );
        fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleEdit = (index) => {
    setSelectedRowIndex(index);
    setFormData({
      name: countries[index].name,
      address: countries[index].address,
      phone: countries[index].phone,
    });
  };

  const handleSaveEdit = async (index) => {
    try {
      await axios.put(
        `http://localhost:3000/countries/${countries[index]._id}`,
        formData
      );
      fetchData();
      setFormData({
        name: "",
        address: "",
        phone: "",
      });
      setSelectedRowIndex(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const [countryID, setCountryID] = useState(null);

  const addDevice = (index) => {
    setCountryID(countries[index]._id);
  };

  const handleChangeDevice = (e) => {
    const { name, value } = e.target;
    setDeviceFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitDevice = async () => {
    try {
      // Post the device data to create a new device
      const deviceResponse = await axios.post(
        "http://localhost:3000/devices/",
        deviceFormData
      );

      // Access the _id of the newly created device from the response
      const deviceId = deviceResponse.data.newDevice._id;

      // Post the device data to the specific country's devices endpoint
      await axios.put(
        `http://localhost:3000/countries/${countryID}/devices/${deviceId}`
      );

      // Fetch updated data
      fetchData();

      setCountryID(null);

      // Reset the device form data
      setDeviceFormData({
        serialNumber: "",
        image: "",
        type: "",
        status: "",
      });
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div className="mx-auto flex items-center flex-col h-screen py-5 overflow-auto">
      <h1 className="mb-4 text-mycolor text-4xl font-extrabold leading-none tracking-tight">
        Managing Locations & Devices
      </h1>
      <div className="flex flex-col lg:w-3/4 md:w-full md:px-10 phone:px-10 justify-between items-center ">
        <div
          className={`flex mt-10 w-full items-center justify-evenly ${
            countryID === null ? "block" : "hidden"
          }`}
        >
          <input
            className=" block p-2.5 w-auto  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Enter Country Name"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <input
            className=" block p-2.5 w-auto phone:w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Enter Country Address"
            name="address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <input
            className="block p-2.5 w-auto phone:w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Enter Country Phone"
            name="phone"
            onChange={handleChange}
            value={formData.phone}
            required
          />

          {selectedRowIndex === null ? (
            <div
              className=" bg-mycolor h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white hover:bg-white text-xl hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
              onClick={handleSubmit}
            >
              <p>
                <FontAwesomeIcon icon={faPlus} />
              </p>
            </div>
          ) : (
            <div
              className="mt-3 bg-mycolor h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white hover:bg-white text-xl hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
              onClick={() => handleSaveEdit(selectedRowIndex)}
            >
              <p>
                <FontAwesomeIcon icon={faCheckSquare} />
              </p>
            </div>
          )}
        </div>
        <div
          className={`flex mt-10 w-full items-center justify-evenly ${
            countryID === null ? "hidden" : "block"
          }`}
        >
          <input
            className="block p-2.5 w-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Enter Device Serial Number"
            name="serialNumber"
            onChange={handleChangeDevice}
            value={deviceFormData.serialNumber}
            required
          />
          <input
            className="block p-2.5 w-auto phone:w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Enter Device img"
            name="image"
            onChange={handleChangeDevice}
            value={deviceFormData.image}
            required
          />
          <select
            name="type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChangeDevice}
            value={deviceFormData.type}
          >
            <option>Select Device Type</option>
            <option>pos</option>
            <option>kiosk</option>
            <option>signage</option>
          </select>
          <select
            name="status"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChangeDevice}
            value={deviceFormData.status}
          >
            <option>Select Status</option>
            <option>active</option>
            <option>inactive</option>
          </select>

          {selectedRowIndex === null ? (
            <div
              className="bg-mycolor h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white hover:bg-white text-xl hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
              onClick={handleSubmitDevice}
            >
              <p>
                <FontAwesomeIcon icon={faPlus} />
              </p>
            </div>
          ) : (
            <div
              className="mt-3 bg-mycolor h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white hover:bg-white text-xl hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
              onClick={() => handleSaveEdit(selectedRowIndex)}
            >
              <p>
                <FontAwesomeIcon icon={faCheckSquare} />
              </p>
            </div>
          )}
        </div>

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
                        {selectedRowIndex === index ? (
                          <>
                            <div
                              className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
                              onClick={() => handleSaveEdit(index)}
                            >
                              <p>
                                <FontAwesomeIcon icon={faCheckSquare} />
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
                              onClick={() => handleDelete(index)}
                            >
                              <p>
                                <FontAwesomeIcon icon={faTrash} />
                              </p>
                            </div>
                            <div
                              className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
                              onClick={() => {
                                handleEdit(index);
                              }}
                            >
                              <p>
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </p>
                            </div>
                            <div
                              className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer"
                              onClick={() => addDevice(index)}
                            >
                              <p>
                                <FontAwesomeIcon icon={faPlus} />
                              </p>
                            </div>
                          </>
                        )}
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
