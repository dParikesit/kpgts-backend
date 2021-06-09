const { QueryCursor } = require('mongoose');
const user = require('../models/user');


// limit menunjukkan banyaknya team yang ditampilkan dalam satu page
// default page adalah 0 (artinya N team pertama akan ditampilkan pada page 0, dengan  0 < N <= limit)
const getPagination = (page, size) => {
    // default pagination, 10 teams per halaman
    const limit = size ? size : 10;
    const offset = page ? page * limit: 0;
    return {limit, offset};
}


// Menunjukkan semua page, namun dibagi pake pagination dibagi menjadi beberapa page
// untuk mengaksesnya harus pake GET parameter size dan page
exports.getAll = (req, res, model, select, query={}) => {
    const {page, size} = req.query;
    
    const {limit, offset} = getPagination(page, size);

    // read https://www.npmjs.com/package/mongoose-paginate-v2
    model.paginate(query, {offset, limit, lean: true, leanWithId: true, select: select})
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                users: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1
            });
        })
        .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Error",
            });
          });
};

