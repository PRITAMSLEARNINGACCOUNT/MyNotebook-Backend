const express = require("express");
const mongoose = require("mongoose");
const NotesDB = require("../Database_Schemas/Notes");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Auth = require("../Middleware/Authorization");
const NotesModel = mongoose.model("NotesCollection", NotesDB);
router.get("/GetNotes", Auth, async (request, response) => {
  try {
    let Result = await NotesModel.find({ user: request.USERID });
    // console.log(Result);
    response.send(Result);
  } catch (error) {
    response.status(500).json({ Error: error });
  }
});
router.post(
  "/AddNote",
  Auth,
  [body("Title").notEmpty(), body("Description").notEmpty()],
  async (request, response) => {
    try {
      const Validation = await validationResult(request);
      if (!Validation.isEmpty()) {
        return response.status(400).json({ errors: Validation.array() });
      } else {
        const NoteObj = {
          user: request.USERID,
          Title: request.body.Title,
          Description: request.body.Description,
        };
        NotesModel.create(NoteObj);
        response.send("Note Created");
      }
    } catch (error) {
      response.status(500).json({ Error: error });
    }
  }
);
router.put("/UpdateNote:NoteId", Auth, async (request, response) => {
  try {
    let UserNotes = [];
    let Result = await NotesModel.find({ user: request.USERID });
    Result.forEach((Object) => {
      UserNotes.push(Object.id);
    });
    if (UserNotes.includes(request.params.NoteId)) {
      let Updated_Info = {};
      if (request.body.Title) {
        Updated_Info["Title"] = request.body.Title;
      }
      if (request.body.Description) {
        Updated_Info["Description"] = request.body.Description;
      }
      let Updated_Note = await NotesModel.findByIdAndUpdate(
        request.params.NoteId,
        Updated_Info,
        { new: true }
      );
      response.json(Updated_Note);
    } else {
      response
        .status(401)
        .send("You Are Not Allowed To Perform This Operation\n");
    }
  } catch (error) {
    response.status(500).json({ Error: error });
  }
});
router.delete("/DeleteNote:NoteId", Auth, async (request, response) => {
  try {
    let PendingDelete = await NotesModel.findById(request.params.NoteId);
    if (PendingDelete.user.toString() === request.USERID) {
      // response.send("Congratulations! You Can Delete This Note\n");
      let Deleted_Note = await NotesModel.findByIdAndDelete(PendingDelete.id);
      response.send(Deleted_Note);
    } else {
      response
        .status(401)
        .send("You Are Not Allowed To Perform This Operation\n");
    }
  } catch (error) {
    response.status(500).json({ Error: error });
  }

  // response.send(PendingDelete);
});
module.exports = router;
