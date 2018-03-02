export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.colour = colour || COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor(width, height) {
    this.grid = [];
    this.rendered = [];

    for (let x = 0; x < width; x++) {
      let col = [];
      for (let y = 0; y < height; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector('#gridEl')) {

    for (let x = 0; x < this.grid.length; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = this.grid[x].length - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }

      this.rendered.push(colEl);
    }

    return this;
  }

  blockClicked(e, block) {
    console.log(e, block);
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid(MAX_X, MAX_Y).render());
