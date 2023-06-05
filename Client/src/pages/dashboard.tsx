import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [url, setUrl] = useState<string>('')
    const [standard, setStandard] = useState<string>('WCAG')

    const handelOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        navigate(`/audit?url=${encodeURIComponent(url)}`, { state: { url, standard, newTest: true } });
    }

    return (
        <section className='dashboard-section'>
            <div className="search-wrap">
                <div className="search_box">
                    <div className="params">
                        <input type="text" name='url' autoFocus={true} autoComplete='off' className="input" placeholder="Type Website's URL" onChange={(e) => { setUrl(e.target.value) }} />
                        <select name="standard" onChange={(e) => { setStandard(e.target.value) }}>
                            <option value="WCAG">WCAG</option>
                            <option value="Section 508">Secton 508</option>
                        </select>
                    </div>
                    <button className="btn" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { handelOnClick(e) }}>Check Website</button>
                </div>
            </div>
            <div className='table-wrapper'>
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
                        <tr>
                            <td>www.uca.ma/este</td>
                            <td>2022-05-26</td>
                            <td>
                                <div className='status-container'>
                                    <p className='violations'>25</p>
                                </div>
                            </td>
                            <td>
                                <div className='status-container'>
                                    <p className='passed'>70</p>
                                </div>
                            </td>
                            <td>
                                <div className='rescan-btn-wrap'>
                                    <button className='rescan-btn'>Rescan</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>www.uca.ma/este</td>
                            <td>2022-05-26</td>
                            <td>
                                <div className='status-container'>
                                    <p className='violations'>25</p>
                                </div>
                            </td>
                            <td>
                                <div className='status-container'>
                                    <p className='passed'>70</p>
                                </div>
                            </td>
                            <td>
                                <div className='rescan-btn-wrap'>
                                    <button className='rescan-btn'>Rescan</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    )
}
