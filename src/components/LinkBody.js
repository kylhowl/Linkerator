import React, { useState, Fragment, useEffect } from 'react';
import { searchTags, updateCount } from '../api';
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
import { Edit } from './index';

const validator = require('validator');

var dateFormat = require('dateformat');

const LinkBody = ({
  links,
  setSearchLinks,
  setBulletinMsg,
  setUpdateLink,
  searchLinks,
  setTags,
  setLinks
}) => {
  const ICON_URL = `http://www.google.com/s2/favicons?domain=`;

  const [sortChoice, setSortChoice] = useState('Old to New');
  const [sortVal, setSortVal] = useState('true');
  const [sortKey, setSortKey] = useState('linkId');
  const [showLinks, setShowLinks] = useState([]);
  const [show, setShow] = useState(false); // modal prop
  const [editLink, setEditLink] = useState('');

  useEffect(() => {
    if (searchLinks.length) {
    setShowLinks(searchLinks);}
    else { setShowLinks(links)};
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
  };

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
    ;
    const newLinks = showLinks.map((link) => {
      if (link.linkId === Number(id)) {
        link.clickcount++;
        return link;
      } else {
        return link;
      }
    });
    
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
    <Col className='mh-100' id='mid-col' style={{ overflowY: 'hidden' }}>
      <div className='sortOptions text-warning'>
        <h3>
          Sort links by {'  '}
          <DropdownButton
            size='sm'
            as={ButtonGroup}
            title={sortChoice}
            value={sortVal}
            variant='warning'
            className='bg-warning'
          >
            <Dropdown.Item
              onClick={handleClick}
              property='linkId'
              value={true}
              className='bg-warning'
            >
              {' '}
              Old to New
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleClick}
              property='linkId'
              value={false}
              className='bg-warning'
            >
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
            <Dropdown.Item
              onClick={handleClick}
              property='tags'
              value={false}
              className='bg-warning'
            >
              Tags - High to Low
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleClick}
              property='tags'
              value={true}
              className='bg-warning'
            >
              Tags - Low to High
            </Dropdown.Item>
          </DropdownButton>
        </h3>
      </div>
      <Container
        className='mh-100'
        style={{
          overflowY: 'auto',
          height: `${
            document.getElementById('mid-col')
              ? document.getElementById('mid-col').offsetHeight - 50
              : 50
          }px`,
        }}
      >
        {showLinks.map((link) => {
          let { linkId, url, comment, clickcount, createdDate, tags } = link;
          return (
            <Card key={linkId} className='link-card bg-warning'>
              <Card.Body>
                <Card.Title>
                  <Button
                    style={{ backgroundColor: 'black' }}
                    href={url}
                    block
                    data={linkId}
                    onClick={linkClick}
                  >
                    <Image src={ICON_URL + url} thumbnail /> {url}
                  </Button>
                </Card.Title>
                <Card.Text>
                  {comment}
                  <br />
                  {clickcount} clicks since{' '}
                  {dateFormat(createdDate, 'mmmm dS, yyyy')}
                </Card.Text>
                {tags.sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((tag) => (
                  <Fragment key={tag}>
                    <Button variant='info' size='sm' onClick={tagClick}>
                      {tag}
                    </Button>{' '}
                  </Fragment>
                ))}
                <Button
                  data={link}
                  variant='secondary'
                  size='sm'
                  onClick={() => setUpdateLink(link)}
                >
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
                <Button  variant='outline-light' size='sm' style={{position : 'absolute', right: '0', bottom: '0'}} onClick={()=>{
                  setShow(true);
                  setEditLink(link);
                }}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-pencil'
                    viewBox='0 0 16 16'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'
                    />
                  </svg>
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </Container>
      <Edit editLink={editLink} show={show} setShow={setShow} setSearchLinks={setSearchLinks} setLinks={setLinks} setBulletinMsg={setBulletinMsg} setTags={setTags} searchLinks={searchLinks}/>
    </Col>
  );
};

export default LinkBody;
