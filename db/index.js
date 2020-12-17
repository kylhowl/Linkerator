// Connect to DB
const { Client } = require('pg');
const DB_NAME = 'kylho:Kory78@localhost:5432/linkeratorDB'
const DB_URL = process.env.DATABASE_URL || `postgres://${ DB_NAME }`;
const client = new Client(DB_URL);

// database methods
async function getAllLinks() {
  try {
    const { rows : links } = await client.query(`
      SELECT * FROM link;
    `);
    const tags = await _getTags(links)
   
    links.map((link) => {
      link.tags = [];
      tags.map((tag) => {
        if (tag.linkId === link.linkId) { link.tags.push(tag.tag_name)}
        return tag;
      })
          return link;
    })

    const { rows : allTags }  = await client.query(`
    SELECT tag_name
    FROM tag;
  `)
  // build return object
  const tagArray = allTags.map((tag)=> tag.tag_name);
  const results = { links , tags : tagArray}

    return results;
  } catch (err) {
    throw err
  }
}

async function _getTags() {
  
  try {
     
      const { rows : tags } = await client.query(`
        SELECT *
        FROM tag
        INNER JOIN link_tag
          on link_tag."tagId"=tag."tagId";
      `);

    return tags
      
  } catch (err) {
    throw err
  }
}

async function getTagLinks(tagName) {
  console.log('tag name', tagName)
  try {
    const tags = await _getTags();
    
    const tagLinks = tags.map((tag) => {
      if (tag.tag_name === tagName) {return tag.linkId}
    })

    const selectValues = tagLinks.map((_,index) => `$${index + 1}`).join(`, `);

    const { rows : links } = await client.query(`
      SELECT * FROM link
      WHERE "linkId" IN (${selectValues});
    `, tagLinks );
  
    links.map((link) => {
      link.tags = [];
      tags.map((tag) => {
        if (tag.linkId === link.linkId) { link.tags.push(tag.tag_name)}
        return tag;
      })
      return link;
    })

    return links;

  } catch (err) {
    throw err;
  }
}

async function createLink(fields = {}) {

  const { url, comment, tags = [] } = fields;

  try {

  
  const { rows : [link] } = await client.query(`
    INSERT INTO link( url, comment)
    VALUES ($1, $2)
    ON CONFLICT (url)
    DO NOTHING
    RETURNING *;
  `, [ url, comment ])
  
  if (!link) {
    return {
      name: "LinkAlreadyExists",
      message: "Link already exists, update or edit existing link."
    }
  }

  if (tags.length) {
    await _createTag(link.linkId, tags);
  }

  link.tags = tags;
  return link
  } catch (err) {
    throw err;
  }
}

async function _createTag(linkId, tags) {
  
  const insertValues = tags.map((_, index) => `$${index + 1}`).join(`), (`);
  try {
    const { rows : tagIds } = await client.query(`
    INSERT INTO tag(tag_name)
    VALUES (${insertValues})
    ON CONFLICT (tag_name)
    DO UPDATE SET tag_name = tag.tag_name
    RETURNING *;
  `, tags );
  // figure out solution for duplicate tag insertion at once
  const tagIdArray = tagIds.map((tag)=> tag.tagId);
  
  const insertLinkTags = tagIdArray.map((_,index) => `$1,$${index+2}`).join(`), (`);

  await client.query(`
    INSERT INTO link_tag("linkId", "tagId")
    VALUES (${insertLinkTags})
    ON CONFLICT DO NOTHING;
  `, [ linkId, ...tagIdArray ])

  } catch (err) {
    throw err
  }
}


async function updateLink(fields) {  
  // fields can include count and/or comment. 
  const { linkId, tags = [], updateCount}  = fields;
  delete fields.linkId; //removes no updateable fields
  delete fields.tags;
  delete fields.updateCount; // this is a boolean telling db to increment count
  
  const updateValues = Object.values(fields);
  const setString = Object.keys(fields).map((key, index) => `"${ key }"=$${ index + 1 }`).join(', ');

  
  try {
    if ( fields.comment ) {   // does not run if nothing to update in link table
      await client.query(`
      UPDATE link
      SET 
      ${setString}
      WHERE "linkId"=${linkId}
    `, updateValues );
    } 
    if (updateCount) {
      await client.query(`
      UPDATE link
      SET clickcount = link.clickcount + 1
      WHERE "linkId"=${linkId};`)
    }

    if (tags.length) {  // does not run if there is no update to tags for link
      await _createTag(linkId, tags)
    }
    
    return await getAllLinks();

  } catch (err) {
    console.log('error in updateLink')
    throw err;
  }
}

// export
module.exports = {
  client,
  getAllLinks,
  getTagLinks,
  createLink,
  updateLink
  // db methods
}