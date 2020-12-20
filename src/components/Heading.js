import React from 'react';
import { Col } from 'react-bootstrap';

const Heading = ({ bulletinMsg }) => {


    return (
                <Col md='auto' className='text-warning text-center w-100' >
                    <h1 id='app-title' style={{fontSize : '4rem', textShadow: '3px -2px 1px black'}}>Linkerator</h1>
                
           
           
                
                    <h4 id='app-subtitle' style={{color: 'yellow', textShadow: '2px -1px 1px black'}}>The search for the missing link</h4>
                
            
             
                    <h4 id='bulletin-text' className="text-white" >{bulletinMsg}</h4>
                </Col>
    )
}

export default Heading