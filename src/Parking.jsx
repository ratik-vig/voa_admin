import {Input, Text, Button, Heading, Select, FormControl, FormLabel} from '@chakra-ui/react'
import Header from './Header'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Parking = ({token, setToken}) => {
    const [visitorId, setVisitor] = useState(0)
    const [parkingId, setParking] = useState(0)
    const [orderDetails, setDetails] = useState([])
    const [payMethod, setMethod] = useState('cash')
    const [cardType, setType] = useState('credit')
    const [cardName, setName] = useState('')
    const [cardNum, setNum] = useState('')
    const [expMon, setMon] = useState('')
    const [expYear, setYear] = useState('')
    const [cvv, setCvv] = useState('')
    const [outTime, setOutTime] = useState('')
    const [hours, setHours] = useState(0)
    const [price, setPrice] = useState(0)
    const toast = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        if(!localStorage.getItem("token")) {
            navigate('/')
        }
    }, [token])

    const handleParkingChange = (e) => {
        setParking(e.target.value)
    }

    const handleVisitorChange = (e) => {
        setVisitor(e.target.value)

    }

    const issueTicket = async() => {
        try{
            let obj = {
            
                visitorId: visitorId,
                inTime: new Date()
            }
            console.log(obj)
            const result = await axios.post("http://localhost:3000/api/v1/parking/issueTicket", {obj})
            if(result){
                toast({
                    title: `Parking Ticket Issued with ID ${result.data.insertId}`,
                    description: `Time ${new Date().toLocaleTimeString()}`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                setVisitor(0)
            }
        }catch(err){
            console.log(err)
        }
    }

    const handleCheckout = async() => {
        try{
            const result = await axios.get("http://localhost:3000/api/v1/parking/getTicketById", {params: {parking_id: parkingId}})
            console.log(result)
            setDetails(result.data)
            setOutTime(new Date())
            var h = Math.floor((new Date() - new Date(result.data[0].in_time)) / 36e5);
            if(h==0) {
                h=1
            }
            setHours(h)
            setPrice(h*10)
        }catch(err){
            console.log(err)
        }
    }

    const handlePayment = async() => {
        let obj = {}
        if(payMethod === 'cash'){
            obj = {
                parkingId: parkingId,
                orderDate: new Date(),
                orderAmt: price,
                orderSrc: 'parking',
                payMethod,
                outTime: outTime

            }
        }else{
            obj = {
                parkingId: parkingId,
                orderDate: new Date(),
                orderAmt: price,
                orderSrc: 'parking',
                payMethod,
                cardName,
                cardNum,
                cardType,
                expMon,
                expYear,
                cvv,
                outTime
            }
        }
        const result = await axios.post('http://localhost:3000/api/v1/parking/payTicket', {obj})
        if(result){
            console.log(result)
            toast({title: `Payment successful`,
            description: `Order ID ${result.data[0][0].ORDER_ID}`,
            status: 'success',
            duration: 5000,
            isClosable: true
        })
        setVisitor("")
        setParking("")
        setMethod("cash")
        setDetails([])
        console.log(result)
    }
}

    return(
        <div style={{minHeight: '100vh', backgroundColor: '#f3f3f3'}}>
            <Header setToken={setToken}/>
            <div style={{width: '50%', margin: '32px auto', backgroundColor: 'white', padding: 32}}>
                <Text>Issue parking ticket</Text>
                <Input placeholder='Enter visitor ID' value={visitorId} onChange={handleVisitorChange} />
                <Button style={{marginTop: 8}} onClick={issueTicket}>Issue</Button>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
                    <Text style={{fontSize: 28}}>OR</Text>
                </div>
                <Text>Pay for parking</Text>
                <Input placeholder='Enter parking ticket ID'value={parkingId} onChange={handleParkingChange}/>
                <Button style={{marginTop: 8}} onClick={handleCheckout}>Checkout</Button>

                {orderDetails.length !== 0 && <div>
                    <Text>{`Parking Details`}</Text>
                    <Text>{`In Time ${new Date(orderDetails[0]?.in_time).toLocaleString()}`}</Text>
                    <Text>{`Out Time ${new Date(outTime).toLocaleString()}`}</Text>
                    <Text>{`Total Hours ${hours}`}</Text>
                    <Text>{`Price $${Number(price).toFixed(2)}`}</Text>

                    <Select defaultValue={payMethod} value={payMethod} onChange={(e) => setMethod(e.target.value)}>
                        <option value={'cash'}>Cash</option>
                        <option value={'card'}>Card</option>
                    </Select>

                    {payMethod === 'card' && <div>
                        <FormControl>
                            <FormLabel>Card Type</FormLabel>
                            <Select defaultValue={cardType} value={cardType} onChange={e => setType(e.target.value)}>
                                <option value={'credit'}>Credit</option>
                                <option value={'debit'}>Debit</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Card Number</FormLabel>
                            <Input placeholder={'card number'} value={cardNum} onChange={e => setNum(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Card Name</FormLabel>
                            <Input placeholder={'card name'} value={cardName} onChange={e => setName(e.target.value)}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Expiry Month</FormLabel>
                            <Input placeholder={'expiry month'} value={expMon} onChange={e => setMon(e.target.value)}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Expiry Year</FormLabel>
                            <Input placeholder={'expiry year'} value={expYear} onChange={e => setYear(e.target.value)}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>CVV</FormLabel>
                            <Input placeholder={'CVV'} value={cvv} onChange={e => setCvv(e.target.value)}/>
                        </FormControl>
                    </div>}

                    <Button onClick={handlePayment}>Pay</Button>
                </div>}
            </div>
        </div>
    )
}

export default Parking