import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Heading, TagBar, LinkBody, Search, Create, AddTag } from './index'

import {
  getLinks
} from '../api';

const App = () => {
  
  const [ bulletinMsg, setBulletinMsg ] = useState(`Welcome. Stop monkeying around. Find a link, add a link, monkey around. No. Wait, don't do that.`);
  const [ links , setLinks ] = useState([]);
  const [ tags , setTags ] = useState([]);
  const [ searchLinks, setSearchLinks ] = useState([]);
  const [ updateLink, setUpdateLink ] = useState('');

  useEffect(() => {
    getLinks()
      .then(response => {
        setLinks(response.links);
        setTags(response.tags);
      })
      .catch(error => {
        setBulletinMsg(error.message);
      });
    
  },[]);

  return (
    <Container className='main-container vh-100' fluid style={{overflowY : 'auto'}}>
      <Row style={{ height : '23vh'}}>
        <Heading bulletinMsg={bulletinMsg} />
      </Row>
      <Row noGutters={false} style={{ height : '73vh'}} >
        <TagBar tags={tags} setBulletinMsg={setBulletinMsg} setSearchLinks={setSearchLinks}/>         
        {searchLinks.length
          ? 
        <LinkBody links={searchLinks} setLinks={setLinks} setBulletinMsg={setBulletinMsg} setSearchLinks={setSearchLinks} setUpdateLink={setUpdateLink} updateLink={updateLink} searchLinks={searchLinks} setTags={setTags}/> 
          : 
        <LinkBody links={links} setLinks={setLinks} setBulletinMsg={setBulletinMsg} setSearchLinks={setSearchLinks} setUpdateLink={setUpdateLink} updateLink={updateLink} searchLinks={searchLinks} setTags={setTags} />}
        <Col sm='3' className='mh-100' style={{overflowY:'auto'}} >
          <Search links={links} setSearchLinks={setSearchLinks} setBulletinMsg={setBulletinMsg}/>
          <br/>
          {updateLink ? <AddTag updateLink={updateLink} setUpdateLink={setUpdateLink} setLinks={setLinks} setTags={setTags} setSearchLinks={setSearchLinks} searchLinks={searchLinks} setBulletinMsg={setBulletinMsg} /> : <Create setBulletinMsg={setBulletinMsg} setLinks={setLinks} links={links} tagState={tags} setTags={setTags}/>}
        </Col>
      </Row>
      <Row className='text-warning' style={{ height : '2vh'}}>
        <Col className='text-center w-100'  >BANANAS, BANANAS, BANANAS </Col>
      </Row>
    </Container>  
  );
}

export default App;