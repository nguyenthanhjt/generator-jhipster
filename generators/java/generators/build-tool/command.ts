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
import { buildToolTypes } from '../../../../jdl/index.js';
import type { JHipsterCommandDefinition } from '../../../base/api.js';
import { GENERATOR_GRADLE } from '../../../generator-list.js';

const { GRADLE, MAVEN } = buildToolTypes;

const command: JHipsterCommandDefinition = {
  options: {},
  configs: {
    buildTool: {
      cli: {
        name: 'build',
        type: String,
      },
      prompt: {
        type: 'list',
        message: 'Would you like to use Maven or Gradle for building the backend?',
      },
      choices: [
        { name: 'Maven', value: MAVEN },
        { name: 'Gradle', value: GRADLE },
      ],
      default: MAVEN,
      description: 'Provide build tool for the application when skipping server side generation',
      scope: 'storage',
    },
  },
  import: [GENERATOR_GRADLE],
};

export default command;
