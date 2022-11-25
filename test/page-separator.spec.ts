import { strictEqual } from 'assert';
import { bibtex, bibtexTidy, test } from './utils';

const singleSeparator = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  pages         = {38-250}
}
`;

const output = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  pages         = {38--250}
}
`;

test('single dash page separator', async () => {
    const tidied = await bibtexTidy(singleSeparator);
    strictEqual(tidied.bibtex, output);

    const preserved = await bibtexTidy(singleSeparator, { replacePageRange: false });
    strictEqual(preserved.bibtex, singleSeparator);
});

