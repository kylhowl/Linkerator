import React, { useState, Fragment, useEffect } from 'react';
import { searchTags, updateCount} from '../api';
import {
  Col,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Button,
  Card,
  Image,
  Container,
} from 'react-bootstrap';

const validator = require('validator');

var dateFormat = require('dateformat');

const LinkBody = ({ links, setSearchLinks, setBulletinMsg, setUpdateLink }) => {
  const ICON_URL = `http://www.google.com/s2/favicons?domain=`;

  const [ sortChoice, setSortChoice ] = useState('Old to New');
  const [ sortVal, setSortVal ] = useState('true');
  const [ sortKey, setSortKey ] = useState('linkId');
  const [ showLinks, setShowLinks ] = useState([]);

  useEffect( ()=> {
    setShowLinks(links);
    _sortLinks();
    // eslint-disable-next-line
  }, [links]);

  const handleClick = async (e) => {
    e.persist();
    
    let key = e.target.getAttribute('property');
    let sortedLinks = [];
    if (Array.isArray(links[0][key])) {
      sortedLinks =
        e.target.getAttribute('value') === 'true'
          ? links.sort((a, b) => a[key].length - b[key].length)
          : links.sort((a, b) => b[key].length - a[key].length);
       setShowLinks(sortedLinks);
    } else {
      sortedLinks =
        e.target.getAttribute('value') === 'true'
          ? links.sort((a, b) => a[key] - b[key])
          : links.sort((a, b) => b[key] - a[key]);
       setShowLinks(sortedLinks);
    }
    setSortChoice(e.target.innerText);
    setSortVal(e.target.getAttribute('value'));
    setSortKey(e.target.getAttribute('property'));
  };

  const _sortLinks = async () => {
    if (links.length) {
      let sortedLinks = [];
      
      if (Array.isArray(links[0][sortKey])) {
        sortedLinks = 
          sortVal === 'true'
            ? links.sort((a, b) => a[sortKey].length - b[sortKey].length)
            : links.sort((a, b) => b[sortKey].length - a[sortKey].length);
        setShowLinks(sortedLinks);
      } else {
        sortedLinks =
          sortVal === 'true'
            ? links.sort((a, b) => a[sortKey] - b[sortKey])
            : links.sort((a, b) => b[sortKey] - a[sortKey]);
        setShowLinks(sortedLinks);
      }
    }
  }

  const linkClick = async (e) => {
    e.persist();
    e.preventDefault();
    updateCount(e.target.getAttribute('data'));
    let url = e.target.getAttribute('href');

    if (!validator.isURL(url, { require_protocol: true })) {
      url = `http://${url}`;
    }

    window.open(url, '_blank', 'noreferrer, noopener');

    await increaseCount(e.target.getAttribute('data'));
  };

  const increaseCount = async (id) => {
    console.log('trying to increase click count for link');
    const newLinks = showLinks.map((link) => {
      if (link.linkId === Number(id)) {
        link.clickcount++;
        return link;
      } else {
        return link;
      }
    });
    console.log(newLinks);
    setSearchLinks(newLinks);
  };

  const tagClick = async (e) => {
    e.persist();
    const res = await searchTags(e.target.innerHTML);
    setSearchLinks(res);
    setBulletinMsg(
      `Found ${res.length} result(s) for ${e.target.innerHTML} tag.`
    );
  };

  return (
    <Col className='mh-100' id='mid-col' style={{overflowY: 'hidden'}}>
      <div className='sortOptions text-warning' >
        <h3>Sort links by {'  '}
        <DropdownButton size='sm'
          as={ButtonGroup}
          title={sortChoice}
          value={sortVal}
          variant='warning'
          className='bg-warning'
        >
          <Dropdown.Item onClick={handleClick} property='linkId' value={true} className='bg-warning'>
            {' '}
            Old to New
          </Dropdown.Item>
          <Dropdown.Item onClick={handleClick} property='linkId' value={false} className='bg-warning'>
            {' '}
            New to Old
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleClick}
            property='clickcount'
            value={false}
            className='bg-warning'
          >
            {' '}
            Clicks - High to Low
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleClick}
            property='clickcount'
            value={true}
            className='bg-warning'
          >
            Clicks - Low to High
          </Dropdown.Item>
          <Dropdown.Item onClick={handleClick} property='tags' value={false} className='bg-warning'>
            Tags - High to Low
          </Dropdown.Item>
          <Dropdown.Item onClick={handleClick} property='tags' value={true} className='bg-warning'>
            Tags - Low to High
          </Dropdown.Item>
        </DropdownButton>
        </h3>
      </div>
      <Container className='mh-100' style={{overflowY : 'auto', height : `${document.getElementById('mid-col') ? document.getElementById('mid-col').offsetHeight - 50 : 50}px` }}>
      
      {showLinks.map((link) => {
        let { linkId, url, comment, clickcount, createdDate, tags } = link;
        return (
          
          <Card key={linkId} className='link-card bg-warning'>
            <Card.Body>
              <Card.Title>
                <Button style={{ backgroundColor : 'black'}} href={url} block data={linkId} onClick={linkClick} >
                  <Image src={ICON_URL + url} thumbnail /> {url}
                </Button>
              </Card.Title>
              <Card.Text>
                {comment}
                <br />
                {clickcount} clicks since{' '}
                {dateFormat(createdDate, 'mmmm dS, yyyy')}
              </Card.Text>
              {tags.map((tag) => (
                <Fragment key={tag}>
                  <Button variant='info' size='sm' onClick={tagClick}>
                    {tag}
                  </Button>{' '}
                </Fragment>
              ))}
              <Button data={link} variant='secondary' size='sm' onClick={() => setUpdateLink(link)}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  fill='currentColor'
                  className='bi bi-plus'
                  viewBox='0 0 16 16'
                >
                  <path
                    fillRule='evenodd'
                    d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'
                  />
                </svg>
              </Button>
            </Card.Body>
          </Card>
          
        );
      })}
      
      </Container>
    </Col>
  );
};

export default LinkBody;
