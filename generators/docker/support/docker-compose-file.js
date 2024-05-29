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
/**
 * Creates EditFileCallback that creates a base docker compose yml file if empty.
 *
 * @param {string} name Docker compose v2 project name
 * @returns {import('../../generators/generator-base.js').EditFileCallback}
 */
export const createDockerComposeFile = (
  name = 'jhipster',
) => `# This configuration is intended for development purpose, it's **your** responsibility to harden it for production
name: ${name}
`;

export const createDockerExtendedServices = (...services) => ({
  services: Object.fromEntries(
    services.map(({ serviceName, serviceFile = `./${serviceName}.yml`, extendedServiceName = serviceName, additionalConfig = {} }) => [
      serviceName,
      {
        extends: {
          file: serviceFile,
          service: extendedServiceName,
        },
        ...additionalConfig,
      },
    ]),
  ),
});
