export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(colour) {
    this.colour = colour || COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor(width, height) {
    this.rendered = [];
    this.grid = Array(width).fill([]).map(() => {
      return Array(height).fill([]).map(() => new Block());
    });
    return this;
  }

  render(container = document.querySelector('#gridEl')) {
    container.innerHTML = "";

    this.grid.forEach((column, columnId) => {
      const columnElement = document.createElement('div');
      columnElement.className = 'col';

      container.appendChild(columnElement);

      column.forEach((block, rowId) => {
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        blockElement.style.background = block.colour;
        blockElement.addEventListener('click', () => {
          this.blockClicked(block, {
            xCoord: columnId,
            yCoord: rowId
          })
        });

        columnElement.appendChild(blockElement);
      });

      this.rendered.push(columnElement);
    });
    return this;
  }

  blockClicked(block, { xCoord, yCoord }) {
    console.log('%o x:%i y:%i', block, xCoord, yCoord);
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid(MAX_X, MAX_Y).render());
