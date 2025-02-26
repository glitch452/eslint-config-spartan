import fs from 'fs';
import path from 'path';

describe('index.js', () => {
  it('should re-export all the utils', () => {
    const actual = fs
      .readFileSync(path.join(__dirname, 'index.js'))
      .toString()
      .split('\n')
      .filter(Boolean)
      .map((x) => x.slice(17, -2))
      .sort();

    const expected = fs
      .readdirSync(__dirname, { withFileTypes: true })
      .filter((x) => x.isFile() && x.name.endsWith('.js') && x.name !== 'index.js')
      .map((x) => x.name)
      .sort();

    expect(actual).toStrictEqual(expected);
  });
});
