import React, { useState } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { createLink } from '../api';

const validator = require('validator');

const Create = ({ setBulletinMsg, links ,setLinks, setTags, tagState }) => {

    const [ newLink , setNewLink ] = useState('');
    const [ comment , setComment ] = useState('');
    const [ tagStr, setTagStr ] = useState('');

    const createSubmit = async (e) => {
        e.preventDefault();
        let tags = []
        if (tagStr) { // checks against no tags entered.
        const tag = tagStr.replace(/,/gi ,'') // removes , from string
        tags = tag.split(' ') // breaks search string into array using spaces
        tags.map((tag) => tag.trim()) // removes white space from front/end of strings
        tags = tags.filter(tag=> tag); // removes extra spaces from result array.
        tags = [...new Set(tags)] // eliminates duplicate tag submission
        // place code for validation on url validation-express
        } 

        if (validator.isURL(newLink)) {
            let patt =/[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/mg ; // regex checks for tdr
            console.log(patt.test(newLink), newLink);
            console.log(typeof patt.test(newLink))

            if ( patt.test(newLink) === false ) { 
                console.log('not valid url') 
            
            setBulletinMsg(`${newLink} is not a valid url, please try again!`);
            console.log('failed 2nd test', newLink);
            return
            }
        } else { 
            setBulletinMsg(`${newLink} is not a valid url, please try again!`);
            console.log('failed 1st test', newLink)
            return
        }

        const body = { url: newLink , comment, tags}
        
        const results = await createLink(body)

        if (!results.url) {
            setBulletinMsg(results.message);
        } else {
            setBulletinMsg(`Added the Missing Link ${results.url} successfully.`)
            let copy = [...links]
            copy.push(results);
            setLinks(copy);
            let tagCopy = [...tagState, ...tags];
            setTags([...new Set(tagCopy)]);           
            document.getElementById('createForm').reset() ;
        }
       

    }

    return (
        <Container className='text-warning'>
            <h3>Add the missing link</h3>
            <Form id='createForm' onSubmit={createSubmit} style={{ fontSize : '1.2rem'}}>
                <Form.Group  as={Row} controlId='formUrlText'>
                    <Form.Label className='text-right' column sm='4'>Link:</Form.Label>
                    <Col  >
                        <Form.Control size='sm' type='text' placeholder='www.google.com , bananas.com, github.com....' required onChange={e=> setNewLink(e.target.value)} autoComplete="off"/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='formCommentText'>
                <Form.Label className='text-right' column sm='4'>Comment:</Form.Label>
                    <Col >
                        <Form.Control size='sm' type='text' placeholder='Best site for bananas, ..etc' required onChange={e=> setComment(e.target.value)} autoComplete="off"/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='formTagText'>
                    <Form.Label className='text-right' column sm='4'>Tags:</Form.Label>
                    <Col >
                        <Form.Control size='sm' type='text' placeholder='google, shopping, bananas, free, funny, ...etc' onChange={e=> setTagStr(e.target.value)} autoComplete="off"/>
                    </Col>
                </Form.Group>
                <Button size='sm' variant='primary' type='submit'>ADD LINK</Button>
                {'    '}
                <Button size='sm' variant='secondary' type='reset'>CLEAR</Button>
            </Form>
        </Container>
    )
}

export default Create