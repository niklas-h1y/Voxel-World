# Decompiled Voxel World source — first pass

This branch adds data extracted from the supplied production HTML bundle.

## Added files

- `data/Voxel-Blocks.json`: 19 block entries and the world-generation/rendering rule values extracted from the bundle's block configuration.
- `data/Voxel-Crafting-Recipes.json`: 16 recipes extracted from the two crafting recipe arrays.
- `tools/decompile.js`: the TypeScript-parser-based extraction and formatting script used for the local decompilation pass.

## Decompilation status

The original inline JavaScript is a 2.44 MB compiled production bundle without source maps. It parses with zero syntax diagnostics and contains 1,409 top-level statements. Pretty-printing restores indentation and statement layout, but it cannot recover the original source file names or meaningful minified identifiers.

The formatted 3.08 MB core was generated locally, but is not included in this repository commit. The original repository application remains unchanged in this branch. The extracted JSON files are included as standalone data assets; the game has not yet been rewired to load them.

## Next refactor

The requested ten runtime modules (world generation, chunks, blocks, crafting, inventory, player controller, entities, renderer, multiplayer, commands) still require dependency-aware extraction from the shared compiled module scope. They should not be represented by empty placeholders or arbitrary numbered fragments. Move one subsystem at a time, expose explicit interfaces, and run browser tests after each move.
