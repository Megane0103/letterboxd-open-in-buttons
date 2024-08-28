// ==UserScript==
// @name         Letterboxd Open in Buttons
// @namespace    https://github.com/Megane0103/letterboxd-open-in-buttons
// @version      1.0
// @description  Adds buttons to get links for movies on different streaming sites from Letterboxd.
// @author       Megane0103
// @match        https://letterboxd.com/film/*
// @grant        none
// @license      GPL-3.0
// ==/UserScript==

(function() {
    'use strict';

    // Extract the TMDB ID from the page
    function getTMDBMovieId() {
        const tmdbLinkElement = document.querySelector('a[href*="themoviedb.org/movie/"]');
        if (tmdbLinkElement) {
            const tmdbIdMatch = tmdbLinkElement.href.match(/\/movie\/(\d+)\//);
            if (tmdbIdMatch) {
                return tmdbIdMatch[1];
            }
        }
        return null;
    }

    // Extract the movie title from the h1 element
    function getMovieTitle() {
        const titleElement = document.querySelector('h1.headline-1.filmtitle .name');
        if (titleElement) {
            let title = titleElement.textContent.replace(/\u00a0/g, ' ').trim();
            // Remove colons, exclamation marks, and question marks from the title
            return title.replace(/[:!?]/g, '');
        }
        return null;
    }

    // Extract the movie year from the page
    function getMovieYear() {
        const yearElement = document.querySelector('.cell .date');
        if (yearElement) {
            const yearMatch = yearElement.textContent.trim().match(/\b\d{4}\b/);
            return yearMatch ? yearMatch[0] : null;
        }
        return null;
    }

    // Create and append the buttons
    function createButtons(tmdbId, movieTitle, movieYear) {
        const ulElement = document.querySelector('.film-stats');
        if (ulElement && !document.querySelector('.custom-buttons-container')) {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'custom-buttons-container';
            ulElement.appendChild(buttonsContainer);

            const buttonConfigurations = [
                { text: 'Open in YIFY', href: `https://yts.mx/movies/${movieTitle.replace(/\s+/g, '-').toLowerCase()}-${movieYear}`, backgroundColor: 'green', color: 'white' },
                { text: 'Open in Movie Web', href: `https://pseudo-flix.pro/media/tmdb-movie-${tmdbId}`, backgroundColor: '#c082ff', color: 'white' },
                { text: 'Open in Braflix', href: `https://www.braflix.video/movie/${tmdbId}`, backgroundColor: '#FB4E2E', color: 'white' },
                { text: 'Open in Seez', href: `https://watchwave-v2.vercel.app/watch/movie/${tmdbId}`, color: 'white' },
                { text: 'Open in Smashy Stream', href: `https://smashystream.xyz/movie/${tmdbId}/watch`, color: 'white' }
            ];

            buttonConfigurations.forEach(config => {
                const button = createButton(config.text, config.href);
                if (config.backgroundColor) {
                    button.style.backgroundColor = config.backgroundColor;
                }
                if (config.color) {
                    button.style.color = config.color;
                }
                buttonsContainer.appendChild(button);
            });
        }
    }

    // Create a button element
    function createButton(text, href) {
        const button = document.createElement('a');
        button.className = 'button button--filled';
        button.style.display = 'block';
        button.style.marginTop = '10px';
        button.style.fontFamily = 'courier new, Courier, monospace';
        button.textContent = text;
        button.href = href;
        button.target = '_blank';
        return button;
    }

    // MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
        const tmdbId = getTMDBMovieId();
        const movieTitle = getMovieTitle();
        const movieYear = getMovieYear();

        if (tmdbId && movieTitle && movieYear) {
            createButtons(tmdbId, movieTitle, movieYear);
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial load check
    window.addEventListener('load', () => {
        const tmdbId = getTMDBMovieId();
        const movieTitle = getMovieTitle();
        const movieYear = getMovieYear();

        if (tmdbId && movieTitle && movieYear) {
            createButtons(tmdbId, movieTitle, movieYear);
        }
    });
})();
