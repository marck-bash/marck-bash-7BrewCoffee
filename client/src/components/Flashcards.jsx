import { useEffect, useState } from "react";

export default function Flashcards() {
    const [flashcards, setFlashcards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [cardCategory, setCardCategory] = useState([]);
    const [isCategoryChecked, setIsCategoryChecked] = useState({
        "all": true,
        "recipe-quick": false,
        "customer-questions": false,
        "company-culture": false,
        "brewista-positions": false,
        "brewista-terms": false,
        "recipe-prep": false,
        "recipe-dairy": false,
        "recipe-tea": false,
        "recipe-questions": false
    });

    // retrieve flashcard data on load and set cards
    useEffect(() => {
        async function getFlashcardData() {
            const response = await fetch("http://localhost:3000/flashcards");
            const flashcardJson = await response.json();
            setFlashcards(flashcardJson);
            setSelectedCards(flashcardJson);
        }
        getFlashcardData();
    }, []);

    // set cards with category change
    useEffect(() => {
        if(cardCategory.length > 0) {
            // find cards that match categories in array
            let tempFlashArr = flashcards.filter((card) => cardCategory.includes(card.category));
            setSelectedCards(tempFlashArr);
        }
        else {
            setSelectedCards(flashcards);
        }
    }, [cardCategory]);

    // move to next flashcard
    function nextFlashcard(event) {
        event.preventDefault();

        let tempCards = [...selectedCards];
        let currentCard = tempCards.shift();
        tempCards.push(currentCard);
        setSelectedCards(tempCards);
    }

    // go to previous flashcard
    function previousFlashcard(event) {
        event.preventDefault();

        let tempCards = [...selectedCards];
        let lastCard = tempCards.pop();
        tempCards.unshift(lastCard);
        setSelectedCards(tempCards);
    }

    // handle checkbox selection
    function categorySelection(category) {
        let categoryValues = Object.values(isCategoryChecked);
        categoryValues.shift();

        if(category === "all") {
            if(!isCategoryChecked.all) {
                // uncheck all other checkboxes
                let tempCategoryCheck = {...isCategoryChecked};
                for(let key in isCategoryChecked) {
                    if(key !== "all") {
                        tempCategoryCheck = {...tempCategoryCheck, [`${key}`]: false};
                    }
                }
                // setIsCategoryChecked(tempCategoryCheck);
                setIsCategoryChecked({...tempCategoryCheck, "all": true});
                setCardCategory([]);
            }
            else if(!categoryValues.includes(true)) {
                // keep checked if only thing checked
                setIsCategoryChecked({...isCategoryChecked, "all": true});
            }
            else {
                setIsCategoryChecked({...isCategoryChecked, "all": false});
            }
        }
        else {
            let tempCategoryCheck = {...isCategoryChecked};
            // if nothing is selected yet uncheck all checkbox
            if(!categoryValues.includes(true)) { 
                tempCategoryCheck = {...tempCategoryCheck, "all": false};
            }

            // if category is not checked yet...
            if(!isCategoryChecked[category]) {
                // add category to cardCategory array
                const tempArr = [...cardCategory, category];
                setCardCategory(tempArr);
            }
            else {
                // remove category from cardCategory array
                const tempArr = [...cardCategory];
                const categoryIndex = cardCategory.findIndex(() => category);
                tempArr.splice(categoryIndex, 1);
                setCardCategory(tempArr);
                // if all checkboxes are unchecked set all checkbox to true
                if(tempArr.length === 0) {
                    tempCategoryCheck = {...tempCategoryCheck, "all": true};
                }
            }
            
            setIsCategoryChecked({...tempCategoryCheck, [`${category}`]: !isCategoryChecked[category]});
        }
    }

    function swapClick(event) {
        // prevent cards that aren't on top from flipping over
        if(event.target.title !== selectedCards[0].cardNumber) {
            event.preventDefault();
        }
    }

    return (
        <div className="flex flex-col">
            <div className="self-center text-6xl m-7">Flashcards</div>
            <div className="m-7 flex justify-center">
                <fieldset className="mr-5">
                    <legend>Category</legend>
                    <div>
                        <input type="checkbox" id="all" name="category" value={isCategoryChecked.all} onChange={() => categorySelection("all")} checked={isCategoryChecked.all} />
                        <label htmlFor="all">All</label>
                    </div>
                    <div>
                        <input type="checkbox" id="recipe-quick" name="category" value={isCategoryChecked["recipe-quick"]} onChange={() => categorySelection("recipe-quick")} checked={isCategoryChecked["recipe-quick"]} />
                        <label htmlFor="recipe-quick">Quick Recipe</label>
                    </div>
                    <div>
                        <input type="checkbox" id="customer-questions" name="category" value={isCategoryChecked["customer-questions"]} onChange={() => categorySelection("customer-questions")} checked={isCategoryChecked["customer-questions"]} />
                        <label htmlFor="customer-questions">Customer Questions</label>
                    </div>
                    <div>
                        <input type="checkbox" id="company-culture" name="category" value={isCategoryChecked["company-culture"]} onChange={() => categorySelection("company-culture")} checked={isCategoryChecked["company-culture"]} />
                        <label htmlFor="company-culture">Company Culture</label>
                    </div>
                    <div>
                        <input type="checkbox" id="brewista-positions" name="category" value={isCategoryChecked["brewista-positions"]} onChange={() => categorySelection("brewista-positions")} checked={isCategoryChecked["brewista-positions"]} />
                        <label htmlFor="brewista-positions">Brewista Positions</label>
                    </div>
                    <div>
                        <input type="checkbox" id="brewista-terms" name="category" value={isCategoryChecked["brewista-terms"]} onChange={() => categorySelection("brewista-terms")} checked={isCategoryChecked["brewista-terms"]} />
                        <label htmlFor="brewista-terms">Brewista Terms</label>
                    </div>
                    <div>
                        <input type="checkbox" id="recipe-prep" name="category" value={isCategoryChecked["recipe-prep"]} onChange={() => categorySelection("recipe-prep")} checked={isCategoryChecked["recipe-prep"]} />
                        <label htmlFor="recipe-prep">Drink Prep</label>
                    </div>
                    <div>
                        <input type="checkbox" id="recipe-dairy" name="category" value={isCategoryChecked["recipe-dairy"]} onChange={() => categorySelection("recipe-dairy")} checked={isCategoryChecked["recipe-dairy"]} />
                        <label htmlFor="recipe-dairy">Dairy</label>
                    </div>
                    <div>
                        <input type="checkbox" id="recipe-tea" name="category" value={isCategoryChecked["recipe-tea"]} onChange={() => categorySelection("recipe-tea")} checked={isCategoryChecked["recipe-tea"]} />
                        <label htmlFor="recipe-tea">Tea</label>
                    </div>
                    <div>
                        <input type="checkbox" id="recipe-questions" name="category" value={isCategoryChecked["recipe-questions"]} onChange={() => categorySelection("recipe-questions")} checked={isCategoryChecked["recipe-questions"]} />
                        <label htmlFor="recipe-questions">Recipe Questions</label>
                    </div>
                </fieldset>
                <div className="w-2/4 flex flex-col content-center gap-y-7">
                    <div className="stack">
                        {selectedCards.map((card) => (
                            <label key={card.cardNumber} className="swap swap-flip">
                                <input type="checkbox" title={card.cardNumber} onClick={swapClick} />
                                <div className="card w-96 h-72 shadow-md bg-primary text-primary-content flex-col justify-center swap-off">
                                    <div className="card-body flex-col justify-center">
                                        <div className="w-full h-full card-title justify-center">{card.question}</div>
                                    </div>
                                </div> 
                                <div className="card w-96 h-72 shadow-md bg-primary text-primary-content flex-col justify-center swap-on">
                                    <div className="card-body flex-col max-h-full justify-center">
                                        {card.answer.length < 238 ? (
                                            <div className="w-full h-full card-title justify-center">{card.answer}</div>
                                        ) : (
                                            <div className="w-full h-full card-title justify-center text-base">{card.answer}</div>
                                        )}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-around">
                        <button className="btn btn-neutral w-1/4" onClick={previousFlashcard}>Previous</button>
                        <button className="btn btn-neutral w-1/4" onClick={nextFlashcard}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}