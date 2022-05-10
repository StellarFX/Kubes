import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage } from '@fortawesome/free-solid-svg-icons';
import './Performances.scss';
import { useListState } from '@mantine/hooks';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const { ipcRenderer } = window.require('electron');

let RAMdata = [
    {
        name: ' ',
        uv: 0
    },
    {
        name: '  ',
        uv: 0
    },
    {
        name: '   ',
        uv: 0
    },
    {
        name: '    ',
        uv: 0
    },
    {
        name: '     ',
        uv: 0
    },
    {
        name: '      ',
        uv: 0
    }
];

let CPUdata = [
    {
        name: ' ',
        uv: 0
    },
    {
        name: '  ',
        uv: 0
    },
    {
        name: '   ',
        uv: 0
    },
    {
        name: '    ',
        uv: 0
    },
    {
        name: '     ',
        uv: 0
    },
    {
        name: '      ',
        uv: 0
    }
];
export default function Configuration(props) {

    const [ram, setRam] = useListState(RAMdata);
    const [cpu, setCpu] = useListState(CPUdata);

    useEffect(()=>{
        let check;
        if(props.status === 1){
            check = setInterval(async()=>{
                let resp = await ipcRenderer.invoke('get-usage', props.path);
                if(resp){
                    console.log(resp['memory']);
                    console.log(resp['cpu']);
                    let date = new Date();
                    setRam.reorder({ from: 0, to: 5})
                    setRam.setItem(5, {name: date.getMinutes() + ":" + date.getSeconds(), uv: (resp['memory']/1000000).toFixed(2)})
                    setCpu.reorder({ from: 0, to: 5})
                    setCpu.setItem(5, {name: date.getMinutes() + ":" + date.getSeconds(), uv: (resp['cpu'])})
                }
            },3 * 1000);
        }

        return () => clearInterval(check);
    },[props.status]);

    return (

        <div className='performances-main-container'>
            <div className='chart-content'>
                <div className='chart-container'>
                    <p className='ram-title'><FontAwesomeIcon icon={faPercentage}/>RAM</p>
                    <ResponsiveContainer minHeight="20rem" width="100%" height="99%" >
                        <ComposedChart
                            width={700}
                            height={320}
                            data={ram}
                            margin={{
                                top: 50,
                                right: 50,
                                bottom: 45,
                                left: 30
                            }}
                        >
                            <CartesianGrid stroke="#201D2D" />
                            <XAxis dataKey="name" scale="band" dy={20} tick={{ fill: "#6D6791" }} />
                            <YAxis dx={-45} textAnchor="left" tick={{ fill: "#6D6791" }} tickFormatter={(tick) => { return `${tick}MB`; }} />
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
                            data={cpu}
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