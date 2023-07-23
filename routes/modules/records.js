const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

// create
router.get('/new', (req, res) => {
    return res.render('new')
})

router.post('/', (req, res) => {
    const userId = req.user._id
    const { name, categoryId, date, amount } = req.body
    return Record.create({
        name,
        categoryId,
        date,
        amount,
        userId
    })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// edit
router.get('/:id/edit', (req, res) => {

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const userId = req.user._id
    const _id = req.params.id

    return Record.findOne({ _id, userId })
        .lean()
        .then(record => {
            record[`categoryIdCheck${record.categoryId}`] = true
            record.formattedDate = formatDate(record.date)
            res.render('edit', { record })
        })
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {

    const userId = req.user._id
    const _id = req.params.id
    const { name, categoryId, date, amount } = req.body

    return Record.findOne({ _id, userId })
        .then(record => {
            record.name = name
            record.categoryId = categoryId
            record.date = date
            record.amount = amount

            return record.save()
        })
        .then(() => res.redirect(`/`))
        .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Record.findOne({ _id, userId })
        .then(record => record.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

module.exports = router
