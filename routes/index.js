let express = require('express');
let router = express.Router();
let axios = require('axios');

// Gets the structure data from conwaylife.com.
const getData = async (id) => {
  try {
    let res = await axios.get(`https://www.conwaylife.com/patterns/${id}.cells`);
    return res.data;
  } catch (err) {
    return null;
  }
}

// Takes in an array of .s and Os. Returns it in array form.
const convertToArray = (arr) => {
  // Get number of columns by taking the maximum row length.
  let cols = arr.reduce(((acc, val) => (val.length > acc) ? val.length : acc), 0);
  return arr.map(row =>[
    ...row.split('').map(cell => (cell === 'O') ? 1 : 0),  // Convert . to 0 and O to 1.
    ...Array(cols - row.length).fill(0)                    // Fill remaining cells with 0s.
  ]);
}

router.get('/:id', async (req, res, next) => {

  let data = await getData(req.params.id);

  if (!data) {
    return res.status(400).json({ result: 'An error has occured :(' });
  }

  return res.status(200).json({
    result:
      convertToArray(
        data.split('\r').join('')  // Remove all instances of '\r'.
            .split('\n').slice(4)  // Split by '\n' and remove header.
            .filter(x => x != '')  // Remove empty lines.
      )
  });
});

module.exports = router;
