import React from 'react'
import '../assets/dashboard.css'
export default function Dashboard() {
    return (
        <section className='dashboard-section'>
            <div className="search-wrap">
                <div className="search_box">
                    <input type="text" name='url' autoComplete='off' className="input" placeholder="Type Website's URL" />
                    <button className="btn">Check Website</button>

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
