import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

const DAILY_CALORIES = 2000;

//racunanje TRENUTNIH kalorij
const extractCalories = (instructions) => {
    if (!instructions) return 0;

    const match = instructions.match(/(\d+)\s*cal/i);
    return match ? parseInt(match[1], 10) : 0;
};

export default function ViewRecipe() {
    const [recipe, setRecipe] = useState({
        name: "",
        ingredients: "",
        instructions: "",
    });

    const [persons, setPersons] = useState(1);

    const { id } = useParams();

    useEffect(() => {
        loadRecipe();
    }, []);

    const loadRecipe = async () => {
        const result = await axios.get(`http://localhost:8081/recipe/${id}`);
        setRecipe(result.data);
    };

    const baseCalories = extractCalories(recipe.instructions);
    const totalCalories = baseCalories * persons;

    //racunanje % TRENUTNIH kalorij
    const caloriePercentage = Math.min(
        Math.round((totalCalories / DAILY_CALORIES) * 100),
        100
    );

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - margin * 2;

        doc.setFontSize(18);
        doc.text(recipe.name, margin, 20);

        doc.setFontSize(14);
        doc.text("Ingredients:", margin, 40);
        const ingredientsLines = doc.splitTextToSize(
            scaleIngredients(recipe.ingredients, persons),
            maxWidth - 5
        );
        doc.text(ingredientsLines, margin + 5, 50);

        const instructionsStartY = 50 + ingredientsLines.length * 7;
        doc.text("Instructions:", margin, instructionsStartY + 10);

        const instructionsLines = doc.splitTextToSize(
            scaleCalories(recipe.instructions, persons),
            maxWidth - 5
        );
        doc.text(instructionsLines, margin + 5, instructionsStartY + 20);

        doc.save(`${recipe.name}.pdf`);
    };

    const scaleIngredients = (sestavine, st) => {
        if (!sestavine) return "";

        return sestavine
            .split("\n")
            .map(line =>
                line.replace(/(\d+(\.\d+)?)/g, match =>
                    (parseFloat(match) * st).toString()
                )
            )
            .join("\n");
    };

    // skaliranje kalorij glede na število oseb
    const scaleCalories = (instructions, persons) => {
        if (!instructions) return "";

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
                                    <pre className="mt-2">
                                        {scaleIngredients(recipe.ingredients, persons)}
                                    </pre>
                                </li>
                                <li className="list-group-item">
                                    <b>Instructions:</b>{" "}
                                    {scaleCalories(recipe.instructions, persons)}
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

                    <div className="calorie-box-wrapper">
                        <div className="calorie-box">
                            <div
                                className="calorie-fill"
                                style={{ height: `${caloriePercentage}%` }}
                            >
                                <span className="calorie-percent">
                                    {caloriePercentage}%
                                </span>
                            </div>
                        </div>

                        <div className="calorie-text">
                            {totalCalories} kcal of daily intake
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
