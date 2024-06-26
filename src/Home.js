import React, { useState, useEffect, useRef } from 'react';
import api from './api'; // Importez votre instance d'Axios
import { useAuth0 } from '@auth0/auth0-react';

function Home() {
    const { user, isAuthenticated, isLoading } = useAuth0(); // Utilisez useAuth0 pour obtenir les informations de l'utilisateur
    const [proposition, setProposition] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [essais, setEssais] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [victoire, setVictoire] = useState(false);
    const [personnageChoisi, setPersonnageChoisi] = useState(null);
    const [gameId, setGameId] = useState(null); // State to store the game ID
    const effectExecutedRef = useRef(false); // Ref to check if the effect has already been executed

    useEffect(() => {
        const fetchGameCharacter = async () => {
            console.log("useEffect triggered");

            if (!isLoading && isAuthenticated && user && !effectExecutedRef.current) {
                effectExecutedRef.current = true; // Mark the effect as executed
                try {
                    console.log("Creating a new game");
                    const response = await api.post('/games', { user: user.sub }); // Utilisez l'ID utilisateur d'Auth0
                    console.log('Personnage choisi:', response.data.characterName);
                    setPersonnageChoisi(response.data.characterName);
                    setGameId(response.data.gameId); // Store the game ID

                    // Fetch all characters to use for suggestions
                    const charactersResponse = await api.get('/characters');
                    setCharacters(charactersResponse.data);
                } catch (error) {
                    console.error('Erreur lors de la création de la partie:', error);
                }
            }
        };

        fetchGameCharacter();
    }, [isLoading, isAuthenticated, user]);

    const resetPartie = () => {
        const fetchGameCharacter = async () => {
            if (isAuthenticated && user) {
                try {
                    console.log("Resetting the game");
                    const response = await api.post('/games', { user: user.sub }); // Utilisez l'ID utilisateur d'Auth0
                    console.log('Personnage choisi:', response.data.characterName);
                    setPersonnageChoisi(response.data.characterName);
                    setGameId(response.data.gameId); // Store the new game ID
                    setVictoire(false);
                    setEssais([]);
                    setProposition('');
                } catch (error) {
                    console.error('Erreur lors de la création de la partie:', error);
                }
            }
        };

        fetchGameCharacter();
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
            suggestion => !essais.map(essai => essai.character.name).includes(suggestion)
        );
        setSuggestions(remainingSuggestions);

        if (remainingSuggestions.length === 1 && remainingSuggestions[0].toLowerCase() === inputValue.toLowerCase()) {
            handleSuggestionClick(remainingSuggestions[0]);
        }
    };

    const handleSuggestionClick = async (suggestion) => {
        // Vérifiez si le personnage a déjà été ajouté
        if (essais.some(essai => essai.character.name.toLowerCase() === suggestion.toLowerCase())) {
            console.warn('Personnage déjà ajouté');
            return;
        }

        const selectedCharacter = characters.find(character => character.name.toLowerCase() === suggestion.toLowerCase());
        try {
            const response = await api.post('/tries', { id_game: gameId, character_name: suggestion });
            const result = response.data;
            setEssais([...essais, { ...result, character: selectedCharacter }]);

            setProposition('');
            setSuggestions([]);

            if (suggestion.toLowerCase() === personnageChoisi.toLowerCase()) {
                setVictoire(true);
                endGame(); // Call the function to end the game
            }
        } catch (error) {
            console.error('Erreur lors de la création de la tentative:', error);
        }
    };

    const getColorClass = (status) => {
        switch (status) {
            case 'ok':
                return 'green';
            case 'partiel':
                return 'orange';
            case 'faux':
                return 'red';
            default:
                return '';
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

    const endGame = async () => {
        if (gameId) {
            try {
                await api.patch(`/games/${gameId}/end`, { end: true });
                console.log('Game ended successfully');
            } catch (error) {
                console.error('Erreur lors de la mise à jour de la partie:', error);
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                                    <div>Caractère</div>
                                    <div>Genre</div>
                                    <div>Affiliations</div>
                                    <div>Rang</div>
                                    <div>Types de chakra</div>
                                    <div>Attributs</div>
                                    <div>Arc de début</div>
                                </div>
                                {essais.map((essai, index) => (
                                    <div key={index} className="row">
                                        <div className="img-cell"><img src={essai.character.imageUrl}
                                                                       alt={essai.character.name}/></div>
                                        <div className={getColorClass(essai.genre)}>{essai.character.genre}</div>
                                        <div
                                            className={getColorClass(essai.affiliations)}>{essai.character.affiliations}</div>
                                        <div className={getColorClass(essai.rang)}>{essai.character.rang}</div>
                                        <div className={getColorClass(essai.chakra)}>{essai.character.chakra}</div>
                                        <div
                                            className={getColorClass(essai.attributs)}>{essai.character.attributs}</div>
                                        <div className={getColorClass(essai.arc)}>{essai.character.arc}</div>
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
