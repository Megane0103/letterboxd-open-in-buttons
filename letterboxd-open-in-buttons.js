// ==UserScript==
// @name         Letterboxd Open in Buttons
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds buttons to get links for movies on different streaming sites from Letterboxd.
// @author       Megane0103
// @match        https://letterboxd.com/film/*
// @grant        GM_xmlhttpRequest
// @license      MIT; https://github.com/Megane0103/letterboxd-open-in-buttons/blob/main/LICENSE
// @copyright   2023, Megane0103 (https://github.com/Megane0103)
// ==/UserScript==

(function() {
    'use strict';

    // TMDB API key
    const apiKey = 'f11591f7d995fc652ac64a06d568947c';

    // Extract movie title from the URL
    const movieTitleMatch = window.location.pathname.match(/\/film\/([^/]+)/);
    const movieTitle = movieTitleMatch ? movieTitleMatch[1] : '';

    // Extract movie year from the page
    const movieYearElement = document.querySelector('a[href^="/films/year/"]');
    const movieYear = movieYearElement ? movieYearElement.textContent.trim() : null;

    // Get TMDB movie ID using TMDB API
    function getTMDBMovieId(movieTitle, movieYear) {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}&year=${movieYear}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.results && data.results.length > 0) {
                    const tmdbId = data.results[0].id;
                    createButtons(tmdbId);
                }
            }
        });
    }

    // Create and append the buttons
    function createButtons(tmdbId) {
        const ulElement = document.querySelector('.film-stats');

        // Create a container for the buttons
        const buttonsContainer = document.createElement('div');
        ulElement.appendChild(buttonsContainer);

        // Button configurations
        const buttonConfigurations = [
            { text: 'Open in YIFY', href: `https://yts.mx/movies/${movieTitle}-${movieYear}`, backgroundColor: 'green' },
            { text: 'Open in Movie Web', href: `https://movie-web.app/media/tmdb-movie-${tmdbId}` },
            { text: 'Open in Seez', href: `https://seez.su/movie/${tmdbId}` },
            // { text: 'Open in Netfilm', href: `https://netfilm.app/watch/movie/tmdb/${movieTitle}_${tmdbId}` },
            { text: 'Open in Smashy Stream', href: `https://smashystream.xyz/movie/${tmdbId}/watch` },
            { text: 'THE MOVIE ARCHIVE', href: `https://themoviearchive.site/watch?tmdb=${tmdbId}` }
        ];

        // Create buttons
        buttonConfigurations.forEach(config => {
            const button = createButton(config.text, config.href);
            if (config.backgroundColor) {
                button.style.backgroundColor = config.backgroundColor;
            }
            buttonsContainer.appendChild(button);
        });
    }

    // Create a button element
    function createButton(text, href) {
        const button = document.createElement('a');
        button.className = 'button button--filled';
        button.style.display = 'block'; // Display as block to make it a separate row
        button.style.marginTop = '10px';
        button.style.fontFamily = 'courier new, Courier, monospace';
        button.textContent = text;
        button.href = href;
        button.target = '_blank';
        return button;
    }

    // Add buttons when the page is loaded
    window.addEventListener('load', function() {
        if (movieYear) {
            getTMDBMovieId(movieTitle, movieYear);
        }
    });
})();
