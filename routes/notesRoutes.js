const express = require('express');
const app = express();
const router = express.Router();
const notes = require('../data/notes.json');
const fs = require('fs');
const path = require('path');



//it should get all notes
router.get('/', (req, res) => {
    try{
        if (notes.notes.length === 0)
            res.status(404).json({Message: "There is no notes!"});
        else
            res.json(notes);
    } catch(error){
        console.error(error)
        res.status(500).json({error: 'Internal server error'});}
    }
);

//it should get a single note by id
router.get('/:id',  (req, res) => {
    const id = parseInt(req.params.id);
    const findNote = notes.notes.find((element) => element.id === id )
    if(!findNote) {
      res.status(404).json({Message: "Note not found!"});
    } 
      res.json(findNote);


});

//it should create a new note (add it to the notes.json file)
router.post('/', (req, res) => {
    let {title, note} = req.body;
    let id = notes.notes[notes.notes.length-1].id+1
    if (!title || !note){
        res.status(404).json({Message: "title and Note are required!"});
    }
    let newNote = {
        id : id,
        title:title,
        note:note
    }
    notes.notes.push(newNote);
    fs.writeFile(path.join(__dirname,"../data/notes.json"),
    JSON.stringify(notes,null,2),err=>{ 
       if (err){
        throw err
       }
        res.json(notes);
    })
    
} );

//it should update an existing note (update the notes.json file)
router.put('/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    let {title, note} = req.body;
    const findNote = notes.notes.find((element) => element.id === id );
    if(!findNote){
        res.status(404).json({Message: "Note not found!"});
    }
    findNote.note = note;
    findNote.title = title;
    // notes.notes.push(findNote);

    fs.writeFile(path.join(__dirname,"../data/notes.json"),
    JSON.stringify(notes,null,2),err=>{ 
       if (err){
        throw err
       }
        res.json(notes);
    });

});

//it should delete an existing note (update the notes.json file)
router.delete('/:id', (req, res)=>{
    const id= parseInt(req.params.id);
    const index = notes.notes.findIndex((element)=> element.id === id);
    if (!index){
        res.status(404).json({Message: "Id not found!!"});
    }
    notes.notes.splice(index,1);
    res.status(200).json({Message: "Note deleted successfully"})
    fs.writeFileSync(path.join(__dirname,"../data/notes.json"),
    JSON.stringify(notes,null,2),err=>{
        if (err){
            throw err
        }
        res.json(notes);
    })
   });





module.exports = router;
