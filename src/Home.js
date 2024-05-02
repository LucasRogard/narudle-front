// Home.js
import React, { useState } from 'react';

function Home() {
    const [proposition, setProposition] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Proposition soumise :", proposition);
        setProposition('');
    };

    return (
        <div>
            <h2>Page d'accueil</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Proposition :
                    <input
                        type="text"
                        value={proposition}
                        onChange={(event) => setProposition(event.target.value)}
                    />
                </label>
                <button type="submit">Valider</button>
            </form>
        </div>
    );
}

export default Home;
