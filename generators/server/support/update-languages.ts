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

import type BaseGenerator from '../../base/index.js';
import { type SpringBootApplication } from '../types.js';

type UpdateServerLanguagesTaskParam = { application: SpringBootApplication & { enableTranslation: true }; control: any };

/**
 * Update Languages In MailServiceIT
 *
 * @param application
 */
export function updateLanguagesInMailServiceITTask(this: BaseGenerator, { application, control }: UpdateServerLanguagesTaskParam) {
  const { javaPackageTestDir, languagesDefinition } = application;
  const { ignoreNeedlesError: ignoreNonExisting } = control;
  let newContent = 'private static final String[] languages = {\n';
  languagesDefinition?.forEach((language, i) => {
    newContent += `        "${language.languageTag}"${i !== languagesDefinition.length - 1 ? ',' : ''}\n`;
  });
  newContent += '        // trinity-needle-i18n-language-constant - Trinity will add/remove languages in this array\n    };';

  this.editFile(`${javaPackageTestDir}/service/MailServiceIT.java`, { ignoreNonExisting }, content =>
    content.replace(/private.*static.*String.*languages.*\{([^}]*trinity-needle-i18n-language-constant[^}]*)\};/g, newContent),
  );
}

export default function updateLanguagesTask(this: BaseGenerator, taskParam: UpdateServerLanguagesTaskParam) {
  updateLanguagesInMailServiceITTask.call(this, taskParam);
}
