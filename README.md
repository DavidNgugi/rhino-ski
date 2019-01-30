# Simple JavaScript Ski Game

This is a version of the classic Windows game SkiFree. If
you've never heard of SkiFree, Google has plenty of examples. Better yet, you can play this version here: 
http://rhinoski.herokuapp.com/  

## What I have added/changed

1. Refactored to a modular approach in ES6 to ease readability, maintainability and extensibility.
    - Created an Event, EventManager, AssetManager, Storage, CollisionDetection, Game, Skier, Rhino and AssetManager modules
2. Implemented Event-based architecture. All game events are registered and dispatched using an EventManager
3. Fixed the bug that caused blizzard to occur (game to crash) when skier crashed and left arrow key is pressed
4. Increase in speed as the game progresses. Ensure you avoid death!
5. Added Game Menus
6. Added Music to game
7. Added Highscore tracking and saving to LocalStorage
8. Added Pause, Resume, Restart, Quit and Game Over functionality
9. Added Jump Tricks (Press space bar)
10. Tests

## FEATURES NOT ADDED/ COMPLETED

1. The chasing by the Rhino

## BUGS FOUND

1. Slight jacking when changing directions

## CONTRIBUTION

Contributions are very much welcome
