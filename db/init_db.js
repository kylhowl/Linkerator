// code to build and initialize DB goes here
const {
  client
  // other db methods 
} = require('./index');

async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order
    console.log('Dropping Tables');
    await client.query(`
      DROP TABLE IF EXISTS link_tag;
    `);
    console.log('Dropped link_tag table');

    await client.query(`
      DROP TABLE IF EXISTS link;
    `);
    console.log('Dropped link table')

    await client.query(`
      DROP TABLE IF EXISTS tag;
    `);
    console.log('Dropped tag table');

    // build tables in correct order
    console.log("Building Tables");
    await client.query(`
      CREATE TABLE link(
        "linkId" SERIAL PRIMARY KEY,
        url VARCHAR(255) UNIQUE NOT NULL,
        comment VARCHAR(255),
        clickcount INTEGER NOT NULL DEFAULT 0,
        "createdDate" DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);
    console.log("Created link table");

    await client.query(`
      CREATE TABLE tag(
        "tagId" SERIAL PRIMARY KEY,
        tag_name VARCHAR(255) UNIQUE NOT NULL,
        "isActive" BOOLEAN  NOT NULL DEFAULT true
      );
    `);
    console.log('Created tag table');
  
    await client.query(`
      CREATE TABLE link_tag(
        "linkId" INTEGER REFERENCES link("linkId") NOT NULL,
        "tagId" INTEGER REFERENCES tag("tagId") NOT NULL,
        UNIQUE ("linkId", "tagId")
      );
    `);
    console.log('Created link_tag table');

  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data
    let {rows : links} = await client.query(`
        INSERT INTO link 
          (url, comment)
        VALUES
          ('www.google.com','Google is a massive search engine, with an account you have access to email, cloud servers, and many more features.'),
          ('www.yahoo.com','Yahoo is a search engine with email service, news, and more features.'),
          ('http://www.bing.com','Bing is a Microsofts search engine that is acts like many other search engines with account features.')
        RETURNING "linkId";
    `)
    console.log('Links ids inserted', links);

    let { rows : tags } = await client.query(`
      INSERT INTO tag (tag_name)
      VALUES ('SEARCH'), ('MAPS'), ('NEWS'), ('SHOPPING')
      RETURNING *;
    `)
    console.log('Tag ids inserted', tags)

    let { rows : linktags } = await client.query(`
      INSERT INTO link_tag("linkId", "tagId")
      VALUES (1,1), (1,2), (2,3), (2,2), (1,4), (3,1), (3,2)
      RETURNING *;
    `)
    console.log('Link-Tag relationships inserted', linktags)

  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());