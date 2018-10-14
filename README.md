# Planetarium
A sonification of our solar system

This project uses data about the planets of our solar system to create an interactive sonification. The dataset was gathered from the NASA website, and transferred to a usable csv file.

Visually, each of the 9 planets (Pluto included) is represented as a circle orbitting around the center of the screen, representing their motion around the Sun. Their distance from the center and their relative size are determined by their corresponding planet's distance from the Sun and diameter respectively. The speed at which they move is determined by their orbital period (the number of Earth days it takes them to complete a full rotation around the Sun). Additionally, the brightness of the circle pulsates at a rate determined by the length of the planet's day.

Audially, each planet is represented as a sine wave drone. The pitch and amplitude of each oscillator is determined by the planet's diameter and mass. As the planets orbit around the center, the panning of each oscillator is modulated according to their current position on the screen. Each oscillator is also connected to an amplitude modulating oscillator. The frequency of this modulator corresponds to the planet's day length, similarly to the visual pulsating of the circle.

CONTROLS
- Moving the mouse over any planet will reveal the planet's name. 
- The user can also click on a planet to solo its oscillator, muting all other planets. 
- To unmute all planets, simply click in any empty space. 
- The user can zoom in and out towards the center by using the mouse's scroll wheel. 
- At the bottom of the screen is a "Time Scale" slider. This controls the rate at which time passes, affecting the speed that planets orbit around the center, and the amplitude modulators (day length) of each oscillator.

The relationship between visible distances and sizes of each planet is not to scale, and the complex motion of the planets is not accurately represented. This is intended to be a very simplified and abstract representation of the solar system.
