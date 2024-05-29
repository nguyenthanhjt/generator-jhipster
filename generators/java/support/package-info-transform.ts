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
import { dirname, join, relative } from 'path';
import { passthrough } from 'p-transform';
import type { MemFsEditorFile } from 'mem-fs-editor';
import { loadFile } from 'mem-fs';
import { Minimatch } from 'minimatch';
import { setModifiedFileState } from 'mem-fs-editor/state';

type PackageInfoTransformOptions = { javaRoots: string[]; javadocs?: Record<string, string> };

const DEFAULT_DOC = 'This package file was generated by JHipster';

const packageInfoTransform = ({ javaRoots, javadocs }: PackageInfoTransformOptions) => {
  const existingPackageInfoFiles: string[] = [];
  return passthrough(function (file) {
    if (file.path.endsWith('package-info.java')) {
      existingPackageInfoFiles.push(file.path);
      return;
    }
    for (const root of javaRoots) {
      if (file.path.startsWith(root)) {
        const directory = dirname(file.path);
        const packageName = relative(root, directory).replaceAll(/[/\\]/g, '.');
        const packageInfoFilePath = join(directory, 'package-info.java');
        if (existingPackageInfoFiles.includes(packageInfoFilePath)) {
          return;
        }
        const packageInfoFile = loadFile(packageInfoFilePath) as MemFsEditorFile;
        if (!packageInfoFile.contents) {
          const packageJavadoc = javadocs?.[packageName] ?? DEFAULT_DOC;
          packageInfoFile.contents = Buffer.from(`/**
 * ${packageJavadoc}
 */
package ${packageName};
`);
          setModifiedFileState(packageInfoFile);
          this.push(packageInfoFile);
        }
        existingPackageInfoFiles.push(packageInfoFilePath);
      }
    }
  });
};

export const matchMainJavaFiles = (srcMainJava: string) => new Minimatch(`**/${srcMainJava}/**/*.java`);

export default packageInfoTransform;
