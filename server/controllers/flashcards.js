import { Router } from "express";
import flashcardData from "../flashcard-data/flashcardData.json" with { type: "json" };

const router = Router();

// return all flashcards
router.get("/flashcards", (request, response) => {
    try {
        // get all flashcard data
        const flashcards = flashcardData;

        // send flashcard data as response
        response.send(flashcards);
    }
    catch(err) {
        response.status(500).send({
            message: err.message
        });
    }
});

export default router;