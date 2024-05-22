import React, { useState } from 'react';

const characters = [
    "Naruto Uzumaki",
    "Sasuke Uchiha",
    "Sakura Haruno",
];

function Home() {
    const [proposition, setProposition] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [essais, setEssais] = useState([]);

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setProposition(inputValue);

        if (!inputValue) {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = characters.filter(
            character => character.toLowerCase().startsWith(inputValue.toLowerCase())
        );

        const remainingSuggestions = filteredSuggestions.filter(
            suggestion => !essais.includes(suggestion)
        );
        setSuggestions(remainingSuggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setEssais([...essais, suggestion]); // Ajouter la suggestion aux essais
        setProposition(''); 
        setSuggestions([])    };

    const handleResetLock = () => {
        setEssais([]); // Réinitialiser les essais
        setSuggestions([]); // Réinitialiser les suggestions
    };

    const handleInputKeyDown = (event) => {
        // Si la touche pressée est Entrée
        if (event.key === 'Enter') {
            if (suggestions.length > 0) {
                handleSuggestionClick(suggestions[0]);
            }
        }
    };

    return (
        <div>
            <h2>Classique</h2>
            <label>
                Proposition :
                <input
                    type="text"
                    value={proposition}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                />
            </label>
            {/* Afficher les suggestions uniquement s'il y en a */}
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            {/* Afficher la liste des essais */}
            <h3>Essais :</h3>
            <ul>
                {essais.map((essai, index) => (
                    <li key={index}>{essai}</li>
                ))}
            </ul>
            <button onClick={handleResetLock} style={{ position: 'absolute', bottom: '10px', left: '10px' }}>Reset Lock</button>
        </div>
    );
}

export default Home;
