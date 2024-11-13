import React, { useEffect, useState } from "react";
import AddDepartment from "./AddDepartment";
import { FaRegPlusSquare } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";

const DepartmentList = () => {
  const [addDepartmentVisibility, setAddDepartmentVisibility] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

  const searchBtnStyle = {
    width: "100%",
    padding: "15px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setDeptLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        console.log(response.data.departments[0]._id);
        
        if (response.data.success) {
            let sno = 1;
            const data = response.data.departments.map((dept,index) => ({
                _id: dept._id,
                sno: index+1,
                dept_name: dept.deptName,
                action: <DepartmentButtons _id={dept._id}/>,
            }));
          setDepartments(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // useEffect to listen for Esc key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setAddDepartmentVisibility(false);
    };
    // Add event listener for keydown
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-6 relative">
      {deptLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {addDepartmentVisibility && (
            <AddDepartment setAddDepartmentVisibility={setAddDepartmentVisibility} />
          )}
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Department</h3>
          </div>
          <div className="flex justify-between items-center my-4">
            <input
              type="text"
              className="px-4 py-0.5 border"
              name="DeptSearch"
              placeholder="Search by Dept Name"
            />
            <button
              onClick={() => setAddDepartmentVisibility(true)}
              className="px-4 py-1 bg-primary rounded text-white"
            >
              + Add Department
            </button>
          </div>
          <div className="tableContainer">
            <DataTable columns={columns} data={departments} />
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentList;
