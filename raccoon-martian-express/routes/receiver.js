const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

let message = null;

router.get('/', (req, res) => {
  res.json({data: message})
  message = null;
})

router.post('/', async function (req, res, next) {
  const {data} = req.body
  message = data
  res.json({data: message});
});



module.exports = router;
