import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

const Heading = ({ bulletinMsg }) => {


    return (
        <Container className='header' fluid>
            <Row >
                <Col md='auto' className='text-warning' style={{ margin : 'auto'}}>
                    <h1 id='app-title' style={{fontSize : '4rem', textShadow: '3px -2px 1px black'}}>Linkerator</h1>
                </Col>
            </Row>
            <Row >
                <Col md='auto' className='text-warning' style={{ margin : 'auto'}}>
                    <h4 id='app-subtitle' style={{color: 'yellow', textShadow: '2px -1px 1px black'}}>The search for the missing link</h4>
                </Col>
            </Row>
            <Row className="marquee" >
                <Col style={{ margin : 'auto', color :  'white', textAlign: 'center'}}>
                    <h4 id='bulletin-text'>{bulletinMsg}</h4>
                </Col>
            </Row>
        </Container>
    
    )
}

export default Heading