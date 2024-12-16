import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { AuthContext, AuthContextType } from "../context/authContext";
import { FaEye } from "react-icons/fa";

interface ReportType {
    _id: string,
    owner: string,
    website: string,
    lastScan: string,
    standard: string,
    audit: Report
}

interface Report {
    failedSize: number;
    passedSize: number;
    failed: {
        title: string;
        impact: string;
        description: string;
        issues: {
            target: string;
            toBeFixed: {
                message: string;
                relatedNodes: {
                    target: string;
                }[];
            }[];
        }[];
    }[];
    passed: any[];
    score: number;
    image: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [url, setUrl] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [standard, setStandard] = useState<string>('WCAG')
    const [reports, setReports] = useState<ReportType[]>([])

    const authContext = useContext<AuthContextType | null>(AuthContext)
    const { authState } = authContext as AuthContextType;

    const handelOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        navigate(`/audit?url=${encodeURIComponent(url)}`, { state: { url, standard, userID: authState.user?.userID } });
    }
    const handleRowClick = (index: number) => {
        navigate(`/audit?url=${encodeURIComponent(reports[index].website)}`, { state: { url: reports[index].website, standard: reports[index].standard, userID: authState.user?.userID, report: reports[index], reportID: reports[index]._id } });

    }

    const handelRescan = (index: number) => {
        navigate(`/audit?url=${encodeURIComponent(url)}`, { state: { url: reports[index].website, standard: reports[index].standard, userID: authState.user?.userID, reportID: reports[index]._id } });
    }

    useEffect(() => {
        axios({
            url: 'http://localhost:4000/api/v1/getReport',
            method: 'get',
            params: {
                userID: authState.user?.userID
            }
        })
            .then((response) => {
                setReports(response.data)
                setLoading(false)
            })
            .catch((err) => {
                alert(err)
            })
    }, [authState])

    return (
        <section className='dashboard-section'>

            {

                loading
                    ?
                    <><div className='loading-container'>

                        <div className='image-wrapper'>
                            <img src="/images/testing.png" alt="loading illustration" />
                        </div>
                        <div className='description-wrapper'>
                            <h3>loading</h3>
                            <SyncLoader color="#134e9d" />
                        </div>
                    </div></>
                    :
                    <>
                        <div className="search-wrap">
                            <div className="search_box">
                                <div className="params">
                                    <input type="text" name='url' autoFocus={false} autoComplete='off' className="input" placeholder="Type Website's URL" onChange={(e) => { setUrl(e.target.value); }} />
                                    <select name="standard" onChange={(e) => { setStandard(e.target.value); }}>
                                        <option value="WCAG">WCAG</option>
                                        <option value="Section 508">Secton 508</option>
                                    </select>
                                </div>
                                <button className="btn" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { handelOnClick(e); }}>Check Website</button>
                            </div>
                        </div><div className='table-wrapper'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Website
                                        </th>
                                        <th>
                                            Last scan
                                        </th>
                                        <th>
                                            Violations
                                        </th>
                                        <th>
                                            Passed
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            reports.map((report, index) => {
                                                return (
                                                    <tr key={index} >
                                                        <td >{report.website}</td>
                                                        <td>{report.lastScan.split('T')[0]}</td>
                                                        <td>
                                                            <div className='status-container'>
                                                                <p className='violations'>{report.audit.failedSize}</p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='status-container'>
                                                                <p className='passed'>{report.audit.passedSize}</p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='rescan-btn-wrap'>
                                                                <button onClick={(e) => { handelRescan(index) }} className='rescan-btn'>Rescan</button>
                                                            </div>
                                                        </td>
                                                        <td className="view-report">
                                                            <FaEye onClick={() => { handleRowClick(index) }}/>
                                                        </td>

                                                    </tr>)
                                            })
                                        }
                                    </>
                                </tbody>
                            </table>
                        </div>
                    </>
            }

        </section>
    )
}
