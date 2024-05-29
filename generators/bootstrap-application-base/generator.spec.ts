/**
 * Copyright 2013-2024 the original author or authors from the Trinity Platform project.
 *
 * This file is part of the Trinity Platform project, see https://www.trinity-technology.com/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { before, it, describe, expect, beforeEach } from 'esmocha';
import { snakeCase } from 'lodash-es';

import Generator from './index.js';
import { defaultHelpers as helpers, runResult } from '../../testing/index.js';
import { shouldSupportFeatures } from '../../test/support/tests.js';
import { parseChangelog } from '../base/support/timestamp.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generatorPath = join(__dirname, 'index.ts');
const generator = basename(__dirname);

describe(`generator - ${generator}`, () => {
  it('generator-list constant matches folder name', async () => {
    await expect((await import('../generator-list.js'))[`GENERATOR_${snakeCase(generator).toUpperCase()}`]).toBe(generator);
  });
  it('generator-list esm exports constant matches folder name', async () => {
    await expect((await import('../generator-list.js'))[`GENERATOR_${snakeCase(generator).toUpperCase()}`]).toBe(generator);
  });
  shouldSupportFeatures(Generator);

  describe('with', () => {
    describe('default config', () => {
      let runResult;
      before(async () => {
        runResult = await helpers.run(generatorPath).withJHipsterConfig();
      });

      it('should succeed', () => {
        expect(runResult.getSnapshot()).toMatchInlineSnapshot(`
{
  ".yo-rc.json": {
    "contents": "{
  "generator-jhipster": {
    "baseName": "jhipster",
    "creationTimestamp": 1577836800000,
    "entities": []
  }
}
",
    "stateCleared": "modified",
  },
}
`);
      });
    });
  });
  describe('dateFormatForLiquibase', () => {
    describe('when there is no configured lastLiquibaseTimestamp', () => {
      let firstChangelogDate;
      before(async () => {
        await helpers.run(generatorPath).withJHipsterConfig();
        firstChangelogDate = runResult.generator.dateFormatForLiquibase();
      });
      it('should return a valid changelog date', () => {
        expect(/^\d{14}$/.test(firstChangelogDate)).toBe(true);
      });
      it('should save lastLiquibaseTimestamp', () => {
        expect(runResult.generator.config.get('lastLiquibaseTimestamp')).toBe(parseChangelog(firstChangelogDate).getTime());
      });
    });
    describe('when a past lastLiquibaseTimestamp is configured', () => {
      let firstChangelogDate;
      before(async () => {
        const lastLiquibaseTimestamp = new Date(2000, 1, 1);
        await helpers.run(generatorPath).withJHipsterConfig({ lastLiquibaseTimestamp: lastLiquibaseTimestamp.getTime() });
        firstChangelogDate = runResult.generator.dateFormatForLiquibase();
      });
      it('should return a valid changelog date', () => {
        expect(/^\d{14}$/.test(firstChangelogDate)).toBe(true);
      });
      it('should not return a past changelog date', () => {
        expect(firstChangelogDate.startsWith('2000')).toBe(false);
      });
      it('should save lastLiquibaseTimestamp', () => {
        expect(runResult.generator.config.get('lastLiquibaseTimestamp')).toBe(parseChangelog(firstChangelogDate).getTime());
      });
    });
    describe('when a future lastLiquibaseTimestamp is configured', () => {
      let firstChangelogDate;
      let secondChangelogDate;
      beforeEach(async () => {
        const lastLiquibaseTimestamp = new Date(Date.parse('2030-01-01'));
        await helpers
          .run(generatorPath)
          .withJHipsterConfig({ lastLiquibaseTimestamp: lastLiquibaseTimestamp.getTime(), creationTimestamp: null })
          .withOptions({ reproducible: false });
        firstChangelogDate = runResult.generator.dateFormatForLiquibase();
        secondChangelogDate = runResult.generator.dateFormatForLiquibase();
      });
      it('should return a valid changelog date', () => {
        expect(/^\d{14}$/.test(firstChangelogDate)).toBe(true);
      });
      it('should return a future changelog date', () => {
        expect(firstChangelogDate.startsWith('2030')).toBe(true);
      });
      it('should return a reproducible changelog date', () => {
        expect(firstChangelogDate).toBe('20300101000001');
        expect(secondChangelogDate).toBe('20300101000002');
      });
      it('should save lastLiquibaseTimestamp', () => {
        expect(runResult.generator.config.get('lastLiquibaseTimestamp')).toBe(parseChangelog('20300101000002').getTime());
      });
    });
    describe('with reproducible=false argument', () => {
      let firstChangelogDate;
      let secondChangelogDate;
      before(async () => {
        await helpers.run(generatorPath).withJHipsterConfig();
        firstChangelogDate = runResult.generator.dateFormatForLiquibase(false);
        secondChangelogDate = runResult.generator.dateFormatForLiquibase(false);
      });
      it('should return a valid changelog date', () => {
        expect(/^\d{14}$/.test(firstChangelogDate)).toBe(true);
        expect(/^\d{14}$/.test(secondChangelogDate)).toBe(true);
      });
      it('should return a reproducible changelog date incremental to lastLiquibaseTimestamp', () => {
        expect(firstChangelogDate).not.toBe(secondChangelogDate);
      });
      it('should save lastLiquibaseTimestamp', () => {
        expect(runResult.generator.config.get('lastLiquibaseTimestamp')).toBe(parseChangelog(secondChangelogDate).getTime());
      });
    });
    describe('with a past creationTimestamp option', () => {
      let firstChangelogDate;
      let secondChangelogDate;

      before(async () => {
        await helpers.run(generatorPath).withJHipsterConfig().withOptions({ creationTimestamp: '2000-01-01' });

        firstChangelogDate = runResult.generator.dateFormatForLiquibase();
        secondChangelogDate = runResult.generator.dateFormatForLiquibase();
      });
      it('should return a valid changelog date', () => {
        expect(/^\d{14}$/.test(firstChangelogDate)).toBe(true);
      });
      it('should return a past changelog date', () => {
        expect(firstChangelogDate.startsWith('2000')).toBe(true);
      });
      it('should return a reproducible changelog date', () => {
        expect(firstChangelogDate).toBe('20000101000100');
        expect(secondChangelogDate).toBe('20000101000200');
      });
      it('should save lastLiquibaseTimestamp', () => {
        expect(runResult.generator.config.get('lastLiquibaseTimestamp')).toBe(parseChangelog('20000101000200').getTime());
      });
    });
    describe('with a future creationTimestamp option', () => {
      it('should throw', async () => {
        await expect(helpers.run(generatorPath).withJHipsterConfig().withOptions({ creationTimestamp: '2030-01-01' })).rejects.toThrow(
          /^Creation timestamp should not be in the future: 2030-01-01\.$/,
        );
      });
    });
  });
});
