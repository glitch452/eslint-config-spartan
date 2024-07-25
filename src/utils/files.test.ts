import { minimatch } from 'minimatch';
import { files } from './files.js';

describe('files', () => {
  describe('files.cjs', () => {
    const validExt = ['cjs', 'cjsx'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.cjs);
      expect(actual).toBe(true);
    });

    it('should reject a file name with an invalid file extension', () => {
      const pattern = 'file.fail';
      const actual = minimatch(pattern, files.cjs);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.cjs);
      expect(actual).toBe(true);
    });
  });

  describe('files.cypress', () => {
    const validExt = ['cy.js', 'cy.ts', 'cy.cjs', 'cy.mjs', 'cy.cts', 'cy.mts'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.cypress);
      expect(actual).toBe(true);
    });

    it('should reject a file name with an invalid file extension', () => {
      const pattern = 'file.fail';
      const actual = minimatch(pattern, files.cypress);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.cypress);
      expect(actual).toBe(true);
    });
  });

  describe('files.json', () => {
    const validExt = ['json'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.json);
      expect(actual).toBe(true);
    });

    it('should reject a file name with an invalid file extension', () => {
      const pattern = 'file.fail';
      const actual = minimatch(pattern, files.json);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.json);
      expect(actual).toBe(true);
    });
  });

  describe('files.js', () => {
    const validExt = ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.js);
      expect(actual).toBe(true);
    });

    it('should reject a file name with an invalid file extension', () => {
      const pattern = 'file.fail';
      const actual = minimatch(pattern, files.js);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.js);
      expect(actual).toBe(true);
    });
  });

  describe('files.ts', () => {
    const validExt = ['ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.ts);
      expect(actual).toBe(true);
    });

    it('should reject a file name with an invalid file extension', () => {
      const pattern = 'file.fail';
      const actual = minimatch(pattern, files.ts);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.ts);
      expect(actual).toBe(true);
    });
  });

  describe('files.jsTs', () => {
    const validExt = ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx', 'ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.jsTs);
      expect(actual).toBe(true);
    });

    it('should reject a file name with an invalid file extension', () => {
      const pattern = 'file.fail';
      const actual = minimatch(pattern, files.jsTs);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.jsTs);
      expect(actual).toBe(true);
    });
  });

  describe('files.jsTsNoX', () => {
    const validExt = ['js', 'cjs', 'mjs', 'ts', 'cts', 'mts'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.jsTsNoX);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'jsx', 'cjsx', 'mjsx', 'tsx', 'ctsx', 'mtsx'])(
      'should reject a file name with an invalid file extension (%s)',
      (ext) => {
        const pattern = `file.${ext}`;
        const actual = minimatch(pattern, files.jsTsNoX);
        expect(actual).toBe(false);
      },
    );

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.jsTsNoX);
      expect(actual).toBe(true);
    });
  });

  describe('files.jsxTsx', () => {
    const validExt = ['jsx', 'cjsx', 'mjsx', 'tsx', 'ctsx', 'mtsx'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.jsxTsx);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js', 'cjs', 'mjs', 'ts', 'cts', 'mts'])(
      'should reject a file name with an invalid file extension (%s)',
      (ext) => {
        const pattern = `file.${ext}`;
        const actual = minimatch(pattern, files.jsxTsx);
        expect(actual).toBe(false);
      },
    );

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.jsxTsx);
      expect(actual).toBe(true);
    });
  });

  describe('files.md', () => {
    const validExt = ['md', 'markdown'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.md);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js', 'markdownx'])('should reject a file name with an invalid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.md);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.md);
      expect(actual).toBe(true);
    });
  });

  describe('files.mdMdx', () => {
    const validExt = ['md', 'mdx', 'markdown'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.mdMdx);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js', 'markdownx'])('should reject a file name with an invalid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.mdMdx);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.mdMdx);
      expect(actual).toBe(true);
    });
  });

  describe('files.mdx', () => {
    const validExt = ['mdx'];

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.mdx);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js'])('should reject a file name with an invalid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.mdx);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.mdx);
      expect(actual).toBe(true);
    });
  });

  describe('files.stories', () => {
    const validExt = ['story', 'stories'].flatMap((x) =>
      ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx', 'ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'].map(
        (ext) => `${x}.${ext}`,
      ),
    );

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.stories);
      expect(actual).toBe(true);
    });

    it.each(validExt)('should accept a file name with only a valid file extension and sub extension (%s)', (ext) => {
      const actual = minimatch(ext, files.stories);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js'])('should reject a file name with an invalid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.stories);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.stories);
      expect(actual).toBe(true);
    });

    it.each(validExt)(
      'should accept a nested path where the file name has only a valid file extension and sub extension (%s)',
      (ext) => {
        const actual = minimatch(ext, files.stories);
        expect(actual).toBe(true);
      },
    );
  });

  describe('files.testSpec', () => {
    const validExt = ['test', 'spec'].flatMap((x) =>
      ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx', 'ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'].map(
        (ext) => `${x}.${ext}`,
      ),
    );

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.testSpec);
      expect(actual).toBe(true);
    });

    it.each(validExt)('should accept a file name with only a valid file extension and sub extension (%s)', (ext) => {
      const actual = minimatch(ext, files.testSpec);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js'])('should reject a file name with an invalid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.testSpec);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.testSpec);
      expect(actual).toBe(true);
    });

    it.each(validExt)(
      'should accept a nested path where the file name has only a valid file extension and sub extension (%s)',
      (ext) => {
        const actual = minimatch(ext, files.testSpec);
        expect(actual).toBe(true);
      },
    );
  });

  describe('files.test', () => {
    const validExt = ['test'].flatMap((x) =>
      ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx', 'ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'].map(
        (ext) => `${x}.${ext}`,
      ),
    );

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.test);
      expect(actual).toBe(true);
    });

    it.each(validExt)('should accept a file name with only a valid file extension and sub extension (%s)', (ext) => {
      const actual = minimatch(ext, files.test);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js'])('should reject a file name with an invalid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.test);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.test);
      expect(actual).toBe(true);
    });

    it.each(validExt)(
      'should accept a nested path where the file name has only a valid file extension and sub extension (%s)',
      (ext) => {
        const actual = minimatch(ext, files.test);
        expect(actual).toBe(true);
      },
    );
  });

  describe('files.spec', () => {
    const validExt = ['spec'].flatMap((x) =>
      ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx', 'ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'].map(
        (ext) => `${x}.${ext}`,
      ),
    );

    it.each(validExt)('should accept a file name with a valid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.spec);
      expect(actual).toBe(true);
    });

    it.each(validExt)('should accept a file name with only a valid file extension and sub extension (%s)', (ext) => {
      const actual = minimatch(ext, files.spec);
      expect(actual).toBe(true);
    });

    it.each(['fail', 'js'])('should reject a file name with an invalid file extension (%s)', (ext) => {
      const pattern = `file.${ext}`;
      const actual = minimatch(pattern, files.spec);
      expect(actual).toBe(false);
    });

    it.each(validExt)('should accept a nested path with a valid file extension (%s)', (ext) => {
      const pattern = `a/path/file.${ext}`;
      const actual = minimatch(pattern, files.spec);
      expect(actual).toBe(true);
    });

    it.each(validExt)(
      'should accept a nested path where the file name has only a valid file extension and sub extension (%s)',
      (ext) => {
        const actual = minimatch(ext, files.spec);
        expect(actual).toBe(true);
      },
    );
  });
});
