import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const [openTab, setOpenTab] = useState(1);

  const onLogoutClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const fetchUsersData = async () => {
    try {
      const apiEndpoint = "http://localhost:3000/getUsers";
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const usersArray = Object.values(data);
      setUsers(usersArray);
      setError(null);
    } catch (error) {
      console.error("Error fetching users data: ", error);
      setUsers([]);
      setError("Failed to fetch users data. Please try again later.");
    }
  };
  const deleteUser = async (userId) => {
    try {
      const apiEndpoint = `http://localhost:3000/deleteUser/${userId}`;
      const response = await fetch(apiEndpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      fetchUsersData();
      setError(null);
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user: ", error);
      setError("Failed to delete user. Please try again later.");
    }
  };
  const acceptUser = async (userId) => {
    try {
      const apiEndpoint = `http://localhost:3000/acceptUser/${userId}`;
      const response = await fetch(apiEndpoint, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to accept user");
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, accepted: true } : user
        )
      );
      setError(null);
      console.log("User accepted successfully");
    } catch (error) {
      console.error("Error accepting user: ", error);
      setError("Failed to accept user. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <>
      <div className="dashboard">
        <div className="navbar">
          <div className="navbar">
            <div className="sidebar">
              <div className="logo">
                <b className="firewatch">FireWatch</b>
              </div>
              <div className="main">
                <div className="option">
                  <div className="bar">
                    <img
                      className="dashboard-icon"
                      alt=""
                      src="/dashboard.svg"
                    />
                    <div className="dashboard1">Dashboard</div>
                  </div>
                </div>
                <div className="option">
                  <div className="bar1">
                    <img className="logout-icon" alt="" src="/logout.svg" />
                    <button className="logout" onClick={onLogoutClick}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start p-9 font-[calibri]">
          <div className="dashboard2">Dashboard</div>

          <div className="flex justify-center rounded-lg border mt-4 p-4 bg-[#1c1a2e] w-Full">
            {/* Tabs */}
            <div className="flex flex-wrap text-lg">
              <div className="w-full">
                <ul
                  className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                  role="tablist"
                >
                  <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                    <a
                      className={
                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                        (openTab === 1
                          ? "text-[#1c1a2e] bg-[#c8ee44]"
                          : "text-white bg-[#1c1a2e]")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(1);
                      }}
                      data-toggle="tab"
                      href="#link1"
                      role="tablist"
                    >
                      Pending Request
                    </a>
                  </li>
                  <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                    <a
                      className={
                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                        (openTab === 2
                          ? "text-[#1c1a2e] bg-[#c8ee44]"
                          : "text-white bg-[#1c1a2e]")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(2);
                      }}
                      data-toggle="tab"
                      href="#link2"
                      role="tablist"
                    >
                      Approved Requests
                    </a>
                  </li>
                </ul>
                <div className="relative flex flex-col min-w-0 break-words bg-[#1c1a2e] w-full mb-6 shadow-lg rounded">
                  <div className="px-4 py-5 flex-auto">
                    <div className="tab-content tab-space">
                      <div
                        className={openTab === 1 ? "block" : "hidden"}
                        id="link1"
                      >
                        <div className="flex flex-col">
                          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                              <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light">
                                  <thead className="border-b font-medium ">
                                    <tr>
                                      <th scope="col" className="px-6 py-4">
                                        #
                                      </th>
                                      <th scope="col" className="px-6 py-4">
                                        User Name
                                      </th>
                                      <th scope="col" className="px-6 py-4">
                                        Email
                                      </th>
                                      <th scope="col" className="px-6 py-4">
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {users
                                      .filter(
                                        (status) => status.accepted == false
                                      )
                                      .map((filteredStatus, i) => (
                                        <>
                                          <tr className="border-b transition duration-300 ease-in-out ">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                                              {i + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                              {filteredStatus.username}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                              {filteredStatus.email}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                              <button
                                                className="accept-button"
                                                onClick={() =>
                                                  acceptUser(
                                                    filteredStatus.userId
                                                  )
                                                }
                                              >
                                                Accept
                                              </button>
                                              <button
                                                className="reject-button"
                                                onClick={() =>
                                                  deleteUser(
                                                    filteredStatus.userId
                                                  )
                                                }
                                              >
                                                Reject
                                              </button>
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={openTab === 2 ? "block" : "hidden"}
                        id="link2"
                      >
                        <div className="flex flex-col">
                          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                              <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light">
                                  <thead className="border-b font-medium ">
                                    <tr>
                                      <th scope="col" className="px-6 py-4">
                                        #
                                      </th>
                                      <th scope="col" className="px-6 py-4">
                                        User Name
                                      </th>
                                      <th scope="col" className="px-6 py-4">
                                        Email
                                      </th>
                                      <th scope="col" className="px-6 py-4">
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {users
                                      .filter(
                                        (status) => status.accepted == true
                                      )
                                      .map((filteredStatus, i) => (
                                        <tr className="border-b transition duration-300 ease-in-out  ">
                                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                                            {i + 1}
                                          </td>
                                          <td className="whitespace-nowrap px-6 py-4">
                                            {filteredStatus.username}
                                          </td>
                                          <td className="whitespace-nowrap px-6 py-4">
                                            {filteredStatus.email}
                                          </td>
                                          <td className="whitespace-nowrap px-6 py-4">
                                            <button className="user-button">
                                              Active User
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Tabs end */}
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
