import { Block, BlockGrid, COLOURS } from './grid';
import { assert } from 'chai';
import sinon from 'sinon';
import jsdom from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve('./public/index.html'),'utf8');

describe('Block', () => {
  it('should randomly select a colour if none is provided', () => {
    let block = new Block();
    assert.isTrue(COLOURS.includes(block.colour), 'has a random colour');
  });
});

describe('BlockGrid', () => {
  
  let sandbox;
  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  })

  it('should construct a game grid of the correct size', () => {
    const blockGrid = new BlockGrid(10, 10);
    assert.lengthOf(blockGrid.grid, 10, 'grid has width of 10');
    assert.lengthOf(blockGrid.grid[0], 10, 'grid has height of 10');
  });

  it('should render a valid game from the grid', async () => {
    const testColumn = Array(4).fill(new Block(COLOURS[0]));
    const testGrid = {
      grid: Array(4).fill(testColumn),
      rendered: []
    };
    
    await new Promise((resolve, reject) => {
      jsdom.env(html, [], (err, window) => {
        BlockGrid.prototype.render.apply(testGrid, [window.document.querySelector('#gridEl')]);
        resolve();
      })
    });
    
    assert.lengthOf(testGrid.rendered, 4, 'rendered game has height of 10');

    const firstCol = testGrid.rendered[0];
    assert.lengthOf(firstCol.children, 4, 'rendered game has width of 10');
    assert.equal(firstCol.children[0].style.background, 'red', 'rendered game tile has correct colour');
  });

  it('should remove co-located elements of the same colour from the grid when an element is clicked', () => {
    const testColumnA = Array(4).fill();
    const testGrid = Object.assign({}, BlockGrid, {
      grid: [
        [new Block(COLOURS[0]), new Block(COLOURS[1]), new Block(COLOURS[0])],
        [new Block(COLOURS[1]), new Block(COLOURS[1]), new Block(COLOURS[1])],
        [new Block(COLOURS[0]), new Block(COLOURS[1]), new Block(COLOURS[0])],
      ],
      rendered: [],
      render: () => {}
    });

    BlockGrid.prototype.blockClicked.apply(testGrid, [
      new Block(COLOURS[1]), 
      { xCoord: 0, yCoord: 0 }
    ]);

    assert.lengthOf(testGrid.grid, 3, 'rendered game still has 3 columns');
    assert.lengthOf(testGrid.grid[0], 2, 'column 1 has 2 blocks');
    assert.lengthOf(testGrid.grid[1], 0, 'column 2 has 0 blocks');
    assert.lengthOf(testGrid.grid[2], 2, 'column 3 has 2 blocks');

    assert.deepEqual(testGrid.grid[0][0], new Block(COLOURS[0]), 'column 1 block 1 is red');
    assert.deepEqual(testGrid.grid[0][1], new Block(COLOURS[0]), 'column 1 block 2 is red');
    assert.deepEqual(testGrid.grid[2][0], new Block(COLOURS[0]), 'column 3 block 1 is red');
    assert.deepEqual(testGrid.grid[2][1], new Block(COLOURS[0]), 'column 3 block 2 is red');
  });

  it('should rerender the game grid when the grid has changed', () => {
    const blockGrid = new BlockGrid(10, 10);
    const renderSpy = sandbox.stub(blockGrid, 'render');
    blockGrid.blockClicked({}, blockGrid.grid[0][0]);
    sinon.assert.calledOnce(renderSpy);
  });
});
