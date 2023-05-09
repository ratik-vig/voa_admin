import { Text } from "@chakra-ui/react"
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, Title} from 'chart.js'
import {useEffect, useState} from 'react'
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

Chart.register(ArcElement, Tooltip, CategoryScale,LinearScale,BarElement,Title);

const Dashboard = ({token, setToken}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if(!localStorage.getItem("token")) {
            navigate('/')
        }
    }, [token])

    const [visitorType, setVisitorType] = useState(null)
    const [topSku, setSku] = useState(null)
    const [topAtrn, setAtrn] = useState(null)
    const getVisitorsByType = async() => {
        try{
            const result = await axios.get('http://localhost:3000/api/v1/admin/getVisitorsByType')
            console.log(result.data[0].count)
            const obj = {
                labels: ['Adult', 'Child', 'Senior'],
                
                datasets: [
                  {
                    label: 'Number of visitors',
                     data: [result.data[0].count, result.data[1].count, result.data[2]?.count],
                     backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        
                      ],
                    borderWidth: 1
                  },
                ],
              };
            setVisitorType(obj)
        }catch(err){
            console.log(err)
        }
    }
    

    const getTopSku=async() => {
        try{
            const result = await axios.get('http://localhost:3000/api/v1/admin/getTopSellingSKU')
            console.log(result.data)
            const labels = result.data.map(item => item.sku_name)
            const qty = result.data.map(item => item.total_quantity)
            console.log(labels)
            const data = {
                labels,
                datasets: [
                  {
                    label: 'Sku',
                    data: qty,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  }
                  
                ],
              };
              setSku(data)
            
        }catch(err){
            console.log(err)
        }
    }

    const getTopAtrn=async() => {
        try{
            const result = await axios.get('http://localhost:3000/api/v1/admin/getTopVisitedAtrns')
            console.log(result.data)
            const labels = result.data.map(item => item.atrn_name)
            const qty = result.data.map(item => item.count)
            console.log(labels)
            const data = {
                labels,
                datasets: [
                  {
                    label: 'Attraction',
                    data: qty,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  }
                  
                ],
              };
              setAtrn(data)
            
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getVisitorsByType()
        getTopSku()
        getTopAtrn()
    }, [])

    return(
        <div style={{minHeight: '100vh', backgroundColor: '#f3f3f3'}}>
            <Header setToken={setToken}/>
            <div style={{width: 300, height: 300, display: 'flex', margin: '64px 64px'}}>
                
                {visitorType && 
                    <div style={{marginLeft: 64}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16}}>Visitor Types</Text>
                        <Pie data={visitorType}/> 
                    </div>
                }
                {topSku && <div style={{marginLeft: 64}}> <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16}}>Top Selling SKUs</Text><Bar data={topSku} /> </div>}
                {topAtrn && <div style={{marginLeft: 64}}><Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16}}>Top Visited Attractions</Text><Bar data={topAtrn} /> </div>}
            </div>
        </div>
        
    )
}

export default Dashboard