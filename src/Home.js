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
        if (characters.length > 0) {
            resetPartie();
        }
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
            suggestion => !essais.some(essai => essai.name === suggestion)
        );
        setSuggestions(remainingSuggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        const character = characters.find(character => character.name === suggestion);
        setEssais([...essais, character]);
        setProposition('');
        setSuggestions([]);

        if (character.name.toLowerCase() === personnageChoisi.name.toLowerCase()) {
            setVictoire(true);
        }
    };

    const handleResetLock = () => {
        resetPartie();
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' && suggestions.length > 0) {
            handleSuggestionClick(suggestions[0]);
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
                    {essais.length > 0 && (
                        <div className="essais-container">
                            <h3>Essais :</h3>
                            <div className="table">
                                <div className="row header">
                                    <div>Nom</div>
                                    <div>Image</div>
                                    <div>Genre</div>
                                    <div>Affiliations</div>
                                    <div>Rang</div>
                                    <div>Chakra</div>
                                    <div>Attributs</div>
                                    <div>Arc</div>
                                </div>
                                {essais.map((essai, index) => (
                                    <div key={index} className="row">
                                        <div>{essai.name}</div>
                                        <div><img src={essai.imageUrl} alt={essai.name} style={{ width: '50px', height: '50px' }} /></div>
                                        <div>{essai.genre}</div>
                                        <div>{essai.affiliations}</div>
                                        <div>{essai.rang}</div>
                                        <div>{essai.chakra}</div>
                                        <div>{essai.attributs}</div>
                                        <div>{essai.arc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button onClick={handleResetLock} style={{ position: 'absolute', bottom: '10px', left: '10px' }}>Reset Lock</button>
                </>
            ) : (
                <h1>Victoire!</h1>
            )}
        </div>
    );
}

export default Home;
