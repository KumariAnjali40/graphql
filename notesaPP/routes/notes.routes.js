const express=require('express');
const {auth}=require("../middleware/auth.middleware");
const {NoteModel}=require('../schema/note.model');

const noteRouter=express.Router();

noteRouter.use(auth);

noteRouter.post("/create",async(req,res)=>{
   try{
   const note=new NoteModel(req.body);
   await note.save();
   res.status(200).json({msg:"new note has been created"});

   }
   catch(err){
    res.status(400).json({error:err});
   }
})

//get
noteRouter.get('/',async(req,res)=>{
   try{
     const notes=await NoteModel.find({userID:req.body.userID});
   //   console.log(userID);
     //filter the data of the particular id so the user can see only theire data.
     res.status(200).json({notes});
   }
   catch(err){
      res.status(400).json({err});
   }
})


//update
// Update
// noteRouter.patch('/update/:noteID', async (req, res) => {
//    try {
//        const noteID = req.params.noteID;
//        const updatedData = req.body;

//        const note = await NoteModel.findById(noteID);

//        if (!note) {
//            return res.status(404).json({ msg: 'Note not found' });
//        }

//        if (note.userID !== req.body.userID) {
//            return res.status(403).json({ msg: 'Unauthorized: You are not allowed to update this note' });
//        }
//        Object.assign(note, updatedData);

//        await note.save();
//        res.status(200).json({ msg: 'Note updated successfully', updatedNote: note });
//    } catch (err) {
//        console.error(err);
//        res.status(500).json({ error: 'Internal Server Error' });
//    }
// });

noteRouter.patch('/update/:noteID',async(req,res)=>{
   const {noteID} = req.params;
   const payload=req.body;
   try{
      const note=await NoteModel.findOne({_id:noteID});
      if(note.userID===req.body.userID){
         await NoteModel.findByIdAndUpdate({_id:noteID},payload);
         res.status(200).json({msg:"user has been updated"});
      }else{
         res.status(200).json({msg:"you are not having permission"});
      }
   }
   catch(err){
      console.log(err);
      res.status(400).json({err:err});
   }
})



//delete
//delete
// noteRouter.delete('/delete/:noteID', async (req, res) => {
   
//    try {
//       const noteID = req.params.noteID;
//       const note = await NoteModel.findOneAndDelete({ _id: noteID });

//       if (!note) {
//          return res.status(404).json({ msg: 'Note not found' });
//       }

//       // Assuming your authentication middleware sets user information in req.user
//       if (note.userID !== req.body.userID) {
//          return res.status(403).json({ msg: 'Unauthorized: You are not allowed to delete this note' });
//       }

//       res.status(200).json({ msg: 'Note deleted successfully' });
//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Internal Server Error' });
//    }

// });

noteRouter.delete('/delete/:noteID',async(req,res)=>{
   const {noteID} = req.params;
   try{
      const note=await NoteModel.findOne({_id:noteID});
      if(note.userID===req.body.userID){
         await NoteModel.findByIdAndDelete({_id:noteID});
         res.status(200).json({msg:"user has been deleted"});
      }else{
         res.status(200).json({msg:"your are not having permission"});
      }
   }
   catch(err){
      console.log(err);
      res.status(400).json({err:err});
   }
})




module.exports={
   noteRouter,
}