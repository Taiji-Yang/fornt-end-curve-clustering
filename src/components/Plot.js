import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';

function Dataplot(props) {
    let data = [];
    let count = 0;
    let lengthcount = 0;
    let flatdatares = [];
    if (props.traction && props.aflow && props.modulenum && props.time){
        for (const trac in props.traction){
            count = count + 1;
        }
        for (const tracnum in props.traction[0]){
            lengthcount = lengthcount + 1;
        }
        for (let i = 0; i < count; i++){
            data.push([])
            for (let j = 0; j < lengthcount; j ++){
                data[i].push({})
            }
        }
        for (let i = 0; i < count; i++){
            for (let k = 0; k < lengthcount; k++){
                data[i][k]["traction"+String(i)] = props.traction[i][k]
            }
        }
        for (let i = 0; i < count; i++){
            for (let k = 0; k < lengthcount; k++){
                data[i][k]["aflow"+String(i)] = props.aflow[i][k]
            }
        }
        for (let i = 0; i < count; i++){
            for (let k = 0; k < lengthcount; k++){
                data[i][k]["modulenum"+String(i)] = props.modulenum[i][k]
            }
        }
        for (let i = 0; i < count; i++){
            for (let k = 0; k < lengthcount; k++){
                data[i][k]["time"] = props.time[i][k]
            }
        }
    }
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function mycompare( a, b ) {
        if ( a[0]['time'] < b[0]['time'] ){
          return -1;
        }
        if ( a[0]['time'] > b[0]['time'] ){
          return 1;
        }
        return 0;
    }
    function flatdata(data){
        let flatdata = []
        for(let i = 0; i < count; i ++){
            for (let j = 0; j < lengthcount; j ++){
                flatdata.push(data[i][j])
            }
        }
        return flatdata
    }
    data.sort(mycompare)
    console.log(data)
    flatdatares = flatdata(data)

    let charts = [];
    let linegroup = [[],[],[]];
    for (let i = 0; i < count; i++){
        let datakeyname1 = "traction" + String(i)
        let datakeyname2 = "aflow" + String(i)
        let datakeyname3 = "modulenum" + String(i)
        let rcolor = getRandomColor()
        linegroup[0].push(
            <Line
                type="monotone"
                dataKey={datakeyname1}
                stroke={rcolor}
                dot={false}
            />
        )
        linegroup[1].push(
            <Line
                type="monotone"
                dataKey={datakeyname2}
                stroke={rcolor}
                dot={false}
            />
        )
        linegroup[2].push(
            <Line
                type="monotone"
                dataKey={datakeyname3}
                stroke={rcolor}
                dot={false}
            />
        )
    }
    for (let i = 0; i < 3; i++){
        charts.push(
        <ResponsiveContainer width='90%' height="33%">
            <LineChart
                data={flatdatares}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            {linegroup[i]}
            </LineChart>
        </ResponsiveContainer>)
    }
    //data.sort(function(a,b) {return (a['time'] > b['time']) ? 1 : ((b['time'] > a['time']) ? -1 : 0);} )
    return (
        <div style = {{height : '100%', width: '50%', border: '10px solid rgba(0, 0, 0, 0.7)'}}>
            {charts}
        </div>
    );
  }
  
export default Dataplot;