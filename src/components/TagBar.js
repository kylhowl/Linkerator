import React from 'react';
import { Col, Button, Image, Row} from 'react-bootstrap'
import { searchTags } from '../api';

const TagBar = ({ tags, setSearchLinks, setBulletinMsg }) => {

    const handleClick = async (e) => {
        e.preventDefault();
        e.persist();
        let tag = e.currentTarget.getAttribute('tag');
        const res = await searchTags(tag);
        await setSearchLinks(res);
        setBulletinMsg(`Found ${res.length} result(s) for ${tag} tag.`);
    }

    return (
        <Col  className='mh-100' id='tagcol' sm='2' md="2" style={{ overflowY : 'hidden'}} >
            
            <Button variant='warning' block onClick={ () => {setSearchLinks([]); setBulletinMsg('All the links, and I mean ALL.')}} >SHOW ALL LINKS</Button>
            <br/>
            <h3 className='text-warning text-center' >Available Tags</h3>
            <p className='text-warning text-center'>Click tags to sort links</p>
            <Row >
                <Col style={{overflowY: 'auto', height : `${document.getElementById('tagcol') ? document.getElementById('tagcol').offsetHeight - 150 : 0 }px`}}>
            {tags.sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((tag)=> {
                return (   
                <Button size='sm' variant='outline-warning' key={tag} tag={tag} block onClick={handleClick} style={{ backgroundColor : 'hsla(129, 81%, 21%, 0.6)'}}><Image src={`/images/favicon.ico`} />{' '}{tag}</Button>
                )
            })}
            </Col>
            </Row>
        </Col>
    )
}

export default TagBar;