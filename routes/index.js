
const { 
  getAllLinks,
  getTagLinks,
  createLink,
  updateLink,
  addTags
} = require('../db');

const apiRouter = require('express').Router();



apiRouter.get(`/tags/:tagName/links`, async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const results = await getTagLinks(tagName);
    
    res.send(results);
  } catch (err) {
    next(err);
  }
});

apiRouter.get(`/links`, async (req, res, next) => {
  try {
    
    const results = await getAllLinks();
    
    res.send(results);
  } catch (err) {
    next(err);
  }
});

apiRouter.post(`/links`, async (req, res, next) => {
  const body = req.body;

  try {
    const results = await createLink(body);
    
    res.send(results)
  } catch (err) {
    next(err);
  }

});

apiRouter.post('/links/:linkId', async (req, res, next) => {
  const { linkId } = req.params;
  const { tags } = req.body;

  try {
    const results = await addTags(linkId, tags);
    res.send(results);
  } catch (err) {
    console.error('Something went wrong creating Tags', err);
    next(err);
  }
})

apiRouter.patch(`/links/:linkId`, async (req, res, next) => {
  const { linkId } = req.params;
  const body = req.body
  body.linkId = linkId
  try {
    const results = await updateLink(body)
    res.send(results);
  } catch (err) {
    next(err);
  }
})

apiRouter.get("/", (req, res, next) => {
  console.log('I am running')
  res.send({
    message: "API is under construction!"
  });
});

module.exports = apiRouter;
