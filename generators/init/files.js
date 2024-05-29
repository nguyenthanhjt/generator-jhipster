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
export const files = {
  prettier: [
    {
      templates: ['.prettierrc.yml.jhi', '.prettierignore.jhi'],
    },
  ],
  git: [
    {
      templates: ['.gitignore.jhi', '.gitattributes.jhi'],
    },
  ],
  global: [
    {
      templates: [
        '.editorconfig.jhi',
        {
          override: false,
          file: 'package.json',
        },
      ],
    },
  ],
};

export const readme = {
  global: [
    {
      templates: ['README.md'],
    },
  ],
};

export const commitHooksFiles = {
  commitHooks: [
    {
      templates: [
        '.lintstagedrc.cjs',
        {
          file: '.husky/pre-commit',
          noEjs: true,
        },
      ],
    },
  ],
};
