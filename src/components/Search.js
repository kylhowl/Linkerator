import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';


const Search = ( { links, setSearchLinks, setBulletinMsg } ) => {

    const [ searchVal, setSearchVal ] = useState()

    const searchSubmit = (e) => {
        e.preventDefault();
        let results = [];
        if (!searchVal) { 
            setSearchLinks([]);
            setBulletinMsg(`Can't search nothing, so you get everything!`);
            return
        }
        const searchStr = searchVal.replace(/,/gi ,'') // removes , from string
        let query = searchStr.split(' ') // breaks search string into array using spaces
        query.map((str) => str.trim()) // removes white space from front/end of strings
        query = query.filter(str=> str); // removes extra spaces from result array.

        for ( let link of links ) {
            const keys = [ 'url', 'comment', 'tags'];
            Loop1 :
            for ( let key of keys) {
                if (Array.isArray(link[key])) { // tags is array so loop of each tag
                    for ( let tag of link[key]) {
                        for ( let q of query ) {
                            if (!q) {break} // does not search for undefined/null values
                            let patt = new RegExp(q, 'i')
                            if (patt.test(tag)) {
                                results.push(link)
                                break Loop1
                            }
                        }
                    }
                } else {
                    for ( let q of query) {
                        if (!q) {break}
                        let patt = new RegExp(q, 'i')
                        if (patt.test(link[key])) {
                            results.push(link)
                            break Loop1
                        }
                    }
                }     
            }
        }
        setBulletinMsg(`Found ${results.length} result(s) for "${searchVal}"`)
        setSearchLinks(results);
        
    }

    return (
        <Container className='searchForm text-warning' >
        <Form onSubmit={searchSubmit} md='8'>
            <h3 >Find a link</h3>
            <Form.Group controlId='formSearchText'>
                <Form.Control size='sm' type='search' placeholder="google, shopping, bananas...etc" onChange={(e)=> setSearchVal(e.target.value)} autoComplete="off"/>
                <Form.Text  >
                    If it's there, we'll find it. Unless it's the missing link.
                </Form.Text>
            </Form.Group>
            <Button size='sm' variant='warning' type='submit'>SEARCH</Button>            
        </Form>
        </Container>
    )
}

export default Search;