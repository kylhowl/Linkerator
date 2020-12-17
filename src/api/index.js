import axios from 'axios';

export async function getLinks() {
  try {
    
    const { data } = await axios.get('/api/links');
    
    return data;
    
  } catch (error) {
    throw error;
  }
}

export async function createLink(body) {
  try {

    const { data } = await axios.post('/api/links', body);

    return data

  } catch (err) {
    throw err;
  }
}

export async function searchTags(tag) {
  try {
    const { data } = await axios.get(`/api/tags/${tag}/links`)
    return data
  } catch (err) {
    throw err
  }
}

export async function updateCount(linkId) {
  try {
    const { data } = await axios.patch(`api/links/${linkId}`, {updateCount : true})
    
    return data
  } catch (err) {
    throw err
  }
}

export async function addTags(linkId, tags = []) {
  
  if (!tags.length) { return { message: 'You forgot the tag(s)!'} }
  try {
    const { data } = await axios.patch(`api/links/${linkId}`, {tags})
    return data
  } catch (err) {
    throw err
  }
}