const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

router.get('/new', (req, res) => {
    return res.render('new')
})

router.post('/', (req, res) => {
    const userId = "64bd05a49c683b9ad2e1a686"
    // const userId = req.user._id
    const { name, categoryId, date, amount} = req.body
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

router.get('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Todo.findOne({ _id, userId })
        .lean()
        .then(todo => res.render('detail', { todo }))
        .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Todo.findOne({ _id, userId })
        .lean()
        .then(todo => res.render('edit', { todo }))
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    const { name, isDone } = req.body
    return Todo.findOne({ _id, userId })
        .then(todo => {
            todo.name = name
            todo.isDone = isDone === 'on'
            return todo.save()
        })
        .then(() => res.redirect(`/todos/${_id}`))
        .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Todo.findOne({ _id, userId })
        .then(todo => todo.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

module.exports = router
