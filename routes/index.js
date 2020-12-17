const { default: Axios } = require('axios');
const { 
  getAllLinks,
  getTagLinks,
  createLink,
  updateLink
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
    // console.log("Trying to get all the links")
    const results = await getAllLinks();
    // console.log('results in routes', results);
    res.send(results);
  } catch (err) {
    next(err);
  }
});

apiRouter.post(`/links`, async (req, res, next) => {
  const body = req.body;
  // console.log('req:', req)
  console.log('body', body)
  try {
    const results = await createLink(body);
    console.log('results from creating link', results);
    res.send(results)
  } catch (err) {
    next(err);
  }

});

apiRouter.patch(`/links/:linkId`, async (req, res, next) => {
  const { linkId } = req.params;
  const body = req.body
  body.linkId = linkId
  try {
    const results = await updateLink(body)
    res.send(results);
  } catch (err) {
    console.log('error!!!')
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
