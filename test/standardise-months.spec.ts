import { strictEqual } from 'assert';
import { bibtex, bibtexTidy, test } from './utils';

const withBrace = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  month         = {jan},
}
`;

const withQuotes = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  month         = "jan",
}
`;

const longMonth = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  month         = {january}
}
`;

const numericMonth = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  month         = 1,
}
`;

const numericMonthWithBrace = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  month         = {1},
}
`;

const casedMonth = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  month         = {JAN},
}
`;

const output = bibtex`
@article{test,
  title         = {Test},
  author        = {Test},
  year          = {2020},
  month         = jan
}
`;

test('months with braces', async () => {
    const tidied = await bibtexTidy(withBrace, { standardizeMonth: true });
    strictEqual(tidied.bibtex, output);
});

test('months with quotes', async () => {
    const tidied = await bibtexTidy(withQuotes, { standardizeMonth: true });
    strictEqual(tidied.bibtex, output);
});

test('long month names', async () => {
    const tidied = await bibtexTidy(longMonth, { standardizeMonth: true });
    strictEqual(tidied.bibtex, output);
});

test('numeric months', async () => {
    const tidied = await bibtexTidy(numericMonth, { standardizeMonth: true });
    strictEqual(tidied.bibtex, output);
});

test('numeric months with braces', async () => {
    const tidied = await bibtexTidy(numericMonthWithBrace, { standardizeMonth: true });
    strictEqual(tidied.bibtex, output);
});

test('non-lowercase months', async () => {
    const tidied = await bibtexTidy(casedMonth, { standardizeMonth: true });
    strictEqual(tidied.bibtex, output);
});

