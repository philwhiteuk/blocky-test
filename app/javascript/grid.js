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
    this.grid = Array(width).fill([]).map(() => {
      return Array(height).fill([]).map(() => new Block());
    });
    this.rendered = [];
    this.height = height;
    return this;
  }

  render(container = document.querySelector('#gridEl')) {
    container.innerHTML = '';

    this.grid.forEach((column, columnId) => {
      const columnElement = document.createElement('div');
      columnElement.className = 'col';

      container.appendChild(columnElement);

      column.forEach((block, rowId) => {
        const blockHeight = columnElement.offsetHeight / this.height;
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        blockElement.style.background = block.colour;
        blockElement.style.bottom = blockHeight * rowId;
        blockElement.addEventListener('click', () => {
          this.blockClicked(block, {
            xCoord: columnId,
            yCoord: rowId
          });
        });

        columnElement.appendChild(blockElement);
      });

      this.rendered.push(columnElement);
    });
    return this;
  }

  blockClicked(block, { xCoord, yCoord }) {
    function selectAdjacentByColour(grid, colourToMatch, originX, originY) {
      [
        [originX, originY],
        [originX, originY + 1],
        [originX, originY - 1],
        [originX - 1, originY],
        [originX + 1, originY]
      ].forEach(([x, y]) => {
        if (
          grid[x] &&
          grid[x][y] &&
          grid[x][y].colour == colourToMatch &&
          !grid[x][y].selected
        ) {
          grid[x][y].selected = true;
          grid = selectAdjacentByColour(grid, colourToMatch, x, y);
        }
      });
      return grid;
    }

    this.grid = selectAdjacentByColour(
      this.grid,
      block.colour,
      xCoord,
      yCoord
    ).map(column => column.filter(block => !block.selected));

    this.render();
    return this;
  }
}

window.addEventListener('DOMContentLoaded', () =>
  new BlockGrid(MAX_X, MAX_Y).render());
