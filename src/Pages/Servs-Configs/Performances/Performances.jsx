import React, { useState, useEffect, PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage } from '@fortawesome/free-solid-svg-icons';
import './Performances.scss';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const RAMdata = [
    {
        name: 'Page A',
        uv: 60
    },
    {
        name: 'Page B',
        uv: 85
    },
    {
        name: 'Page C',
        uv: 35
    },
    {
        name: 'Page D',
        uv: 100
    },
    {
        name: 'Page E',
        uv: 25
    },
    {
        name: 'Page F',
        uv: 1
    },
];

const CPUdata = [
    {
        name: 'Page A',
        uv: 100
    },
    {
        name: 'Page B',
        uv: 60
    },
    {
        name: 'Page C',
        uv: 50
    },
    {
        name: 'Page D',
        uv: 15
    },
    {
        name: 'Page E',
        uv: 78
    },
    {
        name: 'Page F',
        uv: 64
    },
];



export default function Configuration() {

    return (

        <div className='performances-main-container'>
            <div className='chart-content'>
                <div className='chart-container'>
                    <p className='ram-title'><FontAwesomeIcon icon={faPercentage}/>RAM</p>
                    <ResponsiveContainer minHeight="20rem" width="100%" height="99%" >
                        <ComposedChart
                            width={700}
                            height={320}
                            data={RAMdata}
                            margin={{
                                top: 50,
                                right: 50,
                                bottom: 45,
                                left: 30
                            }}
                        >
                            <CartesianGrid stroke="#201D2D" />
                            <XAxis dataKey="name" scale="band" dy={20} tick={{ fill: "#6D6791" }} />
                            <YAxis dx={-45} textAnchor="left" tick={{ fill: "#6D6791" }} tickFormatter={(tick) => { return `${tick}%`; }} />
                            {/* <Tooltip /> */}
                            <Legend />
                            <Bar dataKey="uv" barSize={20} fill="#7447ff" radius={[5, 5, 5, 5]} />
                        </ComposedChart>
                    </ResponsiveContainer>

                </div>
                
                <div className='chart-container'>
                    <p className='CPU-title'><FontAwesomeIcon icon={faPercentage}/>CPU</p>
                    <ResponsiveContainer minHeight="20rem" width="100%" height="99%" >
                        <ComposedChart
                            width={700}
                            height={320}
                            data={CPUdata}
                            margin={{
                                top: 50,
                                right: 50,
                                bottom: 45,
                                left: 30
                            }}
                        >
                            <CartesianGrid stroke="#201D2D" />
                            <XAxis dataKey="name" scale="band" dy={20} tick={{ fill: "#6D6791" }} />
                            <YAxis dx={-45} textAnchor="left" tick={{ fill: "#6D6791" }} tickFormatter={(tick) => { return `${tick}%`; }} />
                            {/* <Tooltip /> */}
                            <Legend />
                            <Bar dataKey="uv" barSize={20} fill="#7447ff" radius={[5, 5, 5, 5]} />
                        </ComposedChart>
                    </ResponsiveContainer>

                </div>
            </div>

        </div>

    );


}