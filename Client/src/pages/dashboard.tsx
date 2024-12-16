import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { connect, ConnectedProps } from "react-redux";
import { FaEye } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { selectAuthState } from "../redux/slices/authSlice";
import { selectReports, setReports, selectReport } from "../redux/slices/reportSlice";
import { stateType } from "../redux/store";

interface ReportType {
  _id: string;
  owner: string;
  website: string;
  lastScan: string;
  standard: string;
  audit: {
    failedSize: number;
    passedSize: number;
    failed: any[];
    passed: any[];
    score: number;
    image: string;
  };
}

const mapStateToProps = (state: stateType) => ({
  auth: selectAuthState(state),
  reports: selectReports(state),
});

const mapDispatch = {
  setReports,
  selectReport,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

function Dashboard({ auth, reports, setReports, selectReport }: PropsFromRedux) {
  const navigate = useNavigate();
  const [url, setUrl] = useState<string>("");
  const [standard, setStandard] = useState<string>("WCAG");

  const { data, isLoading, error } = useQuery(
    ["userReports", auth.user?.userID],
    async () => {
      const response = await axiosInstance.get<ReportType[]>("/getReport", {
        params: { userID: auth.user?.userID },
      });
      return response.data;
    },
    {
      onSuccess: (data: any) => {
        setReports(data); // Update Redux state with the fetched reports
      },
      enabled: !!auth.user?.userID, // Ensure the query runs only if userID exists
    }
  );

  const handleCheckWebsite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(`/audit`, { state: { url, standard } });
  };

  const handleRowClick = (report: ReportType) => {
    selectReport(report); // Update the selected report in Redux
    navigate(`/audit`);
  };

  const handleRescan = (report: ReportType) => {
    selectReport(report); // Update the selected report in Redux
    navigate(`/audit`);
  };

  if (isLoading) {
    return (
      <section className="dashboard-section">
        <div className="loading-container">
          <div className="image-wrapper">
            <img src="/images/testing.png" alt="loading illustration" />
          </div>
          <div className="description-wrapper">
            <h3>Loading</h3>
            <SyncLoader color="#134e9d" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-section">
        <div className="error-container">
          <h3>Failed to load reports</h3>
          <p>{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="search-wrap">
        <div className="search_box">
          <div className="params">
            <input
              type="text"
              className="input"
              placeholder="Type Website's URL"
              onChange={(e) => setUrl(e.target.value)}
            />
            <select name="standard" onChange={(e) => setStandard(e.target.value)}>
              <option value="WCAG">WCAG</option>
              <option value="Section 508">Section 508</option>
            </select>
          </div>
          <button className="btn" onClick={handleCheckWebsite}>
            Check Website
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Website</th>
              <th>Last Scan</th>
              <th>Violations</th>
              <th>Passed</th>
              <th>Rescan</th>
              <th>View Report</th>
            </tr>
          </thead>
          <tbody>
            {reports.allReports.map((report: ReportType, index: number) => (
              <tr key={index}>
                <td>{report.website}</td>
                <td>{report.lastScan.split("T")[0]}</td>
                <td>{report.audit.failedSize}</td>
                <td>{report.audit.passedSize}</td>
                <td>
                  <button className="rescan-btn" onClick={() => handleRescan(report)}>
                    Rescan
                  </button>
                </td>
                <td className="view-report">
                  <FaEye onClick={() => handleRowClick(report)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default connector(Dashboard);
