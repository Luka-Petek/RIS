import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function ViewRecipe() {
    const [recipe, setRecipe] = useState({
        name: "",
        ingredients: "",
        instructions: "",
    });

    const [persons, setPersons] = useState(1);

    const {id} = useParams();

    useEffect(() => {
        loadRecipe();
    }, []);

    const loadRecipe = async () => {
        const result = await axios.get(`http://localhost:8081/recipe/${id}`);
        setRecipe(result.data);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - margin * 2;

        doc.setFontSize(18);
        doc.text(recipe.name, margin, 20);

        doc.setFontSize(14);
        doc.text("Ingredients:", margin, 40);
        const ingredientsLines = doc.splitTextToSize(scaleIngredients(recipe.ingredients, persons), maxWidth - 5);
        doc.text(ingredientsLines, margin + 5, 50);

        const instructionsStartY = 50 + ingredientsLines.length * 7;
        doc.text("Instructions:", margin, instructionsStartY + 10);
        const instructionsLines = doc.splitTextToSize(
            //stremenu ker klicem funkcijo za dinamicno posodabljanje
            scaleCalories(recipe.instructions, persons),
            maxWidth - 5
        );
        doc.text(instructionsLines, margin + 5, instructionsStartY + 20);

        doc.save(`${recipe.name}.pdf`);
    };

    const scaleIngredients = (sestavine, st) => {
        if (!sestavine) {
            return "";
        }

        return sestavine
            .split("\n")    //vsak el da v svojo vrstico
            .map(line =>
                //iz sestavin filtrira stevila (\d+), decimalna ((\.\d+)?), "g" global, da najde vse st.
                line.replace(/(\d+(\.\d+)?)/g, match =>
                    (parseFloat(match) * st).toString()
                )
            )
            .join("\n");
    };

    //ujemanje kalrij in vecanje... pomagas si ker je vedno zraven "cal"... npr "600cal"
    const scaleCalories = (instructions, persons) => {
        if (!instructions) {
            return "";
        }

        return instructions.replace(/(\d+)\s*cal/i, (match, calories) => {
            const scaledCalories = parseInt(calories, 10) * persons;
            return `${scaledCalories}cal`;
        });
    };

    const increasePersons = () => {
        setPersons(prev => prev + 1);
    };

    const decreasePersons = () => {
        setPersons(prev => Math.max(1, prev - 1));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Recipe Details</h2>

                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <button className="btn btn-outline-secondary me-2" onClick={decreasePersons}>
                            −
                        </button>

                        <span>
                            <b>{persons}</b> persons
                        </span>

                        <button className="btn btn-outline-secondary ms-2" onClick={increasePersons}>
                            +
                        </button>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            Details for recipe ID: {id}
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>Title:</b> {recipe.name}
                                </li>
                                <li className="list-group-item">
                                    <b>Ingredients:</b>
                                    <pre className="mt-2">{scaleIngredients(recipe.ingredients, persons)}</pre>
                                </li>
                                <li className="list-group-item">
                                    <b>Instructions:</b> {scaleCalories(recipe.instructions, persons)}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button className="btn btn-success my-2" onClick={downloadPDF}>
                        Download PDF
                    </button>

                    <Link className="btn btn-primary my-2" to={"/"}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
