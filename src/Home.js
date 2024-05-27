import React, { useState, useEffect } from 'react';
import api from './api'; // Importez votre instance d'Axios

function Home() {
    const [proposition, setProposition] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [essais, setEssais] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [victoire, setVictoire] = useState(false);
    const [personnageChoisi, setPersonnageChoisi] = useState(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await api.get('/characters');
                console.log('Données récupérées :', response.data);
                setCharacters(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des personnages:', error);
            }
        };

        fetchCharacters();
    }, []);

    useEffect(() => {
        resetPartie();
    }, [characters]);

    const resetPartie = () => {
        const personnageIndex = Math.floor(Math.random() * characters.length);
        const personnage = characters[personnageIndex];
        setPersonnageChoisi(personnage);
        setVictoire(false);
        setEssais([]);
        setProposition('');
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setProposition(inputValue);

        if (!inputValue) {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = characters
            .map(character => character.name)
            .filter(name => name.toLowerCase().startsWith(inputValue.toLowerCase()));

        const remainingSuggestions = filteredSuggestions.filter(
            suggestion => !essais.includes(suggestion)
        );
        setSuggestions(remainingSuggestions);

        if (remainingSuggestions.length === 1 && remainingSuggestions[0].toLowerCase() === proposition.toLowerCase()) {
            setVictoire(true);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setEssais([...essais, suggestion]);
        setProposition('');
        setSuggestions([]);

        if (suggestion.toLowerCase() === proposition.toLowerCase()) {
            setVictoire(true);
        }
    };

    const handleResetLock = () => {
        resetPartie();
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (suggestions.length > 0) {
                handleSuggestionClick(suggestions[0]);
            }
        }
    };

    return (
        <div>
            {!victoire ? (
                <>
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
                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                    <h3>Essais :</h3>
                    <ul>
                        {essais.map((essai, index) => (
                            <li key={index}>{essai}</li>
                        ))}
                    </ul>
                    <button onClick={handleResetLock} style={{ position: 'absolute', bottom: '10px', left: '10px' }}>Reset Lock</button>
                </>
            ) : (
                <h1>Victoire!</h1>
            )}
        </div>
    );
}

export default Home;
