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
import { before, it, describe, expect } from 'esmocha';
import { snakeCase } from 'lodash-es';

import { getCommandHelpOutput, shouldSupportFeatures, testBlueprintSupport } from '../../test/support/tests.js';
import { defaultHelpers as helpers, runResult } from '../../testing/index.js';
import Generator from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generator = basename(__dirname);
const generatorPath = join(__dirname, 'index.js');

describe(`generator - ${generator}`, () => {
  it('generator-list constant matches folder name', async () => {
    await expect((await import('../generator-list.js'))[`GENERATOR_${snakeCase(generator).toUpperCase()}`]).toBe(generator);
  });
  shouldSupportFeatures(Generator);
  describe('help', () => {
    it('should print expected information', async () => {
      expect(await getCommandHelpOutput(generator)).toMatchSnapshot();
    });
  });
  describe('blueprint support', () => testBlueprintSupport(generator));
  describe('with', () => {
    describe('default config', () => {
      let runResult;
      before(async () => {
        runResult = await helpers.run(generatorPath).withJHipsterConfig().withSkipWritingPriorities().withMockedSource();
      });

      it('should match snapshot', () => {
        expect(runResult.generator.sharedData.getApplication()).toMatchSnapshot({
          user: expect.any(Object),
          authority: expect.any(Object),
          userManagement: expect.any(Object),
          jhipsterPackageJson: expect.any(Object),
          springBootDependencies: expect.any(Object),
        });
      });
    });

    describe('gateway', () => {
      let runResult;
      before(async () => {
        runResult = await helpers
          .run(generatorPath)
          .withJHipsterConfig({
            applicationType: 'gateway',
          })
          .withSkipWritingPriorities();
      });

      it('should match snapshot', () => {
        expect(runResult.generator.sharedData.getApplication()).toMatchSnapshot({
          user: expect.any(Object),
          authority: expect.any(Object),
          userManagement: expect.any(Object),
          jhipsterPackageJson: expect.any(Object),
          jwtSecretKey: expect.any(String),
          springBootDependencies: expect.any(Object),
        });
      });
    });

    describe('microservice', () => {
      let runResult;
      before(async () => {
        runResult = await helpers
          .run(generatorPath)
          .withJHipsterConfig({
            applicationType: 'microservice',
          })
          .withSkipWritingPriorities();
      });

      it('should match snapshot', () => {
        expect(runResult.generator.sharedData.getApplication()).toMatchSnapshot({
          jhipsterPackageJson: expect.any(Object),
          jwtSecretKey: expect.any(String),
          springBootDependencies: expect.any(Object),
        });
      });
    });
  });

  describe('jdlStore', () => {
    describe('with application', () => {
      before(async () => {
        await helpers
          .run(generatorPath)
          .withJHipsterConfig({
            jdlStore: 'app.jdl',
            skipServer: true,
            skipClient: true,
          })
          .withOptions({ refreshOnCommit: true })
          .withSkipWritingPriorities();
      });

      it('should match snapshot', () => {
        expect(runResult.getSnapshot()).toMatchSnapshot();
      });
    });
    describe('with application and entities', () => {
      before(async () => {
        await helpers
          .run(generatorPath)
          .withJHipsterConfig(
            {
              jdlStore: 'app.jdl',
              skipServer: true,
              skipClient: true,
            },
            [{ name: 'Foo' }, { name: 'Bar' }],
          )
          .withOptions({ refreshOnCommit: true })
          .withSkipWritingPriorities();
      });

      it('should match snapshot', () => {
        expect(runResult.getSnapshot()).toMatchSnapshot();
      });
    });

    describe('with incremental changelog application and entities', () => {
      before(async () => {
        await helpers
          .run(generatorPath)
          .withJHipsterConfig(
            {
              jdlStore: 'app.jdl',
              skipServer: true,
              skipClient: true,
              incrementalChangelog: true,
            },
            [{ name: 'Foo' }, { name: 'Bar' }],
          )
          .withOptions({ refreshOnCommit: true })
          .withSkipWritingPriorities();
      });

      it('should match snapshot', () => {
        expect(runResult.getSnapshot()).toMatchSnapshot();
      });
    });
  });
  describe('questions', () => {
    describe('without answers', () => {
      before(async () => {
        await helpers.run(generatorPath).withSkipWritingPriorities();
      });

      it('should match order', () => {
        expect(runResult.askedQuestions.map(({ name }) => name)).toMatchInlineSnapshot(`
[
  "baseName",
  "applicationType",
  "packageName",
  "buildTool",
  "reactive",
  "authenticationType",
  "serverTestFrameworks",
  "databaseType",
  "prodDatabaseType",
  "devDatabaseType",
  "cacheProvider",
  "enableHibernateCache",
  "serverSideOptions",
  "clientFramework",
  "clientTestFrameworks",
  "withAdminUi",
  "clientTheme",
  "enableTranslation",
  "nativeLanguage",
  "languages",
]
`);
      });
    });

    describe('with gateway, gradle and no cacheProvider', () => {
      before(async () => {
        await helpers
          .run(generatorPath)
          .withAnswers({ applicationType: 'gateway', buildTool: 'gradle', cacheProvider: 'no' })
          .withSkipWritingPriorities();
      });

      it('should match order', () => {
        expect(runResult.askedQuestions.map(({ name }) => name)).toMatchInlineSnapshot(`
[
  "baseName",
  "applicationType",
  "packageName",
  "buildTool",
  "serverPort",
  "serviceDiscoveryType",
  "authenticationType",
  "serverTestFrameworks",
  "databaseType",
  "prodDatabaseType",
  "devDatabaseType",
  "cacheProvider",
  "enableHibernateCache",
  "serverSideOptions",
  "enableGradleEnterprise",
  "clientFramework",
  "microfrontend",
  "clientTestFrameworks",
  "withAdminUi",
  "clientTheme",
  "enableTranslation",
  "nativeLanguage",
  "languages",
]
`);
      });
    });

    describe('with microservice', () => {
      before(async () => {
        await helpers
          .run(generatorPath)
          .withAnswers({ applicationType: 'microservice', databaseType: 'mongodb' })
          .withSkipWritingPriorities();
      });

      it('should match order', () => {
        expect(runResult.askedQuestions.map(({ name }) => name)).toMatchInlineSnapshot(`
[
  "baseName",
  "applicationType",
  "packageName",
  "buildTool",
  "reactive",
  "serverPort",
  "serviceDiscoveryType",
  "authenticationType",
  "feignClient",
  "serverTestFrameworks",
  "databaseType",
  "cacheProvider",
  "serverSideOptions",
  "clientFramework",
  "enableTranslation",
  "nativeLanguage",
  "languages",
]
`);
      });
    });
  });
});
