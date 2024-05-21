# 2048

## Overview
> This is a super high level and shallow documentation.

This game is composed by two main data-structures, the [Board](/src/game/models/board.ts) and a Record of [Tiles](/src/game/models/tile.ts). The board will keep a snapshot of all tiles in the game (`empty`, `obstacle`, and `tile`). while the Record of tiles contains all the actual tiles' data indexed by id.

The record of tiles might seem redundant, but it was needed to allow me to animate a moving tile. When a tile is merged we update the value of the target tile and just update the position on the origin tile, this will allows me to keep the target tile in place with the new value while the origin tile is animated into the new position.

To move blocks we break the board into ranges where the tiles are free to move, ie. free of obstacles, and then merge them back into the board structure.

![Move](docs/move-doc.png?raw=true "Move")

## A few future improvements
1. Cleanup unnecessary tiles after movement - the record of tiles is holding to the tiles for longer than necessary
2. Support mobile interaction via touch events
3. Responsive layout - right now the size of tiles is fixed
4. Improve logic to trigger defeat - if we start a 4x4 grid with 15 obstacles, we're not able to tell the user they lost because we only check for defeat after a movement. 
5. Way more tests!
6. Better colors for dark mode.
6. Better obstacle asset
7. Add proper linting and formatting tools.
