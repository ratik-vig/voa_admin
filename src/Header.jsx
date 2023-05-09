import { Text, Button} from '@chakra-ui/react'
import {Link} from 'react-router-dom'
const Header = ({setToken}) => {
    return(
        <div style={{width: '100vw', height: 100, backgroundColor: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Text>VOA Admin</Text>
                <div>
                    <Link style={{margin: '0 16px'}} to={'/dashboard'}>Home</Link>
                    <Link style={{margin: '0 16px'}} to={'/parking'}>Parking</Link>
                </div>
            </div>
            <Button onClick={() => {
                localStorage.removeItem('token')
                setToken("")
            }}>Logout</Button>
        </div>
    )
}

export default Header