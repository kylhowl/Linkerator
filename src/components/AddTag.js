import React, { useState, Fragment } from 'react';
import {
    Container,
    Button,
    Card,
    Form,
    Row,
    Col
  } from 'react-bootstrap';
import { addTags } from '../api';

const AddTag = ({ updateLink, setUpdateLink, setLinks, setTags, setSearchLinks, setBulletinMsg, searchLinks }) => {

    const [ newTag , setNewTag ] = useState('')
    
    const { linkId, url, comment, tags} = updateLink

    const handleSubmit = async (e) => {
        e.persist();
        e.preventDefault();
        const tag = newTag.replace(/,/gi ,'') // removes , from string
        let tagArr = tag.split(' ') // breaks search string into array using spaces
        tagArr.map((tag) => tag.trim()) // removes white space from front/end of strings
        tagArr = tagArr.filter(tag=> tag); // removes extra spaces from result array.

        const results = await addTags(linkId, tagArr)
        
        if (results.links) {
            if (searchLinks.length) {
                // eslint-disable-next-line
                let copy = searchLinks.map( (linkA) => { for ( let linkB of results.links ){ if (linkA.linkId === linkB.linkId) return linkB}});
                setSearchLinks(copy)
            }
        setLinks(results.links);
        setTags(results.tags);
        setUpdateLink('');
        setBulletinMsg(`${tagArr.join(', ')} tag(s) added to ${url}`)
        } else {
            setBulletinMsg('Something went wrong, I blame the monkeys!')
        }

    }

    return (
        <Container className='addTag text-warning'>
            <h3>Add a tag</h3>
            <Card style={{color :' black'}}>
                <Card.Body>
                    <Card.Title>
                        <Button block disabled >
                        {url}
                        </Button>
                    </Card.Title>
                    <Card.Text>
                        {comment}
                    </Card.Text>
                    {tags.map((tag) => (
                        <Fragment key={tag}>
                        <Button variant='info' size='sm' disabled>
                            {tag}
                        </Button>{' '}
                        </Fragment>
                    ))}
              </Card.Body>
            </Card>
            <br/>
            <Form>
                <Form.Group as={Row} controlId='addTagForm'>
                    <Form.Label column sm='2'>
                        Tag:
                    </Form.Label>
                    <Col sm='8'>
                        <Form.Control size='sm' type='text' placeholder='Add a tag or 2...' autoFocus={true} autoComplete='off' onChange={(e)=> setNewTag(e.target.value)} />
                    </Col>
                </Form.Group>
                <Button size='sm' type='submit' onClick={handleSubmit}>ADD TAGS</Button>{'  '}
                <Button size='sm' type='reset' variant='secondary' onClick={()=> setUpdateLink('')}>CANCEL</Button>
            </Form>
        </Container>
    )
}

export default AddTag