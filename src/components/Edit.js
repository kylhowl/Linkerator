import React, { useState } from 'react';
import { Modal, Button, InputGroup, Form} from 'react-bootstrap';
import { editLink } from '../api'

const Edit = ( {show, setShow, editLink : link, setLinks, setSearchLinks, setBulletinMsg, searchLinks, setTags} ) => {

    const { url, comment, tags = [] } = link;

    const handleClose = () => setShow(false);

    const [ commentEdit , setCommentEdit ] = useState(comment)

    const handleSubmit = async (e) => {
        e.persist();
        e.preventDefault();
        const deleteTags = [];
        for (let tag of tags) {
            if (document.getElementById(`checkbox-${tag}`).checked === true) {deleteTags.push(tag)}
        }
        const results = await editLink({comment : commentEdit, tags : deleteTags, linkId : link.linkId});
        if (results.links) {
           
            if (searchLinks.length) {
                // eslint-disable-next-line
                let copy = searchLinks.map( (linkA) => { for ( let linkB of results.links ){ if (linkA.linkId === linkB.linkId) return linkB}});
                setSearchLinks(copy)
                
            }
        setTags(results.tags);
        setBulletinMsg(`Edits made to ${url}!`)
        setLinks(results.links);
        } else {
            setBulletinMsg('Something went wrong, I blame the monkeys!')
        }
        
        handleClose();
    }
       

    return (
        <>
        <Modal show={show} onHide={handleClose} onSubmit={handleSubmit} >
            <Modal.Header closeButton>
                <Modal.Title>Edit info for {url}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button block disabled >{url}</Button>
                <InputGroup size='sm'>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Comment</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control id='comment-edit' as='textarea' aria-label='Comment' defaultValue={comment} onChange={(e)=>{setCommentEdit(e.target.value)}}/>
                </InputGroup>
                <Form>
                    <Form.Group controlId='editTagsList'>
                        <Form.Label>Choose tags to remove</Form.Label>
                        {tags.map((tag) => {
                            return <Form.Check key={tag} type='checkbox' label={tag} id={`checkbox-${tag}`} value={tag} />
                        })}
                    </Form.Group>
                    <Button type='submit'>MAKE CHANGES</Button>
                    {'  '}
                    <Button variant='secondary' onClick={handleClose} >CANCEL</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default Edit